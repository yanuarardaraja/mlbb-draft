const fs = require("fs");
let src = ["data_ref.js","data_heroes_a.js","data_heroes_b.js","engine.js","icons.js"].map(f=>fs.readFileSync(f,"utf8")).join("\n");
src = src.replace(/^const /gm, "var "); // biar deklarasi top-level bocor ke scope test via eval
eval(src);

let fails = 0;
const ok = (cond, msg)=>{ if(!cond){ fails++; console.log("FAIL:", msg); } };

// ---- 1. Integritas data ----
ok(HEROES.length===133, "jumlah hero = "+HEROES.length+" (harus 133)");
const names = new Set();
const BTS = ["mm_as","mm_crit","mm_skill","mm_mag","mg_burst","mg_poke","mg_dps","as_p","as_m","fg_dmg","fg_sus","fg_mag","tk","sp_heal","sp_util"];
const LANES = ["EXP","Jungle","Mid","Gold","Roam"];
HEROES.forEach(h=>{
  ok(!names.has(h.n), "duplikat: "+h.n); names.add(h.n);
  ok(["Tank","Fighter","Assassin","Mage","Marksman","Support"].includes(h.r), h.n+": role "+h.r);
  ok(Array.isArray(h.l) && h.l.length>=1 && h.l.every(L=>LANES.includes(L)), h.n+": lane "+h.l);
  ok(["p","m","x"].includes(h.d), h.n+": dmg "+h.d);
  ok(BTS.includes(h.bt), h.n+": bt "+h.bt);
  ok(EMBLEMS[h.em], h.n+": emblem "+h.em);
  ok(h.tl.length===3, h.n+": talent count");
  h.tl.forEach((t,i)=>{ ok(TALENTS[t], h.n+": talent? "+t); if(TALENTS[t]) ok(TALENTS[t].t===i+1, h.n+": "+t+" tier "+TALENTS[t].t+" dipasang di tier "+(i+1)); });
  h.sp.forEach(s=>ok(SPELLS[s], h.n+": spell? "+s));
  ok(ITEMS[h.bo] && ITEMS[h.bo].c==="boot", h.n+": boots "+h.bo);
  ok(h.co.length===2, h.n+": core count "+h.co.length);
  h.co.forEach(c=>ok(ITEMS[c], h.n+": core item? "+c));
  if (h.rb) ok(ROAM[h.rb], h.n+": blessing? "+h.rb);
  if (h.l.includes("Roam") && ["tk","sp_heal","sp_util"].includes(h.bt)) ok(h.rb, h.n+": roamer tanpa blessing");
  ok(h.tg && Object.keys(h.tg).length>0, h.n+": tags kosong");
  Object.entries(h.tg).forEach(([k,v])=>ok(["tk","bu","dp","cc","hl","ss","dv","pk","iv","td"].includes(k)&&v>=0&&v<=3, h.n+": tag "+k+"="+v));
});

const by = n => HEROES.find(h=>h.n===n);

// ---- 2. Skenario: Aamon vs comp tanky ----
{
  const R = recommend(by("Aamon"), "Jungle", ["Tigreal","Uranus","Belerick","Hylos","Gloo"].map(by), {});
  const items = R.items.map(i=>i.item);
  ok(R.spell.main==="Retribution", "Aamon jungle harus Retribution, dapat "+R.spell.main);
  ok(items.includes("Divine Glaive"), "Aamon vs tanky harus ada Divine Glaive: "+items.join(", "));
  ok(R.T.tk===3, "profil tk harus 3, dapat "+R.T.tk);
  ok(R.tips.some(t=>t.k==="tk"), "harus ada tips vs tanky");
  console.log("Aamon vs full tank →", items.join(" | "));
}
// ---- 3. Lylia vs comp burst ----
{
  const R = recommend(by("Lylia"), "Mid", ["Eudora","Saber","Aurora","Gusion","Ling"].map(by), {});
  const items = R.items.map(i=>i.item);
  ok(items.includes("Winter Crown"), "Lylia vs burst harus ada Winter Crown: "+items.join(", "));
  ok(R.T.buM>=2 || R.T.buP>=2, "profil burst harus >=2");
  console.log("Lylia vs burst →", items.join(" | "), "| spell:", R.spell.main, "/", R.spell.alt);
}
// ---- 4. Layla vs dive ----
{
  const R = recommend(by("Layla"), "Gold", ["Ling","Fanny","Lancelot","Hayabusa","Natalia"].map(by), {});
  const items = R.items.map(i=>i.item);
  ok(items.includes("Wind of Nature"), "Layla vs dive fisik harus ada Wind of Nature: "+items.join(", "));
  ok(R.T.dv===3, "dv harus 3, dapat "+R.T.dv);
  console.log("Layla vs dive →", items.join(" | "));
}
// ---- 5. Tigreal vs comp heal ----
{
  const R = recommend(by("Tigreal"), "Roam", ["Estes","Rafaela","Uranus","Alucard","Ruby"].map(by), {});
  const items = R.items.map(i=>i.item);
  ok(items.includes("Dominance Ice"), "Tigreal vs heal harus ada Dominance Ice: "+items.join(", "));
  console.log("Tigreal vs heal comp →", items.join(" | "));
}
// ---- 6. Thamuz vs full magic + CC ----
{
  const R = recommend(by("Thamuz"), "EXP", ["Eudora","Kagura","Vale","Cecilion","Valir"].map(by), {});
  const items = R.items.map(i=>i.item);
  ok(items[0]==="Tough Boots", "Thamuz vs magic+CC harus Tough Boots, dapat "+items[0]);
  ok(items.includes("Athena's Shield")||items.includes("Radiant Armor")||items.includes("Oracle"), "Thamuz vs magic harus ada magic def: "+items.join(", "));
  console.log("Thamuz vs full magic →", items.join(" | "));
}
// ---- 7. Override manual tanpa hero lawan ----
{
  const R = recommend(by("Miya"), "Gold", [], {hl:3});
  const items = R.items.map(i=>i.item);
  ok(items.includes("Sea Halberd"), "Miya + override heal harus ada Sea Halberd: "+items.join(", "));
  console.log("Miya + paksa heal →", items.join(" | "));
}
// ---- 8. CC ekstrem → Purify buat MM ----
{
  const R = recommend(by("Hanabi"), "Gold", ["Franco","Atlas","Tigreal","Kaja","Aurora"].map(by), {});
  ok(R.T.cc===3, "cc harus 3, dapat "+R.T.cc);
  ok(R.spell.main==="Purify", "Hanabi vs CC ekstrem harus Purify, dapat "+R.spell.main);
  console.log("Hanabi vs CC ekstrem → spell:", R.spell.main, "| boots:", R.items[0].item);
}
// ---- 9. Semua hero x beberapa comp: 6 item unik & valid ----
{
  const comps = [
    ["Tigreal","Estes","Layla","Eudora","Saber"],
    ["Fanny","Ling","Gusion","Natalia","Hayabusa"],
    ["Uranus","Belerick","Hylos","Estes","Alice"],
    ["Karrie","Claude","Miya","Bruno","Moskov"],
    [],
  ];
  let n=0;
  HEROES.forEach(h=>{
    ["EXP","Jungle","Mid","Gold","Roam"].forEach(L=>{
      comps.forEach(c=>{
        const R = recommend(h, L, c.map(by), {});
        const items = R.items.map(i=>i.item);
        ok(items.length===6, h.n+"@"+L+": "+items.length+" item ("+items.join(",")+")");
        ok(new Set(items).size===items.length, h.n+"@"+L+": item dobel ("+items.join(",")+")");
        items.forEach(it=>ok(ITEMS[it], h.n+": item ga dikenal "+it));
        ok(ITEMS[items[0]].c==="boot", h.n+"@"+L+": slot 1 bukan boots ("+items[0]+")");
        ok(SPELLS[R.spell.main], h.n+"@"+L+": spell utama? "+R.spell.main);
        ok(!R.spell.alt || SPELLS[R.spell.alt], h.n+"@"+L+": spell alt? "+R.spell.alt);
        ok(R.spell.main!==R.spell.alt, h.n+"@"+L+": spell utama = alt ("+R.spell.main+")");
        n++;
      });
    });
  });
  console.log("Kombinasi diuji:", n);
}

// ---- 10. Lane bebas ----
{
  const R = recommend(by("Esmeralda"), "Jungle", [], {});
  ok(R.spell.main==="Retribution", "Esme jungle harus Retribution, dapat "+R.spell.main);
  ok(R.spell.blessing, "Esme jungle harus dapat blessing");
  const R2 = recommend(by("Esmeralda"), "Gold", [], {});
  ok(R2.spell.main!=="Retribution", "Esme gold ga boleh Retribution");
  const R3 = recommend(by("Layla"), "Roam", [], {});
  ok(R3.roam && ROAM[R3.roam.bless], "Layla roam harus dapat roam blessing, dapat "+JSON.stringify(R3.roam));
  const R4 = recommend(by("Tigreal"), "Roam", [], {});
  ok(R4.roam && R4.roam.bless==="Encourage", "Tigreal roam blessing default Encourage");
  const HUNTERS = ["Ice Hunter's","Flame Hunter's","Behemoth Hunter's"];
  ok(HUNTERS.includes(R.spell.blessing), "Esme JG blessing harus Hunter's baru, dapat "+R.spell.blessing);
  const R5 = recommend(by("Akai"), "Jungle", [], {}); // tank jungler
  ok(R5.spell.blessing==="Behemoth Hunter's", "Akai (tank) JG harus Behemoth Hunter's, dapat "+R5.spell.blessing);
  const R6 = recommend(by("Fanny"), "Jungle", ["Ling","Fanny","Lancelot","Wanwan","Benedetta"].map(by), {});
  ok(R6.spell.blessing==="Ice Hunter's", "Fanny vs dive-heavy harus Ice Hunter's, dapat "+R6.spell.blessing);
  ok(BLESSINGS["Bloody Retribution"]===undefined, "Bloody Retribution harus udah dihapus");
  console.log("Lane bebas: Esme JG →", R.spell.main, "/", R.spell.blessing, "| Akai JG →", R5.spell.blessing, "| Layla Roam →", R3.roam.bless);
}
// ---- 11. Icon coverage ----
{
  const need = [];
  Object.keys(ITEMS).forEach(k=>{ if(!ICON_MAP[k]) need.push("item:"+k); });
  Object.keys(EMBLEMS).forEach(k=>{ if(!ICON_MAP[k]) need.push("emblem:"+k); });
  Object.keys(SPELLS).forEach(k=>{ if(!ICON_MAP[k]) need.push("spell:"+k); });
  Object.keys(BLESSINGS).forEach(k=>{ if(!ICON_MAP[k]) need.push("bless:"+k); });
  Object.keys(ROAM).forEach(k=>{ if(!ICON_MAP[k]) need.push("roam:"+k); });
  ok(need.length===0, "icon belum ada: "+need.join(", "));
  Object.values(ICON_MAP).forEach(v=>ok(GLYPHS[v[0]], "glyph ga ada: "+v[0]));
  console.log("Icon coverage:", Object.keys(ICON_MAP).length, "entri, semua glyph valid");
}
console.log(fails===0 ? "\n✅ SEMUA TEST LULUS" : "\n❌ "+fails+" test gagal");
process.exit(fails===0?0:1);
