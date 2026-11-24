/* MLBB Swap Trainer — Official Item Catalog & Simple Mode Tab Ordering
 * Generated from mlbb.io official item database + verified against 1000040726.mp4 Simple Mode layout.
 */
(function (global) {
  'use strict';

  global.MLBB_TABS = ['Recommended', 'Attack', 'Magic', 'Defense', 'Movement'];

  global.MLBB_START_LOADOUT = [
    'arcane_boots',
    'corrosion_scythe',
    'demon_hunter_sword',
    'golden_staff',
    'malefic_gun',
    'rose_gold_meteor'
  ];

  global.MLBB_START_QUICKBUY = 'immortality';
  global.MLBB_START_GOLD = 29764;

  global.MLBB_TAB_ORDER = {
  "Recommended": [
    "immortality",
    "winter_crown",
    "rose_gold_meteor",
    "wind_of_nature",
    "malefic_gun",
    "demon_hunter_sword",
    "corrosion_scythe",
    "golden_staff"
  ],
  "Attack": [
    "demon_hunter_sword",
    "corrosion_scythe",
    "golden_staff",
    "wind_of_nature",
    "war_axe",
    "sky_piercer",
    "fleeting_time",
    "winter_crown",
    "malefic_roar",
    "haas_claws",
    "berserkers_fury",
    "endless_battle",
    "windtalker",
    "blade_of_the_heptaseas",
    "blade_of_despair",
    "hunter_strike",
    "rose_gold_meteor",
    "sea_halberd",
    "great_dragon_spear",
    "malefic_gun",
    "power_potion"
  ],
  "Magic": [
    "enchanted_talisman",
    "feather_of_heaven",
    "clock_of_destiny",
    "sky_piercer",
    "fleeting_time",
    "winter_crown",
    "divine_glaive",
    "holy_crystal",
    "blood_wings",
    "glowing_wand",
    "lightning_truncheon",
    "genius_wand",
    "ice_queen_wand",
    "concentrated_energy",
    "wishing_lantern"
  ],
  "Defense": [
    "blade_armor",
    "queens_wings",
    "thunder_belt",
    "cursed_helmet",
    "guardian_helmet",
    "antique_cuirass",
    "oracle",
    "athenas_shield",
    "immortality",
    "dominance_ice",
    "radiant_armor",
    "brute_force_breastplate"
  ],
  "Movement": [
    "arcane_boots",
    "warrior_boots",
    "tough_boots",
    "swift_boots",
    "magic_shoes",
    "rapid_boots",
    "demon_shoes"
  ]
};

  global.MLBB_ITEMS = {
  "antique_cuirass": {
    "id": "antique_cuirass",
    "name": "Antique Cuirass",
    "shortDesc": "Physical Attack Reduction",
    "price": 2170,
    "sellPrice": 1302,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/antique_cuirass.png",
    "stats": [
      "+924 HP",
      "+40 Physical Defense"
    ],
    "passive": "Unique Passive - Deter: When hit by a skill, reduces the attacker's Physical Damage by 6% for 2 seconds (this effect stacks up to 3 times).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "arcane_boots": {
    "id": "arcane_boots",
    "name": "Arcane Boots",
    "shortDesc": "Magic Penetration",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/arcane_boots.png",
    "stats": [
      "+40 Movement Speed",
      "+15 Magic Power",
      "+10 Magic Penetration"
    ],
    "passive": "",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "athenas_shield": {
    "id": "athenas_shield",
    "name": "Athena's Shield",
    "shortDesc": "Resist Burst Magic Damage",
    "price": 2150,
    "sellPrice": 1290,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/athenas_shield.png",
    "stats": [
      "+902 HP",
      "+48 Magic Defense"
    ],
    "passive": "Unique Passive - Shield: Upon taking Magic Damage from enemy hero skills or Basic Attacks, reduces Magic Damage taken by 25% for 3 second (including the damage that triggers the effect)s. Regains this effect 5 seconds after leaving combat.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "berserkers_fury": {
    "id": "berserkers_fury",
    "name": "Berserker's Fury",
    "shortDesc": "Crit Chance & Damage",
    "price": 2390,
    "sellPrice": 1434,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/berserkers_fury.png",
    "stats": [
      "+65 Physical Attack"
    ],
    "passive": "Unique Attribute: +40% Crit DamageUnique Passive - Doom: Critical strikes grant 5% extra Physical Attack for 2 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "blade_armor": {
    "id": "blade_armor",
    "name": "Blade Armor",
    "shortDesc": "Damage Reflection",
    "price": 1910,
    "sellPrice": 1146,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/blade_armor.png",
    "stats": [
      "+80 Physical Defense"
    ],
    "passive": "Unique Attribute: +20% Crit Damage ReductionUnique Passive - Bladed Armor: When struck by a Basic Attack, deals Physical Damage equal to 30 (+2% Total Physical Defense)% of the incoming damage (calculated before Damage Reduction) to the attacker and slows them by 15% for 1 second.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "blade_of_despair": {
    "id": "blade_of_despair",
    "name": "Blade of Despair",
    "shortDesc": "Highest Physical Attack",
    "price": 3010,
    "sellPrice": 1806,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/blade_of_despair.png",
    "stats": [
      "+160 Physical Attack",
      "+5% Movement Speed"
    ],
    "passive": "Unique Passive - Despair: Dealing damage to non-Minion enemies below 50% HP increases Physical Attack by 25% for 2 seconds (takes effect before the damage is dealt).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "blade_of_the_heptaseas": {
    "id": "blade_of_the_heptaseas",
    "name": "Blade of the Heptaseas",
    "shortDesc": "Best for Assassins",
    "price": 1950,
    "sellPrice": 1170,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/blade_of_the_heptaseas.png",
    "stats": [
      "+70 Physical Attack",
      "+250 HP"
    ],
    "passive": "Unique Attribute: +15 Physical PenetrationUnique Passive - Ambush: If no damage is taken or dealt within 5 seconds (excluding from Minions or Creeps), the next Basic Attack will deal an additional 160 (+40% Total Physical Attack) Physical Damage and slow the target by 40% for 1.5 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "blood_wings": {
    "id": "blood_wings",
    "name": "Blood Wings",
    "shortDesc": "High Magic & Shield",
    "price": 2100,
    "sellPrice": 1260,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/blood_wings.png",
    "stats": [
      "+90 Magic Power"
    ],
    "passive": "Unique Passive - Guard: Gains a 800 (+100% Magic Power) Shield that will regenerate 20 seconds after being damaged. The Shield also grants 30 Movement Speed while it lasts and 150 Movement Speed for 1 second after it breaks.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "brute_force_breastplate": {
    "id": "brute_force_breastplate",
    "name": "Brute Force Breastplate",
    "shortDesc": "Hybrid Mobility & Def",
    "price": 2070,
    "sellPrice": 1242,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/brute_force_breastplate.png",
    "stats": [
      "+800 HP",
      "+20 Physical Defense",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Brute Force: Each second after dealing damage, gain 8 extra Adaptive Attack and 2% extra Movement Speed for 4 seconds, up to 6 stacks. Gain 25% extra Control Duration Reduction at full stacks.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "clock_of_destiny": {
    "id": "clock_of_destiny",
    "name": "Clock of Destiny",
    "shortDesc": "For Magic Tanks",
    "price": 2030,
    "sellPrice": 1218,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/clock_of_destiny.png",
    "stats": [
      "+445 Magic Power",
      "+400 HP",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Destiny: Gains 4.5(+0.5*Hero Level) Hybrid Defense for 5 seconds when dealing Magic Damage to enemy heroes, stacking up to 6 times (can gain 1 stack every 0.4 second). Unique Passive - Gift: When HP drops below 50%, recovers 15% of HP over the next 3 seconds. When Mana drops below 50%, restores 15% of Mana over the next 3 seconds. Cooldown: 60 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "concentrated_energy": {
    "id": "concentrated_energy",
    "name": "Concentrated Energy",
    "shortDesc": "Hybrid Lifesteal",
    "price": 2020,
    "sellPrice": 1212,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/concentrated_energy.png",
    "stats": [
      "+70 Magic Power",
      "+400 HP"
    ],
    "passive": "Unique Attribute: +20% Hybrid LifestealUnique Passive - Recharge: Increases Magic Power by 5 after dealing Magic Damage (this effect stacks up to 6 times and can only gain 1 stack every 0.4 second). When reaching full stacks, increases Magic Damage by 12% for 5 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "corrosion_scythe": {
    "id": "corrosion_scythe",
    "name": "Corrosion Scythe",
    "shortDesc": "On-Hit Slow",
    "price": 2050,
    "sellPrice": 1230,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/corrosion_scythe.png",
    "stats": [
      "+30 Physical Attack",
      "+30% Attack Speed",
      "+5% Movement Speed"
    ],
    "passive": "Unique Passive - Corrosive: Basic Attacks gain 80 extra Physical Damage and slow the target by 8% (halved for ranged Basic Attacks) for 1.5 seconds. Stacks up to 5 times. Unique Passive - Impulse: Basic Attacks grant 6% extra Attack Speed for 3 seconds, capped at 5 stacks.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "cursed_helmet": {
    "id": "cursed_helmet",
    "name": "Cursed Helmet",
    "shortDesc": "Survivability & Lane Clearing",
    "price": 1910,
    "sellPrice": 1146,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/cursed_helmet.png",
    "stats": [
      "+1200 HP",
      "+20 Magic Defense"
    ],
    "passive": "Unique Passive - Burning Soul: Deals (1.2% Total HP) Magic Damage to nearby enemies per second. This damage is increased by 125(+15*Hero Level)% against creeps and minions. Unique Passive - Curse: Dealing damage with Burning Soul will reduce the target's Hybrid Defense by 3 for 3 seconds. Stacks up to 3 times.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "demon_hunter_sword": {
    "id": "demon_hunter_sword",
    "name": "Demon Hunter Sword",
    "shortDesc": "Tank Killer",
    "price": 2180,
    "sellPrice": 1308,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/demon_hunter_sword.png",
    "stats": [
      "+35 Physical Attack",
      "+20% Attack Speed",
      "+8% Lifesteal"
    ],
    "passive": "Unique Passive - Engulf: Basic Attacks deal 8% of the target's current HP as extra physical damage (capped at 60 against minions). Unique Passive - Devour: Basic Attacks grant 2% Lifesteal for 3 seconds (stacks up to 5 times).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "demon_shoes": {
    "id": "demon_shoes",
    "name": "Demon Shoes",
    "shortDesc": "Mana Regen",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/demon_shoes.png",
    "stats": [
      "+10 Magic Power",
      "+40 Movement Speed"
    ],
    "passive": "Unique Passive - Mysticism: Getting a kill or assist on an enemy Minion will restore 4% Mana. (An assist occurs when a Minion dies within 2 seconds after taking damage from the hero.)",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "divine_glaive": {
    "id": "divine_glaive",
    "name": "Divine Glaive",
    "shortDesc": "Magic Penetration",
    "price": 1970,
    "sellPrice": 1182,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/divine_glaive.png",
    "stats": [
      "+65 Magic Power"
    ],
    "passive": "Unique Attribute: +40% Magic PenetrationUnique Passive - Spellbreaker: When attacking an enemy, gains 0.1% extra Magic Penetration for each point of the enemy's Magic Defense, capped at 20%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "dominance_ice": {
    "id": "dominance_ice",
    "name": "Dominance Ice",
    "shortDesc": "Anti-Heal & Slow",
    "price": 2010,
    "sellPrice": 1206,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/dominance_ice.png",
    "stats": [
      "+40 Physical Defense",
      "+40 Magic Defense",
      "+5% Movement Speed"
    ],
    "passive": "Unique Passive - Fortress Shield: For each enemy hero within 5 units, Hybrid Defense is increased by 8, up to 40. Unique Passive - Lifebane: Taking damage will reduce the Shield and HP Regen effects of the attacker to 60% of normal for 1 second.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "enchanted_talisman": {
    "id": "enchanted_talisman",
    "name": "Enchanted Talisman",
    "shortDesc": "Mana Regen & CD Reduction",
    "price": 1870,
    "sellPrice": 1122,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/enchanted_talisman.png",
    "stats": [
      "+50 Magic Power",
      "+250 HP",
      "+20% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Mana Spring: Regenerates 15% of Max Mana every 10 seconds. Unique Passive - Magic Mastery: Max Cooldown Reduction is increased by 5%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "endless_battle": {
    "id": "endless_battle",
    "name": "Endless Battle",
    "shortDesc": "Enhanced Basic Attacks",
    "price": 2330,
    "sellPrice": 1398,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/endless_battle.png",
    "stats": [
      "+60 Physical Attack",
      "+5 Magic Power",
      "+250 HP",
      "+10% Cooldown Reduction",
      "+5% Movement Speed"
    ],
    "passive": "Unique Passive - Divine Justice: After casting a skill, the next Basic Attack within 3 seconds deals (60% Total Physical Attack) extra True Damage and recovers 80 (+40% of Total Physical Attack) HP (1.5 seconds cooldown).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "feather_of_heaven": {
    "id": "feather_of_heaven",
    "name": "Feather of Heaven",
    "shortDesc": "Magic Basic Attacks",
    "price": 2030,
    "sellPrice": 1218,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/feather_of_heaven.png",
    "stats": [
      "+55 Magic Power",
      "+20% Attack Speed",
      "+5% Cooldown Reduction",
      "+10% Lifesteal"
    ],
    "passive": "Unique Passive - Affliction: Each Basic Attack deals extra 50 (+30% Total Magic Power) Magic Damage. Unique Passive - Impulse: Basic Attacks grant 6% extra Attack Speed for 3 seconds, capped at 5 stacks.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "fleeting_time": {
    "id": "fleeting_time",
    "name": "Fleeting Time",
    "shortDesc": "Ultimate CD Reduction",
    "price": 2050,
    "sellPrice": 1230,
    "tab": "Attack",
    "tabs": [
      "Attack",
      "Magic"
    ],
    "icon": "trainer_assets/items/fleeting_time.png",
    "stats": [
      "+30 Adaptive Attack",
      "+600 HP",
      "+15% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Timestream: Hero kills or assists reduce the Ultimate's current cooldown by 30%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "genius_wand": {
    "id": "genius_wand",
    "name": "Genius Wand",
    "shortDesc": "Reduce Magic Defense",
    "price": 2000,
    "sellPrice": 1200,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/genius_wand.png",
    "stats": [
      "+75 Magic Power",
      "+5% Movement Speed"
    ],
    "passive": "Unique Attribute: +10 Magic PenetrationUnique Passive - Magic: Dealing Magic Damage to enemy heroes will reduce their Magic Defense by 3+(0.3*Hero Level) for 2 seconds. Stacks up to 3 times.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "glowing_wand": {
    "id": "glowing_wand",
    "name": "Glowing Wand",
    "shortDesc": "Burn & Anti-Heal",
    "price": 2150,
    "sellPrice": 1290,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/glowing_wand.png",
    "stats": [
      "+75 Magic Power",
      "+400 HP",
      "+5% Movement Speed"
    ],
    "passive": "Unique Passive - Scorch: Dealing Magic Damage burns the targets for 3 seconds, also dealing extra Magic Damage equal to 1% of the target's Max HP per second. Unique Passive - Lifebane: Dealing damage to the target will reduce the Shield and HP Regen effects on them to 60% of normal for 3 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "golden_staff": {
    "id": "golden_staff",
    "name": "Golden Staff",
    "shortDesc": "Enhanced Attack Effects",
    "price": 2000,
    "sellPrice": 1200,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/golden_staff.png",
    "stats": [
      "+55 Physical Attack",
      "+15% Attack Speed"
    ],
    "passive": "Unique Passive - Swift: Every 1% extra Crit Chance gained is converted into 1% extra Attack Speed. Unique Passive - Endless Strike: After every 2 non-Crit Basic Attacks, the Attack Speed of the next Basic Attack is increased by 80% (and Attack Speed cap is increased to 500%) and triggers Attack Effects an additional 2 time(s).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "great_dragon_spear": {
    "id": "great_dragon_spear",
    "name": "Great Dragon Spear",
    "shortDesc": "CD Reduction & Crit",
    "price": 2140,
    "sellPrice": 1284,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/great_dragon_spear.png",
    "stats": [
      "+70 Physical Attack",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Supreme Warrior: After casting an Ultimate, increase Movement Speed by 30% for 7.5 seconds. This effect has a 15 seconds cooldown.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "guardian_helmet": {
    "id": "guardian_helmet",
    "name": "Guardian Helmet",
    "shortDesc": "Constant HP Regen",
    "price": 2500,
    "sellPrice": 1500,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/guardian_helmet.png",
    "stats": [
      "+1820 HP"
    ],
    "passive": "Unique Passive - Recovery: After 5 seconds out of combat, recover (2.5% Total HP) HP per second. Unique Passive - Defender: Upon taking more than 500 damage in a single instance, recover 20 (+0.3% Total HP)% HP from the excess damage beyond that amount.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "haas_claws": {
    "id": "haas_claws",
    "name": "Haas' Claws",
    "shortDesc": "Lifesteal",
    "price": 2020,
    "sellPrice": 1212,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/haas_claws.png",
    "stats": [
      "+40 Physical Attack",
      "+15% Attack Speed"
    ],
    "passive": "Unique Attribute: +20% LifestealUnique Passive - Frenzy: Critical strikes grant 20% extra Attack Speed for 2 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "holy_crystal": {
    "id": "holy_crystal",
    "name": "Holy Crystal",
    "shortDesc": "Max Magic Power",
    "price": 3000,
    "sellPrice": 1800,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/holy_crystal.png",
    "stats": [
      "+185 Magic Power"
    ],
    "passive": "Unique Passive - Mystery: Gains 21%-35% extra Magic Power (scales with level).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "hunter_strike": {
    "id": "hunter_strike",
    "name": "Hunter Strike",
    "shortDesc": "Brief Speed-Up",
    "price": 2010,
    "sellPrice": 1206,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/hunter_strike.png",
    "stats": [
      "+80 Physical Attack",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Attribute: +15 Physical PenetrationUnique Passive - Retribution: Dealing damage to the same enemy hero or creep 5 times in a row grants 50% extra Movement Speed that decays over 3 seconds (8 seconds cooldown).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "ice_queen_wand": {
    "id": "ice_queen_wand",
    "name": "Ice Queen Wand",
    "shortDesc": "Magic Skill Slow",
    "price": 2040,
    "sellPrice": 1224,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/ice_queen_wand.png",
    "stats": [
      "+75 Magic Power",
      "+300 HP",
      "+10% Spell Vamp",
      "+7% Movement Speed"
    ],
    "passive": "Unique Passive - Ice Bound: When a skill deals damage to an enemy hero, it will also slow them by 10% for 2 seconds (stacks up to 3 times). This effect has a 1 second cooldown.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "immortality": {
    "id": "immortality",
    "name": "Immortality",
    "shortDesc": "Resurrection",
    "price": 2120,
    "sellPrice": 1272,
    "tab": "Defense",
    "tabs": [
      "Recommended",
      "Defense"
    ],
    "icon": "trainer_assets/items/immortality.png",
    "stats": [
      "+850 HP",
      "+15 Physical Defense"
    ],
    "passive": "Unique Passive - Immortal: Resurrect 2.5 seconds upon death and gets 16% Max HP and a shield that can absorb 150(+70*Hero Level)damage. Shield lasts 3 seconds. This effect has a 210 seconds cooldown.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "lightning_truncheon": {
    "id": "lightning_truncheon",
    "name": "Lightning Truncheon",
    "shortDesc": "Magic Burst AoE",
    "price": 2250,
    "sellPrice": 1350,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/lightning_truncheon.png",
    "stats": [
      "+475 Magic Power",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Resonate: Every 6 seconds, the next skill echoes, dealing 170 (+85% Magic Power) extra Magic Damage to all enemies in range.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "magic_shoes": {
    "id": "magic_shoes",
    "name": "Magic Shoes",
    "shortDesc": "Cooldown Reduction",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/magic_shoes.png",
    "stats": [
      "+150 HP",
      "+10% Cooldown Reduction",
      "+40 Movement Speed"
    ],
    "passive": "",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "malefic_gun": {
    "id": "malefic_gun",
    "name": "Malefic Gun",
    "shortDesc": "Increase Attack Range",
    "price": 2120,
    "sellPrice": 1272,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/malefic_gun.png",
    "stats": [
      "+40 Physical Attack",
      "+20% Attack Speed"
    ],
    "passive": "Unique Passive - Armor Buster: Increase Physical Penetration by 30%. Unique Passive - Malefic Energy: Increases Basic Attack range by 12%. When hitting a target, gains 10% Movement Speed for 0.5 seconds.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "malefic_roar": {
    "id": "malefic_roar",
    "name": "Malefic Roar",
    "shortDesc": "High Physical Penetration",
    "price": 2060,
    "sellPrice": 1236,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/malefic_roar.png",
    "stats": [
      "+60 Physical Attack"
    ],
    "passive": "Unique Passive - Armor Buster: Increase Physical Penetration by 30%. Unique Passive - Breaker: When attacking an enemy, gains 0.1% extra Physical Penetration for each point of the enemy's Physical Defense, capped at 30%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "oracle": {
    "id": "oracle",
    "name": "Oracle",
    "shortDesc": "Enhanced Regen",
    "price": 1860,
    "sellPrice": 1116,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/oracle.png",
    "stats": [
      "+850 HP",
      "+20 Physical Defense",
      "+20 Magic Defense",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Bless: Received Shield and HP Regen effects are increased by 30%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "power_potion": {
    "id": "power_potion",
    "name": "Power Potion",
    "shortDesc": "Increase Power",
    "price": 1500,
    "sellPrice": 0,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/power_potion.png",
    "stats": [
      "+30 Physical Attack",
      "+15% Lifesteal (120s)"
    ],
    "passive": "Unique Passive - Increase Power: Automatically consumed on purchase. Grants +30 Physical Attack and +15% Lifesteal for 120s.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "queens_wings": {
    "id": "queens_wings",
    "name": "Queen's Wings",
    "shortDesc": "Low-HP Retaliation",
    "price": 2250,
    "sellPrice": 1350,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/queens_wings.png",
    "stats": [
      "+40 Adaptive Attack",
      "+600 HP",
      "+10% Cooldown Reduction",
      "+10% Spell Vamp"
    ],
    "passive": "Unique Passive - Demonize: When HP drops below 40%, gains 30% Damage Reduction for 3 seconds and reduces skill cooldowns by 2 seconds. This effect has a 60 seconds cooldown. Unique Passive - Defiance: For every 1% HP lost, damage is increased by 0.25%, up to 15%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "radiant_armor": {
    "id": "radiant_armor",
    "name": "Radiant Armor",
    "shortDesc": "Continuous Magic Def",
    "price": 1880,
    "sellPrice": 1128,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/radiant_armor.png",
    "stats": [
      "+962 HP",
      "+40 Magic Defense"
    ],
    "passive": "Unique Passive - Holy Blessing: Taking Magic Damage grants 5(+1*Hero Level) Magic Defense for 5 seconds, up to 6 stacks ( can only gain 1 stack(s) every 0.4 seconds).",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "rapid_boots": {
    "id": "rapid_boots",
    "name": "Rapid Boots",
    "shortDesc": "Highest Movement Speed",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/rapid_boots.png",
    "stats": [
      "+12 HP",
      "+65 Movement Speed"
    ],
    "passive": "Unique Passive - Side Effect: Loses 20 Movement Speed for 5 seconds upon dealing or taking damage.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "rose_gold_meteor": {
    "id": "rose_gold_meteor",
    "name": "Rose Gold Meteor",
    "shortDesc": "Low-HP Shield",
    "price": 2030,
    "sellPrice": 1218,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/rose_gold_meteor.png",
    "stats": [
      "+40 Physical Attack",
      "+20% Attack Speed",
      "+10% Lifesteal"
    ],
    "passive": "Unique Passive - Dragon Scale: Every 1% Lifesteal increases Hybrid Defense by 1, up to 50 (effect is halved for non-Fighter heroes). Unique Passive - Lifeline: When taking damage that reduces HP below 30%, gains a (120*Hero Level) shield (increases with level) and 50% Movement Speed that rapidly decays over 3 seconds. This effect has a 60 seconds cooldown.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "sea_halberd": {
    "id": "sea_halberd",
    "name": "Sea Halberd",
    "shortDesc": "Healing Reduction",
    "price": 2050,
    "sellPrice": 1230,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/sea_halberd.png",
    "stats": [
      "+80 Physical Attack",
      "+20% Attack Speed"
    ],
    "passive": "Unique Passive - Lifebane: Dealing damage to a target will reduce the Shield and HP Regen effects on them to 60% of normal for 3 seconds. Unique Passive - Punish: Increase damage by 8% against enemy heroes with higher extra HP.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "sky_piercer": {
    "id": "sky_piercer",
    "name": "Sky Piercer",
    "shortDesc": "Best for Finishers",
    "price": 1500,
    "sellPrice": 900,
    "tab": "Attack",
    "tabs": [
      "Attack",
      "Magic"
    ],
    "icon": "trainer_assets/items/sky_piercer.png",
    "stats": [
      "+60 Adaptive Attack",
      "+15 Movement Speed"
    ],
    "passive": "Unique Passive - Lethality: After dealing damage to an enemy hero, executes the hero if their HP is lower than 4%. Gains 10 stack(s) of Lethality for each kill and loses 30% current stack(s) for each death. Each stack of Lethality increases the HP threshold of the execute effect by 0.1%, stacking up 80 times.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "swift_boots": {
    "id": "swift_boots",
    "name": "Swift Boots",
    "shortDesc": "Attack Speed",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/swift_boots.png",
    "stats": [
      "+15% Attack Speed",
      "+40 Movement Speed"
    ],
    "passive": "",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "thunder_belt": {
    "id": "thunder_belt",
    "name": "Thunder Belt",
    "shortDesc": "Damage for Tanks",
    "price": 1820,
    "sellPrice": 1092,
    "tab": "Defense",
    "tabs": [
      "Defense"
    ],
    "icon": "trainer_assets/items/thunder_belt.png",
    "stats": [
      "+600 HP",
      "+15 Physical Defense",
      "+15 Magic Defense",
      "+20 Movement Speed"
    ],
    "passive": "Unique Passive - Thunderbolt: Every 4 seconds, the next Basic Attack deals 50 (+100% Extra Physical Defense) (+100% Extra Magic Defense) extra True Damage to the target and enemies around them, and briefly slows them by 99%. Hybrid Defense permanently increases by 1 each time the attack hits an enemy hero. (This effect is reduced to 50% for Marksmen and Mages)",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "tough_boots": {
    "id": "tough_boots",
    "name": "Tough Boots",
    "shortDesc": "Magic Def & Resilience",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/tough_boots.png",
    "stats": [
      "+18 Magic Defense",
      "+40 Movement Speed"
    ],
    "passive": "Unique Passive - Fortitude: CC and Slow Duration reduced by 25%.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "war_axe": {
    "id": "war_axe",
    "name": "War Axe",
    "shortDesc": "Continuous Damage Boost",
    "price": 2100,
    "sellPrice": 1260,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/war_axe.png",
    "stats": [
      "+35 Physical Attack",
      "+400 HP",
      "+10% Cooldown Reduction",
      "+12% Spell Vamp"
    ],
    "passive": "Unique Passive - Fighting Spirit: Attacks grants 12 extra Physical Attack per second for 4 seconds, up to 6 stacks. Deals 10% extra True Damage based on the damage dealt (no damage reduction counted) at full stacks. (Marksmen, Mages, and Supports only receive 50% of these stacked effects.)",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "warrior_boots": {
    "id": "warrior_boots",
    "name": "Warrior Boots",
    "shortDesc": "Physical Defense",
    "price": 720,
    "sellPrice": 432,
    "tab": "Movement",
    "tabs": [
      "Movement"
    ],
    "icon": "trainer_assets/items/warrior_boots.png",
    "stats": [
      "+18 Physical Defense",
      "+40 Movement Speed"
    ],
    "passive": "Unique Passive - Valor: Gains 4 extra Physical Defense for 3 seconds when taking Physical Damage, up to 20.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "wind_of_nature": {
    "id": "wind_of_nature",
    "name": "Wind of Nature",
    "shortDesc": "Physical Damage Immunity",
    "price": 1910,
    "sellPrice": 1146,
    "tab": "Attack",
    "tabs": [
      "Recommended",
      "Attack"
    ],
    "icon": "trainer_assets/items/wind_of_nature.png",
    "stats": [
      "+30 Physical Attack",
      "+20% Attack Speed",
      "+10% Lifesteal"
    ],
    "passive": "Unique Active - Wind Chant: Become immune to all Physical Damage for 2 seconds (duration is halved for non-Marksmen; 90 seconds cooldown).",
    "isActive": true,
    "activeName": "Wind Chant",
    "activeIcon": "trainer_assets/items/wind_of_nature.png",
    "activeCd": 70
  },
  "windtalker": {
    "id": "windtalker",
    "name": "Windtalker",
    "shortDesc": "Splash Damage",
    "price": 1880,
    "sellPrice": 1128,
    "tab": "Attack",
    "tabs": [
      "Attack"
    ],
    "icon": "trainer_assets/items/windtalker.png",
    "stats": [
      "+35% Attack Speed",
      "+20 Movement Speed"
    ],
    "passive": "Unique Passive - Typhoon: Every 5\u20132 seconds (reduced by 0.2 seconds for each Basic Attack), the next Basic Attack will hit up to 3 enemy units for 150\u2013362 Magic Damage. (This attack can Crit and the damage increases to 200% against Minions.)",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  },
  "winter_crown": {
    "id": "winter_crown",
    "name": "Winter Crown",
    "shortDesc": "Temporary Invincibility",
    "price": 1910,
    "sellPrice": 1146,
    "tab": "Magic",
    "tabs": [
      "Recommended",
      "Attack",
      "Magic"
    ],
    "icon": "trainer_assets/items/winter_crown.png",
    "stats": [
      "+45 Adaptive Attack",
      "+400 HP",
      "+5% Cooldown Reduction"
    ],
    "passive": "Active Skill - Frozen: Becomes frozen, untargetable, and immune to damage for 2s (100s cooldown). Cannot move or cast skills while frozen, but skills already cast won't be interrupted.",
    "isActive": true,
    "activeName": "Frozen",
    "activeIcon": "trainer_assets/items/skill_frozen.png",
    "activeCd": 100
  },
  "wishing_lantern": {
    "id": "wishing_lantern",
    "name": "Wishing Lantern",
    "shortDesc": "Anti-Tank Magic Damage",
    "price": 2250,
    "sellPrice": 1350,
    "tab": "Magic",
    "tabs": [
      "Magic"
    ],
    "icon": "trainer_assets/items/wishing_lantern.png",
    "stats": [
      "+475 Magic Power",
      "+10% Cooldown Reduction"
    ],
    "passive": "Unique Passive - Butterfly Goddess: For every 800 Magic Damage dealt to an enemy hero (calculated before Damage Reduction), a Butterfly Goddess is summoned to attack the enemy hero, dealing Magic Damage equal to 8% of their Current HP.",
    "isActive": false,
    "activeName": null,
    "activeIcon": null,
    "activeCd": 0
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
