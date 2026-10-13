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
// расстояние от точки (px, py) до отрезка (ax, ay)-(bx, by)
function segDist(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
    let t = l2 > 0 ? ((px - ax) * vx + (py - ay) * vy) / l2 : 0;
    t = t < 0 ? 0 : (t > 1 ? 1 : t);
    return dist(px, py, ax + vx * t, ay + vy * t);
}
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
    const pool = new Pool(() => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, r: 0, g: 0, b: 0, css: '#fff', size: 2, decay: 1 }), (p) => { p.life = 0; }, 500);
    let particleLevel = 'medium';
    const limits = { high: 600, medium: 300, low: 100 };
    const colorCache = new Map();
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
            p.life = opts.life || rng(0.2, 0.6); p.maxLife = p.life; p.r = c.r; p.g = c.g; p.b = c.b; p.css = c.css;
            p.size = opts.size || rng(1, 3); p.decay = opts.decay || 1;
        }
    }
    function parseColor(c) {
        if (typeof c === 'object') { if (!c.css) c.css = `rgb(${c.r},${c.g},${c.b})`; return c; }
        const hit = colorCache.get(c); if (hit) return hit;
        const m = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
        const out = m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 240, b: 255 };
        out.css = `rgb(${out.r},${out.g},${out.b})`;
        if (colorCache.size < 200) colorCache.set(c, out);
        return out;
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
            ctx.fillStyle = p.css;
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
    // перевод строк, которые идут мимо DOM (canvas, confirm); остальной текст переводит i18n.js сам
    const tr = (s) => (window.I18N ? window.I18N.t(s) : s);
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d', { alpha: false });

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
            settings: { masterVol: 70, sfxVol: 80, shake: true, dmgNumbers: true, particles: 'medium', zoom: 'auto', quality: 'auto', fullscreen: true }
        };
    }
    function savePersistent() { try { localStorage.setItem('zero30_data', JSON.stringify(persistent)); } catch(e) {} }

    function createPlayer() {
        return {
            x: GAME_W / 2, y: GAME_H / 2, vx: 0, vy: 0, size: PLAYER_SIZE,
            // счётчики оружейных улучшений: без начальных значений Spiral Pattern / Alternating Shots давали NaN-снаряды
            heavyShotCounter: 0, spiralAngle: 0, alternatingSide: 1, stormCounter: 0, burstFireCount: 0, burstFireTimer: 0,
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
            beamWeapon: false, beamDamage: 0, beamMult: 0.7, timeDialation: 1, afterimages: false,
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
        (p) => { p.life = 0; p.hit = null; p.returning = false; p.beam = false; p.isPhantom = false; }, 300
    );

    const eProjPool = new Pool(
        () => ({ x: 0, y: 0, vx: 0, vy: 0, damage: 0, size: 4, life: 0, color: '#ff4466', source: null }),
        (p) => { p.life = 0; p.source = null; p.wait = 0; }, 200
    );

    // ---------- ЭКРАН, КАМЕРА, КАЧЕСТВО ----------
    // Canvas рисуется в реальных пикселях экрана (devicePixelRatio), поэтому на телефоне картинка чёткая.
    // На телефоне камера приближена и следует за игроком: видно не всю арену по высоте, зато всё крупнее.
    let dpr = 1, viewW = 1, viewH = 1, cssScale = 1;
    let camX = 0, camY = 0, camSnap = true, camFor = null, mouseSeen = false;
    let dprCap = 2;                 // потолок плотности в режиме «Auto», снижается, если телефон не тянет
    let needRedraw = true, lastDrawnState = null;
    const perf = { t: 0, frames: 0, sum: 0, lowParticles: false };

    function settingOf(k, def) { return (persistent.settings && persistent.settings[k] !== undefined) ? persistent.settings[k] : def; }

    function resize() {
        viewW = Math.max(1, window.innerWidth); viewH = Math.max(1, window.innerHeight);
        const q = settingOf('quality', 'auto'), dev = window.devicePixelRatio || 1;
        dpr = q === 'low' ? 1 : (q === 'high' ? Math.min(dev, 3) : Math.min(dev, dprCap));
        canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
        cssScale = viewScale();
        camSnap = true; updateCamera(0);
        needRedraw = true;
    }

    function viewScale() {
        const fit = Math.min(viewW / GAME_W, viewH / GAME_H);
        const z = settingOf('zoom', 'auto');
        if (z === 'fit') return fit;
        const phone = Touch.enabled || Math.min(viewW, viewH) < 500;
        if (z === 'auto' && !phone) return fit;
        const visible = z === 'near' ? 460 : 560;   // сколько единиц арены видно по короткой стороне экрана
        return Math.max(fit, Math.min(viewW, viewH) / visible);
    }

    function updateCamera(dt) {
        const visW = viewW / cssScale, visH = viewH / cssScale;
        const f = player || { x: GAME_W / 2, y: GAME_H / 2 };
        const tx = visW >= GAME_W ? (GAME_W - visW) / 2 : clamp(f.x - visW / 2, 0, GAME_W - visW);
        const ty = visH >= GAME_H ? (GAME_H - visH) / 2 : clamp(f.y - visH / 2, 0, GAME_H - visH);
        if (camSnap || !dt) { camX = tx; camY = ty; camSnap = false; }
        else { const k = Math.min(1, dt * 10); camX += (tx - camX) * k; camY += (ty - camY) * k; }
        scale = cssScale * dpr; offsetX = -camX * scale; offsetY = -camY * scale;
        if (mouseSeen && !Touch.enabled) { const gp = screenToGame(mouseX, mouseY); mouseGameX = gp.x; mouseGameY = gp.y; }
    }
    function cameraCrops() { return viewW / cssScale < GAME_W - 1 || viewH / cssScale < GAME_H - 1; }

    // Режим «Auto»: если в бою меньше ~45 кадров/с, снижаем плотность пикселей, потом количество частиц
    function perfSample(rawMs) {
        if (state !== 'playing' || settingOf('quality', 'auto') !== 'auto' || rawMs > 100) return;
        perf.sum += rawMs; perf.frames++;
        if (perf.sum < 2500) return;
        const avg = perf.sum / perf.frames; perf.sum = 0; perf.frames = 0;
        if (avg <= 22) return;
        const dev = window.devicePixelRatio || 1;
        if (dprCap > 1 && dev > 1) { dprCap = dprCap > 1.5 ? 1.5 : 1; resize(); }
        else if (!perf.lowParticles) { perf.lowParticles = true; Particles.setLevel('low'); }
    }

    function screenToGame(sx, sy) { return { x: (sx * dpr - offsetX) / scale, y: (sy * dpr - offsetY) / scale }; }

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
            mouseX = e.clientX; mouseY = e.clientY; mouseSeen = true;
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
        let layer = null, enabled = false, shown = false, dashBtn = null, pauseBtn = null, hudEl = null;
        let aimDir = { x: 1, y: 0 }, dashQueued = false, dashState = '';
        const sticks = {
            move: { id: null, ox: 0, oy: 0, vx: 0, vy: 0, mag: 0, el: null, knob: null },
            aim:  { id: null, ox: 0, oy: 0, vx: 0, vy: 0, mag: 0, el: null, knob: null }
        };
        const api = { lastTouchAt: -1e9, init, setMode, sync, move: sticks.move, aim: sticks.aim, applyAim, takeDash, goFullscreen, get enabled() { return enabled; }, get target() { return sticks.aim.id === null && targetAlive(autoTarget) ? autoTarget : null; } };

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
            pauseBtn = document.getElementById('btnTouchPause'); hudEl = document.getElementById('hud');
            pauseBtn.addEventListener('click', (e) => { e.stopPropagation(); menuKey(); });
            // рывок: срабатывает сразу при касании, без задержки click
            dashBtn = document.getElementById('btnTouchDash');
            dashBtn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); dashQueued = true; dashBtn.classList.add('pressed'); }, { passive: false });
            dashBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); dashBtn.classList.remove('pressed'); }, { passive: false });
            dashBtn.addEventListener('click', (e) => { e.stopPropagation(); dashQueued = true; });
            // на телефоне при старте игры разворачиваем страницу на весь экран (нужно действие пользователя)
            for (const id of ['btnPlay', 'btnRestart', 'btnCreateRoom', 'btnJoinRoom', 'btnLobbyStart', 'btnResume']) {
                const b = document.getElementById(id); if (b) b.addEventListener('click', goFullscreen);
            }
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
            resize(); // на телефоне другой масштаб камеры
        }

        function goFullscreen() {
            if (!enabled || !settingOf('fullscreen', true)) return;
            const el = document.documentElement;
            if (document.fullscreenElement || document.webkitFullscreenElement) return;
            const req = el.requestFullscreen || el.webkitRequestFullscreen;
            if (!req) return; // iPhone: Safari не умеет, страница остаётся как есть
            try {
                const pr = req.call(el, { navigationUI: 'hide' });
                const lock = () => { try { const o = screen.orientation; if (o && o.lock) o.lock('landscape').catch(() => {}); } catch (e) {} };
                if (pr && pr.then) pr.then(lock).catch(() => {}); else lock();
            } catch (e) {}
        }

        // нажатие DASH действует один кадр: если рывок на перезарядке, оно просто пропадает
        function takeDash() { const d = dashQueued; dashQueued = false; return d; }

        // показываем джойстики только в бою, чтобы они не перекрывали меню
        function sync() {
            if (!layer) return;
            const hudOn = !hudEl.classList.contains('hidden');
            const want = enabled && hudOn && (state === 'playing' || state === 'roundStart');
            if (want !== shown) {
                shown = want;
                layer.classList.toggle('hidden', !want);
                if (!want) releaseAll();
            }
            const label = tr(mp ? 'MENU' : 'PAUSE');
            if (pauseBtn.textContent !== label) pauseBtn.textContent = label;
            if (!shown || !player) return;
            const ds = (player.dashTimer > 0 || player.dashCharges <= 0) ? 'cooldown' : 'ready';
            if (ds !== dashState) { dashState = ds; dashBtn.classList.toggle('cooldown', ds === 'cooldown'); }
        }

        function stickFor(id) { return sticks.move.id === id ? sticks.move : (sticks.aim.id === id ? sticks.aim : null); }

        function onStart(e) {
            if (onButton(e)) return; // кнопка паузы
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

        // касания кнопок (PAUSE) не трогаем, иначе браузер не пришлёт по ним click
        const onButton = (e) => !!(e.target && e.target.closest && e.target.closest('button'));

        function onMove(e) {
            if (onButton(e)) return;
            e.preventDefault();
            for (const t of e.changedTouches) { const st = stickFor(t.identifier); if (st) update(st, t.clientX, t.clientY); }
        }

        function onEnd(e) {
            if (onButton(e)) return;
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

        // Куда стрелять:
        //  - правый джойстик зажат: строго туда, куда он показывает;
        //  - иначе автонаводка: ближайший враг (в PvP - соперник) в радиусе AUTO_RANGE, цель держится, пока жива и в зоне;
        //  - целей нет: по направлению движения левого стика, а если стоим - в последнем направлении.
        const AUTO_RANGE = 620, AUTO_KEEP = 700;
        let autoTarget = null;
        // цель жива и всё ещё в игре (враг мог исчезнуть из списка при новом забеге, игрок - выйти)
        function targetAlive(t) {
            if (!t) return false;
            if (t.uid) return !!(mp && mp.remotes[t.uid] === t && t.alive && t.online);
            return !t.dead && enemies.includes(t);
        }
        function findTarget(p) {
            let best = null, bd = AUTO_RANGE;
            if (mp && mp.mode === 'pvp') {
                for (const rm of mpActiveRemotes()) { const d = dist(p.x, p.y, rm.x, rm.y); if (d < bd) { bd = d; best = rm; } }
                return best;
            }
            for (const e of enemies) {
                if (e.dead) continue;
                // боссу и тем, кто близко, приоритет: «расстояние» уменьшаем
                const d = dist(p.x, p.y, e.x, e.y) * (e.isBoss ? 0.75 : 1);
                if (d < bd) { bd = d; best = e; }
            }
            return best;
        }
        function applyAim(p) {
            if (!enabled || !p) return;
            if (sticks.aim.id !== null) { autoTarget = null; mouseGameX = p.x + aimDir.x * 150; mouseGameY = p.y + aimDir.y * 150; return; }
            // текущую цель не меняем на соседнюю каждый кадр, иначе прицел дёргается между двумя врагами
            if (!targetAlive(autoTarget) || dist(p.x, p.y, autoTarget.x, autoTarget.y) > AUTO_KEEP) autoTarget = null;
            const fresh = findTarget(p);
            if (fresh && (!autoTarget || dist(p.x, p.y, fresh.x, fresh.y) < dist(p.x, p.y, autoTarget.x, autoTarget.y) * 0.7)) autoTarget = fresh;
            if (autoTarget) {
                const l = dist(p.x, p.y, autoTarget.x, autoTarget.y) || 1;
                aimDir = { x: (autoTarget.x - p.x) / l, y: (autoTarget.y - p.y) / l };
                mouseGameX = autoTarget.x; mouseGameY = autoTarget.y;
                return;
            }
            if (sticks.move.mag > 0.2) { const l = Math.sqrt(sticks.move.vx * sticks.move.vx + sticks.move.vy * sticks.move.vy) || 1; aimDir = { x: sticks.move.vx / l, y: sticks.move.vy / l }; }
            mouseGameX = p.x + aimDir.x * 150; mouseGameY = p.y + aimDir.y * 150;
        }
        return api;
    })();

    function loop(time) {
        const rawMs = time - lastTime;
        const dt = Math.min(Math.max(rawMs / 1000, 0), 0.05);
        lastTime = time;
        perfSample(rawMs);
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
        // в меню, на паузе и на экране улучшений картинка не меняется: не перерисовываем зря (экономит батарею)
        const live = !!mp || state === 'playing' || state === 'roundStart';
        if (live || needRedraw || state !== lastDrawnState) {
            if (player !== camFor) { camFor = player; camSnap = true; }
            updateCamera(dt);
            render();
            needRedraw = false; lastDrawnState = state;
        }
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

            const touchDash = Touch.takeDash();
            if ((keys['Space'] || touchDash) && p.dashTimer <= 0 && p.dashCharges > 0) performDash();
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
            DmgNumbers.spawn(p.x, p.y - 24, tr('LEVEL UP'), true);
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

        let totalCount = p.projCount + (p.infiniteMag ? (p.infiniteMagStacks || 0) : 0);
        let ox = 0, oy = 0;
        if (p.alternatingShots) { p.alternatingSide = (p.alternatingSide || 1) * -1; const perp = fireAngle + Math.PI / 2; ox = Math.cos(perp) * 12 * p.alternatingSide; oy = Math.sin(perp) * 12 * p.alternatingSide; }
        // страховка: одна NaN-величина делает все выстрелы невидимыми — лучше выстрелить прямо
        if (!Number.isFinite(fireAngle)) { fireAngle = Number.isFinite(aimAngle) ? aimAngle : 0; if (!Number.isFinite(p.spiralAngle)) p.spiralAngle = 0; }
        if (!Number.isFinite(ox) || !Number.isFinite(oy)) { ox = 0; oy = 0; p.alternatingSide = 1; }
        if (!Number.isFinite(totalCount) || totalCount < 1) totalCount = 1;

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
        proj.split = p.projSplit; proj.isSplit = false; proj.isReflected = false; proj.isPhantom = false; proj.beam = false;
        // Beam Emitter: выстрел превращается в быстрый лазер, который прошивает всех врагов на пути без потери урона
        if (p.beamWeapon) {
            proj.beam = true; proj.pierce += 999; proj.vx *= 2.2; proj.vy *= 2.2; proj.life = 0.45;
            proj.damage *= (p.beamMult || 0.7); if (!crit) proj.color = '#7ff8ff';
        }
        if (mp) mpRecordShot(proj);
    }


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
            const sx = proj.x, sy = proj.y;
            proj.x += proj.vx * dt; proj.y += proj.vy * dt; proj.life -= dt;
            if (proj.x < -20 || proj.x > GAME_W + 20 || proj.y < -20 || proj.y > GAME_H + 20) return true;

            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i]; if (e.dead || proj.hit.has(e)) continue;
                // попадание проверяем по всему отрезку полёта за кадр: быстрые снаряды и лазер не пролетают сквозь врагов
                if (segDist(e.x, e.y, sx, sy, proj.x, proj.y) < proj.size + e.size) {
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
                    if (proj.pierce > 0) { proj.pierce--; if (!proj.beam) proj.damage *= 0.8; continue; }
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
            if (proj.wait > 0) { proj.wait -= dt; return false; } // выстрел врага ещё «не случился» в показываемом прошлом
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

    function updateOrbitals(dt) {} function updateDrones(dt) {} function updateBeams(dt) {
        for (let i = beams.length - 1; i >= 0; i--) { beams[i].life -= dt; if (beams[i].life <= 0) beams.splice(i, 1); }
        if (beams.length > 200) beams.splice(0, beams.length - 200);
    } function updateBlackHoles(dt) {}
    
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
        document.getElementById('evolutionTreeScreen').classList.remove('active');
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
        if (upgradeSelectionPending || state !== 'upgrading' || idx < 0 || idx >= currentUpgradeOptions.length) return;
        upgradeSelectionPending = true; const up = currentUpgradeOptions[idx];
        UpgradeSystem.apply(up, player); acquiredUpgrades.push(up);
        if (mp) { mp.build.push('u:' + up.id); mp.buildDirty = true; }
        const online = !!mp;
        Audio.play('upgrade'); setTimeout(() => {
            document.getElementById('upgradeScreen').classList.remove('active');
            if (!online) { advanceRound(); return; }
            if (!mp || (state !== 'upgrading' && state !== 'evolutionTree')) return;
            // В сетевой игре ждём остальных: следующий раунд запускает хост
            mp.readyRound = round; mp.forceSend = true;
            if (state === 'upgrading') mpShowWait(); // при открытом дереве ожидание покажет его закрытие
        }, 400);
    }

    // ============================================================
    // EVOLUTION TREE UI
    // ============================================================
    function openEvolutionTree() {
        if (state === 'evolutionTree' || (state === 'upgrading' && upgradeSelectionPending)) return;
        const prev = state; state = 'evolutionTree';
        const screen = document.getElementById('evolutionTreeScreen');
        // экран улучшений прячем, пока открыто дерево: раньше можно было выбрать карту «сквозь» дерево,
        // раунд начинался, а «Confirm & Close» возвращал игру в состояние выбора, и всё замирало
        const upScreen = document.getElementById('upgradeScreen');
        screen._hadUpgrade = upScreen.classList.contains('active'); upScreen.classList.remove('active');
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
        const screen = document.getElementById('evolutionTreeScreen');
        screen.classList.remove('active');
        if (state !== 'evolutionTree') return; // раунд уже начался без дерева - состояние не трогаем
        state = screen._prevState || 'playing';
        if (state === 'upgrading' && screen._hadUpgrade) {
            if (mp && mp.readyRound >= round) mpShowWait(); // в сети улучшение уже выбрано - ждём остальных
            else document.getElementById('upgradeScreen').classList.add('active');
        }
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
                if (!player.evolutionBranch && nd.tier === 1 && !confirm(tr(`Commit to ${nd.branchName}? Other branches will lock.`))) return;
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

    // ---------- ПЛАВНОСТЬ ДВИЖЕНИЯ ПО СЕТИ ----------
    // Отправитель ставит на пакет метку своих часов (ts / wt). Снимки хранятся в буфере по времени отправителя,
    // поэтому расстояние между ними всегда честное (250 мс), как бы неровно ни приходили пакеты.
    // Показываем их по своим «часам воспроизведения» с задержкой чуть больше интервала отправки:
    // эти часы идут только вперёд и подстраиваются под сеть плавно (скорость 0.9-1.1), без скачков назад.
    function netStamp(o, ts, now) {
        if (typeof ts !== 'number') { o.off = 0; return now; } // старый клиент без меток: время прихода
        if (o.lastTs === ts) return ts;
        if (o.lastTs !== undefined && ts < o.lastTs - 3000) { o.off = undefined; o.buf = null; o.pt = undefined; } // у отправителя перезапустились часы
        o.lastTs = ts;
        const off = now - ts; // задержка сети + разница часов; минимум = самый быстрый пакет
        if (o.off === undefined || off < o.off) o.off = off; else o.off += (off - o.off) * 0.01;
        const lag = now - (ts + o.off);
        o.jit = o.jit === undefined ? lag : o.jit * 0.9 + lag * 0.1;
        return ts;
    }
    function netPlay(o, now) {
        if (o.ptNow === now && o.pt !== undefined) return o.pt;
        const target = now - (o.off || 0) - netDelay(o);
        if (o.pt === undefined || Math.abs(target - o.pt) > 600) o.pt = target;
        else {
            const adv = Math.max(0, now - o.ptNow);
            o.pt += adv + clamp(target - (o.pt + adv), -0.1 * adv, 0.1 * adv);
        }
        o.ptNow = now;
        return o.pt;
    }
    function netDelay(o) { return clamp(NET_SEND_INTERVAL * 1000 + 50 + 2 * (o.jit || 0), 280, 650); }
    function snapPush(o, t, x, y, vx, vy) {
        const b = o.buf || (o.buf = []);
        const last = b[b.length - 1];
        if (last) {
            if (t <= last.t) return;
            if (Math.abs(x - last.x) + Math.abs(y - last.y) > 400) b.length = 0; // телепорт (возрождение): без «полёта» через карту
            else if (t - last.t > NET_SEND_INTERVAL * 1600) b.push({ t: t - NET_SEND_INTERVAL * 1000, x: last.x, y: last.y, vx: 0, vy: 0 }); // стоял, потом поехал
        }
        b.push({ t, x, y, vx, vy });
        if (b.length > 12) b.splice(0, b.length - 12);
    }
    function snapSample(o, rt) {
        const b = o.buf;
        if (!b || !b.length) return null;
        if (rt <= b[0].t) return b[0];
        for (let i = b.length - 1; i >= 0; i--) {
            const a = b[i];
            if (a.t > rt) continue;
            const c = b[i + 1];
            if (c) { const f = (rt - a.t) / ((c.t - a.t) || 1); return { x: a.x + (c.x - a.x) * f, y: a.y + (c.y - a.y) * f }; }
            // новее снимков нет: недолго продолжаем движение (скорость из пакета или по двум последним снимкам)
            let vx = a.vx, vy = a.vy;
            const q = b[i - 1];
            if (vx === undefined) { vx = q ? (a.x - q.x) / ((a.t - q.t) || 1) * 1000 : 0; vy = q ? (a.y - q.y) / ((a.t - q.t) || 1) * 1000 : 0; }
            const ex = Math.min(rt - a.t, 150) / 1000;
            return { x: a.x + vx * ex, y: a.y + vy * ex };
        }
        return b[0];
    }
    // через сколько секунд показать выстрел, чтобы он вылетал из корабля, который мы видим с задержкой
    function netShotWait(o, st, now) { return clamp((st - NET_SEND_INTERVAL * 500 - netPlay(o, now)) / 1000, 0, 0.6); }
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
            lastSent: {}, lastWorldSent: {}, eiSent: new Set(),
            menuOpen: false, over: false, hudTimer: 0, boss: '', finalRes: ''
        };
        player = createPlayer(); enemies = []; projPool.releaseAll(); eProjPool.releaseAll(); rprojs = []; beams = [];
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
        if (mp.isHost && mp.mode === 'coop') mpRestoreEnemies(w.en || '', w.ei || {});
        mp.phase = w.ph === 'start' ? 'playing' : (w.ph || 'playing');
        if (w.ph === 'over') { mpShowOver(w); return; }
        if (w.ph === 'upgrading') {
            state = 'upgrading';
            if (mp.readyRound >= round) mpShowWait(); else showUpgradeScreen();
        } else state = 'playing';
        mp.buildDirty = true; mp.forceSend = true;
    }

    function mpRestoreEnemies(str, ei) {
        enemies = [];
        mp.eiSent = new Set(Object.keys(ei).map(k => parseInt(k, 36)));
        for (const d of mpDecodeEnemies(str, ei)) {
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
        enemies = []; pickups = []; beams = []; projPool.releaseAll(); eProjPool.releaseAll(); Particles.clear(); DmgNumbers.clear();
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
    // Снимок врагов делится на две части:
    //   en — то, что меняется каждый тик: id, x, y, hp, флаги (числа в base36, ~14 символов на врага)
    //   ei/{id} — неизменное: размер, max hp, цвет, урон, тип. Пишется один раз при появлении врага и
    //   удаляется после его смерти, поэтому по сети почти не ходит.
    const b36 = (n) => Math.max(0, Math.round(n)).toString(36);
    function mpEncodeEnemies(eiOut) {
        const out = [], alive = new Set();
        for (const e of enemies) {
            if (e.dead) continue;
            if (!e.netId) e.netId = mp.nextEnemyId++;
            alive.add(e.netId);
            if (out.length >= 150) continue;
            const flags = (e.isBoss ? 1 : 0) | (e.isElite ? 2 : 0) | (e.rangedOnly ? 4 : 0) | ((e.telegraph || 0) > 0 ? 8 : 0);
            out.push(b36(e.netId) + ',' + b36(e.x) + ',' + b36(e.y) + ',' + b36(Math.max(1, Math.ceil(e.hp))) + ',' + flags.toString(36));
            if (!mp.eiSent.has(e.netId)) {
                eiOut['ei/' + b36(e.netId)] = [Math.round(e.size), Math.ceil(e.maxHp), hexOf(e.color), e.contactDmg || 10, e.isBoss ? 'boss' : (e.typeKey || 'glitcher')].join(',');
                mp.eiSent.add(e.netId);
            }
        }
        for (const id of mp.eiSent) if (!alive.has(id)) { eiOut['ei/' + b36(id)] = null; mp.eiSent.delete(id); }
        return out.join(';');
    }

    function mpDecodeEnemies(str, ei) {
        const list = [];
        if (!str || !ei) return list;
        for (const part of String(str).split(';')) {
            const f = part.split(',');
            if (f.length < 5) continue;
            const st = ei[f[0]];
            if (!st) continue;
            const g = String(st).split(',');
            list.push({ id: parseInt(f[0], 36), x: parseInt(f[1], 36), y: parseInt(f[2], 36), hp: parseInt(f[3], 36), flags: parseInt(f[4], 36),
                size: +g[0] || 12, maxHp: +g[1] || 1, color: '#' + (g[2] || 'ff4466'), cd: +g[3] || 10, type: g[4] || 'glitcher' });
        }
        return list;
    }

    // Гость: враги — «тени» с позициями от хоста, плавно подтягиваем их к последним координатам
    function mpSyncProxies(str, ei, lt) {
        const seen = new Set(); const now = performance.now();
        for (const d of mpDecodeEnemies(str, ei)) {
            seen.add(d.id);
            let e = mp.proxies.get(d.id);
            if (!e) { e = { proxy: true, netId: d.id, x: d.x, y: d.y, tx: d.x, ty: d.y, dead: false, flashTimer: 0, armor: 0, hp: d.hp }; mp.proxies.set(d.id, e); }
            if (lt !== null && lt !== undefined) snapPush(e, lt, d.x, d.y);
            e.tx = d.x; e.ty = d.y; e.size = d.size; e.maxHp = d.maxHp; e.color = d.color; e.contactDmg = d.cd;
            e.isBoss = !!(d.flags & 1); e.isElite = !!(d.flags & 2); e.rangedOnly = !!(d.flags & 4); e.telegraph = (d.flags & 8) ? 1 : 0;
            if (e.dead) { if (now - e.deadAt > 1200) { e.dead = false; e.hp = d.hp; } }
            else e.hp = Math.min(e.hp, d.hp);
        }
        for (const [id] of mp.proxies) if (!seen.has(id)) mp.proxies.delete(id);
        enemies = Array.from(mp.proxies.values());
    }

    function mpUpdateProxies(dt) {
        const now = performance.now(), rt = netPlay(mp.hostClk || (mp.hostClk = {}), now);
        for (const e of enemies) {
            const pos = snapSample(e, rt);
            if (pos) { e.x = pos.x; e.y = pos.y; } else { e.x = e.tx; e.y = e.ty; }
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
            Math.round(proj.size * 10), Math.round(proj.damage), proj.crit ? 1 : (proj.isPhantom ? 2 : (proj.beam ? 3 : 0)), Math.round(proj.life * 10)].join(','));
    }

    function mpSpawnRemoteShots(owner, str, wait) {
        const rm = mp.remotes[owner];
        for (const part of String(str).split(';')) {
            const f = part.split(',').map(Number);
            if (f.length < 8) continue;
            rprojs.push({ x: f[0], y: f[1], vx: f[2], vy: f[3], size: Math.max(2, f[4] / 10), dmg: f[5],
                color: f[6] === 1 ? '#ffd700' : f[6] === 2 ? '#cc44ff' : (rm ? rm.color : '#ff3df2'), life: f[7] / 10, owner, beam: f[6] === 3, wait: wait || 0 });
        }
        if (rprojs.length > 400) rprojs.splice(0, rprojs.length - 400);
    }

    function mpUpdateRemoteProjectiles(dt) {
        for (let i = rprojs.length - 1; i >= 0; i--) {
            const q = rprojs[i];
            if (q.wait > 0) { q.wait -= dt; continue; }
            const sx = q.x, sy = q.y;
            q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
            let remove = q.life <= 0 || q.x < -20 || q.x > GAME_W + 20 || q.y < -20 || q.y > GAME_H + 20;
            if (!remove && mp.mode === 'pvp' && !mp.dead && player && segDist(player.x, player.y, sx, sy, q.x, q.y) < q.size + player.size) {
                damagePlayer(q.dmg, q.owner);
                Particles.emit(q.x, q.y, 5, q.color, { speed: 50, life: 0.2 });
                remove = true;
            }
            if (!remove && mp.mode === 'coop' && !q.beam) { // чужой лазер, как и свой, пролетает врагов насквозь
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

    function mpSpawnEnemyShots(str, wait) {
        for (const part of String(str).split(';')) {
            const f = part.split(',');
            if (f.length < 7) continue;
            const p = eProjPool.get();
            p.x = +f[0]; p.y = +f[1]; p.vx = +f[2]; p.vy = +f[3]; p.damage = +f[4]; p.color = '#' + f[5]; p.life = (+f[6]) / 10; p.size = 4; p.source = null; p.wait = wait || 0;
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
                if (s.sh) {
                    rm.color = SLOT_COLORS[(info.slot !== undefined ? +info.slot : 0) % 4];
                    const now = performance.now();
                    mpSpawnRemoteShots(uid, s.sh, netShotWait(rm, netStamp(rm, s.ts, now), now));
                }
            }
            {
                const nx = s.x || 0, ny = s.y || 0, nvx = s.vx || 0, nvy = s.vy || 0, now = performance.now();
                // отдельная метка для позиции: netStamp мог уже обработать этот пакет из-за выстрелов
                const fresh = typeof s.ts === 'number' ? s.ts !== rm.posTs : (nx !== rm.tx || ny !== rm.ty || !rm.buf);
                rm.posTs = s.ts;
                if (fresh) snapPush(rm, netStamp(rm, s.ts, now), nx, ny, nvx, nvy);
                rm.tx = nx; rm.ty = ny; rm.vx = nvx; rm.vy = nvy; rm.a = s.a || 0;
            }
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
            DmgNumbers.spawn(player.x, player.y - 30, tr('+KILL'), true); Audio.play('kill');
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
        const wnow = performance.now(), hc = mp.hostClk || (mp.hostClk = {});
        const freshWorld = typeof w.wt === 'number' ? w.wt !== hc.lastTs : true;
        const wlt = netStamp(hc, w.wt, wnow);
        if (w.eps && w.eps !== mp.lastEps) { if (w.ep) mpSpawnEnemyShots(w.ep, netShotWait(hc, wlt, wnow)); mp.lastEps = w.eps; }
        if (mp.mode === 'coop') mpSyncProxies(w.en || '', w.ei || {}, freshWorld ? wlt : null);
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
            vx: mp.dead ? 0 : Math.round(p.vx), vy: mp.dead ? 0 : Math.round(p.vy),
            hp: Math.max(0, Math.ceil(p.hp)), mhp: Math.ceil(p.maxHp), lv: p.level, al: !mp.dead, rd: mp.readyRound, r: round,
            sz: Math.round(p.size), c: p.evolutionBranch ? UpgradeSystem.evolutionBranches[p.evolutionBranch].color : '',
            k: mp.myKills, kb: mp.kb, xp: Math.floor(p.xp), ep: evolutionPoints
        };
        if (mp.shotsOut.length) { s.sh = mp.shotsOut.join(';'); s.ss = netSeq(); mp.shotsOut = []; }
        if (mp.buildDirty) { s.b = mp.build.join('|'); mp.buildDirty = false; }
        const sd = mpDelta(s, mp.lastSent);
        if (sd) { sd.ts = Math.round(performance.now()); mp.net.sendState(sd); }
        if (mp.isHost) {
            const w = { mid: mp.matchId, r: round, ph: mp.phase, t: Math.round(roundTimer * 100) / 100, xp: mp.teamXp, epb: mp.teamEp, kills,
                boss: bossActive && !bossActive.dead ? `${bossActive.name}|${Math.max(0, Math.ceil(bossActive.hp))}|${Math.ceil(bossActive.maxHp)}` : '' };
            if (mp.mode === 'coop') { const ei = {}; w.en = mpEncodeEnemies(ei); Object.assign(w, ei); }
            if (mp.epOut.length) { w.ep = mp.epOut.join(';'); w.eps = netSeq(); mp.epOut = []; }
            if (mp.deathsOut.length) { w.dx = mp.deathsOut.join(';'); w.dxs = netSeq(); mp.deathsOut = []; }
            if (mp.phase === 'over') w.res = mp.finalRes;
            const wd = mpDelta(w, mp.lastWorldSent);
            if (wd) { wd.wt = Math.round(performance.now()); mp.net.sendWorld(wd); }
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

    // Отправляем только поля, которые изменились с прошлой отправки (update в базе их сливает).
    // Стоящий на месте игрок почти ничего не шлёт, а пакеты в среднем в 2-3 раза меньше.
    function mpDelta(obj, last) {
        let out = null;
        for (const k in obj) {
            const v = obj[k];
            if (k.indexOf('ei/') === 0) { (out || (out = {}))[k] = v; continue; }
            const key = (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
            if (last[k] === key) continue;
            last[k] = key; (out || (out = {}))[k] = v;
        }
        return out;
    }

    // ---------- КАДР ----------
    function mpFrame(dt) {
        const k = Math.min(1, dt * 15), now = performance.now();
        for (const uid in mp.remotes) {
            const rm = mp.remotes[uid];
            const pos = snapSample(rm, netPlay(rm, now));
            if (pos) { rm.x = clamp(pos.x, 0, GAME_W); rm.y = clamp(pos.y, 0, GAME_H); }
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

    // лазерные выстрелы (свои и чужие): светящийся хвост вдоль направления полёта
    function drawBeamShots() {
        let any = false;
        for (const p of projPool.active) if (p.beam) { any = true; break; }
        if (!any && !rprojs.some(q => q.beam)) return;
        ctx.lineCap = 'round';
        const seg = (x, y, vx, vy, w, color) => {
            const tx = x - vx * 0.045, ty = y - vy * 0.045;
            ctx.strokeStyle = color; ctx.globalAlpha = 0.3; ctx.lineWidth = w * 3;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
            ctx.globalAlpha = 1; ctx.lineWidth = w; ctx.strokeStyle = '#e8feff';
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        };
        for (const p of projPool.active) if (p.beam) seg(p.x, p.y, p.vx, p.vy, Math.max(2, p.size), p.color);
        for (const q of rprojs) if (q.beam && !(q.wait > 0)) seg(q.x, q.y, q.vx, q.vy, Math.max(2, q.size), q.color);
        ctx.globalAlpha = 1;
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
        for (const q of rprojs) { if (q.beam || q.wait > 0) continue; ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2); ctx.fill(); }
    }

    function drawDeadOverlay() {
        ctx.save();
        const cx = viewW / 2, cy = viewH / 2, big = Math.min(46, viewW / 11), small = Math.min(18, viewW / 32);
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, viewW, viewH);
        ctx.textAlign = 'center'; ctx.fillStyle = '#ff1744'; ctx.font = `900 ${big}px 'Orbitron', sans-serif`;
        ctx.fillText(tr('ВЫ ПОГИБЛИ'), cx, cy - 10);
        ctx.fillStyle = '#e0e0e0'; ctx.font = `${small}px 'Share Tech Mono', monospace`;
        ctx.fillText(tr(mp.mode === 'pvp' ? `Возрождение через ${Math.max(0, mp.respawnTimer).toFixed(1)} с` : 'Вы вернётесь в следующем раунде, если команда выживет'), cx, cy + small + 12);
        ctx.restore();
    }

    // ============================================================
    // RENDER
    // ============================================================
    function render() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save(); ctx.translate(offsetX, offsetY); ctx.scale(scale, scale); Shake.apply(ctx);

        ctx.fillStyle = '#08080e'; ctx.fillRect(0, 0, GAME_W, GAME_H);
        // сетка одним путём: десятки отдельных stroke() заметно тормозят на телефонах
        const now = performance.now(), gs = now / 200 % 40;
        ctx.strokeStyle = 'rgba(0,240,255,0.04)'; ctx.lineWidth = 1; ctx.beginPath();
        for (let x = -gs; x < GAME_W + 40; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); }
        for (let y = -gs; y < GAME_H + 40; y += 40) { ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); }
        ctx.stroke();
        if (cameraCrops()) { ctx.strokeStyle = 'rgba(0,240,255,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, GAME_W - 2, GAME_H - 2); }

        // сферы: свечение кругом-ореолом вместо shadowBlur (shadowBlur очень дорогой на мобильных)
        for (const pk of pickups) {
            const pulse = 1 + Math.sin(now / 120 + pk.x) * 0.2, r = pk.size * pulse;
            const a = pk.life < 3 ? clamp(pk.life / 3, 0.2, 1) : 1;
            ctx.fillStyle = pk.type === 'heal' ? '#22ff88' : '#a855f7';
            ctx.globalAlpha = a * 0.25; ctx.beginPath(); ctx.arc(pk.x, pk.y, r * 2.3, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pk.x, pk.y, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        for (const e of enemies) { if (!e.dead) drawEnemy(e); }
        // автонаводка на телефоне: пунктирное кольцо вокруг цели
        const tgt = Touch.enabled && state === 'playing' ? Touch.target : null;
        if (tgt) {
            ctx.save(); ctx.strokeStyle = 'rgba(0,240,255,0.6)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -(performance.now() / 40) % 10;
            ctx.beginPath(); ctx.arc(tgt.x, tgt.y, (tgt.size || PLAYER_SIZE) + 9, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
        for (const p of projPool.active) {
            if (p.beam) continue;
            ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
        drawBeamShots();
        if (beams.length) {
            ctx.lineCap = 'round';
            for (const b of beams) {
                if (b.type !== 'lightning') continue;
                ctx.globalAlpha = clamp(b.life / 0.15, 0, 1); ctx.strokeStyle = b.color; ctx.lineWidth = 2;
                const mx = (b.x + b.tx) / 2 + (b.ty - b.y) * 0.15, my = (b.y + b.ty) / 2 - (b.tx - b.x) * 0.15;
                ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(mx, my); ctx.lineTo(b.tx, b.ty); ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
        for (const p of eProjPool.active) {
            if (p.wait > 0) continue;
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
        ctx.restore();
        // дальше — в координатах экрана (CSS-пиксели)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (cameraCrops() && player && state !== 'gameover') drawOffscreenMarkers();
        if (mp && mp.dead && player && state !== 'gameover') drawDeadOverlay();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

    }

    function drawEnemy(e) {
        ctx.fillStyle = e.color || '#ff4466';
        ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2); ctx.fill();
    }

    // Когда камера показывает не всю арену: точки у края экрана в сторону врагов за его пределами
    function drawOffscreenMarkers() {
        const m = 7, s = cssScale; let n = 0;
        for (const e of enemies) {
            if (e.dead) continue;
            const sx = e.x * s - camX * s, sy = e.y * s - camY * s;
            if (sx >= -e.size * s && sx <= viewW + e.size * s && sy >= -e.size * s && sy <= viewH + e.size * s) continue;
            ctx.globalAlpha = 0.75; ctx.fillStyle = e.isBoss ? '#ffd700' : (e.color || '#ff4466');
            ctx.beginPath(); ctx.arc(clamp(sx, m, viewW - m), clamp(sy, m, viewH - m), e.isBoss ? 7 : 4, 0, Math.PI * 2); ctx.fill();
            if (++n >= 40) break;
        }
        ctx.globalAlpha = 1;
    }

    const hudEls = {}, hudVals = {};
    function hudSet(id, prop, v) {
        const key = id + '.' + prop;
        if (hudVals[key] === v) return;
        hudVals[key] = v;
        const el = hudEls[id] || (hudEls[id] = document.getElementById(id));
        if (prop === 'text') el.textContent = v; else el.style[prop] = v;
    }
    const pct = (a, b) => clamp(a / (b || 1) * 100, 0, 100).toFixed(1) + '%';
    function updateHUD() {
        if (!player) return;
        hudSet('hudRound', 'text', String(round));
        hudSet('hudTimer', 'text', roundTimer.toFixed(Touch.enabled ? 1 : 2));
        hudSet('hudKills', 'text', String(kills));
        hudSet('hudHealthFill', 'width', pct(player.hp, player.maxHp));
        hudSet('hudHealthText', 'text', `${Math.ceil(player.hp)}/${player.maxHp}`);
        hudSet('hudEP', 'text', Touch.enabled ? `EP: ${evolutionPoints}` : `EP: ${evolutionPoints}  [T] TREE`);
        hudSet('hudXpFill', 'width', pct(player.xp, player.xpToNext));
        hudSet('hudXpText', 'text', `LV ${player.level}  ${Math.floor(player.xp)}/${player.xpToNext} XP`);
        if (player.maxShield > 0) {
            hudSet('hudShieldBar', 'display', 'block');
            hudSet('hudShieldFill', 'width', pct(player.shield, player.maxShield));
        } else hudSet('hudShieldBar', 'display', 'none');
        if (bossActive && !bossActive.dead) document.getElementById('hudBossFill').style.width = pct(bossActive.hp, bossActive.maxHp);
        hudSet('hudDash', 'text', player.dashTimer > 0 ? `DASH ${player.dashTimer.toFixed(1)}s` : 'DASH READY');
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
        document.getElementById('selZoom').value = s.zoom;
        document.getElementById('selQuality').value = s.quality;
        document.getElementById('chkFullscreen').checked = !!s.fullscreen;
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
        document.getElementById('selParticles').addEventListener('change', (e) => { s().particles = e.target.value; perf.lowParticles = false; onChange(); });
        document.getElementById('selZoom').addEventListener('change', (e) => { s().zoom = e.target.value; onChange(); resize(); });
        document.getElementById('selQuality').addEventListener('change', (e) => { s().quality = e.target.value; dprCap = 2; perf.sum = perf.frames = 0; onChange(); resize(); });
        document.getElementById('chkFullscreen').addEventListener('change', (e) => { s().fullscreen = e.target.checked; onChange(); });
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
        hideAllScreens(); player = createPlayer(); enemies = []; beams = []; projPool.releaseAll(); eProjPool.releaseAll();
        pickups = []; acquiredUpgrades = []; evolutionPoints = 0; currentUpgradeOptions = [];
        round = 1; roundDuration = DEFAULT_ROUND_DURATION; roundTimer = roundDuration;
        kills = 0; runTime = 0; bossActive = null; upgradeSelectionPending = false; state = 'playing';

        document.getElementById('hud').classList.remove('hidden'); startRound();
    }

    function init() {
        applySettings(); resize(); window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', () => setTimeout(resize, 250));
        document.addEventListener('fullscreenchange', () => setTimeout(resize, 100));
        initInput(); initSettings();
        
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