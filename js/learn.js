/* ===== โหมดเรียนรู้: ฉากแอนิเมชันทีละขั้น ===== */
(function(){
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const STAGES = ["อาการ","ตรวจ","วินิจฉัย","ซ่อม","ทดสอบ","สรุป"];
  let muted = false;
  try{ muted = localStorage.getItem("pht-mute")==="1"; }catch(e){}

  /* ---------- ภาพเครื่องส่องไฟ (ใช้ร่วมกับโหมดสอบ) ---------- */
  function pumpSVG(){ return PHDIA.svg({cls:"lp"}) + `<div class="sx-cap" aria-live="polite"></div>`; }

  /* ภาพขยายชิ้นส่วน: ชื่อ "ชนิด_สถานะ" เติม " fixed" เพื่อแสดงสภาพหลังแก้ */
  const ZT = {led:"ภาพขยายแผง LED", cover:"ภาพขยายฝาครอบเลนส์", row:"ภาพขยาย LED หนึ่งแถว (ต่ออนุกรม)", fan:"ภาพขยายพัดลมระบายความร้อน",
    psu:"ภาพขยายภาคจ่ายไฟ", dist:"ระยะโคมถึงเตียง"};
  function zoomSVG(kind){
    const k=kind.split(/[_ ]/)[0]; let b="";
    const dots=(cls,n,x0,y,step,r)=>{let o="";for(let i=0;i<n;i++)o+=`<circle class="${cls}" cx="${x0+i*step}" cy="${y}" r="${r}"/>`;return o;};
    if(k==="led") b=`<rect x="12" y="24" width="156" height="44" rx="6" class="zm-f"/>
      <g class="zm-old" style="fill:#6f8fbf;opacity:.55">${dots("",8,28,40,18,5)}${dots("",8,28,56,18,5)}</g>
      <g class="zm-new" style="fill:#4f9bff">${dots("",8,28,40,18,5)}${dots("",8,28,56,18,5)}</g>
      <text x="90" y="92" text-anchor="middle" class="zm-t zm-old zm-bad">23,400 h · แสงเหลือราว 60% ของ baseline</text><text x="90" y="92" text-anchor="middle" class="zm-t zm-new">แผงใหม่ 37.2 µW/cm²/nm</text>`;
    if(k==="cover") b=`<rect x="12" y="34" width="156" height="24" rx="6" class="zm-f"/>
      <rect x="14" y="36" width="152" height="20" rx="5" class="zm-old" style="fill:#d9c98c"/><g class="zm-dirt zm-old"><rect x="40" y="40" width="22" height="8" rx="2"/><rect x="110" y="42" width="26" height="8" rx="2"/><circle cx="84" cy="46" r="3"/></g>
      <rect x="14" y="36" width="152" height="20" rx="5" class="zm-new" style="fill:rgba(200,225,255,.7)"/>
      <text x="90" y="88" text-anchor="middle" class="zm-t zm-old zm-bad">พลาสติกเหลืองขุ่น คราบกาวเทป</text><text x="90" y="88" text-anchor="middle" class="zm-t zm-new">ฝาครอบใหม่ ใส</text>`;
    if(k==="row") b=`<path class="zm-o" d="M14 50 H166"/>
      <g class="zm-old">${dots("zm-f",7,26,50,22,6)}<circle cx="92" cy="50" r="6" fill="#5d6675"/><path class="zm-cr" d="M86 44 l12 12 M98 44 l-12 12"/></g>
      <g class="zm-new" style="fill:#4f9bff">${dots("",7,26,50,22,6)}</g>
      <text x="90" y="88" text-anchor="middle" class="zm-t zm-old zm-bad">ดวงที่ 4 ขาด ทั้งแถวไม่มีกระแส</text><text x="90" y="88" text-anchor="middle" class="zm-t zm-new">แผงย่อยใหม่ ทั้งแถว 350 mA</text>`;
    if(k==="fan") b=`<rect x="50" y="14" width="80" height="70" rx="10" class="zm-f"/><circle cx="90" cy="49" r="26" class="zm-o"/>
      <g class="zm-old"><path class="zm-o" d="M90 49 l-16 -10 M90 49 l16 10 M90 49 l10 -16 M90 49 l-10 16"/><path class="zm-cr" d="M70 29 l40 40"/></g>
      <g class="zm-new"><path class="zm-ok" d="M90 49 l-16 -10 M90 49 l16 10 M90 49 l10 -16 M90 49 l-10 16"/></g>
      <text x="90" y="100" text-anchor="middle" class="zm-t zm-old zm-bad">ไฟเลี้ยง 12.0 V แต่ไม่หมุน</text><text x="90" y="100" text-anchor="middle" class="zm-t zm-new">พัดลมใหม่ หมุน · ครีบสะอาด</text>`;
    if(k==="psu") b=`<rect x="14" y="20" width="152" height="60" rx="6" fill="#1f6f52" opacity=".85"/>
      <rect x="40" y="30" width="18" height="34" rx="4" fill="#3b4a5a"/><path class="zm-cr zm-old" d="M40 30 q9 -8 18 0"/><rect x="72" y="36" width="30" height="20" rx="2" fill="#1d2430"/><rect x="116" y="30" width="38" height="26" rx="3" fill="#e8e4dc"/>
      <text x="90" y="98" text-anchor="middle" class="zm-t zm-old zm-bad">ตัวเก็บประจุบวม · ไฟออก 0 V</text><text x="90" y="98" text-anchor="middle" class="zm-t zm-new">ภาคจ่ายไฟใหม่ 24.1 V</text>`;
    if(k==="dist") b=`<rect x="30" y="8" width="70" height="10" rx="4" class="zm-f zm-old"/><rect x="30" y="40" width="70" height="10" rx="4" class="zm-f zm-new"/><rect x="20" y="84" width="90" height="8" rx="3" class="zm-f"/>
      <path class="zm-o zm-old" d="M130 18 V84 M126 18 h8 M126 84 h8"/><path class="zm-ok zm-new" d="M146 50 V84 M142 50 h8 M142 84 h8"/>
      <text x="138" y="54" text-anchor="middle" class="zm-t zm-old zm-bad">55 cm · 15.2</text><text x="160" y="70" text-anchor="middle" class="zm-t zm-new">30 cm · 36.0</text>`;
    return `<svg class="zm zm-${k} ${kind}" viewBox="0 0 180 110" role="img" aria-label="${ZT[k]||""}">${b}</svg>`;
  }

  /* ---------- ใช้สถานะกับภาพ ---------- */
  function applyVis(box, v){
    v = v||{};
    const svg = box.querySelector("svg.sx"); if(!svg) return;
    clearTimeout(box._t1); clearTimeout(box._t2);
    PHDIA.state(svg, v);
    const cap=box.querySelector(".sx-cap"); if(cap) cap.innerHTML=v.cap?`<span>${esc(v.cap)}</span>`:"";
    box.classList.remove("working");
    if(v.later){ box._t2=setTimeout(()=>{ PHDIA.state(svg, Object.assign({}, v, v.later, {later:null})); if(cap&&v.later.cap) cap.innerHTML=`<span>${esc(v.later.cap)}</span>`; if(v.later.beep) beep(); }, v.delay||2400); }
    const ins = box.querySelector(".ins"); if(!ins) return;
    let h="";
    if(v.gauge){ const g=v.gauge, mx=g.max||100, mn=g.min||0;
      h+=`<div class="inst"><div class="inst-n">${esc(g.n)}</div>
      <div class="gauge"><div class="g-fill"></div>${g.th!==undefined?`<div class="g-th" style="left:${Math.min(100,(g.th-mn)/(mx-mn)*100)}%"><span>${esc(g.thl||"เกณฑ์ "+g.th+(g.unit||""))}</span></div>`:""}</div>
      <div class="g-v">0${esc(g.unit||"")}</div></div>`; }
    if(v.meter) h+=`<div class="inst"><div class="inst-n">${esc(v.meter.n)}</div><div class="meter big">${esc(v.meter.v)}</div></div>`;
    if(v.zoom) h+=`<div class="inst"><div class="inst-n">${ZT[v.zoom.split(/[_ ]/)[0]]||""}</div>${zoomSVG(v.zoom)}</div>`;
    ins.innerHTML=h;
    if(v.gauge) animGauge(ins, v.gauge);
  }
  function animGauge(ins,g){
    const f=ins.querySelector(".g-fill"), t=ins.querySelector(".g-v"), mx=g.max||100, mn=g.min||0, u=g.unit||"", dp=g.dp||0;
    const bad = g.bad==="below" ? (x=>x<g.th) : g.bad==="above" ? (x=>x>g.th) : (()=>false);
    const pct = x=>Math.min(100,Math.max(0,(x-mn)/(mx-mn)*100))+"%";
    const fmt = x=>(+x).toFixed(dp);
    const from = g.still ? g.v : (g.from!==undefined?g.from:mn);
    f.style.transition="none"; f.style.width=pct(from);
    f.classList.toggle("bad",bad(from)); t.textContent=fmt(from)+u;
    if(g.still){ f.classList.toggle("bad",bad(g.v)); return; }
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      f.style.transition="width 1.6s cubic-bezier(.3,.7,.3,1), background .3s"; f.style.width=pct(g.v);
      const t0=performance.now();
      (function tick(now){ const k=Math.min(1,(now-t0)/1600), e=1-Math.pow(1-k,3), x=from+(g.v-from)*e;
        t.textContent=fmt(x)+u; f.classList.toggle("bad",bad(x)); if(k<1) requestAnimationFrame(tick); })(t0);
    }));
  }

  /* แอนิเมชันพิเศษ แล้วเรียก done เมื่อจบ */
  function runAnim(box, name, done){
    if(name==="work"){
      box.classList.add("working");
      box._t1=setTimeout(()=>{ box.classList.remove("working"); done(); }, 1800);
    }else if(name==="rerun"){
      box._t1=setTimeout(done, 2400);
    }else if(name==="fix"){
      const zm=box.querySelector(".zm"); box.classList.add("working");
      box._t1=setTimeout(()=>{ box.classList.remove("working"); if(zm) zm.classList.add("fixed"); setTimeout(done,500); }, 1600);
    }else done();
  }

  let actx=null;
  function beep(){
    if(muted) return;
    try{
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      [0,0.28,0.56].forEach(d=>{
        const o=actx.createOscillator(), g=actx.createGain();
        o.type="square"; o.frequency.value=880; g.gain.value=0.04;
        o.connect(g); g.connect(actx.destination);
        o.start(actx.currentTime+d); o.stop(actx.currentTime+d+0.16);
      });
    }catch(e){}
  }

  /* ---------- ภาพอาการสำหรับโหมดสอบ (ไม่เน้นชิ้นส่วน เพื่อไม่บอกใบ้) ---------- */
  const MINI = {
    "แสงอ่อนทั้งเตียง":{lvl:"hi", dim:0.6, rad:21.6, hours:23400, cap:"ไฟติดครบทุกแถว แต่วัดได้ 21.6 µW/cm²/nm"},
    "ค่าวัดแสงลดลง":{lvl:"hi", cover:"dirty", rad:24.3, hours:6100, cap:"PM ปีก่อน 36 วันนี้ 24.3 µW/cm²/nm"},
    "แถบมืดบนเตียง":{lvl:"hi", dark:true, alarm:"LED FAULT", rad:15.8, hours:9800, cap:"มีแถบแสงจางกลางเตียง ไฟ LED FAULT ติด"},
    "ดับเอง ไฟ OVER TEMP":{lvl:"hi", cap:"เปิดได้ปกติ…", later:{off:true, hot:true, cap:"ราว 20 นาทีแล้วแสงดับ ไฟแดงกะพริบ"}, delay:2600},
    "เครื่องไม่ติด":{off:true, cap:"เปิดสวิตช์ ไม่มีไฟใดติด"},
    "บิลิรูบินไม่ลด":{lvl:"hi", dist:55, cap:"เครื่องเปิดติด แสงดูสว่างดี"}
  };
  function mini(el, c){
    el.innerHTML = `<div class="lpbox mini">${pumpSVG()}</div>`;
    applyVis(el.querySelector(".lpbox"), MINI[c.alarm]||{lvl:"hi"});
  }

  /* ---------- ตัวเล่นฉาก ---------- */
  function start(id, root, hooks){
    const L = window.LEARN.find(x=>x.id===id); if(!L) return;
    const st = {k:0, tries:0, firstOk:0, picked:null, answered:false, log:[]};
    const qs = L.scenes.filter(s=>s.opts).length;

    function stageBar(stage){
      const si=STAGES.indexOf(stage);
      return `<ol class="stepper">${STAGES.map((s,i)=>`<li class="${i<si?"ok":i===si?"on":""}"><span>${i+1}</span>${s}</li>`).join("")}</ol>`;
    }

    function render(){
      const sc = L.scenes[st.k];
      if(!sc){ return summary(); }
      root.innerHTML = `
        <div class="simhead"><button class="ghost" id="ln-back">← รายการเคส</button>
          <div class="meta"><button class="ghost" id="ln-mute" aria-label="เปิด/ปิดเสียง">${muted?"🔇 ปิดเสียง":"🔊 เปิดเสียง"}</button></div></div>
        <h1>${esc(L.n)} <span class="tag">โหมดเรียนรู้</span></h1>
        ${stageBar(sc.stage)}
        <div class="lgrid">
          <div class="lpbox" id="lpbox">${pumpSVG()}<div class="wrk">🔧 กำลังดำเนินการ…</div><div class="ins"></div></div>
          <div class="lstory">
            <div class="kicker">ขั้นที่ ${st.k+1} / ${L.scenes.length} · ${esc(sc.stage)}</div>
            <h2>${esc(sc.title)}</h2>
            <p>${esc(sc.text)}</p>
            ${sc.opts?`<div class="lopts">${sc.opts.map((o,i)=>`<button class="lopt" data-i="${i}">${esc(o.t)}</button>`).join("")}</div>
              <div id="fb"></div>`
            :`<div class="tools"><button class="primary" id="ln-next">${esc(sc.next||"ต่อไป")} →</button></div>`}
          </div>
        </div>`;
      const box=root.querySelector("#lpbox");
      applyVis(box, sc.vis);
      if(sc.vis && sc.vis.beep) beep();
      root.querySelector("#ln-back").onclick=()=>{clearTimeout(box._t1);hooks.onBack();};
      root.querySelector("#ln-mute").onclick=e=>{muted=!muted;try{localStorage.setItem("pht-mute",muted?"1":"0")}catch(_){}
        e.currentTarget.textContent=muted?"🔇 ปิดเสียง":"🔊 เปิดเสียง";};
      const nx=root.querySelector("#ln-next"); if(nx) nx.onclick=()=>{st.k++;st.answered=false;st.tries=0;render();window.scrollTo(0,0);};
      root.querySelectorAll(".lopt").forEach(b=>b.onclick=()=>pick(+b.dataset.i));
    }

    function pick(i){
      const sc=L.scenes[st.k], o=sc.opts[i], box=root.querySelector("#lpbox");
      if(st.answered) return;
      const btns=[...root.querySelectorAll(".lopt")];
      btns.forEach(b=>b.disabled=true);
      btns[i].classList.add("picked");
      const fb=root.querySelector("#fb");
      fb.innerHTML=`<div class="fb wait">กำลังดำเนินการ… ดูภาพเครื่อง</div>`;
      const mob = window.innerWidth<900;
      if(mob) box.scrollIntoView({behavior:"smooth",block:"start"});
      if(o.vis) applyVis(box, o.vis); else applyVis(box, sc.vis);
      if(o.vis && o.vis.beep) beep();
      runAnim(box, o.anim, ()=>{
        if(o.after){ applyVis(box, o.after); if(o.after.beep) beep(); }
        const good = o.ok===true, mid=o.ok==="costly";
        if(good||mid){ st.answered=true; if(st.tries===0&&good) st.firstOk++; st.log.push({t:sc.title, a:(sc.opts.find(x=>x.ok===true)||o).t}); }
        else st.tries++;
        btns[i].classList.add(good?"good":mid?"mid":"bad");
        const last = st.k===L.scenes.length-1;
        fb.innerHTML=`<div class="fb ${good?"good":mid?"mid":"bad"}">
          <b>${good?"✓ ถูกต้อง":mid?"△ ได้ผล แต่ยังไม่ใช่วิธีที่ดีที่สุด":"✗ ยังไม่ใช่"}</b><p>${esc(o.fb)}</p>
          ${good||mid?`<button class="primary" id="ln-go">${last?"ดูสรุป":"ขั้นต่อไป"} →</button>`:`<button id="ln-retry">ลองตัวเลือกอื่น</button>`}</div>`;
        const go=root.querySelector("#ln-go"); if(go) go.onclick=()=>{st.k++;st.answered=false;st.tries=0;render();window.scrollTo(0,0);};
        const rt=root.querySelector("#ln-retry"); if(rt) rt.onclick=()=>{
          applyVis(box, sc.vis); fb.innerHTML="";
          btns.forEach((b,j)=>{ if(!b.classList.contains("bad")) b.disabled=false; b.classList.remove("picked"); });
        };
        if(mob) setTimeout(()=>fb.scrollIntoView({behavior:"smooth",block:"center"}), o.anim||o.vis?900:0);
      });
    }

    function summary(){
      const C = window.SIM.CASES.find(c=>c.id===id);
      window.Score&&Score.record({key:"learn:"+id, mod:(window.APP_CONFIG||{}).simMod?(window.APP_CONFIG.simMod+" (เรียนรู้)"):"3-จำลองซ่อม (เรียนรู้)", item:L.n, score:st.firstOk, max:qs, detail:"ตอบถูกในครั้งแรก"});
      root.innerHTML = `
        <div class="simhead"><button class="ghost" id="ln-back">← รายการเคส</button></div>
        <h1>${esc(L.n)} <span class="tag">โหมดเรียนรู้</span></h1>
        ${stageBar("สรุป")}
        <div class="score ${st.firstOk===qs?"ok":st.firstOk>=qs-2?"mid":"bad"}"><div class="big">${st.firstOk}/${qs}</div><div>ข้อที่ตอบถูกในครั้งแรก</div></div>
        <h2>ลำดับการทำงานที่ถูกต้อง</h2>
        <ol class="recap">${st.log.map(l=>`<li><b>${esc(l.t)}</b><span>${esc(l.a)}</span></li>`).join("")}</ol>
        ${C?`<h2>ข้อคิด</h2><div class="learn"><p>${esc(C.learn)}</p></div>`:""}
        <div class="tools"><button id="ln-again">เรียนเคสนี้ใหม่</button>${C?`<button class="primary" id="ln-exam">ลองทำเคสนี้ในโหมดสอบ →</button>`:""}<button class="ghost" id="ln-list">รายการเคส</button></div>`;
      root.querySelector("#ln-back").onclick=hooks.onBack;
      root.querySelector("#ln-list").onclick=hooks.onBack;
      root.querySelector("#ln-again").onclick=()=>start(id,root,hooks);
      const ex=root.querySelector("#ln-exam"); if(ex) ex.onclick=()=>hooks.onExam(id);
      window.scrollTo(0,0);
    }
    render(); window.scrollTo(0,0);
  }

  window.Learn = {start, mini, has:id=>window.LEARN.some(x=>x.id===id)};
})();
