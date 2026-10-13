// ============================================================
// ЯЗЫК ИНТЕРФЕЙСА: русский / английский
// Строки в коде остаются как есть (игровые - на английском, онлайн - на русском).
// I18N.t() переводит строку на выбранный язык. Текст в DOM переводится автоматически
// (MutationObserver), поэтому меню, карточки улучшений, дерево эволюции, лобби и подсказки
// переводятся без правок там, где они создаются. Строки с числами и именами переводятся
// по шаблонам: {0}, {1} - подставляемые части.
// ============================================================
(function () {
    'use strict';

    // ---------- английский -> русский (игра) ----------
    const RU = {
        // главное меню, пауза, итоги
        'v2.0 // EVOLUTION BUILD': 'v2.0 // ЭВОЛЮЦИОННАЯ СБОРКА', 'INITIATE RUN': 'НАЧАТЬ ЗАБЕГ', 'ONLINE': 'ОНЛАЙН', 'PROFILE': 'ПРОФИЛЬ', 'SETTINGS': 'НАСТРОЙКИ',
        'SYSTEM PAUSED': 'ПАУЗА', 'RESUME': 'ПРОДОЛЖИТЬ', 'QUIT TO MENU': 'ВЫЙТИ В МЕНЮ',
        'CYCLE TERMINATED': 'ЦИКЛ ЗАВЕРШЁН', 'REINITIATE': 'ЗАНОВО', 'MAIN MENU': 'ГЛАВНОЕ МЕНЮ',
        'Round': 'Раунд', 'Kills': 'Убийства', 'Level': 'Уровень', 'Time': 'Время', 'Best round': 'Лучший раунд',
        // настройки
        'CONFIGURATION': 'НАСТРОЙКИ', 'Master Volume': 'Общая громкость', 'SFX Volume': 'Громкость эффектов',
        'Screen Shake': 'Тряска экрана', 'Damage Numbers': 'Цифры урона', 'Particles': 'Частицы',
        'High': 'Высокое', 'Medium': 'Среднее', 'Low': 'Низкое', 'Auto': 'Авто',
        'Zoom': 'Масштаб', 'Close': 'Крупно', 'Whole Arena': 'Вся арена', 'Quality': 'Качество графики',
        'Phone Fullscreen': 'Полный экран на телефоне', 'Language': 'Язык', 'BACK': 'НАЗАД',
        // HUD и бой
        'ROUND': 'РАУНД', 'KILLS:': 'УБИЙСТВА:', 'SECONDS': 'СЕКУНД', 'DASH': 'РЫВОК', 'PAUSE': 'ПАУЗА', 'MENU': 'МЕНЮ',
        'DASH READY': 'РЫВОК ГОТОВ', 'DASH {0}s': 'РЫВОК {0} с', 'EP: {0}  [T] TREE': 'EP: {0}  [T] ДЕРЕВО',
        'LV {0}  {1}/{2} XP': 'УР {0}  {1}/{2} XP', 'LEVEL UP': 'НОВЫЙ УРОВЕНЬ', '+KILL': '+УБИЙСТВО',
        'THE COMPILER': 'КОМПИЛЯТОР', 'REDACTOR': 'РЕДАКТОР', 'NULL KING': 'НУЛЕВОЙ КОРОЛЬ',
        // экран улучшений и дерево эволюции
        'SYSTEM UPGRADE DETECTED': 'ДОСТУПНО УЛУЧШЕНИЕ', 'Complete — Next Duration:': 'пройден. Следующий:', 'sec': 'с',
        'EVOLUTION TREE': 'ДЕРЕВО ЭВОЛЮЦИИ',
        'Press 1-6 or click to select. Press T during combat for Evolution Tree': 'Нажмите 1-6 или выберите карту. В бою клавиша T открывает дерево эволюции',
        'EVOLUTION POINTS:': 'ОЧКИ ЭВОЛЮЦИИ:', 'CLOSE': 'ЗАКРЫТЬ',
        'Choose ONE primary branch per run. Click an unlocked form to evolve.': 'За забег выбирается ОДНА ветка. Нажмите на открытую форму, чтобы эволюционировать.',
        'Select ONE primary branch. Hover nodes for details.': 'Выберите ОДНУ ветку. Наведите или нажмите на узел, чтобы увидеть подробности.',
        'Confirm & Close': 'Готово', '{0} - Tier {1}': '{0} - уровень {1}', 'Cost: {0} EP': 'Цена: {0} EP',
        'Commit to {0}? Other branches will lock.': 'Выбрать ветку {0}? Остальные ветки закроются.',
        // редкость и категории карточек
        'common': 'обычное', 'uncommon': 'необычное', 'rare': 'редкое', 'epic': 'эпическое',
        'legendary': 'легендарное', 'cursed': 'проклятое', 'mythic': 'мифическое',
        'WEAPON': 'ОРУЖИЕ', 'ELEMENTAL': 'СТИХИИ', 'OFFENSE': 'АТАКА', 'DEFENSE': 'ЗАЩИТА', 'MOBILITY': 'МОБИЛЬНОСТЬ',
        'UTILITY': 'ПОЛЕЗНОЕ', 'CURSED': 'ПРОКЛЯТОЕ', 'LEGENDARY': 'ЛЕГЕНДАРНОЕ', 'MYTHIC': 'МИФИЧЕСКОЕ',

        // названия улучшений
        'MULTISHOT I': 'МУЛЬТИВЫСТРЕЛ I', 'MULTISHOT II': 'МУЛЬТИВЫСТРЕЛ II', 'MULTISHOT III': 'МУЛЬТИВЫСТРЕЛ III',
        'MULTISHOT IV': 'МУЛЬТИВЫСТРЕЛ IV', 'MULTISHOT V': 'МУЛЬТИВЫСТРЕЛ V',
        'Macro Rounds': 'Крупный калибр', 'Giga Rounds': 'Гига-патроны', 'Velocity Boost': 'Ускорение снарядов',
        'Railgun Rounds': 'Рельсотрон', 'Armor Piercing': 'Бронебойные', 'Through & Through': 'Навылет',
        'Ricochet Rounds': 'Рикошет', 'Pinball Protocol': 'Протокол «Пинбол»', 'Smart Rounds': 'Умные снаряды',
        'Lock-On Protocol': 'Протокол захвата', 'Explosive Rounds': 'Разрывные снаряды', 'Bigger Booms': 'Мощные взрывы',
        'Splitting Rounds': 'Дробящиеся снаряды', 'Boomerang Shots': 'Бумеранг', 'Damaging Trails': 'Жгучий след',
        'Replication': 'Репликация', 'Scatter Shot': 'Веерный залп', 'Circular Burst': 'Круговой залп',
        'Spiral Pattern': 'Спираль', 'Alternating Fire': 'Попеременный огонь', 'Cross Volley': 'Крестовый залп',
        'Burst Fire': 'Очередь', 'Charged Heavy': 'Заряженный выстрел', 'Radial Barrage': 'Радиальный шквал',
        'Orbital Blade': 'Орбитальный клинок', 'Blade Storm': 'Буря клинков', 'Attack Drone': 'Боевой дрон',
        'Chain Lightning': 'Цепная молния', 'Storm Conductor': 'Проводник бури', 'Beam Emitter': 'Лазерный излучатель',
        'Incendiary Rounds': 'Зажигательные патроны', 'Inferno Protocol': 'Протокол «Инферно»', 'Cryo Rounds': 'Крио-патроны',
        'Deep Freeze': 'Глубокая заморозка', 'Toxic Payload': 'Токсичный заряд', 'Virulent Strain': 'Вирулентный штамм',
        'Void Fragments': 'Осколки пустоты', 'Gravity Well': 'Гравитационный колодец', 'Contagion': 'Заражение',
        'Point Blank': 'В упор', 'Sniper Protocol': 'Снайперский протокол', 'First Strike': 'Первый удар',
        'Execution Protocol': 'Протокол казни', 'Overkill Cascade': 'Каскад перебора', 'Momentum': 'Инерция',
        'Bloodlust': 'Жажда крови', 'Rapid Fire': 'Скорострельность', 'Overdrive': 'Форсаж', 'Power Core': 'Силовое ядро',
        'Overcharged Core': 'Перегруженное ядро', 'Maximum Output': 'Максимальная мощность', 'Precision Module': 'Модуль точности',
        'Targeting Array': 'Система наведения', 'Critical Amplifier': 'Усилитель критов', 'Devastation Core': 'Ядро опустошения',
        'Giant Slayer': 'Убийца гигантов', 'Vampiric Rounds': 'Вампирские патроны', 'Blood Siphon': 'Кровавый сифон',
        'REAR GUARD I': 'ТЫЛОВОЙ ЩИТ I', 'REAR GUARD II': 'ТЫЛОВОЙ ЩИТ II', 'REAR GUARD III': 'ТЫЛОВОЙ ЩИТ III',
        'REAR GUARD IV': 'ТЫЛОВОЙ ЩИТ IV', 'REAR GUARD V': 'ТЫЛОВОЙ ЩИТ V',
        'Reinforced Core': 'Укреплённое ядро', 'Titanium Frame': 'Титановый корпус', 'Nanite Repair': 'Ремонт нанитами',
        'Advanced Nanites': 'Продвинутые наниты', 'Energy Shield': 'Энергощит', 'Barrier Generator': 'Генератор барьера',
        'Deflector': 'Дефлектор', 'Hardened Plating': 'Закалённая броня', 'Last Stand': 'Последний рубеж',
        'Overclock': 'Разгон', 'Turbo Boost': 'Турбонаддув', 'Extra Dash': 'Дополнительный рывок',
        'Quick Recovery': 'Быстрое восстановление', 'Dash Strike': 'Удар рывком', 'Ghost Trail': 'Призрачный след',
        'Data Amplifier': 'Усилитель данных', 'Magnetic Field': 'Магнитное поле', 'Glass Cannon': 'Стеклянная пушка',
        'Unstable Core': 'Нестабильное ядро', 'Chaos Engine': 'Двигатель хаоса',
        'STORM ENGINE': 'ДВИГАТЕЛЬ БУРИ', 'DEATH BLOOM': 'ЦВЕТОК СМЕРТИ', 'INFINITE MAGAZINE': 'БЕСКОНЕЧНЫЙ МАГАЗИН',
        'PHANTOM ARSENAL': 'ПРИЗРАЧНЫЙ АРСЕНАЛ', 'VOID COLLAPSE': 'КОЛЛАПС ПУСТОТЫ', 'REFLECTOR PRIME': 'ВЕРХОВНЫЙ ОТРАЖАТЕЛЬ',
        'ORBITAL DOMINION': 'ОРБИТАЛЬНОЕ ГОСПОДСТВО', 'HUNTER PROTOCOL': 'ПРОТОКОЛ ОХОТНИКА', 'LAST FRAME': 'ПОСЛЕДНИЙ КАДР',
        'THE ANNIHILATOR': 'АННИГИЛЯТОР', 'IMMORTAL PROTOCOL': 'ПРОТОКОЛ БЕССМЕРТИЯ', 'SPEED DEMON': 'ДЕМОН СКОРОСТИ',
        'VOID LORD': 'ВЛАДЫКА ПУСТОТЫ', 'TERMINUS': 'ТЕРМИНУС', 'IRON FORTRESS': 'ЖЕЛЕЗНАЯ КРЕПОСТЬ',
        'ELEMENTAL OVERLORD': 'ПОВЕЛИТЕЛЬ СТИХИЙ', 'TITAN CORE': 'ЯДРО ТИТАНА', 'CRIT SOVEREIGN': 'ВЛАСТЕЛИН КРИТОВ',
        'SWARM LORD': 'ВЛАДЫКА РОЯ', 'TEMPEST': 'УРАГАН', 'WORLD FRACTURE': 'РАЗЛОМ МИРА',
        'SINGULARITY CORE': 'ЯДРО СИНГУЛЯРНОСТИ', 'OMNIPRESENT': 'ВЕЗДЕСУЩИЙ', 'INFINITE CASCADE': 'БЕСКОНЕЧНЫЙ КАСКАД',
        'ASCENDANT FORM': 'ВОЗВЫШЕННАЯ ФОРМА', 'REALITY MIRROR': 'ЗЕРКАЛО РЕАЛЬНОСТИ', 'APOCALYPSE PROTOCOL': 'ПРОТОКОЛ АПОКАЛИПСИСА',
        'FINAL EVOLUTION': 'ФИНАЛЬНАЯ ЭВОЛЮЦИЯ', 'THUNDER GOD': 'БОГ ГРОМА', 'OMEGA GLASS CANNON': 'ОМЕГА-ПУШКА',
        'COLLAPSED SINGULARITY': 'СХЛОПНУТАЯ СИНГУЛЯРНОСТЬ', 'PERPETUAL ENGINE': 'ВЕЧНЫЙ ДВИГАТЕЛЬ', 'BLOOD ENGINE': 'КРОВАВЫЙ ДВИГАТЕЛЬ',
        'THERMAL SHOCK': 'ТЕРМОШОК', 'VIRULENT VOID': 'ЗАРАЗНАЯ ПУСТОТА', 'LEAD CURTAIN': 'СВИНЦОВЫЙ ЗАНАВЕС',
        'REFLECTIVE BARRICADE': 'ЗЕРКАЛЬНАЯ БАРРИКАДА', 'VELOCITY FORCE': 'СИЛА СКОРОСТИ', 'COHERENT BEAM': 'КОГЕРЕНТНЫЙ ЛУЧ',
        'TESLA DRONES': 'ДРОНЫ ТЕСЛЫ', 'SPIKED PLATING': 'ШИПАСТАЯ БРОНЯ', 'PHANTOM SLICK': 'ПРИЗРАЧНЫЙ ШЛЕЙФ',
        'ARTILLERY MODULE': 'АРТИЛЛЕРИЙСКИЙ МОДУЛЬ',

        // описания улучшений
        '+1 projectile per attack': '+1 снаряд за атаку',
        '+2 more projectiles (total 4+)': 'Ещё +2 снаряда (всего 4+)',
        '+2 more projectiles, reduced spread': 'Ещё +2 снаряда, меньше разброс',
        '+2 projectiles, extras pierce 1': '+2 снаряда, дополнительные пробивают 1 врага',
        'Central projectile deals +100% damage, +2 proj': 'Центральный снаряд наносит +100% урона, +2 снаряда',
        'Projectiles are 40% larger (easier hits)': 'Снаряды на 40% крупнее (легче попасть)',
        'Projectiles 80% larger, +15% damage': 'Снаряды на 80% крупнее, +15% урона',
        '+25% projectile speed': '+25% скорости снарядов',
        '+50% proj speed, +10% damage': '+50% скорости снарядов, +10% урона',
        'Projectiles pierce 1 enemy': 'Снаряды пробивают 1 врага',
        'Pierce +2 more enemies': 'Пробивание ещё +2 врагов',
        'Projectiles bounce to 1 nearby enemy': 'Снаряды отскакивают к 1 ближайшему врагу',
        '+3 ricochets': '+3 рикошета',
        'Projectiles home toward enemies': 'Снаряды наводятся на врагов',
        'Strong projectile homing': 'Сильное самонаведение снарядов',
        'Projectiles explode on impact (50px)': 'Снаряды взрываются при попадании (50 px)',
        '+30px explosion radius': '+30 px к радиусу взрыва',
        'Projectiles split into 3 on first hit': 'При первом попадании снаряд делится на 3',
        'Projectiles return to player after 1s': 'Снаряды возвращаются к игроку через 1 с',
        'Projectiles leave damaging trails': 'Снаряды оставляют жгучий след',
        'Projectiles duplicate on enemy kills (20% chance)': 'Снаряды удваиваются при убийстве (шанс 20%)',
        '+3 projectiles, +30° spread, -20% ATK speed': '+3 снаряда, +30° разброса, -20% скорости атаки',
        'Every 3s fire 8 projectiles in all directions': 'Каждые 3 с 8 снарядов во все стороны',
        'Projectiles rotate in spiral pattern': 'Снаряды летят по спирали',
        'Alternate shots from left/right of player': 'Выстрелы попеременно слева и справа',
        'Also fire 4 projectiles in cross pattern': 'Дополнительно 4 снаряда крестом',
        'Fire 3 rapid shots then pause briefly': 'Очередь из 3 выстрелов, затем короткая пауза',
        'Every 5th shot deals 300% damage': 'Каждый 5-й выстрел наносит 300% урона',
        'Every 5s fire 16 projectiles radially': 'Каждые 5 с 16 снарядов по кругу',
        'Energy blade orbits you': 'Энергоклинок вращается вокруг вас',
        '+2 orbital blades, +50% blade damage': '+2 орбитальных клинка, +50% урона клинков',
        'Deploy autonomous drone': 'Автономный дрон-помощник',
        'Hits chain to 2 enemies': 'Попадания перескакивают на 2 врагов',
        '+3 chain targets': '+3 цели для цепи',
        'Shots become piercing lasers': 'Выстрелы становятся пробивающими лазерами',
        '20% ignite chance': '20% шанс поджечь', '+30% ignite chance': '+30% шанс поджечь',
        '15% freeze chance': '15% шанс заморозить', '+25% freeze chance': '+25% шанс заморозить',
        '20% poison chance': '20% шанс отравить', '+30% poison chance': '+30% шанс отравить',
        'Hits pull enemies': 'Попадания притягивают врагов',
        'Strong gravitational pull, +20px AoE': 'Сильное притяжение, +20 px к области',
        'Status effects spread to nearby enemies': 'Эффекты переходят на соседних врагов',
        '+50% damage within 150px': '+50% урона в радиусе 150 px',
        '+50% damage beyond 400px': '+50% урона дальше 400 px',
        '+40% damage to full-HP enemies': '+40% урона по врагам с полным HP',
        '+50% damage below 30% HP': '+50% урона по врагам ниже 30% HP',
        'Excess damage carries to nearest enemy': 'Лишний урон переходит на ближайшего врага',
        'Consecutive hits increase ATK speed (max +40%)': 'Попадания подряд ускоряют атаку (до +40%)',
        'Kills grant +20% ATK speed for 3s': 'Убийство даёт +20% скорости атаки на 3 с',
        '+20% attack speed': '+20% скорости атаки', '+35% attack speed': '+35% скорости атаки',
        '+15% damage': '+15% урона', '+30% damage': '+30% урона', '+50% damage': '+50% урона',
        '+8% crit chance': '+8% шанса крита', '+15% crit chance': '+15% шанса крита',
        '+50% crit damage': '+50% урона крита', '+100% crit damage': '+100% урона крита',
        '+30% damage to elites/bosses': '+30% урона по элите и боссам',
        'Heal 1 HP per kill': '+1 HP за убийство', 'Heal 3 HP per kill': '+3 HP за убийство',
        'Triangular rear shield blocks projectiles from behind': 'Треугольный щит сзади блокирует снаряды',
        'Rear shield reflects blocked projectiles': 'Тыловой щит отражает заблокированные снаряды',
        'Wider rear shield, +50% reflected damage': 'Тыловой щит шире, +50% урона отражённых снарядов',
        'Reflected projectiles pierce enemies': 'Отражённые снаряды пробивают врагов',
        'Reflections trigger shockwave AoE damage': 'Отражение вызывает ударную волну',
        '+25 max HP, heal full': '+25 к макс. HP, полное лечение',
        '+50 max HP, +5% DR': '+50 к макс. HP, +5% снижения урона',
        'Regen 2 HP/s': 'Регенерация 2 HP/с', 'Regen 5 HP/s': 'Регенерация 5 HP/с',
        '+30 shield': '+30 щита', '+60 shield': '+60 щита',
        '15% reflect chance': '15% шанс отразить', '+8% damage reduction': '+8% снижения урона',
        'Survive fatal hit at 15% HP (once)': 'Пережить смертельный удар с 15% HP (один раз)',
        '+15% movement speed': '+15% скорости движения', '+25% speed': '+25% скорости',
        '+1 dash charge': '+1 заряд рывка', '-20% dash cooldown': '-20% перезарядки рывка',
        'Dash deals 25 damage': 'Рывок наносит 25 урона',
        'Phantom afterimages while moving': 'Фантомные образы при движении',
        '+25% XP': '+25% опыта', '+40% pickup radius': '+40% радиуса подбора',
        '+100% damage, max HP = 50': '+100% урона, макс. HP = 50',
        '+80% ATK speed, +60% dmg, -30% HP': '+80% скорости атаки, +60% урона, -30% HP',
        '+200% dmg, +100% ATK speed, HP = 30': '+200% урона, +100% скорости атаки, HP = 30',
        'Every 4th attack triggers chain lightning burst': 'Каждая 4-я атака выпускает цепную молнию',
        'Killed enemies explode (can chain)': 'Убитые враги взрываются (цепочкой)',
        'Each attack temporarily adds projectile (stacks to +5)': 'Каждая атака временно добавляет снаряд (до +5)',
        'Dash releases fan of spectral projectiles': 'Рывок выпускает веер призрачных снарядов',
        'Every 10s create black hole pulling enemies': 'Каждые 10 с чёрная дыра притягивает врагов',
        'Reflected projectiles +200% dmg, pierce 3': 'Отражённые снаряды: +200% урона, пробивают 3',
        '+4 orbital blades, 2x orbital damage': '+4 орбитальных клинка, урон клинков x2',
        'Consecutive hits on target +15% dmg (stacks)': 'Попадания подряд по цели: +15% урона (копится)',
        'Lethal hit triggers 2s invuln + heal (60s CD)': 'Смертельный удар даёт 2 с неуязвимости и лечение (раз в 60 с)',
        '+5 proj, +5 pierce, +100% dmg, +50% proj speed': '+5 снарядов, +5 пробивания, +100% урона, +50% скорости снарядов',
        '+200 HP, +10 regen, +100 shield, emergency survival': '+200 HP, +10 регенерации, +100 щита, спасение от смерти',
        '+100% speed, +3 dash, dash deals 80 dmg': '+100% скорости, +3 рывка, рывок наносит 80 урона',
        'Strong gravity, massive explosions, +3 orbitals': 'Сильная гравитация, мощные взрывы, +3 клинка',
        'All proj: ricochet 3, pierce 3, chain 3': 'Все снаряды: рикошет 3, пробивание 3, цепь 3',
        '+300 HP, +200 shield, +40% DR, +30% reflect, -30% speed': '+300 HP, +200 щита, +40% снижения урона, +30% отражения, -30% скорости',
        '+40% fire/ice/poison chances, status spread': '+40% к шансам огня, льда и яда, эффекты распространяются',
        '+300 HP, dmg scales with max HP (1 dmg per 10 HP)': '+300 HP, урон растёт от макс. HP (1 урона за 10 HP)',
        '+40% crit, +200% crit dmg, crits explode': '+40% крита, +200% урона крита, криты взрываются',
        '+5 drones, +4 orbitals, drones +100% dmg': '+5 дронов, +4 клинка, дроны +100% урона',
        '+6 proj, radial barrage, circular burst, +50% ATK speed': '+6 снарядов, радиальный шквал, круговой залп, +50% скорости атаки',
        'Every 15s distort arena, massive AoE damage': 'Каждые 15 с искажает арену, огромный урон по области',
        'Constant gravity pulls nearby enemies to you': 'Постоянная гравитация тянет врагов к вам',
        '2 echo copies mirror your attacks': '2 эхо-копии повторяют ваши атаки',
        'Kills cause chained explosions (up to 5)': 'Убийства вызывают цепь взрывов (до 5)',
        'Every 20s empower form: +200% dmg, +50% speed for 5s': 'Каждые 20 с усиление: +200% урона, +50% скорости на 5 с',
        '50% reflect, reflected proj deal 300%': '50% отражения, отражённые снаряды наносят 300%',
        'Combat charges massive AoE blast (release at full)': 'Бой заряжает мощный взрыв по области (срабатывает при полном заряде)',
        'All stats +50%, unlocks evolution-specific ultimate': 'Все характеристики +50%, открывает высшую способность эволюции',
        'Kills chain lightning': 'Убийства выпускают цепную молнию', '+150% crit dmg': '+150% урона крита',
        '+30 explosion radius': '+30 к радиусу взрыва', 'Kills reset dash CD': 'Убийства сбрасывают перезарядку рывка',
        'Heal more on kills': 'Больше лечения за убийства', 'Combo damage +15%': 'Урон комбо +15%',
        'Poison spreads via void': 'Яд распространяется через пустоту', 'Projectile wall': 'Стена снарядов',
        '+20% reflect': '+20% отражения', 'Dash damage +35': 'Урон рывка +35', 'Beam crits': 'Криты лазера',
        'Drones shock': 'Дроны бьют током', 'Thorns': 'Шипы', 'Dash shockwave': 'Ударная волна от рывка',
        '+20% dmg, +20% proj speed': '+20% урона, +20% скорости снарядов',

        // ветки и формы эволюции
        'ASSAULT': 'НАТИСК', 'Offensive evolution. High damage, aggressive geometry.': 'Атакующая эволюция. Высокий урон, агрессивная форма.',
        'CORE': 'ЯДРО', 'Starting form.': 'Начальная форма.',
        'STRIKER': 'УДАРНИК', 'Sharpened arrow. +30% damage, +15% proj speed.': 'Заострённая стрела. +30% урона, +15% скорости снарядов.',
        'REAPER': 'ЖНЕЦ', 'Twin-blade predator. +50% damage, +15% crit, +2 proj.': 'Хищник с двумя лезвиями. +50% урона, +15% крита, +2 снаряда.',
        'ANNIHILATOR': 'АННИГИЛЯТОР', 'Final offensive form. +100% damage, +2 proj, pierce +2.': 'Высшая атакующая форма. +100% урона, +2 снаряда, пробивание +2.',
        'BULWARK': 'ОПЛОТ', 'Defensive evolution. Armor, shields, reflection.': 'Защитная эволюция. Броня, щиты, отражение.',
        'GUARDIAN': 'СТРАЖ', 'Hexagonal shell. +50 HP, +10% DR.': 'Шестигранная оболочка. +50 HP, +10% снижения урона.',
        'BASTION': 'БАСТИОН', 'Layered armor. +100 HP, +60 shield, +15% reflect.': 'Многослойная броня. +100 HP, +60 щита, +15% отражения.',
        'AEGIS': 'ЭГИДА', 'Fortress form. +200 HP, +120 shield, +25% DR, auto rear shield.': 'Форма-крепость. +200 HP, +120 щита, +25% снижения урона, тыловой щит.',
        'PHANTOM': 'ФАНТОМ', 'Mobility evolution. Speed, dashes, afterimages.': 'Эволюция мобильности. Скорость, рывки, остаточные образы.',
        'WRAITH': 'ПРИЗРАК', 'Streamlined. +25% speed, -15% dash CD.': 'Обтекаемая форма. +25% скорости, -15% перезарядки рывка.',
        'SPECTER': 'СПЕКТР', 'Split silhouette. +40% speed, +2 dash charges, dash damages.': 'Раздвоенный силуэт. +40% скорости, +2 заряда рывка, рывок наносит урон.',
        'AFTERIMAGE': 'ОСТАТОЧНЫЙ ОБРАЗ', 'Multiphase. +70% speed, +3 dash charges, phantom clones attack.': 'Многофазная форма. +70% скорости, +3 заряда рывка, атакуют фантомные клоны.',
        'SWARM': 'РОЙ', 'Multi-component evolution. Orbitals, drones.': 'Составная эволюция. Орбитальные клинки, дроны.',
        'SPLIT CORE': 'РАСЩЕПЛЁННОЕ ЯДРО', 'Fragmented. +1 orbital blade, +1 drone.': 'Раздроблённая форма. +1 орбитальный клинок, +1 дрон.',
        'HIVE': 'УЛЕЙ', 'Nested cluster. +2 orbitals, +2 drones, +25% ATK speed.': 'Вложенный кластер. +2 клинка, +2 дрона, +25% скорости атаки.',
        'SINGULARITY SWARM': 'РОЙ СИНГУЛЯРНОСТИ', 'Autonomous collective. +3 orbitals, +3 drones, +50% ATK speed.': 'Автономный коллектив. +3 клинка, +3 дрона, +50% скорости атаки.',
        'VOID': 'ПУСТОТА', 'Corruption evolution. Gravity, instability, high risk/reward.': 'Эволюция порчи. Гравитация, нестабильность, высокий риск и награда.',
        'FRACTURED': 'РАСКОЛОТЫЙ', 'Reality cracks. Void dmg, +25% damage, -10 HP.': 'Трещины реальности. Урон пустотой, +25% урона, -10 HP.',
        'ABERRATION': 'АБЕРРАЦИЯ', 'Reality-bent. Strong pull, +50% damage, +40 explosion radius.': 'Искажённая реальность. Сильное притяжение, +50% урона, +40 к радиусу взрыва.',
        'NULL ENTITY': 'НУЛЕВАЯ СУЩНОСТЬ', 'Beyond form. +100% damage, massive gravity, explosions enlarged.': 'За пределами формы. +100% урона, мощная гравитация, увеличенные взрывы.'
    };

    // ---------- русский -> английский (онлайн, профиль, сообщения) ----------
    const EN = {
        'Поверните телефон горизонтально': 'Rotate your phone to landscape',
        'Вход по логину и паролю, почта не нужна': 'Sign in with a login and password, no email needed',
        'Логин (латиница, цифры, _)': 'Login (Latin letters, digits, _)', 'Пароль (от 6 символов)': 'Password (6+ characters)',
        'Ваш ник': 'Your nickname', 'КОД': 'CODE',
        'ВОЙТИ': 'ENTER', 'РЕГИСТРАЦИЯ': 'REGISTER', 'ИГРАТЬ КАК ГОСТЬ': 'PLAY AS GUEST', 'Логин:': 'Login:',
        'гость': 'guest', 'хост': 'host', 'вы': 'you', 'нет связи': 'offline',
        'Гостевой аккаунт: прогресс не сохраняется. Зарегистрируйтесь, чтобы он сохранялся.': 'Guest account: progress is not saved. Register to keep it.',
        'ВЫЙТИ ИЗ АККАУНТА': 'SIGN OUT', 'НАЗАД': 'BACK', 'Режим новой комнаты': 'New room mode',
        'КООПЕРАТИВ': 'CO-OP', 'СОЗДАТЬ КОМНАТУ': 'CREATE ROOM', 'Войти по коду': 'Join by code', 'ЛОББИ': 'LOBBY',
        'Код комнаты (нажмите, чтобы скопировать)': 'Room code (tap to copy)', 'Игроки': 'Players', 'СТАРТ': 'START',
        'ПОКИНУТЬ КОМНАТУ': 'LEAVE ROOM', 'ВСЕХ В ЛОББИ': 'EVERYONE TO LOBBY', 'Аккаунт': 'Account',
        'не выполнен вход': 'not signed in', 'ОЖИДАНИЕ ДРУГИХ ИГРОКОВ…': 'WAITING FOR OTHER PLAYERS…',
        'Вместе против волн врагов. Опыт общий. Погибшие возвращаются в следующем раунде.': 'Together against waves of enemies. Shared XP. Fallen players return next round.',
        'Все против всех: 5 раундов по 30 секунд. Побеждает тот, у кого больше убийств.': 'Free for all: 5 rounds of 30 seconds. Most kills wins.',
        '{0} (гость)': '{0} (guest)', 'Возвращаем в комнату {0}': 'Returning to room {0}',
        'Онлайн недоступен: Firebase не загрузился (нет интернета или сайт открыт как файл)': 'Online unavailable: Firebase failed to load (no internet, or the page is opened as a file)',
        'Подключение к серверу...': 'Connecting to server...', 'Войдите, чтобы играть онлайн': 'Sign in to play online',
        'Аккаунт создан': 'Account created', 'Ник сохранён': 'Nickname saved', 'Свободно мест: {0}': 'Free slots: {0}',
        'СТАРТ ({0}/{1})': 'START ({0}/{1})',
        'Нужно минимум {0} игрока. Отправьте друзьям код {1}': 'At least {0} players needed. Send your friends the code {1}',
        'Все готовы? Жмите «Старт»': 'Everyone ready? Press Start', 'Ждём, когда хост нажмёт «Старт»': 'Waiting for the host to press Start',
        'Код скопирован: {0}': 'Code copied: {0}', 'Код: {0}': 'Code: {0}',
        'Хост потерял связь. Ждём до 20 секунд': 'Host lost connection. Waiting up to 20 seconds',
        'Хост не вернулся — комната закрыта': 'Host did not return. Room closed',
        // ошибки входа и комнат
        'Логин занят': 'Login is taken', 'Неверный логин или пароль': 'Wrong login or password', 'Нет связи': 'No connection',
        'Слишком много попыток. Подождите минуту': 'Too many attempts. Wait a minute',
        'Пароль слишком простой (минимум 6 символов)': 'Password is too weak (at least 6 characters)',
        'Вход гостем не включён в Firebase (Authentication, вкладка Sign-in method, способ Anonymous)': 'Guest sign-in is not enabled in Firebase (Authentication, Sign-in method tab, Anonymous)',
        'Этот способ входа не включён в консоли Firebase': 'This sign-in method is not enabled in the Firebase console',
        'Нет доступа (permission-denied): опубликуйте правила из папки firebase/ в консоли Firebase': 'Access denied (permission-denied): publish the rules from the firebase/ folder in the Firebase console',
        'Ошибка: {0}': 'Error: {0}', 'Логин: 3–16 символов, только латиница, цифры и _': 'Login: 3-16 characters, Latin letters, digits and _ only',
        'Пароль: минимум 6 символов': 'Password: at least 6 characters', 'Ник: 3–16 символов (буквы, цифры, _)': 'Nickname: 3-16 characters (letters, digits, _)',
        'Сначала войдите': 'Sign in first', 'Вы не в комнате': 'You are not in a room',
        'Не удалось занять место в комнате': 'Could not take a slot in the room',
        'Не удалось создать комнату, попробуйте ещё раз': 'Could not create a room, please try again',
        'Код комнаты: 6 символов': 'Room code: 6 characters', 'Комната не найдена': 'Room not found', 'Комната закрыта': 'Room is closed',
        'Матч уже идёт — дождитесь конца': 'The match is already running. Wait for it to end',
        'Комната заполнена ({0}/{1})': 'Room is full ({0}/{1})', 'Хост покинул игру — комната закрыта': 'The host left. Room closed',
        'Начать игру может только хост': 'Only the host can start the game', 'Нужно минимум {0} игрока': 'At least {0} players needed',
        // сетевой матч
        'ПОБЕДА': 'VICTORY', 'МАТЧ ОКОНЧЕН': 'MATCH OVER', 'КОМАНДА ПОГИБЛА': 'TEAM WIPED OUT',
        'Раундов сыграно': 'Rounds played', 'Раунд': 'Round', 'Убийств командой': 'Team kills', '{0} (вы)': '{0} (you)',
        '{0} убийств, LV {1}': '{0} kills, LV {1}', '{0} уб., LV {1}': '{0} kills, LV {1}', '{0} уб.': '{0} kills',
        'Ждём, когда хост вернёт всех в лобби…': 'Waiting for the host to return everyone to the lobby…',
        'Готовы: {0}/{1}': 'Ready: {0}/{1}', 'PVP, РАУНД {0}/{1}': 'PVP, ROUND {0}/{1}',
        'ВЫ ПОГИБЛИ': 'YOU DIED', 'Возрождение через {0} с': 'Respawn in {0} s',
        'Вы вернётесь в следующем раунде, если команда выживет': 'You will return next round if your team survives'
    };

    // ---------- движок ----------
    function compile(dict) {
        const exact = new Map(), pats = [];
        for (const k in dict) {
            const holes = k.match(/\{\d\}/g);
            if (!holes) { exact.set(k, dict[k]); continue; }
            const re = new RegExp('^' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{\d\\\}/g, '(.+?)') + '$');
            pats.push({ re, order: holes.map(h => +h[1]), out: dict[k] });
        }
        return { exact, pats };
    }
    const TABLES = { ru: compile(RU), en: compile(EN) };
    const KEY = 'zero30_lang';
    const HAS_LETTERS = /[A-Za-zА-Яа-яЁё]/;

    let lang = (() => {
        try { const v = localStorage.getItem(KEY); if (v === 'ru' || v === 'en') return v; } catch (e) {}
        return /^(ru|be|uk|kk)/i.test((navigator.languages && navigator.languages[0]) || navigator.language || '') ? 'ru' : 'en';
    })();

    function tCore(s) {
        if (!HAS_LETTERS.test(s)) return s;
        const tb = TABLES[lang];
        const v = tb.exact.get(s);
        if (v !== undefined) return v;
        for (const p of tb.pats) {
            const m = p.re.exec(s);
            if (!m) continue;
            let out = p.out;
            p.order.forEach((n, i) => { out = out.replace('{' + n + '}', tCore(m[i + 1])); });
            return out;
        }
        return s;
    }
    function t(s) {
        if (s === null || s === undefined) return s;
        s = String(s);
        const core = s.trim();
        if (!core) return s;
        const out = tCore(core);
        if (out === core) return s;
        const lead = s.slice(0, s.indexOf(core)), trail = s.slice(s.indexOf(core) + core.length);
        return lead + out + trail;
    }

    // ---------- перевод DOM ----------
    const SKIP = 'script,style,canvas,[data-noi18n],.lp-name,.mp-name,.lobby-code,#profName,.game-title,#selLang';
    const memo = new WeakMap(); // текстовый узел -> { src, out }
    function skipped(node) { const el = node.nodeType === 1 ? node : node.parentElement; return !el || !!el.closest(SKIP); }
    function trText(node) {
        const cur = node.nodeValue;
        if (!cur || !HAS_LETTERS.test(cur) || skipped(node)) return;
        const m = memo.get(node);
        const src = (m && m.out === cur) ? m.src : cur;
        const out = t(src);
        memo.set(node, { src, out });
        if (out !== cur) node.nodeValue = out;
    }
    function trAttrs(el) {
        if (!el.querySelectorAll) return;
        const list = el.matches && el.matches('[placeholder]') ? [el] : [];
        el.querySelectorAll('[placeholder]').forEach(x => list.push(x));
        for (const x of list) {
            if (x.dataset.i18nPh === undefined) x.dataset.i18nPh = x.getAttribute('placeholder');
            const v = t(x.dataset.i18nPh);
            if (x.getAttribute('placeholder') !== v) x.setAttribute('placeholder', v);
        }
    }
    function trTree(root) {
        if (!root) return;
        if (root.nodeType === 3) { trText(root); return; }
        if (root.nodeType !== 1 || skipped(root)) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let n; while ((n = walker.nextNode())) trText(n);
        trAttrs(root);
    }
    function apply() { trTree(document.body); document.documentElement.lang = lang; }

    let observer = null;
    function watch() {
        if (observer || typeof MutationObserver === 'undefined' || !document.body) return;
        observer = new MutationObserver((records) => {
            for (const r of records) {
                if (r.type === 'characterData') trText(r.target);
                else for (const n of r.addedNodes) trTree(n);
            }
        });
        observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    }

    function setLang(l) {
        if (l !== 'ru' && l !== 'en') return;
        lang = l;
        try { localStorage.setItem(KEY, l); } catch (e) {}
        apply();
        const sel = document.getElementById('selLang'); if (sel && sel.value !== l) sel.value = l;
        window.dispatchEvent(new Event('langchange'));
    }

    function init() {
        apply(); watch();
        const sel = document.getElementById('selLang');
        if (sel) { sel.value = lang; sel.addEventListener('change', () => setLang(sel.value)); }
    }

    window.I18N = { t, setLang, apply, get lang() { return lang; } };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
