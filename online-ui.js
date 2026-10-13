// ZERO//30: LAST CYCLE — экраны онлайна: вход, меню, лобби, связь сети с игрой
(function () {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const HOST_GONE_MS = 20000; // хост без связи дольше 20 с — комната закрывается
    const SLOT_COLORS = ['#00f0ff', '#ff3df2', '#ffd400', '#3dff7a'];
    const MODE_HINTS = {
        coop: 'Вместе против волн врагов. Опыт общий. Погибшие возвращаются в следующем раунде.',
        pvp: 'Все против всех: 5 раундов по 30 секунд. Побеждает тот, у кого больше убийств.'
    };

    let net = null;
    let netFailed = false;
    let user = null;
    let restoreTried = false;
    let hostGoneTimer = null;
    let startingMatch = false;
    let busy = false;
    let newRoomMode = 'coop';
    let afterLoginOnline = false; // пришли в профиль с кнопки ONLINE — после входа сразу в онлайн

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }

    let toastTimer = null;
    function toast(msg, ms) {
        const el = $('mpToast');
        el.textContent = msg; el.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('visible'), ms || 3500);
    }

    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if (id) $(id).classList.add('active');
    }
    function isActive(id) { return $(id).classList.contains('active'); }

    async function run(btns, errEl, fn) {
        if (busy) return;
        busy = true;
        btns.forEach(b => { if (b) b.disabled = true; });
        if (errEl) errEl.textContent = '';
        try { await fn(); }
        catch (e) {
            const msg = (e && e.userMessage) || (net ? net.errorText(e) : String(e));
            if (errEl) errEl.textContent = msg; else toast(msg);
        } finally {
            busy = false;
            btns.forEach(b => { if (b) b.disabled = false; });
        }
    }

    // ------------------------------------------------------------
    // ПОДКЛЮЧЕНИЕ К СЕТЕВОМУ СЛОЮ
    // ------------------------------------------------------------
    function bindNet(n) {
        if (net) return;
        net = n;
        net.on('auth', onAuth);
        net.on('room', onRoom);
        net.on('roomClosed', onRoomClosed);
        net.on('world', (w) => Game.netWorld(w));
        net.on('states', (s) => Game.netStates(s));
        net.on('hits', (h) => Game.netHits(h));
        net.on('error', (msg) => { console.warn(msg); toast(msg, 5000); });
        if (net.authReady) onAuth(net.user);
    }
    window.addEventListener('net-ready', () => bindNet(window.Net));
    window.addEventListener('net-error', () => { netFailed = true; });
    if (window.Net) bindNet(window.Net);

    Game.setHooks({
        onSoloOver: (run) => { if (net && user && !user.guest) net.saveRunStats(run); }
    });

    // ------------------------------------------------------------
    // АККАУНТ
    // ------------------------------------------------------------
    function onAuth(u) {
        user = u;
        $('setAccount').textContent = u ? (u.login + (u.guest ? ' (гость)' : '')) : 'не выполнен вход';
        $('setUid').textContent = u ? u.uid : '—';
        renderProfileScreen();
        if (u) {
            if (!restoreTried) {
                restoreTried = true;
                net.restoreRoom().then(code => { if (code) toast('Возвращаем в комнату ' + code); }).catch(() => {});
            }
        } else {
            restoreTried = false;
            if (Game.isOnline()) Game.stopOnline();
            if (isActive('onlineMenuScreen') || isActive('lobbyScreen')) showScreen('mainMenu');
        }
    }

    function netProblem() {
        if (netFailed) { toast('Онлайн недоступен: Firebase не загрузился (нет интернета или сайт открыт как файл)', 5000); return true; }
        if (!net || !net.authReady) { toast('Подключение к серверу...'); return true; }
        return false;
    }

    $('btnOnline').addEventListener('click', () => {
        if (netProblem()) return;
        if (!user) { showProfile(true); return; }
        if (net.room) { showLobby(); return; }
        showOnlineMenu();
    });

    // ------------------------------------------------------------
    // ПРОФИЛЬ (главное меню): вход, регистрация, гость, выход
    // ------------------------------------------------------------
    $('btnProfile').addEventListener('click', () => { if (!netProblem()) showProfile(false); });

    function showProfile(forOnline) {
        afterLoginOnline = !!forOnline;
        $('authError').textContent = ''; $('profError').textContent = '';
        const notice = $('profNotice');
        notice.textContent = forOnline ? 'Войдите, чтобы играть онлайн' : '';
        notice.classList.toggle('hidden', !forOnline);
        renderProfileScreen();
        showScreen('profileScreen');
    }

    function renderProfileScreen() {
        const signedIn = !!user;
        $('profAuth').classList.toggle('hidden', signedIn);
        $('profUser').classList.toggle('hidden', !signedIn);
        if (!signedIn) return;
        $('profName').textContent = user.login;
        $('profGuestBadge').classList.toggle('hidden', !user.guest);
        $('profGuestHint').classList.toggle('hidden', !user.guest);
        $('profGuestRow').classList.toggle('hidden', !user.guest);
        if (user.guest && document.activeElement !== $('profGuestName')) $('profGuestName').value = user.login;
    }

    function afterLogin() {
        $('authPassword').value = '';
        if (afterLoginOnline) { afterLoginOnline = false; if (net.room) showLobby(); else showOnlineMenu(); return; }
        $('profNotice').classList.add('hidden');
        renderProfileScreen();
    }

    const authBtns = () => [$('btnAuthLogin'), $('btnAuthRegister'), $('btnAuthGuest')];
    $('btnAuthLogin').addEventListener('click', () => run(authBtns(), $('authError'), async () => {
        await net.login($('authLogin').value, $('authPassword').value);
        afterLogin();
    }));
    $('btnAuthRegister').addEventListener('click', () => run(authBtns(), $('authError'), async () => {
        await net.register($('authLogin').value, $('authPassword').value);
        toast('Аккаунт создан');
        afterLogin();
    }));
    $('btnAuthGuest').addEventListener('click', () => run(authBtns(), $('authError'), async () => {
        await net.loginGuest();
        afterLogin();
    }));
    $('authPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnAuthLogin').click(); });
    $('btnGuestName').addEventListener('click', () => {
        $('profError').textContent = '';
        try { net.setGuestName($('profGuestName').value); toast('Ник сохранён'); renderProfileScreen(); }
        catch (e) { $('profError').textContent = e.userMessage || String(e); }
    });
    $('btnLogout').addEventListener('click', () => run([$('btnLogout')], $('profError'), async () => {
        await net.logout();
        renderProfileScreen();
    }));
    $('btnProfileBack').addEventListener('click', () => { afterLoginOnline = false; showScreen('mainMenu'); });

    // ------------------------------------------------------------
    // ОНЛАЙН-МЕНЮ
    // ------------------------------------------------------------
    function showOnlineMenu() {
        showScreen('onlineMenuScreen');
        $('omError').textContent = '';
        renderOnlineMenu();
    }

    function renderOnlineMenu() {
        if (!user) return;
        setNewRoomMode(newRoomMode);
    }

    function setNewRoomMode(mode) {
        newRoomMode = mode;
        $('omModeCoop').classList.toggle('active', mode === 'coop');
        $('omModePvp').classList.toggle('active', mode === 'pvp');
        $('omModeHint').textContent = MODE_HINTS[mode];
    }
    $('omModeCoop').addEventListener('click', () => setNewRoomMode('coop'));
    $('omModePvp').addEventListener('click', () => setNewRoomMode('pvp'));


    const roomBtns = () => [$('btnCreateRoom'), $('btnJoinRoom')];
    $('btnCreateRoom').addEventListener('click', () => run(roomBtns(), $('omError'), async () => {
        await net.createRoom(newRoomMode);
        showLobby();
    }));
    $('btnJoinRoom').addEventListener('click', () => run(roomBtns(), $('omError'), async () => {
        await net.joinRoom($('omCode').value);
        $('omCode').value = '';
        showLobby();
    }));
    $('omCode').addEventListener('input', (e) => { e.target.value = net ? net.normalizeCode(e.target.value) : e.target.value.toUpperCase(); });
    $('omCode').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnJoinRoom').click(); });
    $('btnOnlineBack').addEventListener('click', () => showScreen('mainMenu'));

    // ------------------------------------------------------------
    // ЛОББИ
    // ------------------------------------------------------------
    function showLobby() {
        const room = net && net.room;
        if (!room) { showOnlineMenu(); return; }
        if (room.meta && room.meta.status === 'playing') return; // матч стартует через onRoom
        showScreen('lobbyScreen');
        $('lobbyError').textContent = '';
        if (room.meta) renderLobby({ code: room.code, meta: room.meta, players: room.players, isHost: room.isHost, uid: user.uid });
    }

    function renderLobby(info) {
        const { meta, players, isHost } = info;
        $('lobbyCode').textContent = info.code;
        $('lobbyModeCoop').classList.toggle('active', meta.mode === 'coop');
        $('lobbyModePvp').classList.toggle('active', meta.mode === 'pvp');
        $('lobbyModeCoop').disabled = !isHost; $('lobbyModePvp').disabled = !isHost;
        $('lobbyModeHint').textContent = MODE_HINTS[meta.mode] || '';
        const list = Object.keys(players || {}).map(uid => Object.assign({ uid }, players[uid]))
            .sort((a, b) => (+a.slot || 0) - (+b.slot || 0));
        const online = list.filter(p => p.online !== false).length;
        const max = meta.maxPlayers || 4, min = meta.minPlayers || 2;
        $('lobbyCount').textContent = `(${list.length}/${max})`;
        $('lobbyPlayers').innerHTML = list.map(p => {
            const color = SLOT_COLORS[(+p.slot || 0) % 4];
            const tags = [];
            if (p.uid === meta.host) tags.push('<span class="badge host">хост</span>');
            if (p.uid === info.uid) tags.push('<span class="badge me">вы</span>');
            if (p.guest) tags.push('<span class="badge">гость</span>');
            if (p.online === false) tags.push('<span class="badge off">нет связи</span>');
            return `<div class="lobby-player${p.online === false ? ' offline' : ''}"><span class="lp-name" style="color:${color}">${esc(p.name)}</span>${tags.join('')}</div>`;
        }).join('') + (list.length < max ? `<div class="lobby-player empty">Свободно мест: ${max - list.length}</div>` : '');
        const startBtn = $('btnLobbyStart');
        startBtn.style.display = isHost ? '' : 'none';
        startBtn.disabled = online < min;
        startBtn.textContent = `СТАРТ (${online}/${max})`;
        $('lobbyHint').textContent = isHost
            ? (online < min ? `Нужно минимум ${min} игрока. Отправьте друзьям код ${info.code}` : 'Все готовы? Жмите «Старт»')
            : 'Ждём, когда хост нажмёт «Старт»';
    }

    $('lobbyCode').addEventListener('click', () => {
        const code = $('lobbyCode').textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(code).then(() => toast('Код скопирован: ' + code), () => toast('Код: ' + code));
        else toast('Код: ' + code);
    });
    $('lobbyModeCoop').addEventListener('click', () => net.setMode('coop').catch(e => toast(net.errorText(e))));
    $('lobbyModePvp').addEventListener('click', () => net.setMode('pvp').catch(e => toast(net.errorText(e))));
    $('btnLobbyStart').addEventListener('click', () => run([$('btnLobbyStart')], $('lobbyError'), () => net.startMatch()));
    $('btnLobbyLeave').addEventListener('click', () => leaveRoomToMenu());

    async function leaveRoomToMenu() {
        disarmHostGone();
        if (Game.isOnline()) Game.stopOnline();
        try { await net.leaveRoom(); } catch (e) {}
        showOnlineMenu();
    }

    // ------------------------------------------------------------
    // СОБЫТИЯ КОМНАТЫ
    // ------------------------------------------------------------
    function onRoom(info) {
        Game.netPlayers(info.players);
        watchHost(info);
        if (info.meta.status === 'lobby') {
            if (Game.isOnline()) Game.stopOnline();
            if (!isActive('lobbyScreen')) showScreen('lobbyScreen');
            renderLobby(info);
        } else if (info.meta.status === 'playing') {
            if (!Game.isOnline() && !startingMatch) startMatchClient(info);
        }
    }

    async function startMatchClient(info) {
        startingMatch = true;
        let snap = null;
        try { snap = await net.getMatchSnapshot(); } catch (e) { console.warn(e); }
        startingMatch = false;
        const room = net.room;
        if (!room || !room.meta || room.meta.status !== 'playing' || Game.isOnline()) return;
        Game.startOnline({
            net, mode: room.meta.mode, isHost: room.isHost, uid: user.uid, name: user.login, slot: room.slot,
            matchId: room.meta.startedAt, players: room.players, rejoin: snap,
            onQuit: () => leaveRoomToMenu(),
            onOver: (run) => { if (!user.guest) net.saveRunStats(run); }
        });
        if (snap && snap.world) Game.netWorld(snap.world);
    }

    function onRoomClosed(reason) {
        disarmHostGone();
        if (Game.isOnline()) Game.stopOnline();
        if (user) showOnlineMenu(); else showScreen('mainMenu');
        toast(reason, 5000);
    }

    // Хост пропал (закрыл вкладку, нет связи) — ждём 20 секунд, потом закрываем комнату
    function watchHost(info) {
        if (info.isHost) { disarmHostGone(); return; }
        const host = info.players[info.meta.host];
        if (host && host.online !== false) { disarmHostGone(); return; }
        if (hostGoneTimer) return;
        toast('Хост потерял связь. Ждём до 20 секунд', 5000);
        hostGoneTimer = setTimeout(async () => {
            hostGoneTimer = null;
            const room = net.room;
            if (!room || !room.meta) return;
            const h = room.players[room.meta.host];
            if (h && h.online !== false) return;
            if (Game.isOnline()) Game.stopOnline();
            await net.closeRoomHostGone();
            showOnlineMenu();
            toast('Хост не вернулся — комната закрыта', 5000);
        }, HOST_GONE_MS);
    }
    function disarmHostGone() { if (hostGoneTimer) { clearTimeout(hostGoneTimer); hostGoneTimer = null; } }

    // Кнопки на экране конца матча
    $('btnMpLobby').addEventListener('click', () => run([$('btnMpLobby')], null, () => net.backToLobby()));
    $('btnMpLeave').addEventListener('click', () => leaveRoomToMenu());
})();
