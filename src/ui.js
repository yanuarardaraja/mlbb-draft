// ==== UI ====
const ROLE_COLORS = {Tank:"var(--tank)",Fighter:"var(--fighter)",Assassin:"var(--assassin)",Mage:"var(--mage)",Marksman:"var(--marksman)",Support:"var(--support)"};
const ROLES = ["Semua","Tank","Fighter","Assassin","Mage","Marksman","Support"];
const UI_KEYS = ["tk","buP","buM","dp","cc","hl","ss","dv","pk","iv","td"];
const ALL_LANES = ["EXP","Jungle","Mid","Gold","Roam"];

HEROES.sort((a,b)=>a.n.localeCompare(b.n));

const S = { me:null, lane:null, enemies:[], ov:{}, fMe:"Semua", fEn:"Semua", qMe:"", qEn:"" };

const $ = id => document.getElementById(id);
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// ---- role filters ----
function renderRoleFilter(elId, cur, setter){
  const el = $(elId); el.innerHTML = "";
  ROLES.forEach(r=>{
    const c = document.createElement("span");
    c.className = "rchip" + (cur===r ? " on" : "");
    if (cur===r) c.style.background = r==="Semua" ? "var(--gold)" : ROLE_COLORS[r];
    c.textContent = r;
    c.onclick = ()=>{ setter(r); renderAll(); };
    el.appendChild(c);
  });
}

// ---- hero grids ----
function heroMatch(h, q, f){
  if (f!=="Semua" && h.r!==f) return false;
  if (q && !h.n.toLowerCase().includes(q.toLowerCase())) return false;
  return true;
}
function renderGrid(elId, mode){
  const el = $(elId); el.innerHTML = "";
  const q = mode==="me" ? S.qMe : S.qEn;
  const f = mode==="me" ? S.fMe : S.fEn;
  HEROES.forEach(h=>{
    if (!heroMatch(h,q,f)) return;
    const b = document.createElement("div");
    let cls = "hbtn";
    if (mode==="me"){
      if (S.me===h.n) cls += " sel";
      if (S.enemies.includes(h.n)) cls += " dis";
    } else {
      if (S.enemies.includes(h.n)) cls += " sel";
      if (S.me===h.n) cls += " dis";
      if (S.enemies.length>=5 && !S.enemies.includes(h.n)) cls += " dis";
    }
    b.className = cls;
    const ini = h.n.split(/[\s-]/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
    b.innerHTML = '<span class="dot" style="background:'+(ROLE_COLORS[h.r]||"var(--tx3)")+'">'+ini+'</span>'+esc(h.n);
    b.title = h.r + " · lane meta: " + h.l.join("/");
    b.onclick = ()=>{
      if (mode==="me"){
        if (S.me===h.n){ S.me=null; S.lane=null; }
        else { S.me=h.n; S.lane=h.l[0]; }
      } else {
        const i = S.enemies.indexOf(h.n);
        if (i>=0) S.enemies.splice(i,1);
        else if (S.enemies.length<5) S.enemies.push(h.n);
      }
      renderAll();
    };
    el.appendChild(b);
  });
  if (!el.children.length) el.innerHTML = '<span class="mini" style="grid-column:1/-1;padding:8px;">Ga ketemu — cek ejaan?</span>';
}

function heroByName(n){ return HEROES.find(h=>h.n===n); }

function renderSel(){
  const sm = $("selMe");
  if (S.me){
    const h = heroByName(S.me);
    sm.innerHTML = '<span class="schip" style="border-color:'+(ROLE_COLORS[h.r]||"")+'"><b>'+esc(h.n)+'</b> <span class="mini">'+h.r+'</span> <span class="x" onclick="S.me=null;S.lane=null;renderAll()">✕</span></span>';
  } else sm.innerHTML = '<span class="mini">Belum pilih hero.</span>';

  const lr = $("laneRow"); lr.innerHTML = "";
  if (S.me){
    const h = heroByName(S.me);
    const lab = document.createElement("span"); lab.className="mini"; lab.style.paddingTop="5px"; lab.textContent="Lane:"; lr.appendChild(lab);
    ALL_LANES.forEach(L=>{
      const c = document.createElement("span");
      c.className = "lane" + (S.lane===L ? " on" : "");
      c.innerHTML = esc(L) + (h.l.includes(L) ? '<span class="st">★</span>' : "");
      c.title = h.l.includes(L) ? "Lane meta " + h.n : "Off-meta — tetap bisa, build & spell nyesuain";
      c.onclick = ()=>{ S.lane=L; renderAll(); };
      lr.appendChild(c);
    });
    const hint = document.createElement("span"); hint.className="mini"; hint.style.paddingTop="6px"; hint.innerHTML="★ = lane umum, tapi bebas pilih";
    lr.appendChild(hint);
  }

  const se = $("selEn");
  if (S.enemies.length){
    se.innerHTML = S.enemies.map(n=>{
      const h = heroByName(n);
      return '<span class="schip" style="border-color:'+(ROLE_COLORS[h.r]||"")+'"><b>'+esc(n)+'</b> <span class="x" onclick="rmEn(\''+n.replace(/'/g,"\\'")+'\')">✕</span></span>';
    }).join("") + '<button class="clear" onclick="S.enemies=[];renderAll()">Reset</button>';
  } else se.innerHTML = '<span class="mini">Belum ada lawan dipilih.</span>';
}
function rmEn(n){ const i=S.enemies.indexOf(n); if(i>=0) S.enemies.splice(i,1); renderAll(); }

// ---- threats ----
function currentProfile(){
  return threatProfile(S.enemies.map(heroByName), S.ov);
}
function renderThreats(T){
  const el = $("threats"); el.innerHTML = "";
  UI_KEYS.forEach(k=>{
    const v = T[k]||0;
    const ov = S.ov[k];
    const d = document.createElement("div");
    d.className = "tchip lv"+v + (ov===3?" forced":"") + (ov===0?" off":"");
    const ovLab = ov===3 ? "PAKSA ON" : ov===0 ? "OFF" : "AUTO";
    d.innerHTML = '<div class="tl"><span>'+THREAT_LABELS[k]+'</span><span class="ov">'+ovLab+'</span></div>'
      + '<div class="lv">'+LVL_LABEL[v]+'</div><div class="bar"><i></i></div>';
    d.onclick = ()=>{
      if (S.ov[k]===undefined) S.ov[k]=3;
      else if (S.ov[k]===3) S.ov[k]=0;
      else delete S.ov[k];
      renderAll();
    };
    el.appendChild(d);
  });
}

// ---- output ----
function renderOut(T){
  const el = $("out");
  if (!S.me){
    el.innerHTML = '<div class="placeholder">⚔️<br><br>Pilih <b>hero lu</b> dulu di panel kiri.<br>Terus pilih hero lawan (atau paksa ON ancaman manual) — emblem, spell, dan build bakal nyesuain otomatis.</div>';
    return;
  }
  const h = heroByName(S.me);
  const lane = S.lane || h.l[0];
  const R = recommend(h, lane, S.enemies.map(heroByName), S.ov);
  let html = "";

  // ringkasan matchup
  const act = UI_KEYS.filter(k=>(T[k]||0)>=2).map(k=>THREAT_LABELS[k]+" ("+LVL_LABEL[T[k]]+")");
  const offMeta = !h.l.includes(lane);
  html += '<div class="vs">'
    + '<b>'+esc(h.n)+'</b> <span class="mini">'+h.r+' · '+esc(lane)+(offMeta?' (off-meta — gaspol aja)':'')+'</span>'
    + (S.enemies.length ? ' &nbsp;vs&nbsp; <b>'+S.enemies.map(esc).join(", ")+'</b>' : "")
    + (act.length ? '<br><span class="mini">Ancaman utama: </span>'+act.join(" · ") : (T.empty ? '<br><span class="mini">Profil ancaman kosong — ini build default. Pilih lawan / paksa ON ancaman biar rekomendasinya nyesuain.</span>' : '<br><span class="mini">Ancaman lawan masih rendah — build mendekati default.</span>'))
    + (h.note ? '<br><span class="mini">💡 '+esc(h.note)+'</span>' : "")
    + '</div>';

  // emblem
  html += '<div class="ocard"><div class="ohead">'+iconImg(R.emblem.name,42,'emblem')
    + '<div><div class="otag">Emblem</div><div class="big">'+R.emblem.name+'</div>'
    + '<div class="why">'+esc(R.emblem.base)+' — '+esc(R.emblem.why)+'</div></div></div>';
  R.talents.tl.forEach((t,i)=>{
    html += '<div class="trow"><div class="tier">Tier '+(i+1)+'</div>'+iconImg(t,30,'talent')+'<div><div class="tname">'+esc(t)+'</div><div class="why">'+esc(R.talents.whys[i]||"")+'</div></div></div>';
  });
  if (R.talents.notes.length){
    html += '<ul class="plain notes">'+R.talents.notes.map(n=>'<li>'+esc(n)+'</li>').join("")+'</ul>';
  }
  html += '</div>';

  // spell
  html += '<div class="ocard"><div class="otag" style="margin-bottom:8px;">Battle Spell</div><div class="spgrid">';
  html += '<div class="spbox main"><div class="spflex">'+iconImg(R.spell.main,34,'spell')+'<div><div class="lab">Utama</div><div class="nm">'+esc(R.spell.main)+'</div><div class="why">'+esc(R.spell.why)+' '+esc(SPELLS[R.spell.main]||"")+'</div></div></div></div>';
  html += '<div class="spbox"><div class="spflex">'+iconImg(R.spell.alt,34,'spell')+'<div><div class="lab">Alternatif</div><div class="nm">'+esc(R.spell.alt||"-")+'</div><div class="why">'+esc(R.spell.altWhy||"")+'</div></div></div></div>';
  html += '</div>';
  if (R.spell.blessing){
    html += '<div class="spbox" style="margin-top:10px;border-color:var(--gold2);"><div class="spflex">'+iconImg(R.spell.blessing,34,'bless')+'<div><div class="lab">Jungle Blessing (Upgrade Retribution)</div><div class="nm" style="color:var(--gold)">'+esc(R.spell.blessing)+'</div><div class="why">'+esc(R.spell.blessWhy||"")+' '+esc(BLESSINGS[R.spell.blessing]||"")+'</div></div></div></div>';
  }
  if (R.roam){
    html += '<div class="spbox" style="margin-top:10px;"><div class="spflex">'+iconImg(R.roam.bless,34)+'<div><div class="lab">Roam Blessing</div><div class="nm">'+esc(R.roam.bless)+'</div><div class="why">'+esc(R.roam.why)+'</div></div></div></div>';
  }
  if (!R.spell.blessing && lane!=="Jungle" && h.l.includes("Jungle")){
    html += '<div class="mini" style="margin-top:9px;">ℹ️ '+esc(h.n)+' umum dipakai jungle — klik lane <b style="color:var(--gold)">Jungle</b> di panel kiri buat munculin Retribution + upgrade blessing-nya (Ice/Flame/Behemoth Hunter\'s).</div>';
  }
  html += '</div>';

  // build
  html += '<div class="ocard"><div class="otag" style="margin-bottom:4px;">Build Item (urutan beli)</div>';
  R.items.forEach((it,i)=>{
    html += '<div class="irow"><div class="icwrap"><span class="slotno">'+(i+1)+'</span>'+iconImg(it.item,34)+'</div>'
      + '<div style="flex:1"><div class="iname">'+esc(it.item)
      + ' <span class="phase">'+esc(it.phase)+'</span><span class="itag '+it.tag+'">'+(it.tag==="situasional"?"situasional — kenapa ↓":it.tag)+'</span></div>'
      + '<div class="why">'+esc(it.why)+'</div></div></div>';
  });
  if (R.swaps.length){
    html += '<div class="otag" style="margin:12px 0 2px;">Aturan Swap</div><ul class="plain">'+R.swaps.map(s=>'<li>'+esc(s)+'</li>').join("")+'</ul>';
  }
  html += '</div>';

  // tips
  if (R.tips.length){
    html += '<div class="ocard"><div class="otag" style="margin-bottom:4px;">Cara Bawa Matchup Ini</div><ul class="plain">'
      + R.tips.map(t=>'<li>'+esc(t.t)+'</li>').join("") + '</ul></div>';
  }
  el.innerHTML = html;
}

// ---- legend ----
function renderLegend(){
  $("legend").innerHTML = Object.keys(ROLE_COLORS).map(r=>'<span class="rl"><i style="background:'+ROLE_COLORS[r]+'"></i>'+r+'</span>').join("");
}

function renderAll(){
  renderRoleFilter("rfMe", S.fMe, v=>S.fMe=v);
  renderRoleFilter("rfEn", S.fEn, v=>S.fEn=v);
  renderGrid("gridMe","me");
  renderGrid("gridEn","en");
  renderSel();
  const T = currentProfile();
  renderThreats(T);
  renderOut(T);
}

$("qMe").addEventListener("input", e=>{ S.qMe=e.target.value; renderGrid("gridMe","me"); });
$("qEn").addEventListener("input", e=>{ S.qEn=e.target.value; renderGrid("gridEn","en"); });

renderLegend();
renderAll();
