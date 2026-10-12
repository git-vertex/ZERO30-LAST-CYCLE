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
            if (e.code === 'Escape') {
                if (settingsReturnTo) closeSettings();
                else if (state === 'playing') pauseGame(); else if (state === 'paused') resumeGame(); else if (state === 'evolutionTree') closeEvolutionTree();
            }
            if (e.code === 'KeyT' && state === 'playing') openEvolutionTree();
            if (state === 'upgrading' && !upgradeSelectionPending) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 6) selectUpgradeByIndex(num - 1);
            }
        });
        window.addEventListener('keyup', (e) => { keys[e.code] = false; });
        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            const gp = screenToGame(mouseX, mouseY);
            mouseGameX = gp.x; mouseGameY = gp.y;
        });
    }

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
            }
        }
        render();
        requestAnimationFrame(loop);
    }

    function update(dt) {
        const p = player;
        if (!p) return;
        runTime += dt;
        roundTimer = Math.max(0, roundTimer - dt);
        if (roundTimer === 0) { endRound(); return; }

        let mx = 0, my = 0;
        if (keys['KeyW'] || keys['ArrowUp']) my -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) my += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
        if (mx !== 0 || my !== 0) { const len = Math.sqrt(mx * mx + my * my); mx /= len; my /= len; }
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

        updateOrbitals(dt); updateDrones(dt); updateBeams(dt);
        updateProjectiles(dt); updateEnemyProjectiles(dt);
        EnemySpawner.update(dt, round, bossActive);
        updateEnemies(dt); updatePickups(dt); updateHazards(dt); updateBlackHoles(dt);

        Particles.update(dt); DmgNumbers.update(dt); Shake.update(dt);

        applyLevelUps();
        updateHUD();
    }

    function applyLevelUps() {
        const p = player; if (!p) return;
        while (p.xp >= p.xpToNext) {
            p.xp -= p.xpToNext; p.level++; p.xpToNext = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_SCALE, p.level - 1));
            p.maxHp += 5; p.hp = Math.min(p.maxHp, p.hp + 5); p.damage += 1;
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
        if (e.armor) dmg = Math.max(1, dmg - e.armor);
        e.hp -= dmg; e.flashTimer = 0.1; totalDamageDealt += dmg;
        DmgNumbers.spawn(e.x, e.y, dmg, crit); Audio.play('hit');
        if (e.hp <= 0 && !e.dead) killEnemy(e);
    }

    function killEnemy(e) {
        e.dead = true; kills++; totalKills++;
        pickups.push({ x: e.x, y: e.y, type: 'xp', value: (e.xpValue || 3) * player.xpMult, life: 15, size: 4, vy: 0 });
        if (Math.random() < 0.08) pickups.push({ x: e.x, y: e.y, type: 'heal', value: 10 * player.healMult, life: 12, size: 5, vy: 0 });
        if (player.killHeal > 0) player.hp = Math.min(player.maxHp, player.hp + player.killHeal);
        if (e.isElite) { evolutionPoints += 1; DmgNumbers.spawn(e.x, e.y - 20, '+1 EP', false); }
        if (e.isBoss) { evolutionPoints += 3; DmgNumbers.spawn(e.x, e.y - 20, '+3 EP', false); }
        Particles.emit(e.x, e.y, 12, e.color || '#ff4466', { speed: 100, life: 0.3 });
        Audio.play('kill'); Shake.add(2);
        if (player.deathBloom) createExplosion(e.x, e.y, 55, player.damage * 0.5);
    }

    function updateEnemyProjectiles(dt) {
        eProjPool.update(dt, (proj, dt) => {
            proj.x += proj.vx * dt; proj.y += proj.vy * dt; proj.life -= dt;
            if (proj.x < -20 || proj.x > GAME_W + 20 || proj.y < -20 || proj.y > GAME_H + 20) return true;
            
            // REAR SHIELD
            if (player && player.rearShieldLevel > 0) {
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

            if (player && dist(proj.x, proj.y, player.x, player.y) < proj.size + player.size) {
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

    function damagePlayer(dmg) {
        const p = player; if (!p || p.invulnTimer > 0) return;
        dmg = Math.max(1, dmg * (1 - p.dmgReduction));
        if (p.shield > 0) { const absorbed = Math.min(p.shield, dmg); p.shield -= absorbed; dmg -= absorbed; }
        if (dmg > 0) { p.hp -= dmg; totalDamageReceived += dmg; }
        p.invulnTimer = INVULN_DURATION; p.flashTimer = 0.2; Shake.add(5); Audio.play('playerHit');
        if (p.hp <= 0 && p.emergencySurvival && !p.emergencyUsed) { p.hp = Math.floor(p.maxHp * 0.15); p.emergencyUsed = true; p.invulnTimer = 2; return; }
        if (p.hp <= 0) playerDeath();
    }

    function playerDeath() {
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
            if (e.behavior) e.behavior(e, dt, 1 * (player.timeDialation || 1));
            e.x = clamp(e.x, e.size, GAME_W - e.size); e.y = clamp(e.y, e.size, GAME_H - e.size);

            if (player && !e.rangedOnly) {
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
                    const e = EnemyTypes.create(choose(types), currentRound);
                    const pos = EnemyTypes.findSafeSpawnPosition(player, e.size, enemies, false);
                    if (pos.success) { e.x = pos.x; e.y = pos.y; enemies.push(e); }
                }
            }
        }
        function spawnBoss(currentRound) {
            const boss = EnemyTypes.createBoss(currentRound);
            const pos = EnemyTypes.findSafeSpawnPosition(player, boss.size, enemies, true);
            if (pos.success) { boss.x = pos.x; boss.y = pos.y; } else { boss.x = GAME_W/2; boss.y = 60; }
            enemies.push(boss); document.getElementById('hudBoss').style.display = 'block'; document.getElementById('hudBossName').textContent = boss.name;
            return boss;
        }
        return { update, spawnBoss, reset: () => { spawnTimer = 0; } };
    })();

    function startRound() {
        state = 'roundStart'; roundStartTimer = 1.5;
        document.getElementById('roundStart').classList.remove('hidden'); document.getElementById('roundStart').classList.add('visible');
        document.getElementById('rsRound').textContent = round; document.getElementById('rsTime').textContent = Math.ceil(roundDuration);
        EnemySpawner.reset();
        if (round > 1 && round % BOSS_INTERVAL === 0) {
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
        Audio.play('upgrade'); setTimeout(() => { document.getElementById('upgradeScreen').classList.remove('active'); advanceRound(); }, 400);
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
                    <div class="evo-points-display">▼ <span id="evoPoints">${evolutionPoints}</span> EP</div>
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
        const branchIcons = { assault: '⚔', bulwark: '⛨', phantom: '☄', swarm: '⎈', void: '✧' };
        
        let linesHTML = ''; const nodesData = [];
        const currentTier = player.evolutionForm === 'core' ? 0 : UpgradeSystem.evolutionBranches[player.evolutionBranch].forms.find(f => f.id === player.evolutionForm).tier;

        nodesData.push({ x: cx, y: cy, tier: 0, form: { name: 'CORE', description: 'Base', cost: 0 }, branchColor: '#888', branchName: 'BASE', status: currentTier === 0 ? 'current' : 'unlocked', icon: '⌖' });

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
                nodesData.push({ x: nx, y: ny, tier: t, form: form, branchId: bId, branchColor: branch.color, branchName: branch.name, status: status, icon: branchIcons[bId] });
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
            el.innerHTML = nd.status === 'locked' ? '?' : nd.icon;
            if (nd.status === 'available') el.addEventListener('click', () => {
                if (!player.evolutionBranch && nd.tier === 1 && !confirm(`Commit to ${nd.branchName}? Other branches will lock.`)) return;
                evolutionPoints -= nd.form.cost; UpgradeSystem.applyEvolutionForm(player, nd.branchId, nd.form.id); renderEvolutionTreeGraph();
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

        if (player && state !== 'gameover') {
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
        document.getElementById('hudEP').textContent = `EP: ${evolutionPoints}  [T] TREE`;
        document.getElementById('hudXpFill').style.width = clamp(player.xp / player.xpToNext * 100, 0, 100) + '%';
        document.getElementById('hudXpText').textContent = `LV ${player.level}  ${Math.floor(player.xp)}/${player.xpToNext} XP`;
        const shieldBar = document.getElementById('hudShieldBar');
        if (player.maxShield > 0) {
            shieldBar.style.display = 'block';
            document.getElementById('hudShieldFill').style.width = clamp(player.shield / player.maxShield * 100, 0, 100) + '%';
        } else shieldBar.style.display = 'none';
        const dashEl = document.getElementById('hudDash');
        dashEl.textContent = player.dashTimer > 0 ? `DASH ${player.dashTimer.toFixed(1)}s` : 'DASH READY';
    }

    function showGameOver() {
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('active');
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
        if (settingsReturnTo === 'pause' && state === 'paused') document.getElementById('pauseMenu').classList.add('active');
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
        document.getElementById('btnGoMenu').addEventListener('click', () => { hideAllScreens(); document.getElementById('mainMenu').classList.add('active'); state = 'menu'; });
        document.getElementById('btnQuit').addEventListener('click', () => { hideAllScreens(); document.getElementById('hud').classList.add('hidden'); document.getElementById('mainMenu').classList.add('active'); state = 'menu'; });
        lastTime = performance.now(); requestAnimationFrame(loop);
    }
    
    init();
    return { getPlayer: () => player, getEnemies: () => enemies, getState: () => state, spawnEnemyProjectile: (x, y, vx, vy, damage, color, life, source) => { const p = eProjPool.get(); p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.damage = damage; p.color = color || '#ff4466'; p.life = life || 3; p.size = 4; p.source = source; return p; }, createExplosion, damageEnemy, GAME_W, GAME_H };
})();