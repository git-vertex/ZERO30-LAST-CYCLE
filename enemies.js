// ZERO//30: LAST CYCLE — Enemy System
'use strict';

const EnemyTypes = (() => {

    function rng(min, max) { return Math.random() * (max - min) + min; }
    function rngInt(min, max) { return Math.floor(rng(min, max + 1)); }
    function angleBetween(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); }
    function dist(x1, y1, x2, y2) { const dx = x1 - x2, dy = y1 - y2; return Math.sqrt(dx * dx + dy * dy); }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    // Minimum spawn distance from player (exclusion zone)
    const SPAWN_EXCLUSION_RADIUS = 300;
    const BOSS_EXCLUSION_RADIUS = 400;
    const MAX_SPAWN_ATTEMPTS = 30;

    const TYPES = {
        glitcher: {
            name: 'Glitcher', faction: 'glitcher',
            hp: 20, speed: 120, size: 8, color: '#ff4466', shape: 'circle',
            contactDmg: 12, xpValue: 3, rangedOnly: false,
            behavior: glitcherBehavior
        },
        glitcher_fast: {
            name: 'Swift Glitcher', faction: 'glitcher',
            hp: 12, speed: 200, size: 6, color: '#ff6688', shape: 'circle',
            contactDmg: 8, xpValue: 4, rangedOnly: false,
            behavior: glitcherBehavior
        },
        sentinel: {
            name: 'Sentinel', faction: 'sentinel',
            hp: 25, speed: 50, size: 10, color: '#ff8844', shape: 'diamond',
            contactDmg: 8, xpValue: 5, rangedOnly: true,
            behavior: sentinelBehavior
        },
        sentinel_burst: {
            name: 'Burst Sentinel', faction: 'sentinel',
            hp: 30, speed: 40, size: 11, color: '#ffaa44', shape: 'diamond',
            contactDmg: 8, xpValue: 7, rangedOnly: true,
            behavior: sentinelBurstBehavior
        },
        warden: {
            name: 'Warden', faction: 'warden',
            hp: 60, speed: 40, size: 14, color: '#8866aa', shape: 'square',
            contactDmg: 18, xpValue: 8, rangedOnly: false, armor: 3,
            behavior: wardenBehavior
        },
        stalker: {
            name: 'Stalker', faction: 'stalker',
            hp: 18, speed: 100, size: 9, color: '#cc44ff', shape: 'triangle',
            contactDmg: 15, xpValue: 6, rangedOnly: false,
            behavior: stalkerBehavior
        },
        null_entity: {
            name: 'Null Entity', faction: 'null',
            hp: 22, speed: 80, size: 10, color: '#44ccff', shape: 'hex',
            contactDmg: 10, xpValue: 5, rangedOnly: false,
            behavior: nullBehavior
        }
    };

    function glitcherBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        const a = angleBetween(e.x, e.y, p.x, p.y);
        e.x += Math.cos(a) * e.speed * speedMult * dt;
        e.y += Math.sin(a) * e.speed * speedMult * dt;
        e.x += Math.sin(performance.now() / 200 + e.x) * 0.3;
    }

    function sentinelBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        const d = dist(e.x, e.y, p.x, p.y);
        const preferredDist = 200;
        if (d > preferredDist + 30) {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x += Math.cos(a) * e.speed * speedMult * dt;
            e.y += Math.sin(a) * e.speed * speedMult * dt;
        } else if (d < preferredDist - 30) {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x -= Math.cos(a) * e.speed * speedMult * dt;
            e.y -= Math.sin(a) * e.speed * speedMult * dt;
        }
        e.fireTimer = (e.fireTimer || 0) + dt;
        if (e.fireTimer >= (e.fireRate || 2)) {
            e.fireTimer = 0;
            e.telegraph = 0.5;
            e.telegraphTimer = 0;
        }
        if (e.telegraph && e.telegraph > 0) {
            e.telegraphTimer = (e.telegraphTimer || 0) + dt;
            if (e.telegraphTimer >= 0.5) {
                e.telegraph = 0;
                const a = angleBetween(e.x, e.y, p.x, p.y);
                const spd = 250;
                Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * spd, Math.sin(a) * spd, e.projDmg || 12, '#ff8844', 3, e);
            }
        }
    }

    function sentinelBurstBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        const d = dist(e.x, e.y, p.x, p.y);
        const preferredDist = 220;
        if (d > preferredDist + 40) {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x += Math.cos(a) * e.speed * speedMult * dt;
            e.y += Math.sin(a) * e.speed * speedMult * dt;
        } else if (d < preferredDist - 40) {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x -= Math.cos(a) * e.speed * speedMult * dt;
            e.y -= Math.sin(a) * e.speed * speedMult * dt;
        }
        e.strafeAngle = (e.strafeAngle || 0) + dt * 0.8;
        const strafe = Math.sin(e.strafeAngle) * e.speed * 0.5 * dt;
        const toPlayer = angleBetween(e.x, e.y, p.x, p.y);
        e.x += Math.cos(toPlayer + Math.PI / 2) * strafe;
        e.y += Math.sin(toPlayer + Math.PI / 2) * strafe;
        e.fireTimer = (e.fireTimer || 0) + dt;
        if (e.fireTimer >= (e.fireRate || 3)) {
            e.fireTimer = 0;
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (e.dead) return;
                    const pp = Game.getPlayer();
                    if (!pp) return;
                    const ba = angleBetween(e.x, e.y, pp.x, pp.y) + rng(-0.15, 0.15);
                    Game.spawnEnemyProjectile(e.x, e.y, Math.cos(ba) * 280, Math.sin(ba) * 280, e.projDmg || 10, '#ffaa44', 3, e);
                }, i * 120);
            }
        }
    }

    function wardenBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        const a = angleBetween(e.x, e.y, p.x, p.y);
        e.x += Math.cos(a) * e.speed * speedMult * dt;
        e.y += Math.sin(a) * e.speed * speedMult * dt;
    }

    function stalkerBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.stalkerTimer = (e.stalkerTimer || rng(1, 3));
        e.stalkerPhase = e.stalkerPhase || 'approach';
        e.phaseTimer = (e.phaseTimer || 0) + dt;
        if (e.stalkerPhase === 'approach') {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x += Math.cos(a) * e.speed * 0.6 * speedMult * dt;
            e.y += Math.sin(a) * e.speed * 0.6 * speedMult * dt;
            if (e.phaseTimer >= e.stalkerTimer) {
                e.stalkerPhase = 'teleport';
                e.phaseTimer = 0;
                e.telegraph = 0.4;
            }
        } else if (e.stalkerPhase === 'teleport') {
            if (e.phaseTimer >= 0.4) {
                // Teleport NEAR player but RESPECT minimum distance
                const a = rng(0, Math.PI * 2);
                const d = rng(SPAWN_EXCLUSION_RADIUS * 0.7, SPAWN_EXCLUSION_RADIUS);
                e.x = clamp(p.x + Math.cos(a) * d, e.size, Game.GAME_W - e.size);
                e.y = clamp(p.y + Math.sin(a) * d, e.size, Game.GAME_H - e.size);
                e.stalkerPhase = 'attack';
                e.phaseTimer = 0;
                e.telegraph = 0;
            }
        } else if (e.stalkerPhase === 'attack') {
            const a = angleBetween(e.x, e.y, p.x, p.y);
            e.x += Math.cos(a) * e.speed * 2 * speedMult * dt;
            e.y += Math.sin(a) * e.speed * 2 * speedMult * dt;
            if (e.phaseTimer >= 0.8) {
                e.stalkerPhase = 'approach';
                e.phaseTimer = 0;
                e.stalkerTimer = rng(1.5, 3);
            }
        }
    }

    function nullBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.nullTimer = (e.nullTimer || 0) + dt;
        e.nullAngle = (e.nullAngle || rng(0, Math.PI * 2));
        if (Math.random() < 0.02) e.nullAngle = rng(0, Math.PI * 2);
        const toPlayer = angleBetween(e.x, e.y, p.x, p.y);
        e.nullAngle += (toPlayer - e.nullAngle) * 0.5 * dt;
        e.x += Math.cos(e.nullAngle) * e.speed * speedMult * dt;
        e.y += Math.sin(e.nullAngle) * e.speed * speedMult * dt;
        e.fireTimer = (e.fireTimer || 0) + dt;
        if (e.fireTimer >= 3.5) {
            e.fireTimer = 0;
            for (let i = 0; i < 4; i++) {
                const a = (Math.PI / 2) * i + e.nullAngle;
                Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * 160, Math.sin(a) * 160, 8, '#44ccff', 2.5, e);
            }
        }
    }

    function compilerBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.bossTimer = (e.bossTimer || 0) + dt;
        e.phase = e.phase || 0;
        e.phaseTimer = (e.phaseTimer || 0) + dt;
        e.attackCycle = (e.attackCycle || 0);
        const cx = Game.GAME_W / 2, cy = Game.GAME_H / 2;
        const toCenterA = angleBetween(e.x, e.y, cx, cy);
        const distToCenter = dist(e.x, e.y, cx, cy);
        if (distToCenter > 50) {
            e.x += Math.cos(toCenterA) * 30 * dt;
            e.y += Math.sin(toCenterA) * 30 * dt;
        }
        if (e.hp < e.maxHp * 0.5 && e.phase === 0) { e.phase = 1; e.phaseTimer = 0; }
        e.attackTimer = (e.attackTimer || 0) + dt;
        const attackRate = e.phase === 0 ? 2 : 1.5;
        if (e.attackTimer >= attackRate) {
            e.attackTimer = 0;
            e.attackCycle = (e.attackCycle + 1) % 3;
            if (e.attackCycle === 0) {
                for (let i = 0; i < 12; i++) {
                    const a = (Math.PI * 2 / 12) * i + e.bossTimer;
                    Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * 180, Math.sin(a) * 180, 15, '#ff4466', 4, e);
                }
            } else if (e.attackCycle === 1) {
                const toP = angleBetween(e.x, e.y, p.x, p.y);
                for (let i = -2; i <= 2; i++) {
                    Game.spawnEnemyProjectile(e.x, e.y, Math.cos(toP + i * 0.2) * 250, Math.sin(toP + i * 0.2) * 250, 18, '#ff6688', 3, e);
                }
            } else {
                for (let i = 0; i < 4; i++) {
                    const a = (Math.PI / 2) * i + e.bossTimer * 0.5;
                    for (let s = 1; s <= 3; s++) {
                        setTimeout(() => {
                            if (e.dead) return;
                            Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * (120 + s * 40), Math.sin(a) * (120 + s * 40), 12, '#ff8888', 4, e);
                        }, s * 100);
                    }
                }
            }
        }
    }

    function redactorBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.bossTimer = (e.bossTimer || 0) + dt;
        e.phase = e.phase || 0;
        const a = angleBetween(e.x, e.y, p.x, p.y);
        e.x += Math.cos(a) * 25 * dt;
        e.y += Math.sin(a) * 25 * dt;
        if (e.hp < e.maxHp * 0.5 && e.phase === 0) e.phase = 1;
        e.attackTimer = (e.attackTimer || 0) + dt;
        if (e.attackTimer >= (e.phase === 0 ? 2.5 : 1.8)) {
            e.attackTimer = 0;
            const count = e.phase === 0 ? 2 : 3;
            for (let i = 0; i < count; i++) {
                const zx = rng(80, Game.GAME_W - 80);
                const zy = rng(80, Game.GAME_H - 80);
                setTimeout(() => {
                    if (e.dead) return;
                    Game.createExplosion(zx, zy, 70, 20);
                }, 1500);
                Game.spawnEnemyProjectile(zx, zy, 0, 0, 0, 'rgba(255,23,68,0.3)', 1.5, e);
            }
            const toP = angleBetween(e.x, e.y, p.x, p.y);
            for (let i = 0; i < 8; i++) {
                const pa = toP + (Math.PI * 2 / 8) * i;
                Game.spawnEnemyProjectile(e.x, e.y, Math.cos(pa) * 150, Math.sin(pa) * 150, 12, '#cc2244', 3, e);
            }
        }
    }

    function mirrorExeBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.bossTimer = (e.bossTimer || 0) + dt;
        e.circleAngle = (e.circleAngle || 0) + 0.5 * dt;
        const circleR = 220;
        const targetX = p.x + Math.cos(e.circleAngle) * circleR;
        const targetY = p.y + Math.sin(e.circleAngle) * circleR;
        e.x += (targetX - e.x) * 2 * dt;
        e.y += (targetY - e.y) * 2 * dt;
        e.attackTimer = (e.attackTimer || 0) + dt;
        if (e.attackTimer >= 1.5) {
            e.attackTimer = 0;
            const toP = angleBetween(e.x, e.y, p.x, p.y);
            for (let i = -1; i <= 1; i++) {
                Game.spawnEnemyProjectile(e.x, e.y, Math.cos(toP + i * 0.3) * 300, Math.sin(toP + i * 0.3) * 300, 15, '#cc44ff', 3, e);
            }
        }
        if (e.hp < e.maxHp * 0.6) {
            e.cloneTimer = (e.cloneTimer || 0) + dt;
            if (e.cloneTimer >= 8 && !e.cloneSpawned) {
                e.cloneSpawned = true;
                for (let i = 0; i < 2; i++) {
                    const clone = create('glitcher_fast', Math.floor(e.round || 5));
                    clone.hp = 30; clone.maxHp = 30;
                    clone.size = 12; clone.color = '#cc44ff';
                    clone.speed = 150;
                    // Respect spawn exclusion for clones
                    const a = rng(0, Math.PI * 2);
                    const d = rng(SPAWN_EXCLUSION_RADIUS, SPAWN_EXCLUSION_RADIUS + 50);
                    clone.x = clamp(p.x + Math.cos(a) * d, 20, Game.GAME_W - 20);
                    clone.y = clamp(p.y + Math.sin(a) * d, 20, Game.GAME_H - 20);
                    Game.getEnemies().push(clone);
                }
            }
        }
    }

    function nullKingBehavior(e, dt, speedMult) {
        const p = Game.getPlayer();
        if (!p) return;
        e.bossTimer = (e.bossTimer || 0) + dt;
        e.phase = e.phase || 0;
        e.driftAngle = (e.driftAngle || 0) + 0.3 * dt;
        e.x += Math.cos(e.driftAngle) * 20 * dt;
        e.y += Math.sin(e.driftAngle) * 20 * dt;
        if (e.x < 100) e.driftAngle = 0;
        if (e.x > Game.GAME_W - 100) e.driftAngle = Math.PI;
        if (e.y < 100) e.driftAngle = Math.PI / 2;
        if (e.y > Game.GAME_H - 100) e.driftAngle = -Math.PI / 2;
        if (e.hp < e.maxHp * 0.7 && e.phase === 0) e.phase = 1;
        if (e.hp < e.maxHp * 0.3 && e.phase === 1) e.phase = 2;
        e.attackTimer = (e.attackTimer || 0) + dt;
        const rates = [2, 1.5, 1];
        if (e.attackTimer >= rates[e.phase]) {
            e.attackTimer = 0;
            e.attackPattern = ((e.attackPattern || 0) + 1) % 4;
            switch (e.attackPattern) {
                case 0:
                    for (let i = 0; i < 16; i++) {
                        const a = (Math.PI * 2 / 16) * i + e.bossTimer * 2;
                        Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * 140, Math.sin(a) * 140, 14, '#44ccff', 4, e);
                    }
                    break;
                case 1:
                    const toP = angleBetween(e.x, e.y, p.x, p.y);
                    for (let i = -3; i <= 3; i++) {
                        Game.spawnEnemyProjectile(e.x, e.y, Math.cos(toP + i * 0.15) * 220, Math.sin(toP + i * 0.15) * 220, 16, '#6644ff', 3, e);
                    }
                    break;
                case 2:
                    const pullA = angleBetween(p.x, p.y, e.x, e.y);
                    // Pull player but don't violate exclusion radius minimum
                    const curDist = dist(p.x, p.y, e.x, e.y);
                    if (curDist > 150) {
                        p.x += Math.cos(pullA) * 30;
                        p.y += Math.sin(pullA) * 30;
                    }
                    for (let i = 0; i < 20; i++) {
                        const a = (Math.PI * 2 / 20) * i;
                        Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * 100, Math.sin(a) * 100, 10, '#8844ff', 5, e);
                    }
                    break;
                case 3:
                    // Teleport respecting exclusion
                    const ta = rng(0, Math.PI * 2);
                    const td = rng(BOSS_EXCLUSION_RADIUS, BOSS_EXCLUSION_RADIUS + 100);
                    e.x = clamp(p.x + Math.cos(ta) * td, 150, Game.GAME_W - 150);
                    e.y = clamp(p.y + Math.sin(ta) * td, 150, Game.GAME_H - 150);
                    for (let i = 0; i < 12; i++) {
                        const a = (Math.PI * 2 / 12) * i;
                        Game.spawnEnemyProjectile(e.x, e.y, Math.cos(a) * 200, Math.sin(a) * 200, 18, '#ff44cc', 3, e);
                    }
                    break;
            }
        }
    }

    function create(typeName, currentRound) {
        
        const template = TYPES[typeName];
        if (!template) return create('glitcher', currentRound);
        const scaling = 1 + (currentRound - 1) * 0.12;
        const e = {
            x: 0, y: 0,
            hp: Math.floor(template.hp * scaling),
            maxHp: Math.floor(template.hp * scaling),
            speed: template.speed + currentRound * 2,
            size: template.size, color: template.color, shape: template.shape,
            contactDmg: Math.floor(template.contactDmg * (1 + (currentRound - 1) * 0.08)),
            xpValue: template.xpValue, rangedOnly: template.rangedOnly || false,
            armor: template.armor || 0, behavior: template.behavior,
            dead: false, flashTimer: 0, isElite: false, isBoss: false,
            fireTimer: rng(0, 1), fireRate: 2,
            projDmg: Math.floor(10 * scaling),
            frozen: 0, burning: 0, poisoned: 0,
            burnDmg: 0, poisonDmg: 0, burnTimer: 0, poisonTimer: 0,
            voidPull: 0, voidCenter: null,
            telegraph: 0, telegraphTimer: 0,
            name: template.name, faction: template.faction, round: currentRound,
            spawnFlash: 0.4,
        };
        return e;
    }

    function makeElite(e, currentRound) {
        e.isElite = true;
        e.maxHp = Math.floor(e.maxHp * 2.5);
        e.hp = e.maxHp;
        e.size = Math.floor(e.size * 1.3);
        e.speed *= 1.1;
        e.contactDmg = Math.floor(e.contactDmg * 1.5);
        e.xpValue = Math.floor(e.xpValue * 3);
        e.color = '#ffd700';
        e.name = 'Elite ' + e.name;
    }

    function createBoss(currentRound) {
        const bossIndex = Math.floor((currentRound / BOSS_INTERVAL) - 1) % 4;
        const scaling = 1 + (currentRound - 1) * 0.12;
        const bossDefs = [
            { name: 'THE COMPILER', hp: 400, size: 30, color: '#ff4466', shape: 'boss',
              contactDmg: 25, xpValue: 50, behavior: compilerBehavior },
            { name: 'REDACTOR', hp: 500, size: 28, color: '#cc2244', shape: 'boss',
              contactDmg: 20, xpValue: 60, behavior: redactorBehavior },
            { name: 'MIRROR.EXE', hp: 350, size: 25, color: '#cc44ff', shape: 'boss',
              contactDmg: 18, xpValue: 55, behavior: mirrorExeBehavior },
            { name: 'NULL KING', hp: 600, size: 35, color: '#4444ff', shape: 'boss',
              contactDmg: 30, xpValue: 80, behavior: nullKingBehavior }
        ];
        const def = bossDefs[bossIndex];
        const boss = {
            x: Game.GAME_W / 2, y: -60,
            hp: Math.floor(def.hp * scaling),
            maxHp: Math.floor(def.hp * scaling),
            speed: 30, size: def.size, color: def.color, shape: def.shape,
            contactDmg: Math.floor(def.contactDmg * scaling),
            xpValue: def.xpValue, rangedOnly: false, armor: 0,
            behavior: def.behavior,
            dead: false, flashTimer: 0, isElite: false, isBoss: true,
            name: def.name, bossTimer: 0, attackTimer: 0,
            phase: 0, phaseTimer: 0, attackCycle: 0,
            round: currentRound,
            frozen: 0, burning: 0, poisoned: 0,
            burnDmg: 0, poisonDmg: 0, burnTimer: 0, poisonTimer: 0,
            voidPull: 0, voidCenter: null,
            telegraph: 0, telegraphTimer: 0,
            faction: 'boss', fireTimer: 0, projDmg: 15,
            spawnFlash: 1.0,
        };
        return boss;
    }

    const BOSS_INTERVAL = 5;

    function getTypesForRound(round) {
        const available = ['glitcher'];
        if (round >= 2) available.push('sentinel');
        if (round >= 3) available.push('glitcher_fast');
        if (round >= 4) available.push('warden', 'stalker');
        if (round >= 5) available.push('sentinel_burst');
        if (round >= 6) available.push('null_entity');
        return available;
    }

    // ============================================================
    // SAFE SPAWN POSITION FINDER (Enemy Spawn Exclusion Zone)
    // ============================================================
    function findSafeSpawnPosition(player, enemySize, otherEnemies, isBoss = false) {
        const exclusion = isBoss ? BOSS_EXCLUSION_RADIUS : SPAWN_EXCLUSION_RADIUS;

        for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt++) {
            // Try edge spawning first (most common)
            let x, y;
            const edge = rngInt(0, 3);
            const margin = enemySize + 20;
            if (edge === 0) { x = rng(margin, Game.GAME_W - margin); y = margin; }
            else if (edge === 1) { x = Game.GAME_W - margin; y = rng(margin, Game.GAME_H - margin); }
            else if (edge === 2) { x = rng(margin, Game.GAME_W - margin); y = Game.GAME_H - margin; }
            else { x = margin; y = rng(margin, Game.GAME_H - margin); }

            // Check distance to player
            if (dist(x, y, player.x, player.y) < exclusion) continue;

            // Check overlap with other enemies
            let overlap = false;
            for (const other of otherEnemies) {
                if (other.dead) continue;
                if (dist(x, y, other.x, other.y) < (enemySize + other.size) * 1.5) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) continue;

            return { x, y, success: true };
        }

        // Fallback: ring-based attempt (if edges are too crowded)
        for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt++) {
            const a = rng(0, Math.PI * 2);
            const d = rng(exclusion, exclusion + 150);
            const x = clamp(player.x + Math.cos(a) * d, enemySize + 10, Game.GAME_W - enemySize - 10);
            const y = clamp(player.y + Math.sin(a) * d, enemySize + 10, Game.GAME_H - enemySize - 10);

            if (dist(x, y, player.x, player.y) < exclusion) continue;

            let overlap = false;
            for (const other of otherEnemies) {
                if (other.dead) continue;
                if (dist(x, y, other.x, other.y) < (enemySize + other.size) * 1.5) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) continue;

            return { x, y, success: true };
        }

        return { x: 0, y: 0, success: false };
    }

    return {
        create, makeElite, createBoss, getTypesForRound, TYPES,
        findSafeSpawnPosition,
        SPAWN_EXCLUSION_RADIUS, BOSS_EXCLUSION_RADIUS
    };
})();