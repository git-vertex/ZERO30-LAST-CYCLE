// ZERO//30: LAST CYCLE — сетевой слой (Firebase: Auth + Realtime Database + Firestore)
// Классический скрипт: объявляет window.createNet(sdk, config).
// Сам Firebase SDK подключается в net.js (модуль) и передаётся сюда объектом sdk —
// так этот файл не зависит от CDN и его можно проверять с поддельной базой.
(function () {
    'use strict';

    // Код комнаты: 6 символов, заглавные буквы и цифры без похожих 0/O и 1/I
    const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
    const LOGIN_RE = /^[A-Za-z0-9_]{3,16}$/;
    const GUEST_NAME_RE = /^[A-Za-zА-Яа-яЁё0-9_]{3,16}$/;
    // Служебный домен: логин превращается в адрес login@ДОМЕН только внутри Firebase Auth
    const EMAIL_DOMAIN = 'zero30-last-cycle.app';
    const MAX_PLAYERS = 4;
    const MIN_PLAYERS = 2;
    const ROOM_KEY = 'zero30_room';
    const GUEST_NAME_KEY = 'zero30_guest_name';

    function errorText(err) {
        const code = (err && (err.code || err.message)) || String(err || '');
        if (/email-already-in-use/.test(code)) return 'Логин занят';
        if (/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(code)) return 'Неверный логин или пароль';
        if (/network-request-failed|unavailable|offline|disconnected/i.test(code)) return 'Нет связи';
        if (/too-many-requests/.test(code)) return 'Слишком много попыток. Подождите минуту';
        if (/weak-password/.test(code)) return 'Пароль слишком простой (минимум 6 символов)';
        if (/admin-restricted-operation/.test(code)) return 'Вход гостем не включён в Firebase (Authentication → Sign-in method → Anonymous)';
        if (/operation-not-allowed/.test(code)) return 'Этот способ входа не включён в консоли Firebase';
        if (/permission[-_ ]denied/i.test(code)) return 'Нет доступа (permission-denied): опубликуйте правила из папки firebase/ в консоли Firebase';
        if (err && err.userMessage) return err.userMessage;
        return 'Ошибка: ' + code;
    }

    function userError(message) { const e = new Error(message); e.userMessage = message; return e; }

    function createNet(sdk, config) {
        const app = sdk.initializeApp(config);
        const auth = sdk.getAuth(app);
        const db = sdk.getDatabase(app);
        const fs = sdk.getFirestore(app);

        const handlers = {};
        function on(ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); }
        function emit(ev, data) { (handlers[ev] || []).forEach(fn => { try { fn(data); } catch (e) { console.error(e); } }); }

        let user = null;        // { uid, login, guest }
        let profile = null;     // документ players/{uid} из Firestore
        let authReady = false;
        let room = null;        // { code, slot, unsubs, meta, players, isHost }

        const r = (path) => sdk.ref(db, path);

        function guestName(uid) {
            let n = null;
            try { n = localStorage.getItem(GUEST_NAME_KEY); } catch (e) {}
            return n || ('Гость_' + uid.slice(0, 4));
        }

        function toUser(u) {
            if (!u) return null;
            const guest = !!u.isAnonymous;
            const login = guest ? guestName(u.uid) : (u.displayName || (u.email || '').split('@')[0] || 'player');
            return { uid: u.uid, login, guest };
        }

        sdk.onAuthStateChanged(auth, async (u) => {
            user = toUser(u);
            profile = null;
            if (user && !user.guest) { try { profile = await loadProfile(); } catch (e) { console.warn('profile', e); } }
            authReady = true;
            emit('auth', user);
        });

        // ------------------------------------------------------------
        // АККАУНТ
        // ------------------------------------------------------------
        function loginToEmail(login) { return login.toLowerCase() + '@' + EMAIL_DOMAIN; }

        function checkCredentials(login, password) {
            login = (login || '').trim();
            if (!LOGIN_RE.test(login)) throw userError('Логин: 3–16 символов, только латиница, цифры и _');
            if (!password || password.length < 6) throw userError('Пароль: минимум 6 символов');
            return login;
        }

        async function register(login, password) {
            login = checkCredentials(login, password);
            try {
                const cred = await sdk.createUserWithEmailAndPassword(auth, loginToEmail(login), password);
                try { await sdk.updateProfile(cred.user, { displayName: login }); } catch (e) {}
                user = { uid: cred.user.uid, login, guest: false };
                profile = { login, bestRound: 0, bestKills: 0, totalRuns: 0, totalKills: 0, pvpWins: 0, pvpMatches: 0 };
                try { await sdk.setDoc(sdk.doc(fs, 'players', user.uid), Object.assign({ createdAt: Date.now() }, profile), { merge: true }); }
                catch (e) { console.warn('profile create', e); }
                emit('auth', user);
                return user;
            } catch (e) { throw userError(errorText(e)); }
        }

        async function login(loginName, password) {
            loginName = checkCredentials(loginName, password);
            try { await sdk.signInWithEmailAndPassword(auth, loginToEmail(loginName), password); return user; }
            catch (e) { throw userError(errorText(e)); }
        }

        async function loginGuest() {
            try { await sdk.signInAnonymously(auth); return user; }
            catch (e) { throw userError(errorText(e)); }
        }

        function setGuestName(name) {
            name = (name || '').trim();
            if (!GUEST_NAME_RE.test(name)) throw userError('Ник: 3–16 символов (буквы, цифры, _)');
            try { localStorage.setItem(GUEST_NAME_KEY, name); } catch (e) {}
            if (user && user.guest) { user.login = name; emit('auth', user); }
        }

        async function logout() {
            if (room) await leaveRoom();
            await sdk.signOut(auth);
        }

        // ------------------------------------------------------------
        // ПРОФИЛЬ (Firestore players/{uid})
        // ------------------------------------------------------------
        async function loadProfile() {
            if (!user || user.guest) return null;
            const snap = await sdk.getDoc(sdk.doc(fs, 'players', user.uid));
            return snap.exists() ? snap.data() : null;
        }

        async function saveRunStats(run) {
            if (!user || user.guest) return;
            const p = Object.assign({ bestRound: 0, bestKills: 0, totalRuns: 0, totalKills: 0, pvpWins: 0, pvpMatches: 0 }, profile || {});
            p.login = user.login;
            p.totalRuns += 1;
            p.totalKills += run.kills || 0;
            if (run.mode !== 'pvp') {
                p.bestRound = Math.max(p.bestRound, run.round || 0);
                p.bestKills = Math.max(p.bestKills, run.kills || 0);
            } else {
                p.pvpMatches += 1;
                if (run.won) p.pvpWins += 1;
            }
            p.updatedAt = Date.now();
            profile = p;
            try { await sdk.setDoc(sdk.doc(fs, 'players', user.uid), p, { merge: true }); emit('profile', p); }
            catch (e) { console.warn('saveRunStats', e); emit('error', errorText(e)); }
        }

        // ------------------------------------------------------------
        // КОМНАТЫ
        // ------------------------------------------------------------
        function requireUser() { if (!user) throw userError('Сначала войдите'); }
        function requireRoom() { if (!room) throw userError('Вы не в комнате'); }

        function genCode() {
            const bytes = new Uint8Array(6);
            (window.crypto || window.msCrypto).getRandomValues(bytes);
            let s = '';
            for (let i = 0; i < 6; i++) s += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
            return s;
        }

        function normalizeCode(code) { return (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); }

        async function createRoom(mode) {
            requireUser();
            if (room) await leaveRoom();
            mode = mode === 'pvp' ? 'pvp' : 'coop';
            try {
                for (let attempt = 0; attempt < 6; attempt++) {
                    const code = genCode();
                    const meta = { host: user.uid, hostName: user.login, mode, status: 'lobby', createdAt: Date.now(), maxPlayers: MAX_PLAYERS, minPlayers: MIN_PLAYERS };
                    // Транзакция: комната создаётся только если такого кода ещё нет
                    const res = await sdk.runTransaction(r(`rooms/${code}/meta`), (cur) => { if (cur) return; return meta; });
                    if (!res.committed) continue;
                    const slot = await claimSlot(code);
                    if (slot < 0) throw userError('Не удалось занять место в комнате');
                    await writeMe(code, slot);
                    attach(code, slot);
                    return code;
                }
            } catch (e) { throw userError(errorText(e)); }
            throw userError('Не удалось создать комнату, попробуйте ещё раз');
        }

        // Место в комнате занимается транзакцией: два игрока не смогут занять одно и то же место,
        // а мест всего 4 — поэтому в полную комнату войти нельзя.
        async function claimSlot(code) {
            for (let i = 0; i < MAX_PLAYERS; i++) {
                const res = await sdk.runTransaction(r(`rooms/${code}/slots/${i}`), (cur) => {
                    if (cur === null || cur === undefined) return user.uid;
                    return; // занято — отмена
                });
                if (res.committed && res.snapshot.val() === user.uid) return i;
            }
            return -1;
        }

        function writeMe(code, slot) {
            return sdk.set(r(`rooms/${code}/players/${user.uid}`), {
                name: user.login, slot: String(slot), online: true, guest: !!user.guest, joinedAt: sdk.serverTimestamp()
            });
        }

        async function joinRoom(rawCode) {
            requireUser();
            const code = normalizeCode(rawCode);
            if (!CODE_RE.test(code)) throw userError('Код комнаты: 6 символов');
            if (room && room.code === code) return code;
            if (room) await leaveRoom();
            try {
                const metaSnap = await sdk.get(r(`rooms/${code}/meta`));
                if (!metaSnap.exists()) throw userError('Комната не найдена');
                const meta = metaSnap.val();
                if (meta.status === 'closed') throw userError('Комната закрыта');
                // Уже в этой комнате (например, после обновления страницы)?
                const slotsSnap = await sdk.get(r(`rooms/${code}/slots`));
                const slots = slotsSnap.val() || {};
                const mine = Object.keys(slots).find(k => slots[k] === user.uid);
                if (mine !== undefined) {
                    await writeMe(code, parseInt(mine, 10));
                    attach(code, parseInt(mine, 10));
                    return code;
                }
                if (meta.status !== 'lobby') throw userError('Матч уже идёт — дождитесь конца');
                const slot = await claimSlot(code);
                if (slot < 0) throw userError(`Комната заполнена (${MAX_PLAYERS}/${MAX_PLAYERS})`);
                await writeMe(code, slot);
                attach(code, slot);
                return code;
            } catch (e) {
                if (e.userMessage) throw e;
                throw userError(errorText(e));
            }
        }

        function saveRoomLocal(code) { try { localStorage.setItem(ROOM_KEY, JSON.stringify({ code, uid: user.uid })); } catch (e) {} }
        function clearRoomLocal() { try { localStorage.removeItem(ROOM_KEY); } catch (e) {} }

        function attach(code, slot) {
            detach();
            const meRef = r(`rooms/${code}/players/${user.uid}`);
            room = { code, slot, unsubs: [], meta: null, players: {}, isHost: false, meRef };
            saveRoomLocal(code);

            // Отключение: сервер сам пометит игрока как offline, если вкладка закрылась или пропала связь
            const armPresence = () => {
                sdk.onDisconnect(meRef).update({ online: false, lastSeen: sdk.serverTimestamp() }).catch(() => {});
                sdk.update(meRef, { online: true }).catch(() => {});
            };
            armPresence();
            room.unsubs.push(sdk.onValue(r('.info/connected'), (s) => { if (s.val() === true && room && room.code === code) armPresence(); }));

            room.unsubs.push(sdk.onValue(r(`rooms/${code}/meta`), (s) => {
                if (!room || room.code !== code) return;
                const meta = s.val();
                if (!meta || meta.status === 'closed') {
                    const reason = !meta ? 'Комната закрыта' : 'Хост покинул игру — комната закрыта';
                    cleanupLocal();
                    emit('roomClosed', reason);
                    return;
                }
                room.meta = meta;
                room.isHost = meta.host === user.uid;
                emitRoom();
            }, (err) => emit('error', errorText(err))));

            room.unsubs.push(sdk.onValue(r(`rooms/${code}/players`), (s) => {
                if (!room || room.code !== code) return;
                room.players = s.val() || {};
                emitRoom();
            }));
            room.unsubs.push(sdk.onValue(r(`rooms/${code}/world`), (s) => { if (room && room.code === code) emit('world', s.val()); }));
            room.unsubs.push(sdk.onValue(r(`rooms/${code}/state`), (s) => { if (room && room.code === code) emit('states', s.val() || {}); }));
            room.unsubs.push(sdk.onValue(r(`rooms/${code}/hits`), (s) => { if (room && room.code === code) emit('hits', s.val() || {}); }));
        }

        function emitRoom() {
            if (!room || !room.meta) return;
            emit('room', { code: room.code, meta: room.meta, players: room.players, isHost: room.isHost, uid: user.uid, slot: room.slot });
        }

        function detach() {
            if (!room) return;
            room.unsubs.forEach(u => { try { u(); } catch (e) {} });
            room.unsubs = [];
        }

        function cleanupLocal() {
            if (!room) return;
            try { sdk.onDisconnect(room.meRef).cancel().catch(() => {}); } catch (e) {}
            detach();
            room = null;
            clearRoomLocal();
        }

        async function leaveRoom() {
            if (!room) return;
            const { code, slot, isHost } = room;
            const uid = user.uid;
            cleanupLocal();
            try {
                if (isHost) {
                    // Хост ушёл — комната закрывается (удаляется целиком)
                    await sdk.remove(r(`rooms/${code}`));
                } else {
                    await Promise.all([sdk.remove(r(`rooms/${code}/state/${uid}`)), sdk.remove(r(`rooms/${code}/hits/${uid}`))]).catch(() => {});
                    await sdk.remove(r(`rooms/${code}/players/${uid}`)).catch(() => {});
                    await sdk.remove(r(`rooms/${code}/slots/${slot}`)).catch(() => {});
                }
            } catch (e) { console.warn('leaveRoom', e); }
            emit('roomLeft', code);
        }

        // Гость: хост пропал больше чем на 20 секунд — помечаем комнату закрытой
        async function closeRoomHostGone() {
            if (!room) return;
            const code = room.code;
            try { await sdk.set(r(`rooms/${code}/meta/status`), 'closed'); } catch (e) { console.warn(e); }
            await leaveRoom();
        }

        async function setMode(mode) {
            requireRoom();
            if (!room.isHost) return;
            await sdk.update(r(`rooms/${room.code}/meta`), { mode: mode === 'pvp' ? 'pvp' : 'coop' });
        }

        function onlinePlayers() {
            if (!room) return [];
            return Object.keys(room.players).filter(uid => room.players[uid] && room.players[uid].online !== false);
        }

        async function startMatch() {
            requireRoom();
            if (!room.isHost) throw userError('Начать игру может только хост');
            const count = onlinePlayers().length;
            if (count < MIN_PLAYERS) throw userError(`Нужно минимум ${MIN_PLAYERS} игрока`);
            const mid = Date.now();
            try {
                await sdk.set(r(`rooms/${room.code}/world`), { mid, r: 1, ph: 'start', t: 30, sq: 0, xp: 0, epb: 0, kills: 0, en: '', ep: '', eps: 0 });
                await sdk.update(r(`rooms/${room.code}/meta`), { status: 'playing', startedAt: mid });
            } catch (e) { throw userError(errorText(e)); }
        }

        async function backToLobby() {
            requireRoom();
            if (!room.isHost) return;
            await sdk.remove(r(`rooms/${room.code}/world`)).catch(() => {});
            await sdk.update(r(`rooms/${room.code}/meta`), { status: 'lobby' });
        }

        // Восстановление после обновления страницы: код комнаты и uid сохранены локально,
        // а сервер проверяет, что место в комнате действительно за этим игроком.
        async function restoreRoom() {
            if (!user || room) return null;
            let saved = null;
            try { saved = JSON.parse(localStorage.getItem(ROOM_KEY) || 'null'); } catch (e) {}
            if (!saved || saved.uid !== user.uid || !saved.code) return null;
            try {
                const slotsSnap = await sdk.get(r(`rooms/${saved.code}/slots`));
                const slots = slotsSnap.val() || {};
                if (!Object.keys(slots).some(k => slots[k] === user.uid)) { clearRoomLocal(); return null; }
                return await joinRoom(saved.code);
            } catch (e) { clearRoomLocal(); return null; }
        }

        // ------------------------------------------------------------
        // СИНХРОНИЗАЦИЯ МАТЧА (каждый пишет только своё)
        // ------------------------------------------------------------
        function swallow(p) { return p.catch(e => { emit('error', errorText(e)); }); }
        function sendState(obj) { if (!room) return Promise.resolve(); return swallow(sdk.update(r(`rooms/${room.code}/state/${user.uid}`), obj)); }
        function sendWorld(obj) { if (!room || !room.isHost) return Promise.resolve(); return swallow(sdk.update(r(`rooms/${room.code}/world`), obj)); }
        function sendHits(obj) { if (!room) return Promise.resolve(); return swallow(sdk.set(r(`rooms/${room.code}/hits/${user.uid}`), obj)); }
        function clearMyMatchData() {
            if (!room) return Promise.resolve();
            return Promise.all([sdk.remove(r(`rooms/${room.code}/state/${user.uid}`)), sdk.remove(r(`rooms/${room.code}/hits/${user.uid}`))]).catch(() => {});
        }
        async function getMatchSnapshot() {
            if (!room) return null;
            const [w, s] = await Promise.all([sdk.get(r(`rooms/${room.code}/world`)), sdk.get(r(`rooms/${room.code}/state/${user.uid}`))]);
            return { world: w.val(), myState: s.val() };
        }

        return {
            on,
            get user() { return user; },
            get profile() { return profile; },
            get authReady() { return authReady; },
            get room() { return room ? { code: room.code, meta: room.meta, players: room.players, isHost: room.isHost, slot: room.slot } : null; },
            register, login, loginGuest, logout, setGuestName, loadProfile, saveRunStats,
            createRoom, joinRoom, leaveRoom, closeRoomHostGone, setMode, startMatch, backToLobby, restoreRoom,
            sendState, sendWorld, sendHits, clearMyMatchData, getMatchSnapshot,
            errorText, normalizeCode,
            MAX_PLAYERS, MIN_PLAYERS
        };
    }

    window.createNet = createNet;
})();
