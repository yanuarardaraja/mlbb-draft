// ==== DATA REFERENSI: EMBLEM, TALENT, SPELL, ITEM ====
// Basis: patch ~2.1.8x (Juli 2026)

const EMBLEMS = {
  "Tank":     { base: "+500 HP, +10 Hybrid Defense, +4 HP Regen" },
  "Assassin": { base: "+14 Adaptive Pen, +10 Adaptive Attack, +3% Move Speed" },
  "Mage":     { base: "+30 Magic Power, +8 Magic Pen, +5% CDR" },
  "Fighter":  { base: "+16 Adaptive Attack, +10% Hybrid Lifesteal, +8 Hybrid Defense" },
  "Marksman": { base: "+15% Attack Speed, +16 Adaptive Attack, +10 Adaptive Pen" },
  "Support":  { base: "+12% Healing Effect, +10% CDR, +6% Move Speed" },
  "Common":   { base: "+275 HP, +22 Adaptive Attack, +12 Hybrid Regen" }
};

const TALENTS = {
  // Tier 1
  "Thrill":            { t: 1, e: "+16 Adaptive Attack" },
  "Swift":             { t: 1, e: "+10% Attack Speed" },
  "Vitality":          { t: 1, e: "+225 Max HP" },
  "Firmness":          { t: 1, e: "+8 Physical & Magic Defense" },
  "Agility":           { t: 1, e: "+4% Move Speed" },
  "Rupture":           { t: 1, e: "+5 Adaptive Penetration" },
  "Inspire":           { t: 1, e: "+5% CDR, +2 Mana Regen" },
  "Fatal":             { t: 1, e: "+5% Crit Chance, +5% Crit Damage" },
  // Tier 2
  "Weapon Master":     { t: 2, e: "Attack/Magic Power dari item, emblem & skill +8%" },
  "Pull Yourself Together": { t: 2, e: "CD battle spell & active item -12%" },
  "Festival of Blood": { t: 2, e: "+6% Spell Vamp, +0.5% per kill/assist (max 12 stack)" },
  "Bargain Hunter":    { t: 2, e: "Harga item -5% (spike item lebih cepat)" },
  "Tenacity":          { t: 2, e: "+5% Damage Reduction saat HP < 50%" },
  "Wilderness Blessing": { t: 2, e: "+10% Move Speed di river & jungle (rotasi cepat)" },
  "Master Assassin":   { t: 2, e: "+7% damage ke musuh yang sendirian" },
  "Seasoned Hunter":   { t: 2, e: "+15% damage ke Lord/Turtle" },
  // Tier 3 (Core)
  "Killing Spree":     { t: 3, e: "Serang hero <30% HP: pulih 15% lost HP + 20% MS; reset tiap kill" },
  "Weakness Finder":   { t: 3, e: "Basic attack: slow 50% + potong attack speed musuh 30% (1s)" },
  "Impure Rage":       { t: 3, e: "Damage skill +4% Max HP musuh (adaptive) + pulih mana" },
  "Lethal Ignition":   { t: 3, e: "3x hit >7% HP musuh dalam 5s → bakar 162-750 adaptive dmg" },
  "Quantum Charge":    { t: 3, e: "Basic attack: +30% MS 1.5s + pulih 75-180 HP" },
  "Temporal Reign":    { t: 3, e: "Habis ulti: CD skill lain jalan 1.5x lebih cepat 4s" },
  "Brave Smite":       { t: 3, e: "Damage skill ke hero: pulih 5% Max HP (CD 6s)" },
  "Focusing Mark":     { t: 3, e: "Musuh yang lu serang: tim lu deal +6% damage ke dia" },
  "Concussive Blast":  { t: 3, e: "Basic attack berikutnya: AoE magic dmg 100 + 7% Total HP" },
  "War Cry":           { t: 3, e: "Hit hero 3x → semua damage +8% selama 6s" }
};

const SPELLS = {
  "Retribution": "True dmg gede ke creep + akses jungle blessing (Ice/Flame/Behemoth Hunter's)",
  "Execute":     "True damage 100+10/lvl +13% lost HP target — finisher, nembus shield",
  "Flicker":     "Blink instan — escape/gap close paling fleksibel",
  "Purify":      "Hapus semua CC + imun 1.2s + 15% MS — jawaban lawan lockdown",
  "Aegis":       "Shield 750+90/lvl (5s) — nahan satu burst combo",
  "Sprint":      "+50% MS + imun slow — kabur/kejar",
  "Inspire":     "8 basic attack berikutnya attack speed x1.5",
  "Vengeance":   "-35% damage diterima + reflect 35% (3s) — buat frontliner",
  "Petrify":     "AoE stun 0.8s + slow — engage/peel",
  "Flameshot":   "Poke jarak jauh + knockback musuh deket — peel assassin",
  "Revitalize":  "Area heal ~2.5% Max HP/0.4s + boost shield/regen 25%",
  "Arrival":     "Teleport ke turret/ally building — split push"
};

const BLESSINGS = {
  "Ice Hunter's":      "Advanced Retribution: true dmg + curi Move Speed musuh 4 detik — nempel hero licin",
  "Flame Hunter's":    "Advanced Retribution: true dmg + curi Physical & Magic Attack 4 detik — menang duel",
  "Behemoth Hunter's": "Advanced Retribution: true dmg + curi HP (scaling bonus HP lu) — jungler tanky. Dulu: Bloody Retribution"
};

const ROAM = {
  "Conceal":   "Camo 5s + MS buat tim — engage/pickoff",
  "Encourage": "Buff attack & attack speed tim — teamfight 5v5",
  "Favor":     "Heal/shield lu juga regen ally ter-lemah — buat healer",
  "Dire Hit":  "Stack Force selama gerak → Move Speed + bonus damage basic attack — roam agresif"
};

// cat: atk | mag | def | boot
const ITEMS = {
  // ---- BOOTS ----
  "Warrior Boots":  { c:"boot", e:"+22 Phys Def — lawan dominan fisik" },
  "Tough Boots":    { c:"boot", e:"+22 Magic Def + CC duration -30% — lawan CC/magic" },
  "Magic Shoes":    { c:"boot", e:"+10% CDR — spam skill" },
  "Arcane Boots":   { c:"boot", e:"+10 Magic Pen — damage mage dari early" },
  "Swift Boots":    { c:"boot", e:"+15% Attack Speed — MM basic attack" },
  "Demon Shoes":    { c:"boot", e:"+6 Mana Regen — hero haus mana" },
  "Rapid Boots":    { c:"boot", e:"MS tertinggi — roamer/rotasi" },
  // ---- ATTACK ----
  "Blade of Despair":       { c:"atk", e:"+160 Phys Atk; +25% dmg ke musuh <50% HP — item damage terbesar" },
  "Berserker's Fury":       { c:"atk", e:"+65 PA, +25% crit, +40% crit dmg — core build crit" },
  "Blade of the Heptaseas": { c:"atk", e:"+70 PA +250 HP +15 pen; bonus dmg dari semak/idle 5s — burst pembuka" },
  "Corrosion Scythe":       { c:"atk", e:"On-hit slow stack + attack speed — nempel target" },
  "Demon Hunter Sword":     { c:"atk", e:"Basic attack +8% current HP target — pelebur tank" },
  "Endless Battle":         { c:"atk", e:"True dmg 60% PA tiap habis skill — hero combo skill+basic" },
  "Golden Staff":           { c:"atk", e:"Crit→AS + efek basic attack lebih sering — on-hit MM" },
  "Great Dragon Spear":     { c:"atk", e:"+70 PA +20% crit +CDR; MS burst habis ulti — crit + mobilitas" },
  "Haas's Claws":           { c:"atk", e:"+20% crit +20% lifesteal; crit kasih AS — sustain crit" },
  "Hunter Strike":          { c:"atk", e:"+80 PA +15 pen +CDR; hit beruntun → MS burst — assassin/fighter skill" },
  "Malefic Gun":            { c:"atk", e:"+30% phys pen + attack range +12% — pen buat MM attack speed" },
  "Malefic Roar":           { c:"atk", e:"Phys pen % + bonus pen makin tebal armor lawan — WAJIB vs tanky" },
  "Rose Gold Meteor":       { c:"atk", e:"Shield otomatis saat HP 30% + lifesteal — nahan burst buat carry fisik" },
  "Sea Halberd":            { c:"atk", e:"Anti-heal 60% on-hit + bonus dmg vs HP gede — jawaban healer/lifesteal" },
  "War Axe":                { c:"atk", e:"Stack PA saat combat + hybrid lifesteal — core fighter" },
  "Wind of Nature":         { c:"atk", e:"Aktif: KEBAL damage fisik 2s — jawaban MM vs assassin fisik" },
  "Windtalker":             { c:"atk", e:"+35% AS +20% crit; AoE magic tiap beberapa hit — waveclear MM" },
  "Sky Piercer":            { c:"atk", e:"Eksekusi musuh <4% HP (naik per stack kill) — snowball finisher" },
  // ---- MAGIC ----
  "Blood Wings":            { c:"mag", e:"+90 MP — magic power terbesar, scaling late" },
  "Clock of Destiny":       { c:"mag", e:"+HP/mana/MP; stack def saat deal dmg — mage tanky/scaling" },
  "Concentrated Energy":    { c:"mag", e:"+400 HP + amp damage stack — mage DPS sustain" },
  "Divine Glaive":          { c:"mag", e:"Magic pen % + bonus makin tebal magic def lawan — WAJIB vs tanky" },
  "Enchanted Talisman":     { c:"mag", e:"+20% CDR + regen mana 15%/10s — mage spam skill" },
  "Feather of Heaven":      { c:"mag", e:"Basic attack magic + AS — MM/hybrid magic" },
  "Flask of the Oasis":     { c:"mag", e:"Heal/shield lu lebih kuat + shield proc — support healer" },
  "Genius Wand":            { c:"mag", e:"Shred magic def tiap damage — poke efektif dari early" },
  "Glowing Wand":           { c:"mag", e:"Burn %HP + Lifebane: anti-heal versi mage — vs healer & tank" },
  "Holy Crystal":           { c:"mag", e:"Amplify Magic Power 21-35% — pure damage late" },
  "Ice Queen Wand":         { c:"mag", e:"Skill hit → slow stack + magic lifesteal — kiting & nempel" },
  "Lightning Truncheon":    { c:"mag", e:"Tiap 6s skill berikutnya nyambar 3 musuh — burst poke" },
  "Starlium Scythe":        { c:"mag", e:"Habis skill: basic attack true dmg ~100% MP — nembus magic def" },
  "Wishing Lantern":        { c:"mag", e:"Proc damage %HP current target — vs lawan HP gede" },
  "Winter Crown":           { c:"mag", e:"Aktif: beku 2s KEBAL semua (skill tetap jalan) — escape burst/lockdown", adaptive:true },
  "Fleeting Time":          { c:"mag", e:"Kill/assist → refund 30% CD ulti — hero bergantung ulti", adaptive:true },
  // ---- DEFENSE ----
  "Antique Cuirass":        { c:"def", e:"Kena skill fisik → attack musuh -6% (stack 3x) — vs burst fisik skill" },
  "Athena's Shield":        { c:"def", e:"Kena magic dmg → -25% magic dmg 3s — vs BURST magic" },
  "Blade Armor":            { c:"def", e:"+80 Phys Def; reflect basic attack + slow — vs MM crit/basic attack" },
  "Brute Force Breastplate":{ c:"def", e:"+HP +def + MS stack saat combat — bruiser agresif" },
  "Chastise Pauldron":      { c:"def", e:"Attack speed penyerang dipotong ke 75% + self-heal <30% HP — vs DPS attack speed" },
  "Cursed Helmet":          { c:"def", e:"Burn AoE %HP — waveclear & duel tanky" },
  "Dominance Ice":          { c:"def", e:"Aura: AS musuh -20% + heal/shield musuh -50% — anti-heal versi tank" },
  "Guardian Helmet":        { c:"def", e:"+1800 HP + regen besar di luar combat — frontliner HP pool" },
  "Immortality":            { c:"def", e:"Hidup lagi 2.5s setelah mati — second chance late game" },
  "Oracle":                 { c:"def", e:"Hybrid def + shield & regen yang lu terima +30% — combo sama healer/shield" },
  "Queen's Wings":          { c:"def", e:"HP <40%: -30% damage diterima + CD skill turun — bruiser anti-burst" },
  "Radiant Armor":          { c:"def", e:"Kena magic berulang → magic def stack — vs POKE/DPS magic" },
  "Thunder Belt":           { c:"def", e:"True dmg + slow tiap 4s (scaling def) — tank utility/peel" }
};
