// ZERO//30: LAST CYCLE — Upgrade System with Evolution Tree
'use strict';

const UpgradeSystem = (() => {

    function choose(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ============================================================
    // EVOLUTION TREE — 5 BRANCHES
    // ============================================================
    const EVOLUTION_BRANCHES = {
        assault: {
            id: 'assault', name: 'ASSAULT', color: '#ff4466',
            description: 'Offensive evolution. High damage, aggressive geometry.',
            forms: [
                { id: 'core', name: 'CORE', tier: 0, cost: 0, shape: 'core', size: 14,
                  description: 'Starting form.',
                  stats: {} },
                { id: 'striker', name: 'STRIKER', tier: 1, cost: 2, shape: 'striker', size: 15,
                  description: 'Sharpened arrow. +30% damage, +15% proj speed.',
                  stats: { damageMult: 1.3, projSpeedMult: 1.15, projCount: 1 } },
                { id: 'reaper', name: 'REAPER', tier: 2, cost: 4, shape: 'reaper', size: 16,
                  description: 'Twin-blade predator. +50% damage, +15% crit, +2 proj.',
                  stats: { damageMult: 1.5, critChance: 0.15, projCount: 2, projSpread: 10 } },
                { id: 'annihilator', name: 'ANNIHILATOR', tier: 3, cost: 7, shape: 'annihilator', size: 18,
                  description: 'Final offensive form. +100% damage, +2 proj, pierce +2.',
                  stats: { damageMult: 2.0, projCount: 2, projPierce: 2, critDamage: 0.5, projSpread: 15 } }
            ]
        },
        bulwark: {
            id: 'bulwark', name: 'BULWARK', color: '#00aaff',
            description: 'Defensive evolution. Armor, shields, reflection.',
            forms: [
                { id: 'core', name: 'CORE', tier: 0, cost: 0, shape: 'core', size: 14,
                  description: 'Starting form.', stats: {} },
                { id: 'guardian', name: 'GUARDIAN', tier: 1, cost: 2, shape: 'guardian', size: 17,
                  description: 'Hexagonal shell. +50 HP, +10% DR.',
                  stats: { maxHpAdd: 50, dmgReduction: 0.10 } },
                { id: 'bastion', name: 'BASTION', tier: 2, cost: 4, shape: 'bastion', size: 20,
                  description: 'Layered armor. +100 HP, +60 shield, +15% reflect.',
                  stats: { maxHpAdd: 100, maxShieldAdd: 60, reflectChance: 0.15, speedMult: 0.9 } },
                { id: 'aegis', name: 'AEGIS', tier: 3, cost: 7, shape: 'aegis', size: 24,
                  description: 'Fortress form. +200 HP, +120 shield, +25% DR, auto rear shield.',
                  stats: { maxHpAdd: 200, maxShieldAdd: 120, dmgReduction: 0.25, reflectChance: 0.25, speedMult: 0.85, rearShieldLevel: 2 } }
            ]
        },
        phantom: {
            id: 'phantom', name: 'PHANTOM', color: '#a855f7',
            description: 'Mobility evolution. Speed, dashes, afterimages.',
            forms: [
                { id: 'core', name: 'CORE', tier: 0, cost: 0, shape: 'core', size: 14,
                  description: 'Starting form.', stats: {} },
                { id: 'wraith', name: 'WRAITH', tier: 1, cost: 2, shape: 'wraith', size: 12,
                  description: 'Streamlined. +25% speed, -15% dash CD.',
                  stats: { speedMult: 1.25, dashCDMult: 0.85, afterimages: true } },
                { id: 'specter', name: 'SPECTER', tier: 2, cost: 4, shape: 'specter', size: 11,
                  description: 'Split silhouette. +40% speed, +2 dash charges, dash damages.',
                  stats: { speedMult: 1.4, dashMaxCharges: 2, dashDamageAdd: 30, dashCDMult: 0.7 } },
                { id: 'afterimage', name: 'AFTERIMAGE', tier: 3, cost: 7, shape: 'afterimage', size: 10,
                  description: 'Multiphase. +70% speed, +3 dash charges, phantom clones attack.',
                  stats: { speedMult: 1.7, dashMaxCharges: 3, dashDamageAdd: 60, dashCDMult: 0.5, afterimages: true, phantomClones: true } }
            ]
        },
        swarm: {
            id: 'swarm', name: 'SWARM', color: '#00ff88',
            description: 'Multi-component evolution. Orbitals, drones.',
            forms: [
                { id: 'core', name: 'CORE', tier: 0, cost: 0, shape: 'core', size: 14,
                  description: 'Starting form.', stats: {} },
                { id: 'split_core', name: 'SPLIT CORE', tier: 1, cost: 2, shape: 'split_core', size: 14,
                  description: 'Fragmented. +1 orbital blade, +1 drone.',
                  stats: { orbitalBlades: 1, droneCount: 1 } },
                { id: 'hive', name: 'HIVE', tier: 2, cost: 4, shape: 'hive', size: 15,
                  description: 'Nested cluster. +2 orbitals, +2 drones, +25% ATK speed.',
                  stats: { orbitalBlades: 2, droneCount: 2, attackSpeedMult: 1.25 } },
                { id: 'singularity_swarm', name: 'SINGULARITY SWARM', tier: 3, cost: 7, shape: 'singularity_swarm', size: 16,
                  description: 'Autonomous collective. +3 orbitals, +3 drones, +50% ATK speed.',
                  stats: { orbitalBlades: 3, droneCount: 3, attackSpeedMult: 1.5, orbitalDamageMult: 1.5 } }
            ]
        },
        void: {
            id: 'void', name: 'VOID', color: '#ff00aa',
            description: 'Corruption evolution. Gravity, instability, high risk/reward.',
            forms: [
                { id: 'core', name: 'CORE', tier: 0, cost: 0, shape: 'core', size: 14,
                  description: 'Starting form.', stats: {} },
                { id: 'fractured', name: 'FRACTURED', tier: 1, cost: 2, shape: 'fractured', size: 15,
                  description: 'Reality cracks. Void dmg, +25% damage, -10 HP.',
                  stats: { voidDamageAdd: 2, damageMult: 1.25, maxHpAdd: -10 } },
                { id: 'aberration', name: 'ABERRATION', tier: 2, cost: 4, shape: 'aberration', size: 17,
                  description: 'Reality-bent. Strong pull, +50% damage, +40 explosion radius.',
                  stats: { voidDamageAdd: 4, damageMult: 1.5, explosionRadiusAdd: 40, projExplosive: true, maxHpAdd: -20 } },
                { id: 'null_entity', name: 'NULL ENTITY', tier: 3, cost: 7, shape: 'null_entity', size: 20,
                  description: 'Beyond form. +100% damage, massive gravity, explosions enlarged.',
                  stats: { voidDamageAdd: 6, damageMult: 2.0, explosionRadiusAdd: 60, projExplosive: true, maxHpAdd: -30, critChance: 0.2 } }
            ]
        }
    };

    // ============================================================
    // UPGRADE DATABASE
    // ============================================================
    const ALL_UPGRADES = [
        // ========== WEAPONS: Projectile Modification ==========
        { id: 'multishot_1', name: 'MULTISHOT I', category: 'WEAPON', rarity: 'common', timeCost: 1,
          description: '+1 projectile per attack', tags: ['multi_shot'],
          effect: (p) => { p.projCount += 1; if (p.projSpread < 10) p.projSpread = 10; }, maxStacks: 1 },
        { id: 'multishot_2', name: 'MULTISHOT II', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: '+2 more projectiles (total 4+)', tags: ['multi_shot'],
          effect: (p) => { p.projCount += 2; p.projSpread += 8; }, maxStacks: 1, prereq: ['multishot_1'] },
        { id: 'multishot_3', name: 'MULTISHOT III', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: '+2 more projectiles, reduced spread', tags: ['multi_shot'],
          effect: (p) => { p.projCount += 2; p.projSpread = Math.max(10, p.projSpread - 5); }, maxStacks: 1, prereq: ['multishot_2'] },
        { id: 'multishot_4', name: 'MULTISHOT IV', category: 'WEAPON', rarity: 'epic', timeCost: 8,
          description: '+2 projectiles, extras pierce 1', tags: ['multi_shot', 'pierce'],
          effect: (p) => { p.projCount += 2; p.projPierce += 1; }, maxStacks: 1, prereq: ['multishot_3'] },
        { id: 'multishot_5', name: 'MULTISHOT V', category: 'WEAPON', rarity: 'legendary', timeCost: 11,
          description: 'Central projectile deals +100% damage, +2 proj', tags: ['multi_shot', 'damage'],
          effect: (p) => { p.projCount += 2; p.centerProjBonus = (p.centerProjBonus || 1) + 1; }, maxStacks: 1, prereq: ['multishot_4'] },

        { id: 'proj_size_1', name: 'Macro Rounds', category: 'WEAPON', rarity: 'common', timeCost: 1,
          description: 'Projectiles are 40% larger (easier hits)', tags: ['proj_size'],
          effect: (p) => { p.projSizeMult = (p.projSizeMult || 1) * 1.4; }, maxStacks: 3 },
        { id: 'proj_size_2', name: 'Giga Rounds', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles 80% larger, +15% damage', tags: ['proj_size', 'damage'],
          effect: (p) => { p.projSizeMult = (p.projSizeMult || 1) * 1.8; p.damage *= 1.15; }, maxStacks: 1, prereq: ['proj_size_1'] },

        { id: 'proj_speed_1', name: 'Velocity Boost', category: 'WEAPON', rarity: 'common', timeCost: 1,
          description: '+25% projectile speed', tags: ['proj_speed'],
          effect: (p) => { p.projSpeed *= 1.25; }, maxStacks: 3 },
        { id: 'proj_speed_2', name: 'Railgun Rounds', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: '+50% proj speed, +10% damage', tags: ['proj_speed', 'damage'],
          effect: (p) => { p.projSpeed *= 1.5; p.damage *= 1.1; }, maxStacks: 1, prereq: ['proj_speed_1'] },

        { id: 'pierce_1', name: 'Armor Piercing', category: 'WEAPON', rarity: 'common', timeCost: 1,
          description: 'Projectiles pierce 1 enemy', tags: ['pierce'],
          effect: (p) => { p.projPierce += 1; }, maxStacks: 3 },
        { id: 'pierce_2', name: 'Through & Through', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Pierce +2 more enemies', tags: ['pierce'],
          effect: (p) => { p.projPierce += 2; }, maxStacks: 2, prereq: ['pierce_1'] },

        { id: 'ricochet_1', name: 'Ricochet Rounds', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Projectiles bounce to 1 nearby enemy', tags: ['ricochet'],
          effect: (p) => { p.projRicochet += 1; }, maxStacks: 3 },
        { id: 'ricochet_2', name: 'Pinball Protocol', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: '+3 ricochets', tags: ['ricochet'],
          effect: (p) => { p.projRicochet += 3; }, maxStacks: 1, prereq: ['ricochet_1'] },

        { id: 'homing_1', name: 'Smart Rounds', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles home toward enemies', tags: ['homing'],
          effect: (p) => { p.projHoming = Math.max(p.projHoming, 2); }, maxStacks: 1 },
        { id: 'homing_2', name: 'Lock-On Protocol', category: 'WEAPON', rarity: 'epic', timeCost: 8,
          description: 'Strong projectile homing', tags: ['homing'],
          effect: (p) => { p.projHoming = Math.max(p.projHoming, 5); }, maxStacks: 1, prereq: ['homing_1'] },

        { id: 'explosive_1', name: 'Explosive Rounds', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles explode on impact (50px)', tags: ['explosive'],
          effect: (p) => { p.projExplosive = true; p.explosionRadius = Math.max(p.explosionRadius, 50); }, maxStacks: 1 },
        { id: 'explosive_2', name: 'Bigger Booms', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: '+30px explosion radius', tags: ['explosive'],
          effect: (p) => { p.explosionRadius += 30; }, maxStacks: 2, prereq: ['explosive_1'] },

        { id: 'split_1', name: 'Splitting Rounds', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles split into 3 on first hit', tags: ['split'],
          effect: (p) => { p.projSplit = true; }, maxStacks: 1 },

        { id: 'return_1', name: 'Boomerang Shots', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles return to player after 1s', tags: ['return'],
          effect: (p) => { p.projReturn = true; }, maxStacks: 1 },

        { id: 'trail_1', name: 'Damaging Trails', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Projectiles leave damaging trails', tags: ['trail'],
          effect: (p) => { p.projTrail = true; p.projTrailDmg = 2; }, maxStacks: 2 },

        { id: 'duplicate_1', name: 'Replication', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles duplicate on enemy kills (20% chance)', tags: ['duplicate'],
          effect: (p) => { p.projDuplicateChance = (p.projDuplicateChance || 0) + 0.2; }, maxStacks: 2 },

        // ========== WEAPONS: Firing Patterns ==========
        { id: 'shotgun_1', name: 'Scatter Shot', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: '+3 projectiles, +30° spread, -20% ATK speed', tags: ['shotgun', 'multi_shot'],
          effect: (p) => { p.projCount += 3; p.projSpread += 30; p.attackSpeed *= 0.8; }, maxStacks: 2 },

        { id: 'burst_1', name: 'Circular Burst', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Every 3s fire 8 projectiles in all directions', tags: ['burst'],
          effect: (p) => { p.circularBurst = true; }, maxStacks: 1 },

        { id: 'spiral_1', name: 'Spiral Pattern', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Projectiles rotate in spiral pattern', tags: ['spiral'],
          effect: (p) => { p.spiralShot = true; }, maxStacks: 1 },

        { id: 'alternating_1', name: 'Alternating Fire', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Alternate shots from left/right of player', tags: ['alternating'],
          effect: (p) => { p.alternatingShots = true; }, maxStacks: 1 },

        { id: 'cross_1', name: 'Cross Volley', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Also fire 4 projectiles in cross pattern', tags: ['cross'],
          effect: (p) => { p.crossShot = true; }, maxStacks: 1 },

        { id: 'burst_fire_1', name: 'Burst Fire', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Fire 3 rapid shots then pause briefly', tags: ['burst_fire'],
          effect: (p) => { p.burstFire = 3; }, maxStacks: 1 },

        { id: 'heavy_round_1', name: 'Charged Heavy', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Every 5th shot deals 300% damage', tags: ['heavy'],
          effect: (p) => { p.heavyShotEnabled = true; }, maxStacks: 1 },

        { id: 'radial_1', name: 'Radial Barrage', category: 'WEAPON', rarity: 'epic', timeCost: 8,
          description: 'Every 5s fire 16 projectiles radially', tags: ['radial'],
          effect: (p) => { p.radialBarrage = true; }, maxStacks: 1 },

        // ========== WEAPONS: Advanced ==========
        { id: 'orbital_1', name: 'Orbital Blade', category: 'WEAPON', rarity: 'uncommon', timeCost: 3,
          description: 'Energy blade orbits you', tags: ['orbital'],
          effect: (p) => { p.orbitalBlades += 1; }, maxStacks: 4 },
        { id: 'orbital_2', name: 'Blade Storm', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: '+2 orbital blades, +50% blade damage', tags: ['orbital'],
          effect: (p) => { p.orbitalBlades += 2; p.orbitalDamage *= 1.5; }, maxStacks: 2, prereq: ['orbital_1'] },

        { id: 'drone_1', name: 'Attack Drone', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Deploy autonomous drone', tags: ['drone'],
          effect: (p) => { p.droneCount += 1; }, maxStacks: 3 },

        { id: 'chain_1', name: 'Chain Lightning', category: 'WEAPON', rarity: 'rare', timeCost: 5,
          description: 'Hits chain to 2 enemies', tags: ['chain_lightning', 'electric'],
          effect: (p) => { p.chainLightning += 2; }, maxStacks: 3 },
        { id: 'chain_2', name: 'Storm Conductor', category: 'WEAPON', rarity: 'epic', timeCost: 8,
          description: '+3 chain targets', tags: ['chain_lightning', 'electric'],
          effect: (p) => { p.chainLightning += 3; }, maxStacks: 1, prereq: ['chain_1'] },

        { id: 'beam_1', name: 'Beam Emitter', category: 'WEAPON', rarity: 'epic', timeCost: 8,
          description: 'Continuous beam weapon', tags: ['beam'],
          effect: (p) => { p.beamWeapon = true; p.beamDamage = p.damage * 0.35; }, maxStacks: 1 },

        // ========== ELEMENTAL ==========
        { id: 'fire_1', name: 'Incendiary Rounds', category: 'ELEMENTAL', rarity: 'uncommon', timeCost: 3,
          description: '20% ignite chance', tags: ['fire'],
          effect: (p) => { p.fireChance += 0.2; }, maxStacks: 3 },
        { id: 'fire_2', name: 'Inferno Protocol', category: 'ELEMENTAL', rarity: 'rare', timeCost: 5,
          description: '+30% ignite chance', tags: ['fire'],
          effect: (p) => { p.fireChance += 0.3; }, maxStacks: 1, prereq: ['fire_1'] },

        { id: 'ice_1', name: 'Cryo Rounds', category: 'ELEMENTAL', rarity: 'uncommon', timeCost: 3,
          description: '15% freeze chance', tags: ['ice'],
          effect: (p) => { p.iceChance += 0.15; }, maxStacks: 3 },
        { id: 'ice_2', name: 'Deep Freeze', category: 'ELEMENTAL', rarity: 'rare', timeCost: 5,
          description: '+25% freeze chance', tags: ['ice'],
          effect: (p) => { p.iceChance += 0.25; }, maxStacks: 1, prereq: ['ice_1'] },

        { id: 'poison_1', name: 'Toxic Payload', category: 'ELEMENTAL', rarity: 'uncommon', timeCost: 3,
          description: '20% poison chance', tags: ['poison'],
          effect: (p) => { p.poisonChance += 0.2; }, maxStacks: 3 },
        { id: 'poison_2', name: 'Virulent Strain', category: 'ELEMENTAL', rarity: 'rare', timeCost: 5,
          description: '+30% poison chance', tags: ['poison'],
          effect: (p) => { p.poisonChance += 0.3; }, maxStacks: 1, prereq: ['poison_1'] },

        { id: 'void_1', name: 'Void Fragments', category: 'ELEMENTAL', rarity: 'rare', timeCost: 5,
          description: 'Hits pull enemies', tags: ['void'],
          effect: (p) => { p.voidDamage = Math.max(p.voidDamage, 1); }, maxStacks: 1 },
        { id: 'void_2', name: 'Gravity Well', category: 'ELEMENTAL', rarity: 'epic', timeCost: 8,
          description: 'Strong gravitational pull, +20px AoE', tags: ['void', 'gravity'],
          effect: (p) => { p.voidDamage = Math.max(p.voidDamage, 3); p.explosionRadius += 20; }, maxStacks: 1, prereq: ['void_1'] },

        { id: 'status_spread_1', name: 'Contagion', category: 'ELEMENTAL', rarity: 'rare', timeCost: 5,
          description: 'Status effects spread to nearby enemies', tags: ['fire', 'poison', 'ice'],
          effect: (p) => { p.statusSpread = true; }, maxStacks: 1 },

        // ========== ADVANCED MODIFIERS ==========
        { id: 'close_range_1', name: 'Point Blank', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: '+50% damage within 150px', tags: ['damage'],
          effect: (p) => { p.closeRangeBonus = (p.closeRangeBonus || 0) + 0.5; }, maxStacks: 2 },

        { id: 'long_range_1', name: 'Sniper Protocol', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: '+50% damage beyond 400px', tags: ['damage'],
          effect: (p) => { p.longRangeBonus = (p.longRangeBonus || 0) + 0.5; }, maxStacks: 2 },

        { id: 'first_strike_1', name: 'First Strike', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+40% damage to full-HP enemies', tags: ['damage'],
          effect: (p) => { p.fullHpBonus = (p.fullHpBonus || 0) + 0.4; }, maxStacks: 2 },

        { id: 'execute_1', name: 'Execution Protocol', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+50% damage below 30% HP', tags: ['execute'],
          effect: (p) => { p.executeDmg += 0.5; }, maxStacks: 2 },

        { id: 'overkill_1', name: 'Overkill Cascade', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: 'Excess damage carries to nearest enemy', tags: ['overkill'],
          effect: (p) => { p.overkillEnabled = true; }, maxStacks: 1 },

        { id: 'momentum_1', name: 'Momentum', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: 'Consecutive hits increase ATK speed (max +40%)', tags: ['momentum'],
          effect: (p) => { p.momentumEnabled = true; }, maxStacks: 1 },

        { id: 'kill_atk_speed_1', name: 'Bloodlust', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: 'Kills grant +20% ATK speed for 3s', tags: ['momentum'],
          effect: (p) => { p.killAtkSpeed = (p.killAtkSpeed || 0) + 0.2; }, maxStacks: 2 },

        // ========== STATS: Damage, ATK Speed, Crit ==========
        { id: 'atk_speed_1', name: 'Rapid Fire', category: 'OFFENSE', rarity: 'common', timeCost: 1,
          description: '+20% attack speed', tags: ['attack_speed'],
          effect: (p) => { p.attackSpeed *= 1.2; }, maxStacks: 5 },
        { id: 'atk_speed_2', name: 'Overdrive', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+35% attack speed', tags: ['attack_speed'],
          effect: (p) => { p.attackSpeed *= 1.35; }, maxStacks: 2, prereq: ['atk_speed_1'] },

        { id: 'damage_1', name: 'Power Core', category: 'OFFENSE', rarity: 'common', timeCost: 1,
          description: '+15% damage', tags: ['damage'],
          effect: (p) => { p.damage *= 1.15; }, maxStacks: 5 },
        { id: 'damage_2', name: 'Overcharged Core', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+30% damage', tags: ['damage'],
          effect: (p) => { p.damage *= 1.3; }, maxStacks: 3, prereq: ['damage_1'] },
        { id: 'damage_3', name: 'Maximum Output', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: '+50% damage', tags: ['damage'],
          effect: (p) => { p.damage *= 1.5; }, maxStacks: 2, prereq: ['damage_2'] },

        { id: 'crit_chance_1', name: 'Precision Module', category: 'OFFENSE', rarity: 'common', timeCost: 1,
          description: '+8% crit chance', tags: ['crit'],
          effect: (p) => { p.critChance = Math.min(0.8, p.critChance + 0.08); }, maxStacks: 5 },
        { id: 'crit_chance_2', name: 'Targeting Array', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+15% crit chance', tags: ['crit'],
          effect: (p) => { p.critChance = Math.min(0.8, p.critChance + 0.15); }, maxStacks: 2, prereq: ['crit_chance_1'] },

        { id: 'crit_dmg_1', name: 'Critical Amplifier', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+50% crit damage', tags: ['crit', 'crit_damage'],
          effect: (p) => { p.critDamage += 0.5; }, maxStacks: 3 },
        { id: 'crit_dmg_2', name: 'Devastation Core', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: '+100% crit damage', tags: ['crit', 'crit_damage'],
          effect: (p) => { p.critDamage += 1.0; }, maxStacks: 2, prereq: ['crit_dmg_1'] },

        { id: 'boss_dmg_1', name: 'Giant Slayer', category: 'OFFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+30% damage to elites/bosses', tags: ['boss_damage'],
          effect: (p) => { p.bonusBossDmg += 0.3; }, maxStacks: 3 },

        { id: 'lifesteal_1', name: 'Vampiric Rounds', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: 'Heal 1 HP per kill', tags: ['lifesteal'],
          effect: (p) => { p.killHeal += 1; }, maxStacks: 5 },
        { id: 'lifesteal_2', name: 'Blood Siphon', category: 'OFFENSE', rarity: 'rare', timeCost: 5,
          description: 'Heal 3 HP per kill', tags: ['lifesteal'],
          effect: (p) => { p.killHeal += 3; }, maxStacks: 2, prereq: ['lifesteal_1'] },

        // ========== DEFENSE ==========
        { id: 'rear_shield_1', name: 'REAR GUARD I', category: 'DEFENSE', rarity: 'uncommon', timeCost: 3,
          description: 'Triangular rear shield blocks projectiles from behind', tags: ['rear_shield', 'defense'],
          effect: (p) => { p.rearShieldLevel = Math.max(p.rearShieldLevel || 0, 1); }, maxStacks: 1 },
        { id: 'rear_shield_2', name: 'REAR GUARD II', category: 'DEFENSE', rarity: 'rare', timeCost: 5,
          description: 'Rear shield reflects blocked projectiles', tags: ['rear_shield', 'defense'],
          effect: (p) => { p.rearShieldLevel = Math.max(p.rearShieldLevel || 0, 2); }, maxStacks: 1, prereq: ['rear_shield_1'] },
        { id: 'rear_shield_3', name: 'REAR GUARD III', category: 'DEFENSE', rarity: 'rare', timeCost: 5,
          description: 'Wider rear shield, +50% reflected damage', tags: ['rear_shield', 'defense'],
          effect: (p) => { p.rearShieldLevel = Math.max(p.rearShieldLevel || 0, 3); }, maxStacks: 1, prereq: ['rear_shield_2'] },
        { id: 'rear_shield_4', name: 'REAR GUARD IV', category: 'DEFENSE', rarity: 'epic', timeCost: 8,
          description: 'Reflected projectiles pierce enemies', tags: ['rear_shield', 'defense'],
          effect: (p) => { p.rearShieldLevel = Math.max(p.rearShieldLevel || 0, 4); }, maxStacks: 1, prereq: ['rear_shield_3'] },
        { id: 'rear_shield_5', name: 'REAR GUARD V', category: 'DEFENSE', rarity: 'legendary', timeCost: 11,
          description: 'Reflections trigger shockwave AoE damage', tags: ['rear_shield', 'defense'],
          effect: (p) => { p.rearShieldLevel = Math.max(p.rearShieldLevel || 0, 5); }, maxStacks: 1, prereq: ['rear_shield_4'] },

        { id: 'max_hp_1', name: 'Reinforced Core', category: 'DEFENSE', rarity: 'common', timeCost: 1,
          description: '+25 max HP, heal full', tags: ['hp'],
          effect: (p) => { p.maxHp += 25; p.hp = p.maxHp; }, maxStacks: 5 },
        { id: 'max_hp_2', name: 'Titanium Frame', category: 'DEFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+50 max HP, +5% DR', tags: ['hp', 'defense'],
          effect: (p) => { p.maxHp += 50; p.hp = Math.min(p.maxHp, p.hp + 50); p.dmgReduction = Math.min(0.7, p.dmgReduction + 0.05); }, maxStacks: 3 },

        { id: 'regen_1', name: 'Nanite Repair', category: 'DEFENSE', rarity: 'common', timeCost: 1,
          description: 'Regen 2 HP/s', tags: ['regen'],
          effect: (p) => { p.regen += 2; }, maxStacks: 5 },
        { id: 'regen_2', name: 'Advanced Nanites', category: 'DEFENSE', rarity: 'uncommon', timeCost: 3,
          description: 'Regen 5 HP/s', tags: ['regen'],
          effect: (p) => { p.regen += 5; }, maxStacks: 2, prereq: ['regen_1'] },

        { id: 'shield_1', name: 'Energy Shield', category: 'DEFENSE', rarity: 'uncommon', timeCost: 3,
          description: '+30 shield', tags: ['shield'],
          effect: (p) => { p.maxShield += 30; p.shield += 30; }, maxStacks: 4 },
        { id: 'shield_2', name: 'Barrier Generator', category: 'DEFENSE', rarity: 'rare', timeCost: 5,
          description: '+60 shield', tags: ['shield'],
          effect: (p) => { p.maxShield += 60; p.shield += 60; }, maxStacks: 2, prereq: ['shield_1'] },

        { id: 'reflect_1', name: 'Deflector', category: 'DEFENSE', rarity: 'rare', timeCost: 5,
          description: '15% reflect chance', tags: ['reflect'],
          effect: (p) => { p.reflectChance = Math.min(0.6, p.reflectChance + 0.15); }, maxStacks: 3 },

        { id: 'dmg_reduce_1', name: 'Hardened Plating', category: 'DEFENSE', rarity: 'common', timeCost: 1,
          description: '+8% damage reduction', tags: ['defense'],
          effect: (p) => { p.dmgReduction = Math.min(0.7, p.dmgReduction + 0.08); }, maxStacks: 5 },

        { id: 'emergency_1', name: 'Last Stand', category: 'DEFENSE', rarity: 'epic', timeCost: 8,
          description: 'Survive fatal hit at 15% HP (once)', tags: ['emergency'],
          effect: (p) => { p.emergencySurvival = true; }, maxStacks: 1 },

        // ========== MOBILITY ==========
        { id: 'speed_1', name: 'Overclock', category: 'MOBILITY', rarity: 'common', timeCost: 1,
          description: '+15% movement speed', tags: ['speed'],
          effect: (p) => { p.speed *= 1.15; }, maxStacks: 4 },
        { id: 'speed_2', name: 'Turbo Boost', category: 'MOBILITY', rarity: 'uncommon', timeCost: 3,
          description: '+25% speed', tags: ['speed'],
          effect: (p) => { p.speed *= 1.25; }, maxStacks: 2 },

        { id: 'dash_charge_1', name: 'Extra Dash', category: 'MOBILITY', rarity: 'uncommon', timeCost: 3,
          description: '+1 dash charge', tags: ['dash'],
          effect: (p) => { p.dashMaxCharges += 1; p.dashCharges += 1; }, maxStacks: 3 },

        { id: 'dash_cd_1', name: 'Quick Recovery', category: 'MOBILITY', rarity: 'common', timeCost: 1,
          description: '-20% dash cooldown', tags: ['dash', 'cooldown'],
          effect: (p) => { p.dashCooldown *= 0.8; }, maxStacks: 3 },

        { id: 'dash_dmg_1', name: 'Dash Strike', category: 'MOBILITY', rarity: 'uncommon', timeCost: 3,
          description: 'Dash deals 25 damage', tags: ['dash', 'dash_damage'],
          effect: (p) => { p.dashDamage += 25; }, maxStacks: 3 },

        { id: 'afterimage_1', name: 'Ghost Trail', category: 'MOBILITY', rarity: 'uncommon', timeCost: 3,
          description: 'Phantom afterimages while moving', tags: ['phantom'],
          effect: (p) => { p.afterimages = true; }, maxStacks: 1 },

        // ========== UTILITY ==========
        { id: 'xp_boost_1', name: 'Data Amplifier', category: 'UTILITY', rarity: 'common', timeCost: 1,
          description: '+25% XP', tags: ['xp'],
          effect: (p) => { p.xpMult *= 1.25; }, maxStacks: 3 },
        { id: 'pickup_radius_1', name: 'Magnetic Field', category: 'UTILITY', rarity: 'common', timeCost: 1,
          description: '+40% pickup radius', tags: ['pickup'],
          effect: (p) => { p.pickupRadius *= 1.4; }, maxStacks: 4 },

        // ========== CURSED ==========
        { id: 'cursed_glass_1', name: 'Glass Cannon', category: 'CURSED', rarity: 'cursed', timeCost: 14,
          description: '+100% damage, max HP = 50', tags: ['cursed', 'damage'],
          effect: (p) => { p.damage *= 2; p.maxHp = 50; p.hp = Math.min(p.hp, 50); }, maxStacks: 1 },
        { id: 'cursed_berserker', name: 'Unstable Core', category: 'CURSED', rarity: 'cursed', timeCost: 14,
          description: '+80% ATK speed, +60% dmg, -30% HP', tags: ['cursed', 'attack_speed'],
          effect: (p) => { p.attackSpeed *= 1.8; p.damage *= 1.6; p.maxHp = Math.floor(p.maxHp * 0.7); p.hp = Math.min(p.hp, p.maxHp); }, maxStacks: 1 },
        { id: 'cursed_chaos', name: 'Chaos Engine', category: 'CURSED', rarity: 'cursed', timeCost: 14,
          description: '+200% dmg, +100% ATK speed, HP = 30', tags: ['cursed'],
          effect: (p) => { p.damage *= 3; p.attackSpeed *= 2; p.maxHp = 30; p.hp = Math.min(p.hp, 30); }, maxStacks: 1 },

        // ========== LEGENDARY (20+) ==========
        { id: 'leg_storm_engine', name: 'STORM ENGINE', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Every 4th attack triggers chain lightning burst', tags: ['legendary', 'electric'],
          effect: (p) => { p.stormEngine = true; p.chainLightning = Math.max(p.chainLightning, 3); }, maxStacks: 1 },
        { id: 'leg_death_bloom', name: 'DEATH BLOOM', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Killed enemies explode (can chain)', tags: ['legendary', 'explosive'],
          effect: (p) => { p.deathBloom = true; }, maxStacks: 1 },
        { id: 'leg_infinite_mag', name: 'INFINITE MAGAZINE', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Each attack temporarily adds projectile (stacks to +5)', tags: ['legendary', 'multi_shot'],
          effect: (p) => { p.infiniteMag = true; }, maxStacks: 1 },
        { id: 'leg_phantom_arsenal', name: 'PHANTOM ARSENAL', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Dash releases fan of spectral projectiles', tags: ['legendary', 'dash'],
          effect: (p) => { p.phantomArsenal = true; }, maxStacks: 1 },
        { id: 'leg_void_collapse', name: 'VOID COLLAPSE', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Every 10s create black hole pulling enemies', tags: ['legendary', 'void'],
          effect: (p) => { p.voidCollapse = true; }, maxStacks: 1 },
        { id: 'leg_reflector_prime', name: 'REFLECTOR PRIME', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Reflected projectiles +200% dmg, pierce 3', tags: ['legendary', 'reflect'],
          effect: (p) => { p.reflectChance = Math.min(0.6, p.reflectChance + 0.3); p.reflectorPrime = true; }, maxStacks: 1 },
        { id: 'leg_orbital_dominion', name: 'ORBITAL DOMINION', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+4 orbital blades, 2x orbital damage', tags: ['legendary', 'orbital'],
          effect: (p) => { p.orbitalBlades += 4; p.orbitalDamage *= 2; }, maxStacks: 1 },
        { id: 'leg_hunter_protocol', name: 'HUNTER PROTOCOL', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Consecutive hits on target +15% dmg (stacks)', tags: ['legendary'],
          effect: (p) => { p.hunterProtocol = true; }, maxStacks: 1 },
        { id: 'leg_last_frame', name: 'LAST FRAME', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Lethal hit triggers 2s invuln + heal (60s CD)', tags: ['legendary', 'emergency'],
          effect: (p) => { p.lastFrame = true; p.lastFrameCD = 0; }, maxStacks: 1 },
        { id: 'leg_annihilator', name: 'THE ANNIHILATOR', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+5 proj, +5 pierce, +100% dmg, +50% proj speed', tags: ['legendary', 'multi_shot', 'pierce'],
          effect: (p) => { p.projCount += 5; p.projPierce += 5; p.damage *= 2; p.projSpeed *= 1.5; p.projSpread += 20; }, maxStacks: 1 },
        { id: 'leg_immortal', name: 'IMMORTAL PROTOCOL', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+200 HP, +10 regen, +100 shield, emergency survival', tags: ['legendary', 'hp'],
          effect: (p) => { p.maxHp += 200; p.hp += 200; p.regen += 10; p.maxShield += 100; p.shield += 100; p.emergencySurvival = true; }, maxStacks: 1 },
        { id: 'leg_speed_demon', name: 'SPEED DEMON', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+100% speed, +3 dash, dash deals 80 dmg', tags: ['legendary', 'speed', 'dash'],
          effect: (p) => { p.speed *= 2; p.dashMaxCharges += 3; p.dashCharges += 3; p.dashDamage += 80; }, maxStacks: 1 },
        { id: 'leg_void_lord', name: 'VOID LORD', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'Strong gravity, massive explosions, +3 orbitals', tags: ['legendary', 'void'],
          effect: (p) => { p.voidDamage = Math.max(p.voidDamage, 5); p.projExplosive = true; p.explosionRadius = Math.max(p.explosionRadius, 70); p.orbitalBlades += 3; }, maxStacks: 1 },
        { id: 'leg_terminus', name: 'TERMINUS', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: 'All proj: ricochet 3, pierce 3, chain 3', tags: ['legendary'],
          effect: (p) => { p.projRicochet += 3; p.projPierce += 3; p.chainLightning += 3; }, maxStacks: 1 },
        { id: 'leg_fortress', name: 'IRON FORTRESS', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+300 HP, +200 shield, +40% DR, +30% reflect, -30% speed', tags: ['legendary', 'defense'],
          effect: (p) => { p.maxHp += 300; p.hp += 300; p.maxShield += 200; p.shield += 200; p.dmgReduction = Math.min(0.7, p.dmgReduction + 0.4); p.reflectChance = Math.min(0.6, p.reflectChance + 0.3); p.speed *= 0.7; }, maxStacks: 1 },
        { id: 'leg_elemental_overlord', name: 'ELEMENTAL OVERLORD', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+40% fire/ice/poison chances, status spread', tags: ['legendary', 'fire', 'ice', 'poison'],
          effect: (p) => { p.fireChance += 0.4; p.iceChance += 0.4; p.poisonChance += 0.4; p.statusSpread = true; }, maxStacks: 1 },
        { id: 'leg_titan_core', name: 'TITAN CORE', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+300 HP, dmg scales with max HP (1 dmg per 10 HP)', tags: ['legendary', 'hp'],
          effect: (p) => { p.maxHp += 300; p.hp += 300; p.titanCore = true; }, maxStacks: 1 },
        { id: 'leg_crit_sovereign', name: 'CRIT SOVEREIGN', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+40% crit, +200% crit dmg, crits explode', tags: ['legendary', 'crit'],
          effect: (p) => { p.critChance = Math.min(0.8, p.critChance + 0.4); p.critDamage += 2.0; p.critExplode = true; }, maxStacks: 1 },
        { id: 'leg_swarm_lord', name: 'SWARM LORD', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+5 drones, +4 orbitals, drones +100% dmg', tags: ['legendary', 'drone', 'orbital'],
          effect: (p) => { p.droneCount += 5; p.orbitalBlades += 4; p.droneDmgMult = (p.droneDmgMult || 1) * 2; }, maxStacks: 1 },
        { id: 'leg_tempest', name: 'TEMPEST', category: 'LEGENDARY', rarity: 'legendary', timeCost: 11,
          description: '+6 proj, radial barrage, circular burst, +50% ATK speed', tags: ['legendary', 'multi_shot'],
          effect: (p) => { p.projCount += 6; p.projSpread += 15; p.radialBarrage = true; p.circularBurst = true; p.attackSpeed *= 1.5; }, maxStacks: 1 },

        // ========== MYTHIC (8) ==========
        { id: 'myth_world_fracture', name: 'WORLD FRACTURE', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'Every 15s distort arena, massive AoE damage', tags: ['mythic'],
          effect: (p) => { p.worldFracture = true; }, maxStacks: 1 },
        { id: 'myth_singularity_core', name: 'SINGULARITY CORE', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'Constant gravity pulls nearby enemies to you', tags: ['mythic', 'void'],
          effect: (p) => { p.singularityCore = true; p.voidDamage = Math.max(p.voidDamage, 5); }, maxStacks: 1 },
        { id: 'myth_omnipresent', name: 'OMNIPRESENT', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: '2 echo copies mirror your attacks', tags: ['mythic'],
          effect: (p) => { p.omnipresent = true; }, maxStacks: 1 },
        { id: 'myth_cascade', name: 'INFINITE CASCADE', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'Kills cause chained explosions (up to 5)', tags: ['mythic', 'explosive'],
          effect: (p) => { p.infiniteCascade = true; p.deathBloom = true; }, maxStacks: 1 },
        { id: 'myth_ascendant', name: 'ASCENDANT FORM', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'Every 20s empower form: +200% dmg, +50% speed for 5s', tags: ['mythic'],
          effect: (p) => { p.ascendantForm = true; p.ascendantCD = 0; }, maxStacks: 1 },
        { id: 'myth_reality_mirror', name: 'REALITY MIRROR', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: '50% reflect, reflected proj deal 300%', tags: ['mythic', 'reflect'],
          effect: (p) => { p.reflectChance = Math.min(0.9, p.reflectChance + 0.5); p.reflectorPrime = true; p.realityMirror = true; }, maxStacks: 1 },
        { id: 'myth_apocalypse', name: 'APOCALYPSE PROTOCOL', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'Combat charges massive AoE blast (release at full)', tags: ['mythic'],
          effect: (p) => { p.apocalypseProtocol = true; p.apocalypseCharge = 0; }, maxStacks: 1 },
        { id: 'myth_final_evolution', name: 'FINAL EVOLUTION', category: 'MYTHIC', rarity: 'mythic', timeCost: 15,
          description: 'All stats +50%, unlocks evolution-specific ultimate', tags: ['mythic'],
          effect: (p) => { p.damage *= 1.5; p.attackSpeed *= 1.5; p.speed *= 1.5; p.maxHp = Math.floor(p.maxHp * 1.5); p.hp = p.maxHp; p.finalEvolution = true; }, maxStacks: 1 },
    ];

    // ============================================================
    // SYNERGIES (15+)
    // ============================================================
    const SYNERGIES = [
        { id: 'thunder_god', name: 'THUNDER GOD', requires: ['electric', 'attack_speed'],
          description: 'Kills chain lightning', effect: (p) => { p.chainLightning += 2; p.attackSpeed *= 1.1; } },
        { id: 'glass_cannon_evo', name: 'OMEGA GLASS CANNON', requires: ['damage', 'crit'],
          description: '+150% crit dmg', effect: (p) => { p.critDamage += 1.5; } },
        { id: 'black_hole', name: 'COLLAPSED SINGULARITY', requires: ['void', 'explosive'],
          description: '+30 explosion radius', effect: (p) => { p.explosionRadius += 30; p.voidDamage = Math.max(p.voidDamage, 4); } },
        { id: 'perpetual_motion', name: 'PERPETUAL ENGINE', requires: ['dash', 'phantom'],
          description: 'Kills reset dash CD', effect: (p) => { p.dashCooldown *= 0.8; p.speed *= 1.1; } },
        { id: 'blood_engine', name: 'BLOOD ENGINE', requires: ['lifesteal', 'damage'],
          description: 'Heal more on kills', effect: (p) => { p.killHeal += 2; } },
        { id: 'thermal_shock', name: 'THERMAL SHOCK', requires: ['fire', 'ice'],
          description: 'Combo damage +15%', effect: (p) => { p.damage *= 1.15; } },
        { id: 'virulent_void', name: 'VIRULENT VOID', requires: ['poison', 'void'],
          description: 'Poison spreads via void', effect: (p) => { p.statusSpread = true; } },
        { id: 'lead_curtain', name: 'LEAD CURTAIN', requires: ['multi_shot', 'attack_speed'],
          description: 'Projectile wall', effect: (p) => { p.projCount += 1; p.attackSpeed *= 1.15; } },
        { id: 'reflective_barricade', name: 'REFLECTIVE BARRICADE', requires: ['shield', 'defense'],
          description: '+20% reflect', effect: (p) => { p.reflectChance = Math.min(0.6, p.reflectChance + 0.2); } },
        { id: 'velocity_force', name: 'VELOCITY FORCE', requires: ['speed', 'dash_damage'],
          description: 'Dash damage +35', effect: (p) => { p.dashDamage += 35; p.speed *= 1.1; } },
        { id: 'coherent_beam', name: 'COHERENT BEAM', requires: ['beam', 'crit'],
          description: 'Beam crits', effect: (p) => { p.critChance = Math.min(0.8, p.critChance + 0.15); if (p.beamDamage) p.beamDamage *= 1.35; } },
        { id: 'shock_drone', name: 'TESLA DRONES', requires: ['drone', 'electric'],
          description: 'Drones shock', effect: (p) => { p.chainLightning = Math.max(p.chainLightning, 2); } },
        { id: 'spiked_plating', name: 'SPIKED PLATING', requires: ['hp', 'defense'],
          description: 'Thorns', effect: (p) => { p.thorns = true; p.maxHp += 15; p.hp += 15; } },
        { id: 'phantom_slick', name: 'PHANTOM SLICK', requires: ['phantom', 'cooldown'],
          description: 'Dash shockwave', effect: (p) => { p.dashCooldown *= 0.85; p.dashDamage += 25; } },
        { id: 'artillery_module', name: 'ARTILLERY MODULE', requires: ['damage', 'proj_speed'],
          description: '+20% dmg, +20% proj speed', effect: (p) => { p.damage *= 1.2; p.projSpeed *= 1.2; } },
    ];

    // ============================================================
    // UPGRADE GENERATION
    // ============================================================
    function generateOptions(count, currentRound, acquiredUpgrades, playerEvolution) {
        const counts = {};
        acquiredUpgrades.forEach(u => { counts[u.id] = (counts[u.id] || 0) + 1; });

        const pool = ALL_UPGRADES.filter(u => {
            const max = u.maxStacks || 99;
            if ((counts[u.id] || 0) >= max) return false;
            if (u.prereq && !u.prereq.every(reqId => (counts[reqId] || 0) > 0)) return false;
            // Mythic requires at least some evolution progress
            if (u.rarity === 'mythic' && (!playerEvolution || playerEvolution.tier < 2)) return false;
            return true;
        });

        const selected = [];
        const commonWeight = Math.max(10, 55 - currentRound * 2);
        const uncommonWeight = 25;
        const rareWeight = 12 + currentRound * 0.5;
        const epicWeight = 5 + currentRound * 0.3;
        const legendaryWeight = Math.max(0.5, currentRound * 0.4);
        const mythicWeight = currentRound >= 10 ? 1 : 0;
        const cursedWeight = 4;

        const totalWeight = commonWeight + uncommonWeight + rareWeight + epicWeight + legendaryWeight + mythicWeight + cursedWeight;

        const availablePool = [...pool];

                for (let i = 0; i < count; i++) {
            if (availablePool.length === 0) {
                selected.push({
                    id: 'fill_damage_' + i, name: 'Core Boost', category: 'OFFENSE', rarity: 'common', timeCost: 1,
                    description: '+10% damage', tags: ['damage'], effect: (p) => { p.damage *= 1.1; }
                });
                continue;
            }

            let targetRarity;
            // CURSED REALITY MODE OVERRIDE
            if (gameMode === 'cursed') {
                targetRarity = Math.random() < 0.7 ? 'cursed' : 'legendary';
            } else {
                let roll = Math.random() * totalWeight;
                if (roll < commonWeight) targetRarity = 'common';
                else if (roll < commonWeight + uncommonWeight) targetRarity = 'uncommon';
                else if (roll < commonWeight + uncommonWeight + rareWeight) targetRarity = 'rare';
                else if (roll < commonWeight + uncommonWeight + rareWeight + epicWeight) targetRarity = 'epic';
                else if (roll < commonWeight + uncommonWeight + rareWeight + epicWeight + legendaryWeight) targetRarity = 'legendary';
                else if (roll < commonWeight + uncommonWeight + rareWeight + epicWeight + legendaryWeight + mythicWeight) targetRarity = 'mythic';
                else targetRarity = 'cursed';
            }

            let candidates = availablePool.filter(u => u.rarity === targetRarity);
            if (candidates.length === 0) candidates = [...availablePool];

            const chosen = choose(candidates);
            selected.push(chosen);
            const idx = availablePool.indexOf(chosen);
            if (idx > -1) availablePool.splice(idx, 1);
        }
    }

    function apply(upgrade, player) {
        if (upgrade && typeof upgrade.effect === 'function') upgrade.effect(player);
    }

    function applyEvolutionForm(player, branchId, formId) {
        const branch = EVOLUTION_BRANCHES[branchId];
        if (!branch) return;
        const form = branch.forms.find(f => f.id === formId);
        if (!form) return;

        const s = form.stats;
        if (s.maxHpAdd) { player.maxHp += s.maxHpAdd; player.hp = Math.max(1, Math.min(player.maxHp, player.hp + s.maxHpAdd)); }
        if (s.maxShieldAdd) { player.maxShield += s.maxShieldAdd; player.shield += s.maxShieldAdd; }
        if (s.damageMult) player.damage *= s.damageMult;
        if (s.attackSpeedMult) player.attackSpeed *= s.attackSpeedMult;
        if (s.speedMult) player.speed *= s.speedMult;
        if (s.projSpeedMult) player.projSpeed *= s.projSpeedMult;
        if (s.projCount) player.projCount += s.projCount;
        if (s.projSpread) player.projSpread += s.projSpread;
        if (s.projPierce) player.projPierce += s.projPierce;
        if (s.critChance) player.critChance = Math.min(0.8, player.critChance + s.critChance);
        if (s.critDamage) player.critDamage += s.critDamage;
        if (s.dmgReduction) player.dmgReduction = Math.min(0.7, player.dmgReduction + s.dmgReduction);
        if (s.reflectChance) player.reflectChance = Math.min(0.6, player.reflectChance + s.reflectChance);
        if (s.dashMaxCharges) { player.dashMaxCharges += s.dashMaxCharges; player.dashCharges = player.dashMaxCharges; }
        if (s.dashCDMult) player.dashCooldown *= s.dashCDMult;
        if (s.dashDamageAdd) player.dashDamage += s.dashDamageAdd;
        if (s.orbitalBlades) player.orbitalBlades += s.orbitalBlades;
        if (s.orbitalDamageMult) player.orbitalDamage *= s.orbitalDamageMult;
        if (s.droneCount) player.droneCount += s.droneCount;
        if (s.voidDamageAdd) player.voidDamage += s.voidDamageAdd;
        if (s.explosionRadiusAdd) player.explosionRadius += s.explosionRadiusAdd;
        if (s.projExplosive) player.projExplosive = true;
        if (s.afterimages) player.afterimages = true;
        if (s.phantomClones) player.phantomClones = true;
        if (s.rearShieldLevel) player.rearShieldLevel = Math.max(player.rearShieldLevel || 0, s.rearShieldLevel);

        player.evolutionBranch = branchId;
        player.evolutionForm = formId;
        player.evolutionShape = form.shape;
        player.size = form.size;
    }

    return {
        generateOptions, apply, applyEvolutionForm,
        getAllUpgrades: () => ALL_UPGRADES,
        synergies: SYNERGIES,
        evolutionBranches: EVOLUTION_BRANCHES
    };
})();