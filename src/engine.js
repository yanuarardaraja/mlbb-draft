// ==== ENGINE REKOMENDASI ====

const THREAT_KEYS = ["tk","buP","buM","dp","cc","hl","ss","dv","pk","iv","td"];
const THREAT_LABELS = {
  tk:"Tanky", buP:"Burst Fisik", buM:"Burst Magic", dp:"DPS Basic Attack", cc:"CC Berat",
  hl:"Heal/Shield Tim", ss:"Sustain/Regen", dv:"Dive/Backline", pk:"Poke Jauh",
  iv:"Invisibility", td:"True Damage"
};
const LVL_LABEL = ["-","Ada","Tinggi","Ekstrem"];

const SQUISHY = ["mm_as","mm_crit","mm_skill","mm_mag","mg_burst","mg_poke","mg_dps","as_p","as_m"];
const MM_BT   = ["mm_as","mm_crit","mm_skill","mm_mag"];
const MG_BT   = ["mg_burst","mg_poke","mg_dps"];
const FG_BT   = ["fg_dmg","fg_sus","fg_mag"];
const TANKY_BT= ["tk","sp_heal","sp_util"];

function lvl(raw, cnt){
  if (cnt <= 0) return 0;
  if (raw >= Math.max(4, cnt*1.5)) return 3;
  if (raw >= Math.max(2.5, cnt*0.9)) return 2;
  if (raw >= 1) return 1;
  return 0;
}

// enemies: array hero object; overrides: {key: 0|3|null}
function threatProfile(enemies, overrides){
  overrides = overrides || {};
  const raw = {tk:0,buP:0,buM:0,dp:0,dpP:0,dpM:0,cc:0,hl:0,ss:0,dv:0,pk:0,iv:0,td:0};
  let phys=0, mag=0;
  enemies.forEach(e=>{
    const t = e.tg || {};
    raw.tk += t.tk||0; raw.cc += t.cc||0; raw.hl += t.hl||0; raw.ss += t.ss||0;
    raw.dv += t.dv||0; raw.pk += t.pk||0; raw.iv += t.iv||0; raw.td += t.td||0;
    const bu = t.bu||0, dp = t.dp||0;
    if (e.d==="p"){ raw.buP += bu; raw.dpP += dp; }
    else if (e.d==="m"){ raw.buM += bu; raw.dpM += dp; }
    else { raw.buP += bu/2; raw.buM += bu/2; raw.dpP += dp/2; raw.dpM += dp/2; }
    raw.dp += dp;
    const w = 1 + bu/2 + dp/2 + (t.pk||0)/3;
    if (e.d==="p") phys += w; else if (e.d==="m") mag += w; else { phys += w/2; mag += w/2; }
  });
  const cnt = enemies.length;
  const P = { raw, cnt, physShare: (phys+mag)>0 ? phys/(phys+mag) : 0.5 };
  P.magShare = 1 - P.physShare;
  THREAT_KEYS.forEach(k=>{ P[k] = lvl(raw[k]||0, cnt); });
  P.dpP = lvl(raw.dpP, cnt); P.dpM = lvl(raw.dpM, cnt);
  // manual override (0 = matiin, 3 = paksa ekstrem)
  THREAT_KEYS.forEach(k=>{
    if (overrides[k] === 0) P[k] = 0;
    if (overrides[k] === 3) { P[k] = 3; if(k==="buP"){P.physShare=Math.max(P.physShare,0.55);P.magShare=1-P.physShare;} if(k==="buM"){P.magShare=Math.max(P.magShare,0.55);P.physShare=1-P.magShare;} if(k==="dp"){P.dpP=Math.max(P.dpP,2);} }
  });
  P.hasCritMM = enemies.some(e=>e.bt==="mm_crit");
  P.antiHealNeed = (P.hl>=2) || (P.hl + P.ss >= 3) || (overrides.hl===3) || (overrides.ss===3);
  P.empty = cnt===0 && !Object.keys(overrides).some(k=>overrides[k]===3);
  return P;
}

function isJungler(hero, lane){ return lane === "Jungle"; }

// lane bebas: hero apa pun bisa roam — kasih blessing default sesuai gaya main
function defaultBlessing(hero){
  if (hero.rb) return hero.rb;
  if (hero.bt==="sp_heal") return "Favor";
  if (["as_p","as_m","fg_dmg"].includes(hero.bt)) return "Conceal";
  if (MG_BT.includes(hero.bt) || MM_BT.includes(hero.bt)) return "Dire Hit";
  return "Encourage";
}

// ---------- SPELL ----------
function pickSpell(hero, lane, T){
  const jung = isJungler(hero, lane);
  const squishy = SQUISHY.includes(hero.bt);
  let main, why, alt, altWhy, blessing=null, blessWhy=null;

  if (jung){
    main = "Retribution"; why = "Lu jungler — non-negotiable.";
    const tankyJg = ["tk","fg_sus","fg_mag","sp_util","sp_heal"].includes(hero.bt);
    if (tankyJg){ blessing="Behemoth Hunter's"; blessWhy="Curi HP scaling bonus HP lu — paling cocok jungler tanky (ini pengganti Bloody Retribution)."; }
    else if (T.dv>=2){ blessing="Ice Hunter's"; blessWhy="Lawan banyak hero licin/dive — curi Move Speed biar bisa nempel/lepas."; }
    else if (T.buP + T.buM >= 4){ blessing="Flame Hunter's"; blessWhy="Lawan burst — curi attack mereka pas duel."; }
    else { blessing="Ice Hunter's"; blessWhy="Default paling aman: curi Move Speed buat ganking & ngejar kill."; }
    alt = hero.sp[0]==="Retribution" ? hero.sp[1] : hero.sp[0];
    altWhy = "Kalau lu ga jadi jungler.";
  } else {
    main = hero.sp[0]==="Retribution" ? (hero.sp[1]||"Flicker") : hero.sp[0];
    why = "Default paling fleksibel buat " + hero.n + ".";
    alt = (hero.sp[1] && hero.sp[1]!==main) ? hero.sp[1] : (main==="Flicker" ? "Sprint" : "Flicker");
    altWhy = "Opsi kedua standar.";
    if (T.cc>=2 && squishy){
      if (T.cc>=3 && main!=="Purify"){
        alt = main; altWhy = "Kalau lu pede sama positioning.";
        main = "Purify"; why = "CC lawan EKSTREM — sekali kena lock lu mati. Purify = tombol hidup.";
      } else if (main!=="Purify"){
        alt = "Purify"; altWhy = "CC lawan berat — pertimbangkan serius, apalagi kalau lawan ada suppress/lock (Franco/Kaja/Saber).";
      }
    }
    if (T.dv>=2 && MM_BT.includes(hero.bt) && main!=="Purify" && alt!=="Aegis"){
      altWhy = "Assassin lawan bakal nyari lu — " + alt + " atau Aegis buat nahan burst pertama.";
    }
  }
  return {main, why, alt, altWhy, blessing, blessWhy};
}

// ---------- BOOTS ----------
function pickBoots(hero, T){
  let b = hero.bo, why = ITEMS[hero.bo] ? ITEMS[hero.bo].e : "";
  const melee = FG_BT.includes(hero.bt) || TANKY_BT.includes(hero.bt) || hero.bt==="as_p";
  if (T.cc>=2){
    const isMage = MG_BT.includes(hero.bt) || hero.bt==="as_m";
    if (!isMage || T.cc>=3){
      if (b!=="Tough Boots"){ b = "Tough Boots"; why = "CC lawan berat — resilience motong durasi stun/slow. Damage bisa dikejar dari item lain."; }
      else why = "Udah pas: CC lawan berat, resilience wajib.";
    } else {
      why += " (CC lawan lumayan — kalau makin parah, swap ke Tough Boots.)";
    }
  } else if (melee && T.magShare>=0.62 && b==="Warrior Boots"){
    b = "Tough Boots"; why = "Damage lawan dominan magic — magic def lebih kepake daripada armor.";
  } else if (melee && T.physShare>=0.62 && b==="Tough Boots" && T.cc<2){
    b = "Warrior Boots"; why = "Damage lawan dominan fisik — armor lebih kepake.";
  }
  return {item:b, why};
}

// ---------- TALENT ----------
function pickTalents(hero, lane, T){
  const tl = hero.tl.slice();
  const whys = ["","",""];
  const notes = [];
  // Tier 3 adjust
  if ((hero.bt==="mg_dps"||hero.bt==="mg_poke") && T.tk>=2 && tl[2]==="Lethal Ignition"){
    tl[2] = "Impure Rage";
    whys[2] = "Lawan tanky — Impure Rage mukul 4% Max HP: makin gendut musuh makin sakit.";
  }
  if (FG_BT.includes(hero.bt) && (T.buP+T.buM)>=4 && tl[1]==="Festival of Blood"){
    notes.push("Lawan full burst: spell vamp kurang kepake (fight-nya cepet). Tenacity di Tier 2 bisa jadi opsi bertahan.");
  }
  if (TANKY_BT.includes(hero.bt) && T.dp>=2 && tl[1]!=="Tenacity"){
    notes.push("DPS lawan tinggi — pastiin Tier 2 Tenacity kepasang.");
  }
  if (isJungler(hero,lane) && !["Wilderness Blessing","Seasoned Hunter","Master Assassin","Festival of Blood"].includes(tl[1])){
    notes.push("Karena jungle: Wilderness Blessing (rotasi) atau Seasoned Hunter (secure Lord/Turtle) layak dipertimbangkan di Tier 2.");
  }
  if (MM_BT.includes(hero.bt) && T.dv>=2 && tl[2]==="Weakness Finder"){
    whys[2] = "Makin penting karena lawan suka dive: basic attack lu slow 50% — peel diri sendiri.";
  }
  // default whys
  if (!whys[0]) whys[0] = TALENTS[tl[0]] ? TALENTS[tl[0]].e : "";
  if (!whys[1]) whys[1] = TALENTS[tl[1]] ? TALENTS[tl[1]].e : "";
  if (!whys[2]) whys[2] = TALENTS[tl[2]] ? TALENTS[tl[2]].e : "";
  return {tl, whys, notes};
}

// ---------- ITEM POOLS ----------
const SCALE_POOL = {
  mm_as:   ["Windtalker","Golden Staff","Corrosion Scythe","Demon Hunter Sword","Blade of Despair"],
  mm_crit: ["Great Dragon Spear","Windtalker","Berserker's Fury","Blade of Despair"],
  mm_skill:["Endless Battle","Sky Piercer","Blade of Despair","Great Dragon Spear"],
  mm_mag:  ["Feather of Heaven","Holy Crystal","Genius Wand","Blood Wings"],
  mg_burst:["Lightning Truncheon","Holy Crystal","Blood Wings","Genius Wand"],
  mg_poke: ["Lightning Truncheon","Holy Crystal","Blood Wings","Genius Wand"],
  mg_dps:  ["Concentrated Energy","Holy Crystal","Ice Queen Wand","Blood Wings"],
  as_p:    ["Blade of Despair","Endless Battle","Sky Piercer","Blade of the Heptaseas"],
  as_m:    ["Holy Crystal","Blood Wings","Lightning Truncheon","Starlium Scythe"],
  fg_dmg:  ["Blade of Despair","Endless Battle","Hunter Strike","Sky Piercer"],
  fg_sus:  ["Blade of Despair","Endless Battle","Hunter Strike"],
  fg_mag:  ["Holy Crystal","Concentrated Energy","Glowing Wand","Starlium Scythe"],
  tk:      ["Cursed Helmet","Guardian Helmet","Thunder Belt"],
  sp_heal: ["Enchanted Talisman","Fleeting Time","Ice Queen Wand"],
  sp_util: ["Fleeting Time","Oracle","Thunder Belt"]
};

function isMagicDealer(bt){ return MG_BT.includes(bt) || bt==="as_m" || bt==="fg_mag" || bt==="mm_mag"; }

function antiTankItem(hero){
  if (isMagicDealer(hero.bt)) return {item:"Divine Glaive", why:"Lawan tanky — magic pen % WAJIB, bonusnya makin gede kalau mereka stack magic def."};
  if (hero.bt==="mm_as") return {item:"Malefic Gun", why:"Lawan tanky — pen 30% versi MM attack speed, plus nambah range."};
  return {item:"Malefic Roar", why:"Lawan tanky — pen % WAJIB. Tanpa ini damage lu cuma gatel di tank."};
}
function antiHealItem(hero){
  if (TANKY_BT.includes(hero.bt)) return {item:"Dominance Ice", why:"Ada heal/sustain gede di lawan — aura lu motong heal & shield mereka 50%. Nempel terus ke healer/lifesteal-nya."};
  if (isMagicDealer(hero.bt)) return {item:"Glowing Wand", why:"Ada heal/sustain gede di lawan — Lifebane motong heal mereka + burn %HP."};
  return {item:"Sea Halberd", why:"Ada heal/sustain gede di lawan — on-hit motong heal & shield 60%. Beli SEBELUM war besar pertama."};
}

// skor item defense berdasarkan ancaman
function defCandidates(hero, T){
  const c = [];
  const add = (item, score, why)=>{ if(score>0.35) c.push({item, score, why}); };
  add("Athena's Shield", T.buM*2.2 + T.magShare*1.2, "Burst magic lawan gede — kena magic sekali, 25% damage magic berikutnya ke-reduce.");
  add("Radiant Armor", T.dpM*2.2 + (T.magShare>0.5 ? T.pk*1.1 : 0), "Damage magic lawan berulang (DPS/poke) — magic def numpuk tiap kena.");
  add("Antique Cuirass", T.buP*2.2, "Burst fisik skill-based — tiap kena skill, attack musuh turun 6% (stack 3x).");
  add("Blade Armor", T.dpP*1.9 + (T.hasCritMM?1.6:0), T.hasCritMM ? "Ada MM crit di lawan — reflect + crit mereka jadi makan diri sendiri." : "Basic attack fisik deras — reflect + slow penyerang.");
  add("Chastise Pauldron", T.dpP*1.7 + (T.dp>=2?0.8:0), "DPS attack speed lawan — AS mereka dipotong ke 75% + lu dapet self-heal pas kritis.");
  add("Dominance Ice", (T.hl*1.6 + T.ss*1.3) + T.dpP*0.5, "Anti-heal + potong attack speed — dobel fungsi lawan comp sustain.");
  add("Immortality", 1.15 + (T.buP+T.buM)*0.45, "Second life — asuransi late game, apalagi lawan tipe pickoff.");
  add("Guardian Helmet", 0.9 + T.pk*0.9, "Lawan poke — regen gede bikin lu ga perlu recall abis kena harass.");
  add("Oracle", 0.75 + T.buM*0.7 + T.hl*0.4, "Hybrid def + shield/regen yang lu terima +30%.");
  add("Cursed Helmet", 0.7, "Burn AoE — waveclear & damage pasif buat frontliner.");
  add("Thunder Belt", 0.55 + T.dv*0.8, "True dmg + slow tiap 4 detik — peel buat lindungin backline.");
  c.sort((a,b)=>b.score-a.score);
  return c;
}

// slot defense buat carry (1 slot)
function carryDefItem(hero, T){
  const mm = MM_BT.includes(hero.bt);
  const mg = MG_BT.includes(hero.bt) || hero.bt==="as_m";
  if (mm){
    if (T.dv>=2 && T.physShare>=0.45) return {item:"Wind of Nature", why:"Assassin fisik bakal lompat ke lu — aktifin = KEBAL damage fisik 2 detik, mereka pulang tangan kosong."};
    if (T.buM>=2) return {item:"Rose Gold Meteor", why:"Burst magic lawan gede — shield otomatis pas HP 30%."};
    if (T.buP>=2) return {item:"Wind of Nature", why:"Burst fisik lawan gede — aktif imun fisik 2 detik pas mereka all-in."};
    return {item:"Immortality", why:"Slot aman late game — second life."};
  }
  if (mg){
    if (T.dv>=2 || T.buP>=2 || T.buM>=2) return {item:"Winter Crown", why:"Lawan burst/dive — beku 2 detik kebal semua pas mereka lompat, tim lu balikin damage. Skill lu (DoT/summon) tetap jalan."};
    return {item:"Immortality", why:"Slot aman late game — second life."};
  }
  // as_p
  if (T.buM>=2) return {item:"Athena's Shield", why:"Burst magic lawan gede — biar lu ga mati duluan sebelum combo keluar."};
  if (T.buP>=2) return {item:"Rose Gold Meteor", why:"Burst fisik lawan — shield 30% HP nyelametin combo lu."};
  return {item:"Immortality", why:"Slot aman late game — masuk, mati, hidup lagi, keluar."};
}

function fill(used, list){
  for (const it of list){ if(!used.has(it)) { used.add(it); return it; } }
  return null;
}

// ---------- BUILD ----------
function buildItems(hero, lane, T){
  const used = new Set();
  const out = [];
  const push = (item, why, tag, phase)=>{ if(item && !used.has(item)){ used.add(item); out.push({item, why, tag, phase}); } };

  const boots = pickBoots(hero, T);
  push(boots.item, boots.why, "boots", "Early");

  const scale = SCALE_POOL[hero.bt] || [];
  const co = hero.co.slice();

  if (TANKY_BT.includes(hero.bt)){
    // roamer/tank: 2 core + 3 def by threat
    push(co[0], (ITEMS[co[0]]||{}).e || "Core item " + hero.n + ".", "core", "Early");
    let defs = defCandidates(hero, T).filter(d=>!used.has(d.item));
    if (T.antiHealNeed && !used.has("Dominance Ice") && !defs.slice(0,3).some(d=>d.item==="Dominance Ice")){
      defs = [{item:"Dominance Ice", score:99, why:antiHealItem(hero).why}].concat(defs.filter(d=>d.item!=="Dominance Ice"));
    }
    push(co[1], (ITEMS[co[1]]||{}).e || "Core item " + hero.n + ".", "core", "Mid");
    let phase = ["Mid","Mid-Late","Late"];
    defs.filter(d=>!used.has(d.item)).slice(0,3).forEach((d,i)=> push(d.item, d.why, "situasional", phase[i]||"Late"));
    // fallback
    while (out.length<6){ const f = fill(used, SCALE_POOL.tk.concat(["Immortality","Oracle","Athena's Shield","Antique Cuirass"])); if(!f) break; out.push({item:f, why:(ITEMS[f]||{}).e||"", tag:"situasional", phase:"Late"}); }
    return out;
  }

  const isFighter = FG_BT.includes(hero.bt);
  // CORE 2
  push(co[0], (ITEMS[co[0]]||{}).e || "Core " + hero.n + ".", "core", "Early");
  push(co[1], (ITEMS[co[1]]||{}).e || "Core " + hero.n + ".", "core", "Mid");

  // FLEX A: anti-tank atau scaling
  if (T.tk>=2){
    const at = antiTankItem(hero);
    push(at.item, at.why, "situasional", "Mid");
  } else {
    const f = fill(used, scale);
    if (f) out.push({item:f, why:(ITEMS[f]||{}).e||"", tag:"damage", phase:"Mid"});
  }

  // FLEX B: anti-heal atau scaling kedua
  if (T.antiHealNeed){
    const ah = antiHealItem(hero);
    if (!used.has(ah.item)) push(ah.item, ah.why, "situasional", "Mid-Late");
    else { const f = fill(used, scale); if(f) out.push({item:f, why:(ITEMS[f]||{}).e||"", tag:"damage", phase:"Mid-Late"}); }
  } else if (isFighter){
    // fighter: def slot pertama
    const defs = defCandidates(hero, T).filter(d=>!used.has(d.item) && d.item!=="Cursed Helmet");
    if (T.buP>=2 && !used.has("Queen's Wings")) push("Queen's Wings", "Burst fisik lawan gede — HP<40%: damage diterima -30%, lu tetap hidup di tengah war.", "situasional", "Mid-Late");
    else if (defs[0]) push(defs[0].item, defs[0].why, "situasional", "Mid-Late");
  } else {
    const f = fill(used, scale);
    if (f) out.push({item:f, why:(ITEMS[f]||{}).e||"", tag:"damage", phase:"Mid-Late"});
  }

  // FLEX C: defensive
  if (isFighter){
    const defs = defCandidates(hero, T).filter(d=>!used.has(d.item) && d.item!=="Cursed Helmet");
    if (defs[0]) push(defs[0].item, defs[0].why, "situasional", "Late");
  } else {
    const d = carryDefItem(hero, T);
    if (!used.has(d.item)) push(d.item, d.why, "situasional", "Late");
  }

  // fallback biar selalu 6
  while (out.length<6){
    const f = fill(used, scale.concat(["Immortality","Blade of Despair","Holy Crystal","Athena's Shield"]));
    if (!f) break;
    out.push({item:f, why:(ITEMS[f]||{}).e||"", tag:"damage", phase:"Late"});
  }
  return out.slice(0,6);
}

// ---------- TIPS ----------
function matchupTips(hero, T, enemies){
  const tips = [];
  const squishy = SQUISHY.includes(hero.bt);
  if (T.tk>=2) tips.push({k:"tk", t:"Lawan tanky: fokus target squishy dulu. Tank mereka dicuekin aja sampai pen item lu jadi — jangan buang skill ke frontline."});
  if (T.buP+T.buM>=3 && squishy) tips.push({k:"bu", t:"Lawan burst: jangan first-in. Tunggu skill kunci mereka keluar (pancing pakai frontline), baru lu masuk. Satu kesalahan posisi = mati."});
  if (T.cc>=2) tips.push({k:"cc", t:"CC berat: gerak zigzag, jangan jalan di koridor lurus. Hafalin CD skill lock mereka — window abis mereka miss itu waktu lu agresif."});
  if (T.antiHealNeed) tips.push({k:"hl", t:"Anti-heal itu TIMING: beli sebelum war besar pertama (menit 8-10), bukan setelah kalah war. Telat beli = war ke-2 juga kalah."});
  if (T.dv>=2 && squishy) tips.push({k:"dv", t:"Ada diver: berdiri DEKAT frontline lu (bukan di belakang sendirian), simpan dash/escape buat defense, jangan dipakai buat poke."});
  if (T.pk>=2) tips.push({k:"pk", t:"Lawan poke: jangan ladder war di area terbuka. Rotasi lewat semak, paksa fight jarak dekat di mana poke mereka ga sempat keluar."});
  if (T.iv>=1) tips.push({k:"iv", t:"Ada hero invis/camo di lawan: jalan bareng tim, taruh AoE di semak sebelum masuk. Solo farming di jungle gelap = nyerahin diri."});
  if (T.td>=2) tips.push({k:"td", t:"Lawan bawa TRUE damage (nembus semua def): jangan cuma numpuk armor — tambah Max HP (item HP gede) biar mereka butuh waktu lebih lama."});
  if (T.ss>=2 && !T.antiHealNeed) tips.push({k:"ss", t:"Lawan sustain: jangan tukar damage pelan-pelan (mereka menang lama-lamaan). Burst cepat atau mundur."});
  return tips.slice(0,5);
}

function swapNotes(hero, T, items){
  const s = [];
  const hasPen = items.some(i=>["Malefic Roar","Malefic Gun","Divine Glaive"].includes(i.item));
  if (T.tk>=1 && !hasPen && !TANKY_BT.includes(hero.bt)){
    const at = antiTankItem(hero);
    s.push("Kalau frontline lawan mulai tebel di menit 12+: selipin " + at.item + " gantiin item damage terakhir.");
  }
  if (!TANKY_BT.includes(hero.bt)){
    s.push("Sering mati sebelum ngefek? Majuin item defensif ke slot 4, geser damage ke belakang. Build hidup > build sultan.");
    s.push("Late game full build: jual boots → ganti item ke-7 (damage/def sesuai kebutuhan) kalau match nya panjang.");
  } else {
    if (T.antiHealNeed) s.push("Dominance Ice naikin prioritas: beli sebelum menit 10 kalau healer lawan mulai keliatan ngefek.");
    s.push("Urutan item defense fleksibel — beli sesuai siapa yang lagi fed di lawan, bukan urutan mati.");
  }
  return s;
}

// ---------- MAIN ----------
function recommend(hero, lane, enemies, overrides){
  const T = threatProfile(enemies, overrides);
  const spell = pickSpell(hero, lane, T);
  const tal = pickTalents(hero, lane, T);
  const items = buildItems(hero, lane, T);
  const tips = matchupTips(hero, T, enemies);
  const swaps = swapNotes(hero, T, items);
  const emblemWhy = {
    "Tank":"HP + def + regen — lu hidup buat nyerap damage.",
    "Assassin":"Pen + attack + MS — burst & mobilitas.",
    "Mage":"Magic power + pen + CDR — paket damage skill.",
    "Fighter":"Attack + lifesteal + def — paket brawler.",
    "Marksman":"AS + attack + pen — DPS basic attack.",
    "Support":"Healing + CDR + MS — utility maksimal.",
    "Common":"Stat rata — fallback kalau emblem role belum ke-level."
  }[hero.em] || "";
  return { T, spell, talents: tal, items, tips, swaps,
    emblem: { name: hero.em, base: (EMBLEMS[hero.em]||{}).base||"", why: emblemWhy },
    roam: lane==="Roam" ? (function(){ const b = defaultBlessing(hero); return { bless: b, why: (ROAM[b]||"") }; })() : null
  };
}

if (typeof module !== "undefined") module.exports = {threatProfile, recommend, HEROES, ITEMS, THREAT_LABELS, THREAT_KEYS, LVL_LABEL};
