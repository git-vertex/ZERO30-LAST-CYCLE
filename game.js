// ZERO//30: LAST CYCLE — Main Game Module
'use strict';

// ============================================================
// AUDIO
// ============================================================
const Audio = (() => {
    let ctx = null;
    let masterVol = 0.7, sfxVol = 0.8;
    function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        return ctx;
    }
    function play(type) {
        try {
            const c = getCtx();
            const now = c.currentTime;
            const g = c.createGain();
            g.connect(c.destination);
            const vol = masterVol * sfxVol;
            switch (type) {
                case 'shoot': {
                    const o = c.createOscillator();
                    o.type = 'square'; o.frequency.setValueAtTime(800, now);
                    o.frequency.exponentialRampToValueAtTime(200, now + 0.08);
                    g.gain.setValueAtTime(0.08 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    o.connect(g); o.start(now); o.stop(now + 0.08); break;
                }
                case 'hit': {
                    const o = c.createOscillator();
                    o.type = 'sawtooth'; o.frequency.setValueAtTime(300, now);
                    o.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                    g.gain.setValueAtTime(0.1 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    o.connect(g); o.start(now); o.stop(now + 0.05); break;
                }
                case 'kill': {
                    const o = c.createOscillator();
                    o.type = 'sawtooth'; o.frequency.setValueAtTime(600, now);
                    o.frequency.exponentialRampToValueAtTime(50, now + 0.15);
                    g.gain.setValueAtTime(0.12 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    o.connect(g); o.start(now); o.stop(now + 0.15); break;
                }
                case 'dash': {
                    const o = c.createOscillator();
                    o.type = 'sine'; o.frequency.setValueAtTime(200, now);
                    o.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                    g.gain.setValueAtTime(0.1 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    o.connect(g); o.start(now); o.stop(now + 0.12); break;
                }
                case 'playerHit': {
                    const o = c.createOscillator();
                    o.type = 'square'; o.frequency.setValueAtTime(150, now);
                    o.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                    g.gain.setValueAtTime(0.15 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    o.connect(g); o.start(now); o.stop(now + 0.2); break;
                }
                case 'upgrade': {
                    const o = c.createOscillator();
                    o.type = 'sine'; o.frequency.setValueAtTime(400, now);
                    o.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                    g.gain.setValueAtTime(0.1 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    o.connect(g); o.start(now); o.stop(now + 0.2); break;
                }
                case 'evolve': {
                    for (let i = 0; i < 3; i++) {
                        const o = c.createOscillator();
                        o.type = 'sine'; o.frequency.setValueAtTime(300 + i * 200, now + i * 0.1);
                        o.frequency.exponentialRampToValueAtTime(1000 + i * 200, now + i * 0.1 + 0.2);
                        const gi = c.createGain(); gi.connect(c.destination);
                        gi.gain.setValueAtTime(0.1 * vol, now + i * 0.1);
                        gi.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
                        o.connect(gi); o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
                    }
                    break;
                }
                case 'roundEnd': {
                    const o = c.createOscillator();
                    o.type = 'triangle'; o.frequency.setValueAtTime(1000, now);
                    o.frequency.exponentialRampToValueAtTime(300, now + 0.3);
                    g.gain.setValueAtTime(0.1 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    o.connect(g); o.start(now); o.stop(now + 0.3); break;
                }
                case 'bossIntro': {
                    for (let i = 0; i < 3; i++) {
                        const o = c.createOscillator();
                        o.type = 'sawtooth'; o.frequency.setValueAtTime(80 + i * 30, now + i * 0.15);
                        o.frequency.exponentialRampToValueAtTime(40, now + i * 0.15 + 0.3);
                        const gi = c.createGain(); gi.connect(c.destination);
                        gi.gain.setValueAtTime(0.12 * vol, now + i * 0.15);
                        gi.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.3);
                        o.connect(gi); o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.3);
                    }
                    break;
                }
                case 'explosion': {
                    const bufferSize = c.sampleRate * 0.15;
                    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                    const noise = c.createBufferSource(); noise.buffer = buffer;
                    g.gain.setValueAtTime(0.15 * vol, now);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    noise.connect(g); noise.start(now); noise.stop(now + 0.15);
                    break;
                }
            }
        } catch(e) {}
    }
    return { play, setMaster(v) { masterVol = v; }, setSfx(v) { sfxVol = v; } };
})();

// ============================================================
// CONSTANTS & UTILS
// ============================================================
const GAME_W = 1200, GAME_H = 800;
const DEFAULT_ROUND_DURATION = 30; // every round lasts exactly 30 seconds
const BOSS_INTERVAL = 5;
const PLAYER_SIZE = 14;
const PICKUP_RADIUS_BASE = 120;
const INVULN_DURATION = 0.5;
const XP_PER_LEVEL_BASE = 15;
const XP_LEVEL_SCALE = 1.25;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(x1, y1, x2, y2) { const dx = x1 - x2, dy = y1 - y2; return Math.sqrt(dx * dx + dy * dy); }
function angleBetween(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); }
function rng(min, max) { return Math.random() * (max - min) + min; }
function rngInt(min, max) { return Math.floor(rng(min, max + 1)); }
function choose(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalizeAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }

// ============================================================
// OBJECT POOL & PARTICLES
// ============================================================
class Pool {
    constructor(factory, reset, initialSize = 50) {
        this.factory = factory; this.resetFn = reset;
        this.pool = []; this.active = [];
        for (let i = 0; i < initialSize; i++) this.pool.push(factory());
    }
    get() { let obj = this.pool.pop() || this.factory(); this.active.push(obj); return obj; }
    release(obj) {
        const idx = this.active.indexOf(obj);
        if (idx !== -1) { this.active.splice(idx, 1); this.resetFn(obj); this.pool.push(obj); }
    }
    releaseAll() {
        while (this.active.length > 0) {
            const obj = this.active.pop(); this.resetFn(obj); this.pool.push(obj);
        }
    }
    update(dt, updateFn) {
        for (let i = this.active.length - 1; i >= 0; i--) {
            if (updateFn(this.active[i], dt)) {
                this.resetFn(this.active[i]); this.pool.push(this.active[i]); this.active.splice(i, 1);
            }
        }
    }
}

const Particles = (() => {
    const pool = new Pool(() => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, r: 0, g: 0, b: 0, size: 2, decay: 1 }), (p) => { p.life = 0; }, 500);
    let particleLevel = 'medium';
    const limits = { high: 600, medium: 300, low: 100 };
    function emit(x, y, count, color, opts = {}) {
        const maxP = limits[particleLevel] || 300;
        if (pool.active.length > maxP) return;
        const c = parseColor(color);
        const actual = Math.min(count, maxP - pool.active.length);
        for (let i = 0; i < actual; i++) {
            const p = pool.get();
            const angle = opts.angle !== undefined ? opts.angle + rng(-opts.spread || 0.5, opts.spread || 0.5) : rng(0, Math.PI * 2);
            const speed = opts.speed || rng(30, 120);
            p.x = x + rng(-2, 2); p.y = y + rng(-2, 2);
            p.vx = Math.cos(angle) * speed * rng(0.5, 1.5); p.vy = Math.sin(angle) * speed * rng(0.5, 1.5);
            p.life = opts.life || rng(0.2, 0.6); p.maxLife = p.life; p.r = c.r; p.g = c.g; p.b = c.b;
            p.size = opts.size || rng(1, 3); p.decay = opts.decay || 1;
        }
    }
    function parseColor(c) {
        if (typeof c === 'object') return c;
        const m = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
        if (m) return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
        return { r: 0, g: 240, b: 255 };
    }
    function update(dt) {
        pool.update(dt, (p, dt) => {
            p.x += p.vx * dt; p.y += p.vy * dt;
            p.vx *= (1 - 2 * dt); p.vy *= (1 - 2 * dt);
            p.life -= dt * p.decay; return p.life <= 0;
        });
    }
    function draw(ctx) {
        for (const p of pool.active) {
            ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
            ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }
    return { emit, update, draw, clear: () => pool.releaseAll(), setLevel: (l) => particleLevel = l };
})();

const DmgNumbers = (() => {
    const pool = new Pool(() => ({ x: 0, y: 0, text: '', color: '#fff', life: 0, vy: 0, size: 12 }), (d) => { d.life = 0; }, 100);
    let enabled = true;
    function spawn(x, y, amount, crit = false) {
        if (!enabled) return;
        const d = pool.get();
        d.x = x + rng(-10, 10); d.y = y - 10;
        d.text = typeof amount === 'number' ? Math.round(amount).toString() : String(amount);
        d.color = crit ? '#ffd700' : '#ffffff'; d.size = crit ? 16 : 12; d.life = 0.8; d.vy = -60;
    }
    function update(dt) {
        pool.update(dt, (d, dt) => { d.y += d.vy * dt; d.vy *= (1 - 2 * dt); d.life -= dt; return d.life <= 0; });
    }
    function draw(ctx) {
        for (const d of pool.active) {
            ctx.globalAlpha = clamp(d.life / 0.8, 0, 1); ctx.fillStyle = d.color;
            ctx.font = `bold ${d.size}px 'Orbitron', sans-serif`; ctx.textAlign = 'center';
            ctx.fillText(d.text, d.x, d.y);
        }
        ctx.globalAlpha = 1;
    }
    return { spawn, update, draw, clear: () => pool.releaseAll(), setEnabled: (v) => enabled = v };
})();

const Shake = (() => {
    let intensity = 0, enabled = true, ox = 0, oy = 0;
    function add(amount) { if (enabled) intensity = Math.min(intensity + amount, 15); }
    function update(dt) {
        if (intensity > 0.1) {
            ox = rng(-intensity, intensity); oy = rng(-intensity, intensity);
            intensity *= Math.max(0, 1 - 8 * dt);
        } else { ox = 0; oy = 0; intensity = 0; }
    }
    function apply(ctx) { ctx.translate(ox, oy); }
    return { add, update, apply, setEnabled: (v) => enabled = v };
})();

// ============================================================
// GAME ENGINE
// ============================================================
const Game = (() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let state = 'menu';
    let round = 1, roundTimer = DEFAULT_ROUND_DURATION, roundDuration = DEFAULT_ROUND_DURATION;
    let kills = 0, totalKills = 0;
    let totalDamageDealt = 0, totalDamageReceived = 0, runTime = 0;
    let roundStartTimer = 0;
    let scale = 1, offsetX = 0, offsetY = 0;
    let mouseX = GAME_W / 2, mouseY = GAME_H / 2, mouseGameX = GAME_W / 2, mouseGameY = GAME_H / 2;
    let lastTime = 0, bossActive = null, upgradeSelectionPending = false;
    let currentUpgradeOptions = [];
    const keys = {};

    let player = null;
    let enemies = [], projectiles = [], enemyProjectiles = [];
    let pickups = [], orbitals = [], drones = [], beams = [], hazards = [], blackHoles = [];
    let acquiredUpgrades = [], synergiesUnlocked = [];
    let evolutionPoints = 0;

    let persistent = loadPersistent();

    function loadPersistent() {
        try { return JSON.parse(localStorage.getItem('zero30_data')) || defaultPersistent(); } 
        catch(e) { return defaultPersistent(); }
    }
    function defaultPersistent() {
        return {
            bestRound: 0, bestKills: 0, totalRuns: 0, totalKillsAll: 0, totalTimeAll: 0,
            discoveredUpgrades: [], discoveredSynergies: [], discoveredForms: [],
            settings: { masterVol: 70, sfxVol: 80, shake: true, dmgNumbers: true, particles: 'medium' }
        };
    }
    function savePersistent() { try { localStorage.setItem('zero30_data', JSON.stringify(persistent)); } catch(e) {} }

    function createPlayer() {
        return {
            x: GAME_W / 2, y: GAME_H / 2, vx: 0, vy: 0, size: PLAYER_SIZE,
            hp: 100, maxHp: 100, shield: 0, maxShield: 0,
            speed: 240, damage: 10, attackSpeed: 3.5, attackTimer: 0,
            critChance: 0.05, critDamage: 1.5, projSpeed: 450, projCount: 1, projPierce: 0, projRicochet: 0,
            projSpread: 0, projExplosive: false, explosionRadius: 0, projHoming: 0, chainLightning: 0,
            projSizeMult: 1, projSplit: false, projReturn: false, projTrail: false, projTrailDmg: 0, projDuplicateChance: 0,
            fireChance: 0, iceChance: 0, poisonChance: 0, voidDamage: 0, statusSpread: false,
            pickupRadius: PICKUP_RADIUS_BASE, xp: 0, level: 1, xpToNext: XP_PER_LEVEL_BASE,
            dashDist: 120, dashCooldown: 1.5, dashTimer: 0, dashCharges: 1, dashMaxCharges: 1, dashDamage: 0,
            invulnTimer: 0, regen: 0, regenTimer: 0, dmgReduction: 0, reflectChance: 0,
            xpMult: 1, healMult: 1, bonusBossDmg: 0, executeDmg: 0, lifesteal: 0, killHeal: 0,
            orbitalBlades: 0, orbitalDamage: 8, droneCount: 0, droneDmgMult: 1,
            beamWeapon: false, beamDamage: 0, timeDialation: 1, afterimages: false,
            emergencySurvival: false, emergencyUsed: false,
            rearShieldLevel: 0, rearShieldHitFlash: 0,
            evolutionBranch: null, evolutionForm: 'core', evolutionShape: 'core',
            flashTimer: 0, dashTrail: [], echoes: []
        };
    }

    const projPool = new Pool(
        () => ({ x: 0, y: 0, vx: 0, vy: 0, damage: 0, size: 3, life: 0, pierce: 0, ricochet: 0,
                 explosive: false, explosionRadius: 0, homing: 0, hit: null, owner: 'player',
                 color: '#00f0ff', chainLightning: 0, fire: false, ice: false, poison: false,
                 voidDmg: 0, crit: false, startX: 0, startY: 0, returning: false, returnTimer: 0,
                 trail: false, trailDmg: 0, duplicateChance: 0, split: false, isSplit: false,
                 isCenter: false, isPhantom: false, isReflected: false, pierceOnReflect: false }),
        (p) => { p.life = 0; p.hit = null; p.returning = false; }, 300
    );

    const eProjPool = new Pool(
        () => ({ x: 0, y: 0, vx: 0, vy: 0, damage: 0, size: 4, life: 0, color: '#ff4466', source: null }),
        (p) => { p.life = 0; p.source = null; }, 200
    );

    function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const scaleX = canvas.width / GAME_W, scaleY = canvas.height / GAME_H;
        scale = Math.min(scaleX, scaleY);
        offsetX = (canvas.width - GAME_W * scale) / 2; offsetY = (canvas.height - GAME_H * scale) / 2;
    }

    function screenToGame(sx, sy) { return { x: (sx - offsetX) / scale, y: (sy - offsetY) / scale }; }

    function initInput() {
        window.addEventListener('keydown', (e) => {
            keys[e.code] = true;
            if (e.code === 'Escape') menuKey();
            if (e.code === 'KeyT' && state === 'playing' && !mp) openEvolutionTree();
            if (state === 'upgrading' && !upgradeSelectionPending) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 6) selectUpgradeByIndex(num - 1);
            }
        });
        window.addEventListener('keyup', (e) => { keys[e.code] = false; });
        canvas.addEventListener('mousemove', (e) => {
            // настоящая мышь выключает сенсорный режим (синтетические события после касания игнорируем)
            if (performance.now() - Touch.lastTouchAt > 1000) Touch.setMode(false);
            mouseX = e.clientX; mouseY = e.clientY;
            const gp = screenToGame(mouseX, mouseY);
            mouseGameX = gp.x; mouseGameY = gp.y;
        });
        Touch.init();
    }

    function menuKey() {
        if (settingsReturnTo) closeSettings();
        else if (mp) { if (state !== 'gameover') mpToggleMenu(); }
        else if (state === 'playing') pauseGame(); else if (state === 'paused') resumeGame(); else if (state === 'evolutionTree') closeEvolutionTree();
    }

    // ============================================================
    // СЕНСОРНОЕ УПРАВЛЕНИЕ: два джойстика
    // левая половина экрана — движение, правая — направление стрельбы
    // ============================================================
    const Touch = (() => {
        const RADIUS = 55;       // ход ручки в CSS-пикселях
        const DEAD = 0.12;       // мёртвая зона
        const AIM_MIN = 0.25;    // с какого отклонения правый джойстик меняет направление
        let layer = null, enabled = false, shown = false;
        let aimDir = { x: 1, y: 0 };
        const sticks = {
            move: { id: null, ox: 0, oy: 0, vx: 0, vy: 0, mag: 0, el: null, knob: null },
            aim:  { id: null, ox: 0, oy: 0, vx: 0, vy: 0, mag: 0, el: null, knob: null }
        };
        const api = { lastTouchAt: -1e9, init, setMode, sync, move: sticks.move, aim: sticks.aim, applyAim, get enabled() { return enabled; } };

        function init() {
            layer = document.getElementById('touchLayer');
            if (!layer) return;
            sticks.move.el = document.getElementById('joyMove'); sticks.move.knob = sticks.move.el.querySelector('.joy-knob');
            sticks.aim.el = document.getElementById('joyAim'); sticks.aim.knob = sticks.aim.el.querySelector('.joy-knob');
            window.addEventListener('touchstart', () => { api.lastTouchAt = performance.now(); setMode(true); }, { capture: true, passive: true });
            layer.addEventListener('touchstart', onStart, { passive: false });
            layer.addEventListener('touchmove', onMove, { passive: false });
            layer.addEventListener('touchend', onEnd, { passive: false });
            layer.addEventListener('touchcancel', onEnd, { passive: false });
            document.getElementById('btnTouchPause').addEventListener('click', (e) => { e.stopPropagation(); menuKey(); });
            // телефон или планшет: основной указатель — палец
            let coarse = false;
            try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
            setMode(coarse);
        }

        function setMode(on) {
            if (enabled === on) return;
            enabled = on;
            document.body.classList.toggle('touch-mode', on);
            if (!on) { releaseAll(); if (layer) layer.classList.add('hidden'); shown = false; }
        }

        // показываем джойстики только в бою, чтобы они не перекрывали меню
        function sync() {
            if (!layer) return;
            const hudOn = !document.getElementById('hud').classList.contains('hidden');
            const want = enabled && hudOn && (state === 'playing' || state === 'roundStart');
            if (want !== shown) {
                shown = want;
                layer.classList.toggle('hidden', !want);
                if (!want) releaseAll();
            }
            const pauseBtn = document.getElementById('btnTouchPause');
            const label = mp ? 'MENU' : 'PAUSE';
            if (pauseBtn.textContent !== label) pauseBtn.textContent = label;
        }

        function stickFor(id) { return sticks.move.id === id ? sticks.move : (sticks.aim.id === id ? sticks.aim : null); }

        function onStart(e) {
            if (e.target.closest && e.target.closest('button')) return; // кнопка паузы
            e.preventDefault();
            for (const t of e.changedTouches) {
                const st = t.clientX < window.innerWidth / 2 ? sticks.move : sticks.aim;
                if (st.id !== null) continue;
                st.id = t.identifier;
                // джойстик появляется под пальцем, но целиком в пределах экрана
                const m = RADIUS + 10;
                st.ox = clamp(t.clientX, m, window.innerWidth - m);
                st.oy = clamp(t.clientY, m, window.innerHeight - m);
                st.el.classList.add('active');
                st.el.style.left = st.ox + 'px'; st.el.style.top = st.oy + 'px';
                st.el.style.right = 'auto'; st.el.style.bottom = 'auto';
                update(st, t.clientX, t.clientY);
            }
        }

        function onMove(e) {
            e.preventDefault();
            for (const t of e.changedTouches) { const st = stickFor(t.identifier); if (st) update(st, t.clientX, t.clientY); }
        }

        function onEnd(e) {
            e.preventDefault();
            for (const t of e.changedTouches) { const st = stickFor(t.identifier); if (st) release(st); }
        }

        function update(st, x, y) {
            let dx = x - st.ox, dy = y - st.oy;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > RADIUS) { dx = dx / d * RADIUS; dy = dy / d * RADIUS; }
            st.knob.style.transform = `translate(${dx}px, ${dy}px)`;
            let mag = Math.min(1, d / RADIUS);
            if (mag < DEAD) { st.vx = 0; st.vy = 0; st.mag = 0; return; }
            st.mag = (mag - DEAD) / (1 - DEAD);
            st.vx = dx / (Math.sqrt(dx * dx + dy * dy) || 1) * st.mag;
            st.vy = dy / (Math.sqrt(dx * dx + dy * dy) || 1) * st.mag;
            if (st === sticks.aim && mag >= AIM_MIN) { const l = Math.sqrt(dx * dx + dy * dy) || 1; aimDir = { x: dx / l, y: dy / l }; }
        }

        function release(st) {
            st.id = null; st.vx = 0; st.vy = 0; st.mag = 0;
            if (!st.el) return;
            st.el.classList.remove('active');
            st.el.style.left = st.el.style.top = st.el.style.right = st.el.style.bottom = '';
            st.knob.style.transform = '';
        }
        function releaseAll() { release(sticks.move); release(sticks.aim); }

        // Куда стрелять: пока правый джойстик зажат — по нему.
        // Отпустили — автонаведение на ближайшего врага, а если рядом никого — в последнем направлении.
        function applyAim(p) {
            if (!enabled || !p) return;
            if (sticks.aim.id === null) {
                for (const e of enemies) {
                    if (!e.dead && dist(p.x, p.y, e.x, e.y) < 300) { mouseGameX = p.x; mouseGameY = p.y; return; }
                }
            }
            mouseGameX = p.x + aimDir.x * 150; mouseGameY = p.y + aimDir.y * 150;
        }
        return api;
    })();

    function loop(time) {
        const dt = Math.min(Math.max((time - lastTime) / 1000, 0), 0.05);
        lastTime = time;
        if (state === 'playing') {
            update(dt);
        }
        else if (state === 'roundStart') {
            roundStartTimer -= dt;
            if (roundStartTimer <= 0) {
                state = 'playing';
                document.getElementById('roundStart').classList.remove('visible');
                document.getElementById('roundStart').classList.add('hidden');
                if (mp && mp.isHost && mp.phase === 'start') { mp.phase = 'playing'; mp.forceSend = true; }
            }
        }
        if (mp) mpFrame(dt);
        Touch.sync();
        render();
        requestAnimationFrame(loop);
    }

    function update(dt) {
        const p = player;
        if (!p) return;
        runTime += dt;
        roundTimer = Math.max(0, roundTimer - dt);
        if (roundTimer === 0) {
            if (!mp) { endRound(); return; }
            if (mp.isHost && mp.phase === 'playing') { mpHostEndRound(); return; }
        }
        const controlsOn = !mp || !mp.dead;
        if (controlsOn) {
            let mx = 0, my = 0;
            if (keys['KeyW'] || keys['ArrowUp']) my -= 1;
            if (keys['KeyS'] || keys['ArrowDown']) my += 1;
            if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
            if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
            if (mx !== 0 || my !== 0) { const len = Math.sqrt(mx * mx + my * my); mx /= len; my /= len; }
            else if (Touch.move.mag > 0) { mx = Touch.move.vx; my = Touch.move.vy; } // левый джойстик (аналоговый)
            Touch.applyAim(p);
            const accel = 1200, friction = 8;
            p.vx += mx * accel * dt; p.vy += my * accel * dt;
            p.vx *= Math.max(0, 1 - friction * dt); p.vy *= Math.max(0, 1 - friction * dt);
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > p.speed) { p.vx = (p.vx / spd) * p.speed; p.vy = (p.vy / spd) * p.speed; }
            p.x = clamp(p.x + p.vx * dt, p.size, GAME_W - p.size);
            p.y = clamp(p.y + p.vy * dt, p.size, GAME_H - p.size);

            if (keys['Space'] && p.dashTimer <= 0 && p.dashCharges > 0) performDash();
            p.dashTimer = Math.max(0, p.dashTimer - dt);
            if (p.dashTimer <= 0 && p.dashCharges < p.dashMaxCharges) p.dashCharges = p.dashMaxCharges;

            p.invulnTimer = Math.max(0, p.invulnTimer - dt); p.flashTimer = Math.max(0, p.flashTimer - dt);
            p.rearShieldHitFlash = Math.max(0, p.rearShieldHitFlash - dt);

            if (p.regen !== 0) {
                p.regenTimer += dt;
                if (p.regenTimer >= 1) {
                    p.regenTimer -= 1;
                    p.hp = Math.min(p.maxHp, p.hp + p.regen);
                    if (p.hp <= 0 && p.regen < 0) { playerDeath(); return; }
                }
            }
            if (p.maxShield > 0 && p.shield < p.maxShield) p.shield = Math.min(p.maxShield, p.shield + p.maxShield * 0.05 * dt);

            // Attacks
            p.attackTimer += dt;
            let effectiveAtkSpeed = p.attackSpeed;
            if (p.momentumEnabled) effectiveAtkSpeed *= (1 + Math.min(0.4, p.momentumStacks * 0.04));
            if (p.killAtkSpeed > 0 && p.killAtkSpeedTimer > 0) effectiveAtkSpeed *= (1 + p.killAtkSpeed);
            if (p.ascendantActive > 0) effectiveAtkSpeed *= 1.5;
            if (effectiveAtkSpeed > 0) {
                const attackInterval = 1 / effectiveAtkSpeed;
                if (p.attackTimer >= attackInterval) {
                    p.attackTimer -= attackInterval;
                    if (p.burstFire > 0) { p.burstFireCount = p.burstFire; p.burstFireTimer = 0; }
                    playerAttack();
                }
            }
            if (p.burstFireCount > 0) {
                p.burstFireTimer += dt;
                if (p.burstFireTimer >= 0.08) { p.burstFireTimer = 0; p.burstFireCount--; playerAttack(true); }
            }

            if (p.afterimages && (Math.abs(p.vx) > 50 || Math.abs(p.vy) > 50)) p.dashTrail.push({ x: p.x, y: p.y, life: 0.3 });
            for (let i = p.dashTrail.length - 1; i >= 0; i--) { p.dashTrail[i].life -= dt; if (p.dashTrail[i].life <= 0) p.dashTrail.splice(i, 1); }

            if (p.omnipresent) {
                if (p.echoes.length < 2) for (let i = p.echoes.length; i < 2; i++) p.echoes.push({ x: p.x, y: p.y, offsetAngle: Math.PI * i, orbitR: 80 });
                for (const e of p.echoes) { e.offsetAngle += dt * 0.8; e.x = p.x + Math.cos(e.offsetAngle) * e.orbitR; e.y = p.y + Math.sin(e.offsetAngle) * e.orbitR; }
            }
            if (mp && mp.mode === 'pvp') p.xp += dt * 1.5 * p.xpMult; // в PvP опыт капает и за время в бою
        } else mpUpdateDead(dt);
        if (!player) return;

        updateOrbitals(dt); updateDrones(dt); updateBeams(dt);
        updateProjectiles(dt); updateEnemyProjectiles(dt);
        if (!mp || (mp.isHost && mp.mode === 'coop')) { EnemySpawner.update(dt, round, bossActive); updateEnemies(dt); }
        else if (mp.mode === 'coop') mpUpdateProxies(dt);
        if (mp) mpUpdateRemoteProjectiles(dt);
        if (!mp || !mp.dead) updatePickups(dt);
        updateHazards(dt); updateBlackHoles(dt);
        if (!player || state !== 'playing') { if (player) updateHUD(); return; }

        Particles.update(dt); DmgNumbers.update(dt); Shake.update(dt);

        applyLevelUps();
        updateHUD();
    }

    function applyLevelUps() {
        const p = player; if (!p) return;
        while (p.xp >= p.xpToNext) {
            p.xp -= p.xpToNext; p.level++; p.xpToNext = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_SCALE, p.level - 1));
            p.maxHp += 5; if (!(mp && mp.dead)) p.hp = Math.min(p.maxHp, p.hp + 5); p.damage += 1;
            Particles.emit(p.x, p.y, 30, '#a855f7', { speed: 80, life: 0.5 });
            DmgNumbers.spawn(p.x, p.y - 24, 'LEVEL UP', true);
            Audio.play('upgrade');
        }
    }

    function playerAttack(isBurst = false) {
        const p = player;
        const aimAngle = angleBetween(p.x, p.y, mouseGameX, mouseGameY);
        let nearestEnemy = null, nearestDist = 300;
        for (const e of enemies) {
            if (e.dead) continue; const d = dist(p.x, p.y, e.x, e.y);
            if (d < nearestDist) { nearestDist = d; nearestEnemy = e; }
        }
        let fireAngle = aimAngle;
        if (nearestEnemy && dist(mouseGameX, mouseGameY, p.x, p.y) < 30) fireAngle = angleBetween(p.x, p.y, nearestEnemy.x, nearestEnemy.y);

        let dmgMult = 1;
        if (p.heavyShotEnabled) { p.heavyShotCounter++; if (p.heavyShotCounter >= 5) { p.heavyShotCounter = 0; dmgMult = 3; } }
        if (p.spiralShot) { p.spiralAngle += 0.3; fireAngle += Math.sin(p.spiralAngle) * 0.5; }
        if (p.beamWeapon) { fireBeam(fireAngle); return; }

        let totalCount = p.projCount + (p.infiniteMag ? p.infiniteMagStacks : 0);
        let ox = 0, oy = 0;
        if (p.alternatingShots) { p.alternatingSide *= -1; const perp = fireAngle + Math.PI / 2; ox = Math.cos(perp) * 12 * p.alternatingSide; oy = Math.sin(perp) * 12 * p.alternatingSide; }

        fireProjectileFan(p.x + ox, p.y + oy, fireAngle, totalCount, p.projSpread, dmgMult);

        if (p.crossShot) for (let i = 0; i < 4; i++) fireSingleProjectile(p.x, p.y, (Math.PI / 2) * i, 0.5);
        if (p.omnipresent) for (const echo of p.echoes) fireProjectileFan(echo.x, echo.y, fireAngle, Math.min(totalCount, 3), p.projSpread, dmgMult * 0.5);
        if (p.stormEngine) { p.stormCounter++; if (p.stormCounter >= 4 && nearestEnemy) { p.stormCounter = 0; chainLightningFrom(nearestEnemy, p.damage * 0.8, p.chainLightning + 2, new Set([nearestEnemy])); } }

        if (!isBurst) Audio.play('shoot');
        Particles.emit(p.x + Math.cos(fireAngle) * 20, p.y + Math.sin(fireAngle) * 20, 3, '#00f0ff', { angle: fireAngle, spread: 0.3, speed: 60, life: 0.15, size: 2 });
    }

    function fireProjectileFan(ox, oy, bAngle, count, spread, dMult) {
        const spreadTotal = spread * (Math.PI / 180);
        for (let i = 0; i < count; i++) {
            let a = bAngle; if (count > 1) a = bAngle - spreadTotal / 2 + (spreadTotal / (count - 1)) * i;
            a += rng(-0.03, 0.03);
            fireSingleProjectile(ox, oy, a, dMult, (count % 2 === 1 && i === Math.floor(count / 2)));
        }
    }

    function fireSingleProjectile(ox, oy, angle, dmgMult = 1, isCenter = false) {
        const p = player, proj = projPool.get();
        proj.x = ox + Math.cos(angle) * (p.size + 5); proj.y = oy + Math.sin(angle) * (p.size + 5);
        proj.vx = Math.cos(angle) * p.projSpeed; proj.vy = Math.sin(angle) * p.projSpeed;
        let dmg = p.damage * dmgMult;
        if (isCenter && p.centerProjBonus > 1) dmg *= p.centerProjBonus;
        if (p.ascendantActive > 0) dmg *= 3;
        if (p.titanCore) dmg += Math.floor(p.maxHp / 10);
        let crit = Math.random() < p.critChance; if (crit) dmg *= p.critDamage;
        proj.damage = dmg; proj.size = 3 * p.projSizeMult; proj.life = 2; proj.pierce = p.projPierce; proj.ricochet = p.projRicochet;
        proj.explosive = p.projExplosive; proj.explosionRadius = p.explosionRadius; proj.homing = p.projHoming;
        proj.hit = new Set(); proj.color = crit ? '#ffd700' : '#00f0ff'; proj.chainLightning = p.chainLightning;
        proj.fire = Math.random() < p.fireChance; proj.ice = Math.random() < p.iceChance; proj.poison = Math.random() < p.poisonChance;
        proj.voidDmg = p.voidDamage; proj.crit = crit; proj.trail = p.projTrail; proj.trailDmg = p.projTrailDmg;
        proj.split = p.projSplit; proj.isSplit = false; proj.isReflected = false;
        if (mp) mpRecordShot(proj);
    }

    function fireBeam(angle) { beams.push({ x: player.x, y: player.y, angle: angle, length: 500, damage: player.beamDamage || player.damage * 0.3, width: 6, life: 0.1, color: '#00f0ff', hit: new Set() }); }

    function performDash() {
        const p = player; let angle = (Math.abs(p.vx) > 10 || Math.abs(p.vy) > 10) ? Math.atan2(p.vy, p.vx) : angleBetween(p.x, p.y, mouseGameX, mouseGameY);
        const dx = Math.cos(angle) * p.dashDist, dy = Math.sin(angle) * p.dashDist;
        for (let i = 0; i < 5; i++) p.dashTrail.push({ x: p.x + dx * (i/5), y: p.y + dy * (i/5), life: 0.3 });
        p.x = clamp(p.x + dx, p.size, GAME_W - p.size); p.y = clamp(p.y + dy, p.size, GAME_H - p.size);
        p.invulnTimer = Math.max(p.invulnTimer, 0.2); p.dashCharges--; p.dashTimer = p.dashCooldown;
        if (p.dashDamage > 0) for (const e of enemies) if (!e.dead && dist(p.x, p.y, e.x, e.y) < 60) damageEnemy(e, p.dashDamage);
        if (p.phantomArsenal) {
            for (let i = -3; i <= 3; i++) {
                const a = angle + i * 0.2, proj = projPool.get();
                proj.x = p.x; proj.y = p.y; proj.vx = Math.cos(a) * 500; proj.vy = Math.sin(a) * 500;
                proj.damage = p.damage * 1.5; proj.size = 4 * p.projSizeMult; proj.life = 1.2; proj.pierce = 2; proj.ricochet = 0;
                proj.hit = new Set(); proj.color = '#cc44ff'; proj.isPhantom = true;
                if (mp) mpRecordShot(proj);
            }
        }
        Audio.play('dash'); Particles.emit(p.x, p.y, 15, '#00f0ff', { speed: 100, life: 0.3 });
    }

    function updateProjectiles(dt) {
        projPool.update(dt, (proj, dt) => {
            if (proj.homing > 0) {
                let nearest = null, nDist = 250;
                for (const e of enemies) if (!e.dead && !proj.hit.has(e) && dist(proj.x, proj.y, e.x, e.y) < nDist) { nDist = dist(proj.x, proj.y, e.x, e.y); nearest = e; }
                if (nearest) {
                    const target = angleBetween(proj.x, proj.y, nearest.x, nearest.y), current = Math.atan2(proj.vy, proj.vx);
                    const turn = clamp(normalizeAngle(target - current), -proj.homing * dt * 5, proj.homing * dt * 5);
                    const spd = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
                    proj.vx = Math.cos(current + turn) * spd; proj.vy = Math.sin(current + turn) * spd;
                }
            }
            proj.x += proj.vx * dt; proj.y += proj.vy * dt; proj.life -= dt;
            if (proj.x < -20 || proj.x > GAME_W + 20 || proj.y < -20 || proj.y > GAME_H + 20) return true;

            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i]; if (e.dead || proj.hit.has(e)) continue;
                if (dist(proj.x, proj.y, e.x, e.y) < proj.size + e.size) {
                    proj.hit.add(e); let dmg = proj.damage;
                    if (player.closeRangeBonus > 0 && dist(player.x, player.y, e.x, e.y) < 150) dmg *= (1 + player.closeRangeBonus);
                    if (player.longRangeBonus > 0 && dist(player.x, player.y, e.x, e.y) > 400) dmg *= (1 + player.longRangeBonus);
                    if (e.isBoss && player.bonusBossDmg > 0) dmg *= (1 + player.bonusBossDmg);
                    if (player.executeDmg > 0 && e.hp < e.maxHp * 0.3) dmg *= (1 + player.executeDmg);
                    const hpBefore = e.hp; damageEnemy(e, dmg, proj.crit);
                    
                    if (proj.fire && !e.dead) { e.burning = (e.burning || 0) + 3; e.burnDmg = proj.damage * 0.3; }
                    if (proj.ice && !e.dead) e.frozen = Math.max(e.frozen || 0, 1.5);
                    if (proj.poison && !e.dead) { e.poisoned = (e.poisoned || 0) + 4; e.poisonDmg = proj.damage * 0.2; }
                    if (proj.voidDmg > 0 && !e.dead) { e.voidPull = 2; e.voidCenter = { x: proj.x, y: proj.y }; }
                    if (proj.chainLightning > 0 && !e.dead) chainLightningFrom(e, proj.damage * 0.5, proj.chainLightning, new Set([e]));
                    if (proj.crit && player.critExplode) createExplosion(proj.x, proj.y, 40, proj.damage * 0.4);
                    
                    if (proj.split && !proj.isSplit) {
                        const baseA = Math.atan2(proj.vy, proj.vx);
                        for (let s = -1; s <= 1; s++) {
                            if (s === 0) continue;
                            const sp = projPool.get(); Object.assign(sp, proj); sp.hit = new Set(); sp.split = false; sp.isSplit = true;
                            sp.vx = Math.cos(baseA + s * 0.4) * 400; sp.vy = Math.sin(baseA + s * 0.4) * 400; sp.damage = proj.damage * 0.6; sp.life = 1; sp.ricochet = 0; sp.pierce = 0;
                        }
                    }
                    if (proj.explosive) { createExplosion(proj.x, proj.y, proj.explosionRadius || 50, proj.damage * 0.5); return true; }
                    if (proj.pierce > 0) { proj.pierce--; proj.damage *= 0.8; continue; }
                    if (proj.ricochet > 0) {
                        proj.ricochet--; let nextTarget = null, minD = 200;
                        for (const e2 of enemies) if (!proj.hit.has(e2) && !e2.dead && dist(proj.x, proj.y, e2.x, e2.y) < minD) { minD = dist(proj.x, proj.y, e2.x, e2.y); nextTarget = e2; }
                        if (nextTarget) {
                            const a = angleBetween(proj.x, proj.y, nextTarget.x, nextTarget.y), sp = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
                            proj.vx = Math.cos(a) * sp; proj.vy = Math.sin(a) * sp; proj.damage *= 0.7; continue;
                        }
                    }
                    Particles.emit(proj.x, proj.y, 5, proj.color, { speed: 60, life: 0.2 });
                    return true;
                }
            }
            return proj.life <= 0;
        });
    }

    function chainLightningFrom(source, damage, chains, hitSet) {
        if (chains <= 0) return;
        let nearest = null, minD = 150;
        for (const e of enemies) if (!hitSet.has(e) && !e.dead && dist(source.x, source.y, e.x, e.y) < minD) { minD = dist(source.x, source.y, e.x, e.y); nearest = e; }
        if (nearest) {
            hitSet.add(nearest); damageEnemy(nearest, damage);
            beams.push({ x: source.x, y: source.y, tx: nearest.x, ty: nearest.y, type: 'lightning', life: 0.15, color: '#88ddff' });
            chainLightningFrom(nearest, damage * 0.7, chains - 1, hitSet);
        }
    }

    function createExplosion(x, y, radius, damage) {
        Particles.emit(x, y, 25, '#ff6622', { speed: 150, life: 0.3, size: 3 });
        Shake.add(4); Audio.play('explosion');
        for (const e of enemies) if (!e.dead && dist(x, y, e.x, e.y) < radius + e.size) damageEnemy(e, damage);
    }

    function damageEnemy(e, dmg, crit = false) {
        if (e.dead) return;
        if (e.proxy) { if (mp) mpHitProxy(e, dmg, crit); return; }
        if (e.armor) dmg = Math.max(1, dmg - e.armor);
        e.hp -= dmg; e.flashTimer = 0.1; totalDamageDealt += dmg;
        DmgNumbers.spawn(e.x, e.y, dmg, crit); Audio.play('hit');
        if (e.hp <= 0 && !e.dead) killEnemy(e);
    }

    function killEnemy(e) {
        e.dead = true; kills++; totalKills++;
        const byMe = !hitOwner;
        if (mp) {
            // В кооперативе опыт общий: хост копит его в world.xp, гости добавляют себе разницу
            // Сферы опыта видит и собирает каждый игрок у себя (у каждого своя копия),
            // гостям хост отправляет места смертей врагов вместе с общим счётчиком опыта
            if (byMe) mp.myKills++;
            mp.teamXp += e.xpValue || 3;
            if (mp.deathsOut.length < 80) mp.deathsOut.push(`${Math.round(e.x)},${Math.round(e.y)},${e.xpValue || 3}`);
        }
        dropOrbs(e.x, e.y, e.xpValue || 3);
        if (player.killHeal > 0 && byMe && !(mp && mp.dead)) player.hp = Math.min(player.maxHp, player.hp + player.killHeal);
        if (e.isElite) { evolutionPoints += 1; if (mp) mp.teamEp += 1; DmgNumbers.spawn(e.x, e.y - 20, '+1 EP', false); }
        if (e.isBoss) { evolutionPoints += 3; if (mp) mp.teamEp += 3; DmgNumbers.spawn(e.x, e.y - 20, '+3 EP', false); }
        Particles.emit(e.x, e.y, 12, e.color || '#ff4466', { speed: 100, life: 0.3 });
        Audio.play('kill'); Shake.add(2);
        if (player.deathBloom && byMe) createExplosion(e.x, e.y, 55, player.damage * 0.5);
    }

    function updateEnemyProjectiles(dt) {
        eProjPool.update(dt, (proj, dt) => {
            proj.x += proj.vx * dt; proj.y += proj.vy * dt; proj.life -= dt;
            if (proj.x < -20 || proj.x > GAME_W + 20 || proj.y < -20 || proj.y > GAME_H + 20) return true;
            
            // REAR SHIELD
            const meAlive = player && !(mp && mp.dead);
            if (meAlive && player.rearShieldLevel > 0) {
                const aimAngle = angleBetween(player.x, player.y, mouseGameX, mouseGameY);
                const shieldAngle = aimAngle + Math.PI;
                const localX = (proj.x - player.x) * Math.cos(-shieldAngle) - (proj.y - player.y) * Math.sin(-shieldAngle);
                const localY = (proj.x - player.x) * Math.sin(-shieldAngle) + (proj.y - player.y) * Math.cos(-shieldAngle);
                if (localX > player.size + 8 && localX < player.size + 8 + 35 + player.rearShieldLevel * 5) {
                    const maxY = ((50 + player.rearShieldLevel * 10) / 2) * (1 - (localX - (player.size + 8)) / (35 + player.rearShieldLevel * 5));
                    if (Math.abs(localY) <= maxY) {
                        player.rearShieldHitFlash = 0.3; Audio.play('reflect');
                        if (player.rearShieldLevel >= 2) reflectProjectile(proj, player.rearShieldLevel);
                        return true;
                    }
                }
            }

            if (meAlive && dist(proj.x, proj.y, player.x, player.y) < proj.size + player.size) {
                if (player.reflectChance > 0 && Math.random() < player.reflectChance) { reflectProjectile(proj, 2); return true; }
                damagePlayer(proj.damage);
                Particles.emit(proj.x, proj.y, 5, '#ff4466', { speed: 50, life: 0.2 });
                return true;
            }
            return proj.life <= 0;
        });
    }

    function reflectProjectile(proj, level) {
        const pp = projPool.get();
        let ra = Math.atan2(-proj.vy, -proj.vx);
        if (proj.source && !proj.source.dead) ra = angleBetween(proj.x, proj.y, proj.source.x, proj.source.y);
        const refSpeed = Math.max(400, Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy) * 1.5);
        Object.assign(pp, { x: proj.x, y: proj.y, vx: Math.cos(ra) * refSpeed, vy: Math.sin(ra) * refSpeed,
            damage: proj.damage * (player.reflectorPrime ? 3 : 1.5), size: proj.size + 1, life: 2,
            pierce: (level >= 4 || player.reflectorPrime) ? 3 : 0, hit: new Set(), owner: 'player',
            color: '#88ddff', isReflected: true });
        if (level >= 5 || player.realityMirror) createExplosion(proj.x, proj.y, 80, proj.damage * 2);
    }

    function damagePlayer(dmg, attacker = null) {
        const p = player; if (!p || p.invulnTimer > 0 || (mp && mp.dead)) return;
        dmg = Math.max(1, dmg * (1 - p.dmgReduction));
        if (p.shield > 0) { const absorbed = Math.min(p.shield, dmg); p.shield -= absorbed; dmg -= absorbed; }
        if (dmg > 0) { p.hp -= dmg; totalDamageReceived += dmg; }
        p.invulnTimer = INVULN_DURATION; p.flashTimer = 0.2; Shake.add(5); Audio.play('playerHit');
        if (p.hp <= 0 && p.emergencySurvival && !p.emergencyUsed) { p.hp = Math.floor(p.maxHp * 0.15); p.emergencyUsed = true; p.invulnTimer = 2; return; }
        if (p.hp <= 0) { if (mp) mpOnLocalDeath(attacker); else playerDeath(); }
    }

    function playerDeath() {
        if (mp) { mpOnLocalDeath(null); return; }
        state = 'gameover'; Audio.play('death'); Shake.add(10);
        persistent.totalRuns++; persistent.bestRound = Math.max(persistent.bestRound, round);
        persistent.totalKillsAll += kills; persistent.totalTimeAll += runTime; savePersistent(); showGameOver();
    }

    function updateOrbitals(dt) {} function updateDrones(dt) {} function updateBeams(dt) {} function updateBlackHoles(dt) {}
    
    function updateEnemies(dt) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i]; if (e.dead) { enemies.splice(i, 1); continue; }
            if (e.hp <= 0) { killEnemy(e); continue; }
            e.flashTimer = Math.max(0, (e.flashTimer || 0) - dt);
            if (e.behavior) {
                aiTarget = mp ? mpNearestTarget(e) : null;
                e.behavior(e, dt, 1 * (player.timeDialation || 1));
                aiTarget = null;
            }
            e.x = clamp(e.x, e.size, GAME_W - e.size); e.y = clamp(e.y, e.size, GAME_H - e.size);

            if (player && !e.rangedOnly && !(mp && mp.dead)) {
                const cDist = dist(e.x, e.y, player.x, player.y), mDist = e.size + player.size;
                if (cDist < mDist) {
                    const pa = angleBetween(player.x, player.y, e.x, e.y);
                    const force = Math.max((mDist - cDist) * 3, 120);
                    e.x += Math.cos(pa) * force * dt; e.y += Math.sin(pa) * force * dt;
                    if (cDist < 5) { const ra = rng(0, Math.PI*2); e.x = player.x + Math.cos(ra)*(mDist+5); e.y = player.y + Math.sin(ra)*(mDist+5); }
                    damagePlayer(e.contactDmg || 10);
                }
            }
            for (let j = i + 1; j < enemies.length; j++) {
                const e2 = enemies[j]; if (e2.dead) continue;
                const d = dist(e.x, e.y, e2.x, e2.y), mSep = (e.size + e2.size) * 0.8;
                if (d < mSep && d > 0.1) {
                    const sa = angleBetween(e2.x, e2.y, e.x, e.y), pa = (mSep - d) * 0.5;
                    e.x += Math.cos(sa) * pa * dt * 5; e.y += Math.sin(sa) * pa * dt * 5;
                    e2.x -= Math.cos(sa) * pa * dt * 5; e2.y -= Math.sin(sa) * pa * dt * 5;
                }
            }
        }
        if (bossActive && bossActive.dead) {
            Particles.emit(bossActive.x, bossActive.y, 50, '#ffd700', { speed: 150, life: 0.5, size: 3 });
            document.getElementById('hudBoss').style.display = 'none';
            bossActive = null;
        }
    }

    function dropOrbs(x, y, xpValue) {
        pickups.push({ x, y, type: 'xp', value: xpValue * player.xpMult, life: 15, size: 4, vy: 0 });
        if (Math.random() < 0.08) pickups.push({ x, y, type: 'heal', value: 10 * player.healMult, life: 12, size: 5, vy: 0 });
    }

    function updatePickups(dt) {
        const p = player;
        for (let i = pickups.length - 1; i >= 0; i--) {
            const pk = pickups[i]; pk.life -= dt; if (pk.life <= 0) { pickups.splice(i, 1); continue; }
            const d = dist(pk.x, pk.y, p.x, p.y);
            if (d < p.pickupRadius) {
                const a = angleBetween(pk.x, pk.y, p.x, p.y), speed = Math.max(200, 400 - d * 2);
                pk.x += Math.cos(a) * speed * dt; pk.y += Math.sin(a) * speed * dt;
            }
            if (d < p.size + pk.size) {
                if (pk.type === 'xp') p.xp += pk.value;
                else if (pk.type === 'heal') p.hp = Math.min(p.maxHp, p.hp + pk.value);
                pickups.splice(i, 1);
            }
        }
    }
    function updateHazards(dt) {}

    // ============================================================
    // ROUNDS & SPAWNING
    // ============================================================
    const EnemySpawner = (() => {
        let spawnTimer = 0;
        function update(dt, currentRound, bossActive) {
            if (bossActive) return;
            spawnTimer += dt;
            const spawnRate = Math.max(0.8, 3 - currentRound * 0.15);
            if (spawnTimer >= spawnRate) {
                spawnTimer = 0;
                const count = rngInt(2, Math.min(3 + Math.floor(currentRound / 2), 8));
                const types = EnemyTypes.getTypesForRound(currentRound);
                for (let i = 0; i < count; i++) {
                    const typeKey = choose(types);
                    const e = EnemyTypes.create(typeKey, currentRound); e.typeKey = typeKey;
                    const pos = EnemyTypes.findSafeSpawnPosition(mp ? mpSpawnRef() : player, e.size, enemies, false);
                    if (pos.success) { e.x = pos.x; e.y = pos.y; enemies.push(e); }
                }
            }
        }
        function spawnBoss(currentRound) {
            const boss = EnemyTypes.createBoss(currentRound);
            const pos = EnemyTypes.findSafeSpawnPosition(mp ? mpSpawnRef() : player, boss.size, enemies, true);
            if (pos.success) { boss.x = pos.x; boss.y = pos.y; } else { boss.x = GAME_W/2; boss.y = 60; }
            enemies.push(boss); document.getElementById('hudBoss').style.display = 'block'; document.getElementById('hudBossName').textContent = boss.name;
            return boss;
        }
        return { update, spawnBoss, reset: () => { spawnTimer = 0; } };
    })();

    function startRound() {
        state = 'roundStart'; roundStartTimer = 1.5;
        document.getElementById('roundStart').classList.remove('hidden'); document.getElementById('roundStart').classList.add('visible');
        document.getElementById('rsRound').textContent = (mp && mp.mode === 'pvp') ? `${round}/${PVP_ROUNDS}` : round;
        document.getElementById('rsTime').textContent = Math.ceil(roundDuration);
        EnemySpawner.reset();
        if (round > 1 && round % BOSS_INTERVAL === 0 && (!mp || (mp.isHost && mp.mode === 'coop'))) {
            setTimeout(() => { if (state === 'playing' || state === 'roundStart') bossActive = EnemySpawner.spawnBoss(round); }, 2000);
        }
    }
    function endRound() {
        // Collect every XP orb still on the field so kills at the end of the round are not lost
        for (const pk of pickups) if (pk.type === 'xp') player.xp += pk.value;
        pickups = [];
        applyLevelUps(); updateHUD();
        state = 'upgrading'; evolutionPoints += 1; showUpgradeScreen();
    }
    function advanceRound() {
        round++; roundDuration = DEFAULT_ROUND_DURATION;
        roundTimer = roundDuration; enemies = enemies.filter(e => !e.dead); startRound();
    }

    function showUpgradeScreen() {
        upgradeSelectionPending = false;
        const container = document.getElementById('upgradeCards'); container.innerHTML = '';
        document.getElementById('upRound').textContent = round;
        const pEvo = player.evolutionBranch ? { tier: UpgradeSystem.evolutionBranches[player.evolutionBranch].forms.find(f => f.id === player.evolutionForm).tier } : { tier: 0 };
        const opts = UpgradeSystem.generateOptions(6, round, acquiredUpgrades, pEvo);
        currentUpgradeOptions = opts;

        opts.forEach((up, idx) => {
            const card = document.createElement('div'); card.className = `upgrade-card ${up.rarity}`;
            card.innerHTML = `<span class="card-key">[${idx + 1}]</span><div class="card-rarity">${up.rarity}</div><div class="card-name">${up.name}</div><div class="card-category">${up.category}</div><div class="card-desc">${up.description}</div>`;
            card.addEventListener('click', () => selectUpgradeByIndex(idx)); container.appendChild(card);
        });
        document.getElementById('btnOpenEvoTree').style.display = 'inline-block';
        document.getElementById('upNextTime').textContent = DEFAULT_ROUND_DURATION;
        document.getElementById('upgradeScreen').classList.add('active');
    }

    function selectUpgradeByIndex(idx) {
        if (upgradeSelectionPending || idx < 0 || idx >= currentUpgradeOptions.length) return;
        upgradeSelectionPending = true; const up = currentUpgradeOptions[idx];
        UpgradeSystem.apply(up, player); acquiredUpgrades.push(up);
        if (mp) { mp.build.push('u:' + up.id); mp.buildDirty = true; }
        const online = !!mp;
        Audio.play('upgrade'); setTimeout(() => {
            document.getElementById('upgradeScreen').classList.remove('active');
            if (!online) { advanceRound(); return; }
            if (!mp || state !== 'upgrading') return;
            // В сетевой игре ждём остальных: следующий раунд запускает хост
            mp.readyRound = round; mp.forceSend = true; mpShowWait();
        }, 400);
    }

    // ============================================================
    // EVOLUTION TREE UI
    // ============================================================
    function openEvolutionTree() {
        const prev = state; state = 'evolutionTree';
        const screen = document.getElementById('evolutionTreeScreen');
        screen.innerHTML = `
            <div class="evo-tree-container">
                <div class="evo-top-bar">
                    <div class="evo-points-display"><span id="evoPoints">${evolutionPoints}</span> EP</div>
                    <p class="evo-tree-subtitle">Select ONE primary branch. Hover nodes for details.</p>
                </div>
                <div class="evo-map-wrapper">
                    <div class="evo-map" id="evoMap">
                        <svg id="evo-lines"></svg><div id="evo-nodes"></div>
                    </div>
                </div>
                <button class="evo-close-btn" id="btnEvoCloseInline">Confirm & Close</button>
                <div id="evoTooltip" class="evo-tooltip"></div>
            </div>`;
        document.getElementById('btnEvoCloseInline').addEventListener('click', closeEvolutionTree);
        renderEvolutionTreeGraph(); screen.classList.add('active'); screen._prevState = prev;
    }

    function closeEvolutionTree() {
        const prev = document.getElementById('evolutionTreeScreen')._prevState || 'playing';
        document.getElementById('evolutionTreeScreen').classList.remove('active'); state = prev;
    }

    function renderEvolutionTreeGraph() {
        document.getElementById('evoPoints').textContent = evolutionPoints;
        const linesContainer = document.getElementById('evo-lines'), nodesContainer = document.getElementById('evo-nodes'), tooltip = document.getElementById('evoTooltip');
        linesContainer.innerHTML = ''; nodesContainer.innerHTML = '';
        const cx = 400, cy = 400, radiusSteps = [0, 110, 220, 330];
        const angles = [-Math.PI/2, -Math.PI/2 + (Math.PI*2/5), -Math.PI/2 + (Math.PI*4/5), -Math.PI/2 + (Math.PI*6/5), -Math.PI/2 + (Math.PI*8/5)];
        const branchLabels = { assault: 'A', bulwark: 'B', phantom: 'P', swarm: 'S', void: 'V' };
        
        let linesHTML = ''; const nodesData = [];
        const currentTier = player.evolutionForm === 'core' ? 0 : UpgradeSystem.evolutionBranches[player.evolutionBranch].forms.find(f => f.id === player.evolutionForm).tier;

        nodesData.push({ x: cx, y: cy, tier: 0, form: { name: 'CORE', description: 'Base', cost: 0 }, branchColor: '#888', branchName: 'BASE', status: currentTier === 0 ? 'current' : 'unlocked', icon: 'C' });

        Object.keys(UpgradeSystem.evolutionBranches).forEach((bId, idx) => {
            const branch = UpgradeSystem.evolutionBranches[bId];
            for (let t = 1; t <= 3; t++) {
                const form = branch.forms.find(f => f.tier === t); if (!form) continue;
                const r = radiusSteps[t], variance = (t % 2 === 0 ? 0.08 : -0.08);
                const nx = cx + Math.cos(angles[idx] + variance) * r, ny = cy + Math.sin(angles[idx] + variance) * r;
                let status = 'locked';
                if (player.evolutionBranch === bId) {
                    if (currentTier === t) status = 'current'; else if (currentTier > t) status = 'unlocked'; else if (currentTier === t - 1 && evolutionPoints >= form.cost) status = 'available';
                } else if (!player.evolutionBranch && t === 1 && evolutionPoints >= form.cost) status = 'available';
                nodesData.push({ x: nx, y: ny, tier: t, form: form, branchId: bId, branchColor: branch.color, branchName: branch.name, status: status, icon: branchLabels[bId] + t });
                const prevR = radiusSteps[t - 1], prevVar = ((t - 1) % 2 === 0 ? 0.08 : -0.08);
                const px = t === 1 ? cx : cx + Math.cos(angles[idx] + prevVar) * prevR, py = t === 1 ? cy : cy + Math.sin(angles[idx] + prevVar) * prevR;
                linesHTML += `<line x1="${px}" y1="${py}" x2="${nx}" y2="${ny}" stroke="${status === 'locked' && player.evolutionBranch && player.evolutionBranch !== bId ? '#333' : branch.color}" stroke-width="3" opacity="${status === 'locked' ? 0.3 : 0.8}" />`;
            }
        });

        linesContainer.innerHTML = linesHTML;
        nodesData.forEach(nd => {
            const el = document.createElement('div'); el.className = `evo-node ${nd.status}`;
            el.style.left = nd.x + 'px'; el.style.top = nd.y + 'px';
            if (nd.status !== 'locked') { el.style.backgroundColor = nd.branchColor; el.style.color = '#fff'; }
            if (nd.status === 'current') el.style.color = nd.branchColor;
            el.textContent = nd.status === 'locked' ? '' : nd.icon;
            if (nd.status === 'available') el.addEventListener('click', () => {
                if (!player.evolutionBranch && nd.tier === 1 && !confirm(`Commit to ${nd.branchName}? Other branches will lock.`)) return;
                evolutionPoints -= nd.form.cost; UpgradeSystem.applyEvolutionForm(player, nd.branchId, nd.form.id);
                if (mp) { mp.build.push(`e:${nd.branchId}:${nd.form.id}`); mp.buildDirty = true; mp.forceSend = true; }
                renderEvolutionTreeGraph();
            });
            el.addEventListener('mouseenter', () => {
                tooltip.innerHTML = `<div class="tt-name" style="color: ${nd.status === 'locked' ? '#888' : nd.branchColor}">${nd.form.name}</div><div class="tt-branch">${nd.branchName} - Tier ${nd.tier}</div><div class="tt-desc">${nd.form.description}</div>${nd.form.cost > 0 ? `<div class="tt-cost">Cost: ${nd.form.cost} EP</div>` : ''}`;
                tooltip.classList.add('visible');
                let tx = nd.x + 30; if (tx + 260 > 800) tx = nd.x - 290;
                tooltip.style.left = tx + 'px'; tooltip.style.top = nd.y + 'px';
            });
            el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
            nodesContainer.appendChild(el);
        });
    }

    // ============================================================
    // MULTIPLAYER — кооператив и PvP через Firebase Realtime Database
    // Хост считает врагов и раунды, каждый игрок считает себя сам.
    // Каждый пишет только свою часть: state/{uid}, hits/{uid}; хост — world.
    // ============================================================
    const NET_SEND_INTERVAL = 0.25;      // отправка не чаще 4 раз в секунду
    const PVP_ROUNDS = 5;
    const UPGRADE_WAIT_LIMIT = 45;       // сек: не ждать вечно игрока, ушедшего в AFK на экране улучшений
    const SLOT_COLORS = ['#00f0ff', '#ff3df2', '#ffd400', '#3dff7a'];
    const PVP_SPAWNS = [[150, 150], [GAME_W - 150, GAME_H - 150], [GAME_W - 150, 150], [150, GAME_H - 150]];
    const FILL_UPGRADE = { id: 'fill_damage', effect: (p) => { p.damage *= 1.1; } };
    let mp = null;
    let aiTarget = null;     // цель для ИИ врага (ближайший игрок) — читается через Game.getPlayer()
    let hitOwner = null;     // uid игрока, чей урон сейчас применяет хост
    let rprojs = [];         // снаряды других игроков (у себя симулируем локально)
    let hooks = {};

    function hexOf(c) { const m = /^#([0-9a-f]{6})/i.exec(c || ''); return m ? m[1] : 'ff4466'; }
    function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
    function netSeq() { return Date.now() % 1000000000; }

    function startOnline(opts) {
        hideAllScreens();
        mp = {
            net: opts.net, mode: opts.mode === 'pvp' ? 'pvp' : 'coop', isHost: !!opts.isHost, uid: opts.uid, name: opts.name || 'player',
            slot: opts.slot | 0, matchId: opts.matchId, onQuit: opts.onQuit || null, onOver: opts.onOver || null,
            players: opts.players || {}, remotes: {},
            sendTimer: 0, forceSend: true, shotsOut: [], epOut: [],
            hitTotals: new Map(), hitsDirty: false, hostApplied: {},
            teamXp: 0, teamEp: 0, lastTeamXp: 0, lastTeamEp: 0, lastEps: 0, deathsOut: [], lastDxs: 0,
            phase: 'start', readyRound: 0, upgradeWait: 0,
            dead: false, respawnTimer: 0, kb: {}, myKills: 0, pvpKillsSeen: 0,
            build: [], buildDirty: true, nextEnemyId: 1, proxies: new Map(),
            menuOpen: false, over: false, hudTimer: 0, boss: '', finalRes: ''
        };
        player = createPlayer(); enemies = []; projPool.releaseAll(); eProjPool.releaseAll(); rprojs = [];
        pickups = []; acquiredUpgrades = []; evolutionPoints = 0; currentUpgradeOptions = [];
        round = 1; roundDuration = DEFAULT_ROUND_DURATION; roundTimer = roundDuration;
        kills = 0; runTime = 0; totalDamageDealt = 0; totalDamageReceived = 0; bossActive = null; upgradeSelectionPending = false;
        Particles.clear(); DmgNumbers.clear();
        document.getElementById('hudBoss').style.display = 'none';
        document.getElementById('hud').classList.remove('hidden');
        document.getElementById('mpPanel').classList.remove('hidden');
        if (mp.mode === 'pvp') mpPlaceAtSpawn();
        const rj = opts.rejoin;
        if (rj && rj.myState && rj.myState.mid === mp.matchId && rj.world && rj.world.mid === mp.matchId) mpRestore(rj.myState, rj.world);
        else startRound();
        mpRenderPanel();
        mpSendNow();
    }

    // Возврат в матч после обновления страницы: повторяем купленные улучшения и формы эволюции
    function mpRestore(s, w) {
        const all = UpgradeSystem.getAllUpgrades();
        const tokens = String(s.b || '').split('|').filter(Boolean);
        for (const t of tokens) {
            const parts = t.split(':');
            if (parts[0] === 'u') {
                const up = all.find(u => u.id === parts[1]) || (parts[1].indexOf('fill_') === 0 ? FILL_UPGRADE : null);
                if (up) { UpgradeSystem.apply(up, player); acquiredUpgrades.push(up); }
            } else if (parts[0] === 'e') UpgradeSystem.applyEvolutionForm(player, parts[1], parts[2]);
        }
        mp.build = tokens;
        const lv = s.lv || 1;
        for (let i = 1; i < lv; i++) { player.level++; player.maxHp += 5; player.damage += 1; }
        player.xpToNext = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_SCALE, player.level - 1));
        player.xp = s.xp || 0; evolutionPoints = s.ep || 0; mp.kb = s.kb || {}; mp.myKills = s.k || 0;
        if (typeof s.x === 'number') player.x = s.x;
        if (typeof s.y === 'number') player.y = s.y;
        player.hp = clamp(typeof s.hp === 'number' ? s.hp : player.maxHp, 0, player.maxHp);
        mp.readyRound = s.rd || 0;
        mp.dead = s.al === false;
        if (mp.dead && mp.mode === 'pvp') mp.respawnTimer = 1;
        if (!mp.dead && player.hp <= 0) player.hp = player.maxHp;
        mp.pvpKillsSeen = null; // пересчитается из чужих state без повторной награды

        round = w.r || 1; roundDuration = DEFAULT_ROUND_DURATION;
        roundTimer = typeof w.t === 'number' ? w.t : DEFAULT_ROUND_DURATION;
        mp.teamXp = mp.lastTeamXp = w.xp || 0; mp.teamEp = mp.lastTeamEp = w.epb || 0; mp.lastEps = w.eps || 0; mp.lastDxs = w.dxs || 0;
        kills = mp.mode === 'coop' ? (w.kills || 0) : 0;
        if (mp.isHost && mp.mode === 'coop') mpRestoreEnemies(w.en || '');
        mp.phase = w.ph === 'start' ? 'playing' : (w.ph || 'playing');
        if (w.ph === 'over') { mpShowOver(w); return; }
        if (w.ph === 'upgrading') {
            state = 'upgrading';
            if (mp.readyRound >= round) mpShowWait(); else showUpgradeScreen();
        } else state = 'playing';
        mp.buildDirty = true; mp.forceSend = true;
    }

    function mpRestoreEnemies(str) {
        enemies = [];
        for (const d of mpDecodeEnemies(str)) {
            let e;
            if (d.flags & 1) e = EnemyTypes.createBoss(round);
            else { e = EnemyTypes.create(d.type, round); if (d.flags & 2) EnemyTypes.makeElite(e, round); }
            e.x = d.x; e.y = d.y; e.hp = d.hp; e.maxHp = d.maxHp; e.netId = d.id; e.typeKey = d.type; e.spawnFlash = 0;
            enemies.push(e);
            mp.nextEnemyId = Math.max(mp.nextEnemyId, d.id + 1);
            if (e.isBoss) { bossActive = e; document.getElementById('hudBoss').style.display = 'block'; document.getElementById('hudBossName').textContent = e.name; }
        }
    }

    function stopOnline() {
        if (!mp) return;
        mp = null; aiTarget = null; hitOwner = null; rprojs = [];
        enemies = []; pickups = []; projPool.releaseAll(); eProjPool.releaseAll(); Particles.clear(); DmgNumbers.clear();
        bossActive = null; player = null;
        hideAllScreens();
        ['hud', 'mpPanel', 'mpWait'].forEach(id => document.getElementById(id).classList.add('hidden'));
        document.getElementById('roundStart').classList.remove('visible'); document.getElementById('roundStart').classList.add('hidden');
        document.getElementById('hudBoss').style.display = 'none';
        mpResetGameOverScreen();
        state = 'menu';
    }

    function mpPlaceAtSpawn() {
        const sp = PVP_SPAWNS[mp.slot % PVP_SPAWNS.length];
        player.x = sp[0]; player.y = sp[1]; player.vx = 0; player.vy = 0;
    }

    function mpNearestTarget(e) {
        let best = null, bestD = Infinity;
        if (player && !mp.dead) { best = player; bestD = dist(e.x, e.y, player.x, player.y); }
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            if (!rm.alive || !rm.online) continue;
            const d = dist(e.x, e.y, rm.x, rm.y);
            if (d < bestD) { bestD = d; best = rm; }
        }
        return best;
    }

    function mpSpawnRef() {
        const list = [];
        if (player && !mp.dead) list.push(player);
        for (const uid in mp.remotes) { const rm = mp.remotes[uid]; if (rm.alive && rm.online) list.push(rm); }
        return list.length ? choose(list) : player;
    }

    function mpActiveRemotes() { return Object.values(mp.remotes).filter(rm => rm.online); }

    // ---------- ВРАГИ: кодирование снимка (хост рассылает всем) ----------
    function mpEncodeEnemies() {
        const out = [];
        for (const e of enemies) {
            if (e.dead) continue;
            if (!e.netId) e.netId = mp.nextEnemyId++;
            const flags = (e.isBoss ? 1 : 0) | (e.isElite ? 2 : 0) | (e.rangedOnly ? 4 : 0) | ((e.telegraph || 0) > 0 ? 8 : 0);
            out.push([e.netId, Math.round(e.x), Math.round(e.y), Math.round(e.size), Math.max(1, Math.ceil(e.hp)), Math.ceil(e.maxHp),
                hexOf(e.color), flags, e.contactDmg || 10, e.isBoss ? 'boss' : (e.typeKey || 'glitcher')].join(','));
            if (out.length >= 150) break;
        }
        return out.join(';');
    }

    function mpDecodeEnemies(str) {
        const list = [];
        if (!str) return list;
        for (const part of String(str).split(';')) {
            const f = part.split(',');
            if (f.length < 10) continue;
            list.push({ id: +f[0], x: +f[1], y: +f[2], size: +f[3], hp: +f[4], maxHp: +f[5], color: '#' + f[6], flags: +f[7], cd: +f[8], type: f[9] });
        }
        return list;
    }

    // Гость: враги — «тени» с позициями от хоста, плавно подтягиваем их к последним координатам
    function mpSyncProxies(str) {
        const seen = new Set(); const now = performance.now();
        for (const d of mpDecodeEnemies(str)) {
            seen.add(d.id);
            let e = mp.proxies.get(d.id);
            if (!e) { e = { proxy: true, netId: d.id, x: d.x, y: d.y, tx: d.x, ty: d.y, dead: false, flashTimer: 0, armor: 0, hp: d.hp }; mp.proxies.set(d.id, e); }
            e.tx = d.x; e.ty = d.y; e.size = d.size; e.maxHp = d.maxHp; e.color = d.color; e.contactDmg = d.cd;
            e.isBoss = !!(d.flags & 1); e.isElite = !!(d.flags & 2); e.rangedOnly = !!(d.flags & 4); e.telegraph = (d.flags & 8) ? 1 : 0;
            if (e.dead) { if (now - e.deadAt > 1200) { e.dead = false; e.hp = d.hp; } }
            else e.hp = Math.min(e.hp, d.hp);
        }
        for (const [id] of mp.proxies) if (!seen.has(id)) mp.proxies.delete(id);
        enemies = Array.from(mp.proxies.values());
    }

    function mpUpdateProxies(dt) {
        const k = Math.min(1, dt * 10);
        for (const e of enemies) {
            if (Math.abs(e.tx - e.x) > 200 || Math.abs(e.ty - e.y) > 200) { e.x = e.tx; e.y = e.ty; }
            else { e.x += (e.tx - e.x) * k; e.y += (e.ty - e.y) * k; }
            e.flashTimer = Math.max(0, (e.flashTimer || 0) - dt);
            if (e.dead || mp.dead || e.rangedOnly || !player) continue;
            if (dist(e.x, e.y, player.x, player.y) < e.size + player.size) damagePlayer(e.contactDmg || 10);
        }
    }

    // Гость попал по врагу: показываем сразу, а урон копим и отправляем хосту (накопительным итогом —
    // даже если одно сообщение потеряется, следующее его перекроет)
    function mpHitProxy(e, dmg, crit) {
        e.hp -= dmg; e.flashTimer = 0.1; totalDamageDealt += dmg;
        DmgNumbers.spawn(e.x, e.y, dmg, crit); Audio.play('hit');
        const cur = mp.hitTotals.get(e.netId) || { d: 0, t: 0 };
        cur.d += dmg; cur.t = performance.now(); mp.hitTotals.set(e.netId, cur); mp.hitsDirty = true;
        if (e.hp <= 0) {
            e.dead = true; e.deadAt = performance.now(); mp.myKills++;
            Particles.emit(e.x, e.y, 12, e.color || '#ff4466', { speed: 100, life: 0.3 });
            Audio.play('kill'); Shake.add(2);
        }
    }

    // Хост: применяем урон гостей
    function netHits(all) {
        if (!mp || !mp.isHost || mp.mode !== 'coop' || !all) return;
        for (const uid in all) {
            if (uid === mp.uid) continue;
            const h = all[uid];
            if (!h || h.mid !== mp.matchId) continue;
            const applied = mp.hostApplied[uid] || (mp.hostApplied[uid] = new Map());
            const present = new Set();
            for (const pair of String(h.h || '').split(',')) {
                if (!pair) continue;
                const [idS, dS] = pair.split(':'); const id = +idS, total = +dS;
                present.add(id);
                const diff = total - (applied.get(id) || 0);
                if (diff <= 0) continue;
                applied.set(id, total);
                const e = enemies.find(en => en.netId === id && !en.dead);
                if (e) { hitOwner = uid; damageEnemy(e, diff); hitOwner = null; }
            }
            for (const [id] of applied) if (!present.has(id)) applied.delete(id);
        }
    }

    // ---------- СНАРЯДЫ ИГРОКОВ ----------
    function mpRecordShot(proj) {
        if (!mp || mp.shotsOut.length >= 40) return;
        mp.shotsOut.push([Math.round(proj.x), Math.round(proj.y), Math.round(proj.vx), Math.round(proj.vy),
            Math.round(proj.size * 10), Math.round(proj.damage), proj.crit ? 1 : (proj.isPhantom ? 2 : 0), Math.round(proj.life * 10)].join(','));
    }

    function mpSpawnRemoteShots(owner, str) {
        const rm = mp.remotes[owner];
        for (const part of String(str).split(';')) {
            const f = part.split(',').map(Number);
            if (f.length < 8) continue;
            rprojs.push({ x: f[0], y: f[1], vx: f[2], vy: f[3], size: Math.max(2, f[4] / 10), dmg: f[5],
                color: f[6] === 1 ? '#ffd700' : f[6] === 2 ? '#cc44ff' : (rm ? rm.color : '#ff3df2'), life: f[7] / 10, owner });
        }
        if (rprojs.length > 400) rprojs.splice(0, rprojs.length - 400);
    }

    function mpUpdateRemoteProjectiles(dt) {
        for (let i = rprojs.length - 1; i >= 0; i--) {
            const q = rprojs[i];
            q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
            let remove = q.life <= 0 || q.x < -20 || q.x > GAME_W + 20 || q.y < -20 || q.y > GAME_H + 20;
            if (!remove && mp.mode === 'pvp' && !mp.dead && player && dist(q.x, q.y, player.x, player.y) < q.size + player.size) {
                damagePlayer(q.dmg, q.owner);
                Particles.emit(q.x, q.y, 5, q.color, { speed: 50, life: 0.2 });
                remove = true;
            }
            if (!remove && mp.mode === 'coop') {
                for (const e of enemies) if (!e.dead && dist(q.x, q.y, e.x, e.y) < q.size + e.size) { remove = true; break; }
            }
            if (remove) rprojs.splice(i, 1);
        }
    }

    // ---------- СНАРЯДЫ ВРАГОВ (хост рассылает всем, у каждого симулируются локально) ----------
    function mpRecordEnemyShot(x, y, vx, vy, damage, color, life) {
        if (!mp || !mp.isHost || mp.epOut.length >= 60) return;
        mp.epOut.push([Math.round(x), Math.round(y), Math.round(vx), Math.round(vy), Math.round(damage || 0), hexOf(color), Math.round((life || 3) * 10)].join(','));
    }

    function mpSpawnEnemyShots(str) {
        for (const part of String(str).split(';')) {
            const f = part.split(',');
            if (f.length < 7) continue;
            const p = eProjPool.get();
            p.x = +f[0]; p.y = +f[1]; p.vx = +f[2]; p.vy = +f[3]; p.damage = +f[4]; p.color = '#' + f[5]; p.life = (+f[6]) / 10; p.size = 4; p.source = null;
        }
    }

    // ---------- СОСТОЯНИЯ ИГРОКОВ ----------
    function netPlayers(players) {
        if (!mp) return;
        mp.players = players || {};
        for (const uid in mp.remotes) {
            const info = mp.players[uid];
            mp.remotes[uid].online = !!info && info.online !== false;
            if (info) mp.remotes[uid].name = info.name;
        }
    }

    function netStates(all) {
        if (!mp || !all) return;
        const seen = new Set();
        for (const uid in all) {
            if (uid === mp.uid) continue;
            const s = all[uid];
            if (!s || s.mid !== mp.matchId) continue;
            seen.add(uid);
            const info = mp.players[uid] || {};
            let rm = mp.remotes[uid];
            if (!rm) {
                rm = mp.remotes[uid] = { uid, x: s.x || 0, y: s.y || 0, tx: s.x || 0, ty: s.y || 0, a: 0, lastSs: s.ss, size: PLAYER_SIZE };
            } else if (s.ss && s.ss !== rm.lastSs) {
                rm.lastSs = s.ss;
                if (s.sh) { rm.color = SLOT_COLORS[(info.slot !== undefined ? +info.slot : 0) % 4]; mpSpawnRemoteShots(uid, s.sh); }
            }
            rm.tx = s.x || 0; rm.ty = s.y || 0; rm.a = s.a || 0;
            if (mp.mode === 'pvp') {
                // PvP: за убийство на месте гибели соперника появляется сфера опыта (только у убийцы)
                const byMe = (s.kb && s.kb[mp.uid]) || 0;
                if (rm.killedByMe !== undefined && byMe > rm.killedByMe && player) {
                    for (let i = rm.killedByMe; i < byMe; i++) dropOrbs(rm.tx + rng(-15, 15), rm.ty + rng(-15, 15), 25);
                }
                rm.killedByMe = byMe;
            }
            rm.hp = s.hp || 0; rm.mhp = s.mhp || 100; rm.lv = s.lv || 1; rm.alive = s.al !== false; rm.rd = s.rd || 0;
            rm.size = s.sz || PLAYER_SIZE; rm.formColor = s.c || ''; rm.k = s.k || 0; rm.kb = s.kb || {};
            rm.name = info.name || s.n || '???';
            rm.slot = info.slot !== undefined ? +info.slot : 0;
            rm.color = SLOT_COLORS[rm.slot % 4];
            rm.online = info.online !== false && (info.name !== undefined || !!s.n);
        }
        for (const uid in mp.remotes) if (!seen.has(uid)) delete mp.remotes[uid];
        if (mp.mode === 'pvp') mpCheckPvpKills();
    }

    function mpPvpKillsOf(uid) {
        let n = 0;
        if (uid !== mp.uid) n += mp.kb[uid] || 0;
        for (const u in mp.remotes) if (u !== uid) n += (mp.remotes[u].kb && mp.remotes[u].kb[uid]) || 0;
        return n;
    }

    function mpCheckPvpKills() {
        const mine = mpPvpKillsOf(mp.uid);
        if (mp.pvpKillsSeen === null) mp.pvpKillsSeen = mine;
        else if (mine > mp.pvpKillsSeen && player) {
            const d = mine - mp.pvpKillsSeen; mp.pvpKillsSeen = mine;
            player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.2 * d);
            DmgNumbers.spawn(player.x, player.y - 30, '+KILL', true); Audio.play('kill');
        }
        kills = mine;
    }

    // ---------- МИР (хост рассылает гостям) ----------
    function netWorld(w) {
        if (!mp || !w || w.mid !== mp.matchId || mp.isHost || !player) return;
        let orbXp = 0;
        if (w.dxs && w.dxs !== mp.lastDxs) {
            mp.lastDxs = w.dxs;
            for (const part of String(w.dx || '').split(';')) {
                const f = part.split(',');
                if (f.length < 3) continue;
                dropOrbs(+f[0], +f[1], +f[2]); orbXp += +f[2];
            }
        }
        if ((w.xp || 0) > mp.lastTeamXp) {
            // если какая-то пачка смертей потерялась в сети, недостающий опыт начисляем напрямую
            const rest = (w.xp - mp.lastTeamXp) - orbXp;
            if (rest > 0) player.xp += rest * player.xpMult;
            mp.lastTeamXp = w.xp;
        }
        if ((w.epb || 0) > mp.lastTeamEp) { evolutionPoints += w.epb - mp.lastTeamEp; mp.lastTeamEp = w.epb; }
        if (mp.mode === 'coop') kills = w.kills || 0;
        if (w.eps && w.eps !== mp.lastEps) { if (w.ep) mpSpawnEnemyShots(w.ep); mp.lastEps = w.eps; }
        if (mp.mode === 'coop') mpSyncProxies(w.en || '');
        mp.boss = w.boss || '';
        if (w.ph === 'over') { mp.finalRes = w.res || ''; if (!mp.over) mpShowOver(w); return; }
        if ((w.ph === 'start' || w.ph === 'playing') && w.r > round) mpBeginRound(w.r);
        if (w.ph === 'playing' && w.r === round && state === 'playing' && typeof w.t === 'number') roundTimer = w.t;
        if (w.ph === 'upgrading' && w.r === round && (state === 'playing' || state === 'roundStart')) {
            document.getElementById('roundStart').classList.remove('visible'); document.getElementById('roundStart').classList.add('hidden');
            endRound();
        }
        mp.phase = w.ph;
    }

    function mpBeginRound(r) {
        round = r; roundDuration = DEFAULT_ROUND_DURATION; roundTimer = roundDuration;
        document.getElementById('upgradeScreen').classList.remove('active');
        document.getElementById('evolutionTreeScreen').classList.remove('active');
        mpHideWait();
        upgradeSelectionPending = false;
        if (mp.mode === 'coop') {
            if (mp.dead) { mp.dead = false; player.hp = Math.max(1, Math.floor(player.maxHp * 0.5)); player.invulnTimer = 2; }
        } else {
            mp.dead = false; mp.respawnTimer = 0; player.hp = player.maxHp; player.invulnTimer = 1.5;
            mpPlaceAtSpawn(); rprojs = []; eProjPool.releaseAll();
        }
        if (mp.isHost) enemies = enemies.filter(e => !e.dead);
        startRound();
        mp.forceSend = true;
    }

    function mpHostEndRound() {
        if (mp.mode === 'pvp' && round >= PVP_ROUNDS) { mpHostFinish(); return; }
        mp.phase = 'upgrading'; mp.upgradeWait = 0; mp.forceSend = true;
        endRound();
    }

    function mpHostNextRound() {
        mp.phase = 'start';
        mpBeginRound(round + 1);
    }

    function mpHostFrame(dt) {
        if (mp.over) return;
        if (mp.phase === 'upgrading') {
            mp.upgradeWait += dt;
            const others = mpActiveRemotes();
            const othersReady = others.every(rm => rm.rd >= round);
            if (mp.readyRound >= round && (othersReady || mp.upgradeWait > UPGRADE_WAIT_LIMIT)) mpHostNextRound();
        } else if (mp.phase === 'playing' && mp.mode === 'coop') {
            const anyAlive = !mp.dead || mpActiveRemotes().some(rm => rm.alive);
            if (!anyAlive) mpHostFinish();
        }
    }

    function mpStandings() {
        const rows = [];
        const pvp = mp.mode === 'pvp';
        rows.push({ uid: mp.uid, name: mp.name, color: SLOT_COLORS[mp.slot % 4], kills: pvp ? mpPvpKillsOf(mp.uid) : mp.myKills, lv: player ? player.level : 1, me: true });
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            rows.push({ uid, name: rm.name, color: rm.color, kills: pvp ? mpPvpKillsOf(uid) : rm.k, lv: rm.lv, me: false });
        }
        if (mp.finalRes) {
            const fixed = {};
            mp.finalRes.split(',').forEach(p => { const [u, k] = p.split(':'); if (u) fixed[u] = +k; });
            rows.forEach(r => { if (fixed[r.uid] !== undefined) r.kills = fixed[r.uid]; });
        }
        rows.sort((a, b) => b.kills - a.kills);
        return rows;
    }

    function mpHostFinish() {
        mp.phase = 'over';
        mp.finalRes = mpStandings().map(r => `${r.uid}:${r.kills}`).join(',');
        mp.forceSend = true; mpSendNow();
        mpShowOver({ r: round, kills });
    }

    function mpShowOver(w) {
        if (mp.over) return;
        mp.over = true; state = 'gameover'; Audio.play('death');
        document.getElementById('upgradeScreen').classList.remove('active');
        document.getElementById('evolutionTreeScreen').classList.remove('active');
        document.getElementById('pauseMenu').classList.remove('active');
        mpHideWait();
        const pvp = mp.mode === 'pvp';
        const rows = mpStandings();
        const won = pvp && rows.length > 0 && rows[0].uid === mp.uid && (rows.length < 2 || rows[0].kills > rows[1].kills);
        document.querySelector('#gameOverScreen .gameover-title').textContent = pvp ? (won ? 'ПОБЕДА' : 'МАТЧ ОКОНЧЕН') : 'КОМАНДА ПОГИБЛА';
        let html = `<div class="stat-label">${pvp ? 'Раундов сыграно' : 'Раунд'}</div><div class="stat-value">${w.r || round}</div>`;
        if (!pvp) html += `<div class="stat-label">Убийств командой</div><div class="stat-value">${w.kills || kills}</div>`;
        rows.forEach((r, i) => {
            html += `<div class="stat-label" style="color:${r.color}">${pvp ? (i + 1) + '. ' : ''}${escHtml(r.name)}${r.me ? ' (вы)' : ''}</div><div class="stat-value">${r.kills} ${pvp ? 'убийств' : 'уб.'}, LV ${r.lv}</div>`;
        });
        document.getElementById('goStats').innerHTML = html;
        document.getElementById('goBuild').innerHTML = acquiredUpgrades.map(u => `<span class="build-tag">${escHtml(u.name || u.id)}</span>`).join('');
        document.getElementById('btnRestart').style.display = 'none';
        document.getElementById('btnGoMenu').style.display = 'none';
        document.getElementById('mpOverButtons').classList.remove('hidden');
        document.getElementById('btnMpLobby').style.display = mp.isHost ? '' : 'none';
        document.getElementById('mpOverHint').textContent = mp.isHost ? '' : 'Ждём, когда хост вернёт всех в лобби…';
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('active');
        if (mp.onOver) { try { mp.onOver({ mode: mp.mode, round: w.r || round, kills: rows.find(r => r.me).kills, won }); } catch (e) {} }
    }

    function mpResetGameOverScreen() {
        document.querySelector('#gameOverScreen .gameover-title').textContent = 'CYCLE TERMINATED';
        document.getElementById('btnRestart').style.display = '';
        document.getElementById('btnGoMenu').style.display = '';
        document.getElementById('mpOverButtons').classList.add('hidden');
    }

    function mpOnLocalDeath(killer) {
        if (mp.dead) return;
        mp.dead = true; player.hp = 0; Audio.play('death'); Shake.add(8);
        Particles.emit(player.x, player.y, 40, SLOT_COLORS[mp.slot % 4], { speed: 160, life: 0.6, size: 3 });
        if (mp.mode === 'pvp') {
            mp.respawnTimer = 3;
            if (killer && killer !== mp.uid) mp.kb[killer] = (mp.kb[killer] || 0) + 1;
        }
        mp.forceSend = true;
    }

    function mpUpdateDead(dt) {
        if (mp.mode !== 'pvp') return;
        mp.respawnTimer -= dt;
        if (mp.respawnTimer <= 0) {
            mp.dead = false; player.hp = player.maxHp; player.shield = player.maxShield; player.invulnTimer = 2;
            const sp = choose(PVP_SPAWNS); player.x = sp[0]; player.y = sp[1]; player.vx = 0; player.vy = 0;
            mp.forceSend = true;
        }
    }

    function mpShowWait() { document.getElementById('mpWait').classList.remove('hidden'); mpUpdateWait(); }
    function mpHideWait() { document.getElementById('mpWait').classList.add('hidden'); }
    function mpUpdateWait() {
        const others = mpActiveRemotes();
        const ready = (mp.readyRound >= round ? 1 : 0) + others.filter(rm => rm.rd >= round).length;
        document.getElementById('mpWaitCount').textContent = `Готовы: ${ready}/${others.length + 1}`;
    }

    function mpToggleMenu(force) {
        const el = document.getElementById('pauseMenu');
        const open = force !== undefined ? force : !el.classList.contains('active');
        el.classList.toggle('active', open);
        mp.menuOpen = open;
    }

    // ---------- ОТПРАВКА ----------
    function mpNetTick(dt) {
        mp.sendTimer += dt;
        if (mp.sendTimer < NET_SEND_INTERVAL && !mp.forceSend) return;
        mp.sendTimer = 0; mp.forceSend = false;
        mpSendNow();
    }

    function mpSendNow() {
        const p = player;
        if (!mp || !p) return;
        const aim = angleBetween(p.x, p.y, mouseGameX, mouseGameY);
        const s = {
            mid: mp.matchId, n: mp.name, x: Math.round(p.x), y: Math.round(p.y), a: Math.round(aim * 100) / 100,
            hp: Math.max(0, Math.ceil(p.hp)), mhp: Math.ceil(p.maxHp), lv: p.level, al: !mp.dead, rd: mp.readyRound, r: round,
            sz: Math.round(p.size), c: p.evolutionBranch ? UpgradeSystem.evolutionBranches[p.evolutionBranch].color : '',
            k: mp.myKills, kb: mp.kb, xp: Math.floor(p.xp), ep: evolutionPoints
        };
        if (mp.shotsOut.length) { s.sh = mp.shotsOut.join(';'); s.ss = netSeq(); mp.shotsOut = []; }
        if (mp.buildDirty) { s.b = mp.build.join('|'); mp.buildDirty = false; }
        mp.net.sendState(s);
        if (mp.isHost) {
            const w = { mid: mp.matchId, r: round, ph: mp.phase, t: Math.round(roundTimer * 100) / 100, xp: mp.teamXp, epb: mp.teamEp, kills,
                boss: bossActive && !bossActive.dead ? `${bossActive.name}|${Math.max(0, Math.ceil(bossActive.hp))}|${Math.ceil(bossActive.maxHp)}` : '' };
            if (mp.mode === 'coop') w.en = mpEncodeEnemies();
            if (mp.epOut.length) { w.ep = mp.epOut.join(';'); w.eps = netSeq(); mp.epOut = []; }
            if (mp.deathsOut.length) { w.dx = mp.deathsOut.join(';'); w.dxs = netSeq(); mp.deathsOut = []; }
            if (mp.phase === 'over') w.res = mp.finalRes;
            mp.net.sendWorld(w);
        } else if (mp.mode === 'coop' && mp.hitsDirty) {
            mp.hitsDirty = false;
            const now = performance.now(), parts = [];
            for (const [id, v] of mp.hitTotals) {
                if (!mp.proxies.has(id) && now - v.t > 3000) { mp.hitTotals.delete(id); continue; }
                parts.push(id + ':' + Math.round(v.d * 10) / 10);
            }
            mp.net.sendHits({ mid: mp.matchId, h: parts.join(',') });
        }
    }

    // ---------- КАДР ----------
    function mpFrame(dt) {
        const k = Math.min(1, dt * 12);
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            if (Math.abs(rm.tx - rm.x) > 300 || Math.abs(rm.ty - rm.y) > 300) { rm.x = rm.tx; rm.y = rm.ty; }
            else { rm.x += (rm.tx - rm.x) * k; rm.y += (rm.ty - rm.y) * k; }
        }
        if (mp.isHost) mpHostFrame(dt);
        if (!mp) return;
        mpNetTick(dt);
        mp.hudTimer -= dt;
        if (mp.hudTimer <= 0) {
            mp.hudTimer = 0.2;
            mpRenderPanel();
            if (!document.getElementById('mpWait').classList.contains('hidden')) mpUpdateWait();
            if (!mp.isHost) {
                const hb = document.getElementById('hudBoss');
                if (mp.boss) {
                    const [name, hp, max] = mp.boss.split('|');
                    hb.style.display = 'block'; document.getElementById('hudBossName').textContent = name;
                    document.getElementById('hudBossFill').style.width = clamp(+hp / (+max || 1) * 100, 0, 100) + '%';
                } else hb.style.display = 'none';
            }
            if (state !== 'playing') updateHUD();
        }
    }

    function mpRenderPanel() {
        if (!mp) return;
        const pvp = mp.mode === 'pvp';
        const rows = [{ name: mp.name, color: SLOT_COLORS[mp.slot % 4], hp: player ? player.hp : 0, mhp: player ? player.maxHp : 1, alive: !mp.dead, lv: player ? player.level : 1, kills: pvp ? mpPvpKillsOf(mp.uid) : mp.myKills, me: true, online: true }];
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            rows.push({ name: rm.name, color: rm.color, hp: rm.hp, mhp: rm.mhp, alive: rm.alive, lv: rm.lv, kills: pvp ? mpPvpKillsOf(uid) : rm.k, me: false, online: rm.online });
        }
        let html = `<div class="mp-panel-title">${pvp ? `PVP, РАУНД ${round}/${PVP_ROUNDS}` : 'КООПЕРАТИВ'}</div>`;
        for (const r of rows) {
            const pct = clamp(r.hp / (r.mhp || 1) * 100, 0, 100);
            html += `<div class="mp-row${r.alive ? '' : ' dead'}${r.online ? '' : ' offline'}"><span class="mp-name" style="color:${r.color}">${escHtml(r.name)}${r.me ? ' (вы)' : ''}</span><span class="mp-lv">LV ${r.lv}</span><span class="mp-kills">${r.kills} уб.</span>` +
                `<div class="mp-hp"><div style="width:${r.alive ? pct : 0}%;background:${r.color}"></div></div>${r.online ? '' : '<span class="mp-off">нет связи</span>'}</div>`;
        }
        document.getElementById('mpPanel').innerHTML = html;
    }

    function drawRemotePlayers() {
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            ctx.save(); ctx.translate(rm.x, rm.y);
            ctx.globalAlpha = rm.alive ? (rm.online ? 1 : 0.4) : 0.25;
            ctx.save(); ctx.rotate(rm.a);
            ctx.fillStyle = rm.formColor || rm.color;
            ctx.beginPath(); ctx.moveTo(rm.size, 0); ctx.lineTo(-rm.size * 0.6, -rm.size * 0.7); ctx.lineTo(-rm.size * 0.6, rm.size * 0.7); ctx.fill();
            ctx.restore();
            ctx.globalAlpha = rm.alive ? 1 : 0.4;
            ctx.fillStyle = rm.color; ctx.font = "bold 12px 'Share Tech Mono', monospace"; ctx.textAlign = 'center';
            ctx.fillText(rm.name, 0, -rm.size - 16);
            ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-18, -rm.size - 12, 36, 4);
            ctx.fillStyle = rm.color; ctx.fillRect(-18, -rm.size - 12, 36 * clamp(rm.hp / (rm.mhp || 1), 0, 1), 4);
            ctx.globalAlpha = 1;
            ctx.restore();
        }
        for (const q of rprojs) { ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2); ctx.fill(); }
    }

    function drawDeadOverlay() {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.textAlign = 'center'; ctx.fillStyle = '#ff1744'; ctx.font = "900 46px 'Orbitron', sans-serif";
        ctx.fillText('ВЫ ПОГИБЛИ', GAME_W / 2, GAME_H / 2 - 10);
        ctx.fillStyle = '#e0e0e0'; ctx.font = "18px 'Share Tech Mono', monospace";
        ctx.fillText(mp.mode === 'pvp' ? `Возрождение через ${Math.max(0, mp.respawnTimer).toFixed(1)} с` : 'Вы вернётесь в следующем раунде, если команда выживет', GAME_W / 2, GAME_H / 2 + 30);
        ctx.restore();
    }

    // ============================================================
    // RENDER
    // ============================================================
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); ctx.translate(offsetX, offsetY); ctx.scale(scale, scale); Shake.apply(ctx);
        
        ctx.fillStyle = '#08080e'; ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.strokeStyle = 'rgba(0,240,255,0.04)'; ctx.lineWidth = 1;
        for (let x = -(performance.now() / 200 % 40); x < GAME_W + 40; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke(); }
        for (let y = -(performance.now() / 200 % 40); y < GAME_H + 40; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); ctx.stroke(); }

        for (const pk of pickups) {
            const pulse = 1 + Math.sin(performance.now() / 120 + pk.x) * 0.2;
            ctx.globalAlpha = pk.life < 3 ? clamp(pk.life / 3, 0.2, 1) : 1;
            ctx.fillStyle = pk.type === 'heal' ? '#22ff88' : '#a855f7';
            ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(pk.x, pk.y, pk.size * pulse, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        for (const e of enemies) { if (!e.dead) drawEnemy(e); }
        for (const p of projPool.active) {
            ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
        for (const p of eProjPool.active) {
            ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }

        if (mp) drawRemotePlayers();

        if (player && state !== 'gameover' && !(mp && mp.dead)) {
            ctx.save(); ctx.translate(player.x, player.y);
            ctx.strokeStyle = 'rgba(168,85,247,0.06)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, player.pickupRadius, 0, Math.PI * 2); ctx.stroke();
            if (player.pickupRadius > PICKUP_RADIUS_BASE + 10) { ctx.strokeStyle = 'rgba(168,85,247,0.12)'; ctx.stroke(); }

            const aimA = angleBetween(0, 0, mouseGameX - player.x, mouseGameY - player.y);
            if (player.rearShieldLevel > 0) {
                ctx.save(); ctx.rotate(aimA + Math.PI);
                ctx.fillStyle = player.rearShieldLevel >= 5 ? '#ffd700' : '#00aaff'; ctx.globalAlpha = 0.3;
                ctx.beginPath(); ctx.moveTo(player.size + 8, -30); ctx.lineTo(player.size + 8 + 35, 0); ctx.lineTo(player.size + 8, 30); ctx.fill();
                ctx.restore();
            }

            ctx.rotate(aimA);
            ctx.fillStyle = player.evolutionBranch ? UpgradeSystem.evolutionBranches[player.evolutionBranch].color : '#00f0ff';
            ctx.beginPath(); ctx.moveTo(player.size, 0); ctx.lineTo(-player.size * 0.6, -player.size * 0.7); ctx.lineTo(-player.size * 0.6, player.size * 0.7); ctx.fill();
            ctx.restore();
        }

        Particles.draw(ctx); DmgNumbers.draw(ctx);
        if (mp && mp.dead && player && state !== 'gameover') drawDeadOverlay();
        ctx.restore();

    }

    function drawEnemy(e) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color || '#ff4466';
        ctx.beginPath(); ctx.arc(0, 0, e.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    function updateHUD() {
        if (!player) return;
        document.getElementById('hudRound').textContent = round;
        document.getElementById('hudTimer').textContent = roundTimer.toFixed(2);
        document.getElementById('hudKills').textContent = kills;
        document.getElementById('hudHealthFill').style.width = clamp(player.hp / player.maxHp * 100, 0, 100) + '%';
        document.getElementById('hudHealthText').textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
        document.getElementById('hudEP').textContent = Touch.enabled ? `EP: ${evolutionPoints}` : `EP: ${evolutionPoints}  [T] TREE`;
        document.getElementById('hudXpFill').style.width = clamp(player.xp / player.xpToNext * 100, 0, 100) + '%';
        document.getElementById('hudXpText').textContent = `LV ${player.level}  ${Math.floor(player.xp)}/${player.xpToNext} XP`;
        const shieldBar = document.getElementById('hudShieldBar');
        if (player.maxShield > 0) {
            shieldBar.style.display = 'block';
            document.getElementById('hudShieldFill').style.width = clamp(player.shield / player.maxShield * 100, 0, 100) + '%';
        } else shieldBar.style.display = 'none';
        if (bossActive && !bossActive.dead) document.getElementById('hudBossFill').style.width = clamp(bossActive.hp / bossActive.maxHp * 100, 0, 100) + '%';
        const dashEl = document.getElementById('hudDash');
        dashEl.textContent = player.dashTimer > 0 ? `DASH ${player.dashTimer.toFixed(1)}s` : 'DASH READY';
    }

    function showGameOver() {
        mpResetGameOverScreen();
        const mins = Math.floor(runTime / 60), secs = Math.floor(runTime % 60);
        document.getElementById('goStats').innerHTML =
            `<div class="stat-label">Round</div><div class="stat-value">${round}</div>` +
            `<div class="stat-label">Kills</div><div class="stat-value">${kills}</div>` +
            `<div class="stat-label">Level</div><div class="stat-value">${player ? player.level : 1}</div>` +
            `<div class="stat-label">Time</div><div class="stat-value">${mins}:${String(secs).padStart(2, '0')}</div>` +
            `<div class="stat-label">Best round</div><div class="stat-value">${persistent.bestRound}</div>`;
        document.getElementById('goBuild').innerHTML = acquiredUpgrades.map(u => `<span class="build-tag">${escHtml(u.name || u.id)}</span>`).join('');
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('active');
        if (hooks.onSoloOver) { try { hooks.onSoloOver({ mode: 'solo', round, kills }); } catch (e) {} }
    }

    function applySettings() {
        const defaults = defaultPersistent().settings;
        persistent.settings = Object.assign({}, defaults, persistent.settings || {});
        const s = persistent.settings;
        Audio.setMaster(s.masterVol / 100); Audio.setSfx(s.sfxVol / 100);
        Shake.setEnabled(!!s.shake); DmgNumbers.setEnabled(!!s.dmgNumbers); Particles.setLevel(s.particles);
        if (!s.dmgNumbers) DmgNumbers.clear();
    }

    // ---------- SETTINGS SCREEN ----------
    let settingsReturnTo = null; // 'menu' or 'pause'
    function syncSettingsUI() {
        const s = persistent.settings;
        document.getElementById('volMaster').value = s.masterVol;
        document.getElementById('volMasterVal').textContent = s.masterVol + '%';
        document.getElementById('volSfx').value = s.sfxVol;
        document.getElementById('volSfxVal').textContent = s.sfxVol + '%';
        document.getElementById('chkShake').checked = !!s.shake;
        document.getElementById('chkDmgNum').checked = !!s.dmgNumbers;
        document.getElementById('selParticles').value = s.particles;
    }
    function openSettings(from) {
        settingsReturnTo = from; syncSettingsUI();
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('pauseMenu').classList.remove('active');
        document.getElementById('settingsScreen').classList.add('active');
    }
    function closeSettings() {
        if (!settingsReturnTo) return;
        document.getElementById('settingsScreen').classList.remove('active');
        if (settingsReturnTo === 'pause' && (state === 'paused' || mp)) document.getElementById('pauseMenu').classList.add('active');
        else document.getElementById('mainMenu').classList.add('active');
        settingsReturnTo = null; savePersistent();
    }
    function initSettings() {
        const s = () => persistent.settings;
        const onChange = () => { applySettings(); savePersistent(); };
        document.getElementById('volMaster').addEventListener('input', (e) => {
            s().masterVol = parseInt(e.target.value, 10); document.getElementById('volMasterVal').textContent = s().masterVol + '%'; onChange();
        });
        document.getElementById('volSfx').addEventListener('input', (e) => {
            s().sfxVol = parseInt(e.target.value, 10); document.getElementById('volSfxVal').textContent = s().sfxVol + '%'; onChange();
        });
        document.getElementById('volSfx').addEventListener('change', () => Audio.play('hit'));
        document.getElementById('chkShake').addEventListener('change', (e) => { s().shake = e.target.checked; onChange(); });
        document.getElementById('chkDmgNum').addEventListener('change', (e) => { s().dmgNumbers = e.target.checked; onChange(); });
        document.getElementById('selParticles').addEventListener('change', (e) => { s().particles = e.target.value; onChange(); });
        document.getElementById('btnSettings').addEventListener('click', () => openSettings('menu'));
        document.getElementById('btnPauseSettings').addEventListener('click', () => openSettings('pause'));
        document.getElementById('btnSettingsBack').addEventListener('click', closeSettings);
        syncSettingsUI();
    }

    function hideAllScreens() { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); }

    function pauseGame() {
        if (state !== 'playing') return;
        state = 'paused';
        document.getElementById('pauseMenu').classList.add('active');
    }

    function resumeGame() {
        if (mp) { mpToggleMenu(false); return; }
        if (state !== 'paused') return;
        document.getElementById('pauseMenu').classList.remove('active');
        state = 'playing';
    }

    function startNewRun() {
        hideAllScreens(); player = createPlayer(); enemies = []; projPool.releaseAll(); eProjPool.releaseAll();
        pickups = []; acquiredUpgrades = []; evolutionPoints = 0; currentUpgradeOptions = [];
        round = 1; roundDuration = DEFAULT_ROUND_DURATION; roundTimer = roundDuration;
        kills = 0; runTime = 0; bossActive = null; upgradeSelectionPending = false; state = 'playing';

        document.getElementById('hud').classList.remove('hidden'); startRound();
    }

    function init() {
        resize(); window.addEventListener('resize', resize); initInput(); applySettings(); initSettings();
        
        document.getElementById('btnPlay').addEventListener('click', startNewRun);
        document.getElementById('btnRestart').addEventListener('click', startNewRun);
        document.getElementById('btnResume').addEventListener('click', resumeGame);
        document.getElementById('btnOpenEvoTree').addEventListener('click', openEvolutionTree);
        document.getElementById('btnGoMenu').addEventListener('click', () => { if (mp) return; hideAllScreens(); document.getElementById('mainMenu').classList.add('active'); state = 'menu'; });
        document.getElementById('btnQuit').addEventListener('click', () => {
            if (mp) { const cb = mp.onQuit; stopOnline(); if (cb) cb(); return; }
            hideAllScreens(); document.getElementById('hud').classList.add('hidden'); document.getElementById('mainMenu').classList.add('active'); state = 'menu'; });
        lastTime = performance.now(); requestAnimationFrame(loop);
    }
    
    init();
    function spawnEnemyProjectile(x, y, vx, vy, damage, color, life, source) {
        const p = eProjPool.get(); p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.damage = damage; p.color = color || '#ff4466'; p.life = life || 3; p.size = 4; p.source = source;
        if (mp && mp.isHost) mpRecordEnemyShot(x, y, vx, vy, damage, p.color, p.life);
        return p;
    }

    return {
        getPlayer: () => aiTarget || player, getEnemies: () => enemies, getState: () => state, spawnEnemyProjectile, createExplosion, damageEnemy, GAME_W, GAME_H,
        // сетевая игра
        startOnline, stopOnline, netWorld, netStates, netHits, netPlayers,
        isOnline: () => !!mp, setHooks: (h) => { hooks = Object.assign(hooks, h || {}); }
    };
})();