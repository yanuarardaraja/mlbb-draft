// ==== ICON SVG INLINE (emblem, spell, item, blessing) ====
const GLYPHS = {
  sword:'<path d="M21 3c-2.8.2-5.4 1.4-7.3 3.3L7 13l4 4 6.7-6.7C19.6 8.4 20.8 5.8 21 3zM6 14l-3 4 3 3 4-3z"/>',
  dagger:'<path d="M4 3l7 10 2-2L5 2zM20 3l-7 10-2-2L19 2zM4 21l7-6-1.5-1.5L3.5 19zM20 21l-7-6 1.5-1.5L20.5 19z"/>',
  axe:'<path d="M12.7 6.3l5 5L7 22H2v-5zM14 5l5 5c2-1.5 3-4 3-6.5V2h-1.5C18 2 15.5 3 14 5z"/>',
  spear:'<path d="M22 2h-4l-8.5 10.2 2.3 2.3L22 6V2zM8 14l2 2-6 6H2v-2z"/>',
  trident:'<path d="M11 2v5H9V4H7v5c0 1.7 1.3 3 3 3h1v8h2v-8h1c1.7 0 3-1.3 3-3V4h-2v3h-2V2z"/>',
  gun:'<path d="M2 8h15l5-2v7l-3-.8V15h-5v-2.5H9V17H5v-4H2z"/>',
  scythe:'<path d="M4 2c5-1 12 0 16 4l-1.5 1.5C15 4.5 9.5 3.8 5 4.6zM17 7L4 20l2 2L19 9z"/>',
  staffstar:'<path d="M12 2l1.8 3.6 3.7 1.4-3 2.6.9 3.9L12 11.4 8.6 13.5l.9-3.9-3-2.6 3.7-1.4zM11 13h2v9h-2z"/>',
  wand:'<path d="M3 21l10-10 2 2L5 23zM15 3l1 2.5L18.5 6 16 7l-1 2.5L14 7l-2.5-1L14 5.5zM20 10l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  orb:'<path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 2.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z"/><circle cx="12" cy="12" r="3"/>',
  book:'<path d="M12 6C10 4.5 7 4 3 4v15c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zm-1 12.6c-1.6-.7-3.6-1-6.5-1.1V5.6c2.9.1 4.9.5 6.5 1.4zm8.5-1.1c-2.9.1-4.9.4-6.5 1.1V7c1.6-.9 3.6-1.3 6.5-1.4z"/>',
  crown:'<path d="M2.5 7.5L7 11l5-7 5 7 4.5-3.5L19.5 19h-15zM4.5 20.5h15V22h-15z"/>',
  clock:'<path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 2a7 7 0 110 14 7 7 0 010-14zm1 2h-2v6l4.5 2.7 1-1.7-3.5-2.1z"/>',
  wings:'<path d="M11 20C9.5 13 6 8.5 1.5 6.5 6.5 5.5 10.5 8 12 12c1.5-4 5.5-6.5 10.5-5.5C18 8.5 14.5 13 13 20z"/>',
  shield:'<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/>',
  helmet:'<path d="M4 12a8 8 0 0116 0v8h-5v-6h-2v6h-2v-6H9v6H4z"/>',
  chest:'<path d="M7 3h10l3 4-2 3v11h-3.5v-6h-5v6H5V10L3 7z"/>',
  boot:'<path d="M8 2h6v9c0 1 .5 2 1.5 2.5L20 16c1.2.6 2 1.9 2 3.2V21H4v-8c0-1 .8-2 2-2h2z"/>',
  heal:'<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 12h-3v3h-4v-3H7v-4h3V7h4v3h3z"/>',
  lantern:'<path d="M9 2h6v2H9zM8 5h8l1.5 4c.4 1 .6 2.1.6 3.2 0 3.3-2.7 6-6.1 6-3.3 0-6-2.7-6-6 0-1.1.2-2.2.6-3.2zM11 19h2v3h-2z"/>',
  snow:'<g fill="none" stroke="#fff" stroke-opacity=".93" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17"/></g>',
  bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  flame:'<path d="M12 2s6 5 6 11a6 6 0 11-12 0c0-2 1-4 2.5-5.5C9 9 10 10.5 11 10c1.5-.8.5-5 1-8z"/>',
  eye:'<path d="M12 5C6.5 5 2.3 8.6 1 12c1.3 3.4 5.5 7 11 7s9.7-3.6 11-7c-1.3-3.4-5.5-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z"/><circle cx="12" cy="12" r="2"/>',
  feather:'<path d="M20 4c-7 0-13 4-15 11l-3 5 1.5 1 3-5h5c5 0 8.5-5 8.5-12zM7.5 14c2-4 5.5-7 9.5-8-2 4-5 7-9.5 8z"/>',
  hourglass:'<path d="M6 2h12v3.5L13.5 12 18 18.5V22H6v-3.5L10.5 12 6 5.5z"/>',
  claw:'<path d="M3 4c3 2 5 5 6 9l-2 1c-2-3-4-6-4-10zm6-1c3 2.5 5 6 5.5 10.5l-2 .7C11.5 10 10 6.5 9 3zm7 0c2.5 3 4 7 4 11.5l-2 .3c0-4-1-8-3.5-11z"/>',
  skull:'<path fill-rule="evenodd" d="M12 2a8 8 0 00-8 8c0 2.5 1.2 4.8 3 6.3V20a2 2 0 002 2h6a2 2 0 002-2v-3.7c1.8-1.5 3-3.8 3-6.3a8 8 0 00-8-8zM8.5 13a2 2 0 110-4 2 2 0 010 4zm7 0a2 2 0 110-4 2 2 0 010 4zM11 15h2l-1 3z"/>',
  crosshair:'<path d="M12 2a1 1 0 011 1v2.1A7 7 0 0118.9 11H21a1 1 0 010 2h-2.1A7 7 0 0113 18.9V21a1 1 0 01-2 0v-2.1A7 7 0 015.1 13H3a1 1 0 010-2h2.1A7 7 0 0111 5.1V3a1 1 0 011-1zm0 5a5 5 0 100 10 5 5 0 000-10zm0 3a2 2 0 110 4 2 2 0 010-4z"/>',
  star:'<path d="M12 2l2.6 6.2 6.7.5-5.1 4.4 1.6 6.6L12 16l-5.8 3.7 1.6-6.6-5.1-4.4 6.7-.5z"/>',
  sparkle:'<path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>',
  arrowup:'<path d="M12 3l7 7-2.1 2.1-3.4-3.4V21h-3V8.7l-3.4 3.4L5 10z"/>',
  reflect:'<path d="M4 7h9l-2.5-2.5L12 3l5 5-5 5-1.5-1.5L13 9H4zM20 17h-9l2.5 2.5L12 21l-5-5 5-5 1.5 1.5L11 15h9z"/>',
  drop:'<path d="M12 2s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z"/>',
  ring:'<path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z"/>',
  flask:'<path d="M9 2h6v2h-1v4l4.8 8.4A3 3 0 0116.2 21H7.8a3 3 0 01-2.6-4.6L10 8V4H9zM8.5 15h7l1.6 2.8a1 1 0 01-.9 1.7H7.8a1 1 0 01-.9-1.7z"/>',
  wind:'<g fill="none" stroke="#fff" stroke-opacity=".93" stroke-width="2" stroke-linecap="round"><path d="M3 8h9a3 3 0 10-3-3M3 12h14a3 3 0 113 3M3 16h8a3 3 0 11-3 3"/></g>',
  bow:'<g fill="none" stroke="#fff" stroke-opacity=".93" stroke-width="2" stroke-linecap="round"><path d="M6 3c6.5 2.5 6.5 15.5 0 18M6 3v18M6 12h11M13 8l4 4-4 4"/></g>'
};

// name → [glyph, warna atas, warna bawah]
const ICON_MAP = {
  // Emblem
  "Tank":["shield","#3b82f6","#1e3a8a"], "Assassin":["dagger","#a855f7","#581c87"], "Mage":["orb","#22d3ee","#155e75"],
  "Fighter":["axe","#f97316","#7c2d12"], "Marksman":["crosshair","#eab308","#713f12"], "Support":["heal","#22c55e","#14532d"], "Common":["star","#94a3b8","#334155"],
  // Spell
  "Retribution":["claw","#f59e0b","#7c2d12"], "Execute":["skull","#ef4444","#7f1d1d"], "Inspire":["arrowup","#fb923c","#7c2d12"],
  "Sprint":["boot","#4ade80","#14532d"], "Revitalize":["heal","#34d399","#065f46"], "Aegis":["shield","#60a5fa","#1e3a8a"],
  "Petrify":["eye","#a8a29e","#44403c"], "Purify":["sparkle","#e879f9","#701a75"], "Flameshot":["flame","#fb923c","#7c2d12"],
  "Flicker":["bolt","#c084fc","#581c87"], "Arrival":["ring","#38bdf8","#0c4a6e"], "Vengeance":["reflect","#f87171","#7f1d1d"],
  // Jungle blessing (patch 2.1.88: Ice/Flame/Behemoth Hunter's)
  "Ice Hunter's":["snow","#7dd3fc","#0c4a6e"], "Flame Hunter's":["flame","#f87171","#7f1d1d"], "Behemoth Hunter's":["drop","#ef4444","#450a0a"],
  // Roam blessing
  "Conceal":["eye","#a78bfa","#4c1d95"], "Encourage":["arrowup","#fbbf24","#78350f"], "Favor":["heal","#f9a8d4","#9d174d"], "Dire Hit":["crosshair","#f87171","#7f1d1d"],
  // Boots
  "Warrior Boots":["boot","#f97316","#7c2d12"], "Tough Boots":["boot","#38bdf8","#075985"], "Magic Shoes":["boot","#a78bfa","#4c1d95"],
  "Arcane Boots":["boot","#e879f9","#701a75"], "Swift Boots":["boot","#fbbf24","#92400e"], "Demon Shoes":["boot","#818cf8","#3730a3"], "Rapid Boots":["boot","#34d399","#065f46"],
  // Attack
  "Blade of Despair":["sword","#fb923c","#7c2d12"], "Berserker's Fury":["sword","#ef4444","#7f1d1d"], "Blade of the Heptaseas":["sword","#60a5fa","#1e3a8a"],
  "Corrosion Scythe":["scythe","#a3e635","#3f6212"], "Demon Hunter Sword":["sword","#c084fc","#581c87"], "Endless Battle":["bolt","#f472b6","#831843"],
  "Golden Staff":["staffstar","#fcd34d","#92400e"], "Great Dragon Spear":["spear","#f87171","#7f1d1d"], "Haas's Claws":["claw","#ef4444","#450a0a"],
  "Hunter Strike":["dagger","#93c5fd","#1e40af"], "Malefic Gun":["gun","#fb7185","#881337"], "Malefic Roar":["claw","#fb923c","#7c2d12"],
  "Rose Gold Meteor":["shield","#fda4af","#9f1239"], "Sea Halberd":["trident","#2dd4bf","#134e4a"], "War Axe":["axe","#f59e0b","#78350f"],
  "Wind of Nature":["feather","#4ade80","#14532d"], "Windtalker":["wind","#67e8f9","#155e75"], "Sky Piercer":["spear","#7dd3fc","#0c4a6e"],
  // Magic
  "Blood Wings":["wings","#f43f5e","#881337"], "Clock of Destiny":["clock","#fcd34d","#78350f"], "Concentrated Energy":["orb","#fb7185","#9f1239"],
  "Divine Glaive":["spear","#0ea5e9","#312e81"], "Enchanted Talisman":["book","#2dd4bf","#115e59"], "Feather of Heaven":["feather","#fbbf24","#854d0e"],
  "Flask of the Oasis":["flask","#4ade80","#166534"], "Genius Wand":["wand","#c084fc","#6b21a8"], "Glowing Wand":["wand","#fb923c","#9a3412"],
  "Holy Crystal":["orb","#f0abfc","#86198f"], "Ice Queen Wand":["snow","#7dd3fc","#0369a1"], "Lightning Truncheon":["bolt","#60a5fa","#1e3a8a"],
  "Starlium Scythe":["scythe","#a78bfa","#4c1d95"], "Wishing Lantern":["lantern","#fbbf24","#854d0e"], "Winter Crown":["crown","#67e8f9","#0e7490"],
  "Fleeting Time":["hourglass","#5eead4","#0f766e"],
  // Defense
  "Antique Cuirass":["chest","#fbbf24","#7c2d12"], "Athena's Shield":["shield","#93c5fd","#1e3a8a"], "Blade Armor":["chest","#f87171","#7f1d1d"],
  "Brute Force Breastplate":["chest","#fb923c","#7c2d12"], "Chastise Pauldron":["chest","#fcd34d","#854d0e"], "Cursed Helmet":["skull","#a3e635","#365314"],
  "Dominance Ice":["snow","#38bdf8","#1e3a8a"], "Guardian Helmet":["helmet","#fcd34d","#78350f"], "Immortality":["star","#fde047","#a16207"],
  "Oracle":["eye","#2dd4bf","#134e4a"], "Queen's Wings":["wings","#7dd3fc","#0c4a6e"], "Radiant Armor":["shield","#fde047","#a16207"],
  "Thunder Belt":["bolt","#facc15","#713f12"]
};

// ==== ICON ASLI (hotlink MLBB Wiki, fallback otomatis ke SVG) ====
const FP = f => "https://mobile-legends.fandom.com/wiki/Special:FilePath/" + encodeURIComponent(f.replace(/ /g,"_")) + ".png";
const EMB_FILES = {
  "Tank":["Custom Tank Emblem","Tank Emblem"], "Assassin":["Custom Assassin Emblem","Assassin Emblem"],
  "Mage":["Custom Mage Emblem","Mage Emblem"], "Fighter":["Custom Fighter Emblem","Fighter Emblem"],
  "Marksman":["Custom Marksman Emblem","Marksman Emblem"], "Support":["Custom Support Emblem","Support Emblem"],
  "Common":["Basic Common Emblem","Common Emblem"]
};
const BLESS_FILES = {
  "Ice Hunter's":["Ice Hunter's","Ice Retribution"],
  "Flame Hunter's":["Flame Hunter's","Flame Retribution"],
  "Behemoth Hunter's":["Behemoth Hunter's","Bloody Retribution"]
};
function iconCandidates(name, kind){
  if (kind==="emblem") return EMB_FILES[name] || [name];
  if (kind==="bless") return BLESS_FILES[name] || [name];
  if (kind==="spell") return name==="Inspire" ? ["Inspire (Battle Spell)","Battle Spell Inspire","Inspire"] : [name, name+" (Battle Spell)"];
  return [name]; // item, boots, talent, roam
}
function attrEsc(s){ return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
function iconImg(name, size, kind){
  size = size || 30;
  const c = iconCandidates(name, kind);
  const alts = attrEsc(JSON.stringify(c.slice(1).map(FP)));
  return '<span class="icimg" style="width:'+size+'px;height:'+size+'px;">'
    + '<img src="'+FP(c[0])+'" data-alts="'+alts+'" data-n="'+attrEsc(name)+'" data-s="'+size+'" '
    + 'loading="lazy" referrerpolicy="no-referrer" alt="" onerror="icFail(this)">'
    + '</span>';
}
function icFail(img){
  try{
    const alts = JSON.parse(img.dataset.alts || "[]");
    if (alts.length){ img.dataset.alts = JSON.stringify(alts.slice(1)); img.src = alts[0]; return; }
  }catch(e){}
  const s = parseInt(img.dataset.s) || 30;
  const w = img.closest(".icimg");
  if (w) w.outerHTML = iconSVG(img.dataset.n, s);
}

function iconSVG(name, size){
  size = size || 30;
  const m = ICON_MAP[name] || ["star","#64748b","#334155"];
  const gid = "lg_" + String(name).toLowerCase().replace(/[^a-z0-9]/g,"");
  return '<svg class="ic" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" aria-hidden="true">'
    + '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="'+m[1]+'"/><stop offset="1" stop-color="'+m[2]+'"/></linearGradient></defs>'
    + '<rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="url(#'+gid+')" stroke="rgba(255,255,255,.22)"/>'
    + '<g transform="translate(3.6 3.6) scale(0.7)" fill="#fff" fill-opacity=".93">' + (GLYPHS[m[0]]||GLYPHS.star) + '</g>'
    + '</svg>';
}
