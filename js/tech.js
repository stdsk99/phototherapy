/* ===== โมดูล 3: การใช้งานและความปลอดภัย (เครื่องส่องไฟ) =====
   แท็บ: บทเรียน · ฝึกตั้งค่า · ตรวจก่อนใช้งาน · มุมช่าง
   คะแนน clin:sim = ฝึกตั้งและวัด (5 ใบสั่ง × 2 = 10) + มุมช่าง (8 โจทย์ × 2 = 16) รวม 26 คะแนน
   ระบบส่งคะแนนครั้งเดียวเมื่อทำครบทั้งสองส่วน (เก็บผลส่วนที่ทำแล้วไว้ในเครื่องระหว่างรอ) */
(function(){
  const D=window.TECHUSE, root=document.getElementById("tech");
  if(!D||!root) return;
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const r1=x=>Math.round(x*10)/10, f1=x=>x.toFixed(1);
  const range=(a,b,s)=>{const o=[];for(let x=a;x<=b+1e-9;x+=s)o.push(r1(x));return o;};
  const TABS=[["learn","บทเรียน"],["set","ฝึกตั้งและวัดแสง"],["check","ตรวจก่อนใช้งาน"],["tech","มุมช่าง"]];
  const MOD="3-การใช้งานและความปลอดภัย";
  let tab="learn", lesson=D.lessons[0].id;

  /* ---------- คะแนนรวม 2 ส่วน ---------- */
  const K_P="pht-clin-part";
  const sid=()=>{ const p=window.Score&&Score.profile(); return p?p.sid:""; };
  function parts(){ try{ const o=JSON.parse(localStorage.getItem(K_P)); return o&&o.sid===sid()?o:{sid:sid()}; }catch(e){ return {sid:sid()}; } }
  function savePart(name, score, max){
    const o=parts(); o[name]={score, max, t:Date.now()};
    if(o.set && o.tech){
      const sc=o.set.score+o.tech.score, mx=o.set.max+o.tech.max;
      window.Score&&Score.record({key:"clin:sim", mod:MOD, item:"ฝึกตั้งและวัดแสง และมุมช่าง", score:sc, max:mx,
        detail:`ฝึกตั้งและวัด ${o.set.score}/${o.set.max} · มุมช่าง ${o.tech.score}/${o.tech.max}`});
      try{ localStorage.removeItem(K_P); }catch(e){}
      return {done:true, score:sc, max:mx};
    }
    try{ localStorage.setItem(K_P, JSON.stringify(o)); }catch(e){}
    return {done:false};
  }
  function statusBar(){
    const o=parts(), b=window.Score&&Score.bestOf("clin:sim");
    const one=(k,n)=>o[k]?`<span class="tp ok">✓ ${n} ${o[k].score}/${o[k].max}</span>`:`<span class="tp">○ ${n}</span>`;
    return `<div class="tstat"><b>คะแนนโมดูลนี้</b>${one("set","ฝึกตั้งและวัดแสง")}${one("tech","มุมช่าง")}
      <span class="muted small">${b?`ดีที่สุด ${Math.round(b.v*100)}% (${b.score}/${b.max})`:"ทำครบทั้งสองส่วนแล้วระบบจึงส่งคะแนน"} · เกณฑ์ผ่าน ≥ 80%</span></div>`;
  }

  function frame(body){
    root.innerHTML=`<h1>${esc(D.title)}</h1>
      <p class="muted">${esc(D.sub)}</p>
      <div class="note small" style="margin:0 0 10px">⚠️ ${esc(D.disclaimer)}</div>
      ${statusBar()}
      <div class="chips pmtabs">${TABS.map(([id,n])=>`<button data-t="${id}" class="${tab===id?"on":""}">${n}</button>`).join("")}</div>
      <div id="tu-body">${body}</div>`;
    root.querySelectorAll(".pmtabs [data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();window.scrollTo(0,0);});
  }

  /* ---------- บทเรียน ---------- */
  function block([t,c]){
    if(t==="p") return `<p>${c}</p>`;
    if(t==="ul") return `<ul>${c.map(x=>`<li>${x}</li>`).join("")}</ul>`;
    if(t==="ol") return `<ol>${c.map(x=>`<li>${x}</li>`).join("")}</ol>`;
    if(t==="ex") return `<div class="exbox"><b>ตัวอย่าง</b><br>${esc(c).replace(/\n/g,"<br>")}</div>`;
    if(t==="tip") return `<div class="hint">💡 ${c}</div>`;
    if(t==="warn") return `<div class="msg bad">⚠️ ${c}</div>`;
    return "";
  }
  function viewLearn(){
    const L=D.lessons.find(x=>x.id===lesson), i=D.lessons.indexOf(L);
    frame(`<div class="clgrid">
      <nav class="clnav">${D.lessons.map(x=>`<button data-l="${x.id}" data-seen="tech|${x.id}" class="${x.id===lesson?"on":""}">${esc(x.n)}</button>`).join("")}</nav>
      <article class="lesson"><h2>${esc(L.n)}</h2>${L.b.map(block).join("")}
        ${L.drill?`<div id="cfg-drill"></div>`:""}
        <div class="tools">${i>0?`<button data-go="${D.lessons[i-1].id}">◀ ${esc(D.lessons[i-1].n)}</button>`:""}
        ${i<D.lessons.length-1?`<button class="primary" data-go="${D.lessons[i+1].id}">${esc(D.lessons[i+1].n)} ▶</button>`:`<button class="primary" data-tab="set">ไปฝึกตั้งและวัดแสง ▶</button>`}</div>
      </article></div>`);
    if(window.Seen) Seen.mark("tech", lesson, root);
    root.querySelectorAll("[data-l],[data-go]").forEach(b=>b.onclick=()=>{lesson=b.dataset.l||b.dataset.go;render();if(window.innerWidth<900)root.querySelector(".lesson").scrollIntoView({behavior:"smooth"});});
    const t=root.querySelector("[data-tab]"); if(t) t.onclick=()=>{tab="set";render();window.scrollTo(0,0);};
  }

  /* ---------- ฝึกตั้งและวัดแสง (เครื่องส่องไฟจำลอง) ---------- */
  const P=D.panel;
  const LN={hi:"HIGH", lo:"LOW"};
  function genOrder(kind){
    const who=pick(["หอผู้ป่วยทารกแรกเกิด","หอผู้ป่วยทารกวิกฤต","หอผู้ป่วยกุมารเวชกรรม"]);
    const O={
      hi:()=>({kind, lvl:"hi", d:P.dStd, who, text:`เครื่องกลับจากซ่อม ส่งคืนพร้อมใช้: ตั้ง HIGH ระยะ ${P.dStd} cm ตามคู่มือ แล้ววัดยืนยันกลางเตียงว่าได้อย่างน้อย ${P.hiMin} µW/cm²/nm`}),
      lo:()=>({kind, lvl:"lo", d:P.dStd, who, text:`หน่วยงานขอตั้ง LOW ตามคำสั่งการรักษา: ตั้ง LOW ระยะ ${P.dStd} cm แล้ววัดกลางเตียงบันทึกค่าไว้ในใบงาน`}),
      rec:()=>({kind, lvl:"hi", d:P.dStd, who:"งาน PM", text:`ทำ PM: ตั้ง HIGH ระยะ ${P.dStd} cm วัดกลางเตียงด้วยเครื่องวัดที่สอบเทียบแล้ว แล้วบันทึกค่า`})
    };
    return O[kind]();
  }
  let setRound=null;
  function newSetRound(){ setRound={orders:shuffle(D.setKinds).slice(0,5).map(genOrder), i:0, res:[]}; }

  function viewSet(){
    if(!setRound) newSetRound();
    const R=setRound;
    if(R.i>=R.orders.length) return setSummary();
    const O=R.orders[R.i];
    const st={lvl:pick(["hi","lo"]), d:pick([40,45,50,25]), bad:Math.random()<.6?pick(["cloth","meter","center"]):"", seen:false, msg:"", read:null, readKey:""};
    frame(`<div class="simtop"><span class="kicker">ใบสั่งที่ ${R.i+1} / ${R.orders.length} · ${esc(O.who)}</span>
        <div class="simdots">${R.orders.map((x,k)=>`<i class="${R.res[k]===true?"ok":R.res[k]===false?"bad":k===R.i?"on":""}"></i>`).join("")}</div></div>
      <div class="order"><div class="tk-h"><span>📋 ใบสั่งงาน</span></div><p>${esc(O.text)}</p></div>
      <div class="sxset">
        <div class="lpbox" id="set-dev"></div>
        <div>
          <h3>ระดับความเข้ม</h3>
          <div class="ctrl" id="set-lvl">${["hi","lo"].map(m=>`<button data-m="${m}">${LN[m]}</button>`).join("")}</div>
          <h3>ระยะแผง LED ถึงผิวเตียง</h3>
          <div class="ctrl"><button data-k="-1" aria-label="ลดโคมลง">▼ ลด</button><button data-k="1" aria-label="ยกโคมขึ้น">▲ ยก</button></div>
          <h3>ตรวจและวัด</h3>
          <div class="ctrl"><button id="set-look">🔍 ตรวจโคมและเครื่องวัด</button><button id="set-fix" hidden></button><button id="set-meas">📏 วัดแสงกลางเตียง</button></div>
          <p class="read" id="set-read"></p>
          <div class="imsg small" id="set-msg" role="status"></div>
          <p class="muted small">ปุ่ม ▲▼ ปรับระยะทีละ ${P.dStep} cm · ทุกครั้งที่เปลี่ยนระดับหรือระยะ ต้องวัดใหม่</p>
          <div class="tools"><button class="primary" id="set-go">ส่งงาน</button></div>
          <div id="set-side"></div>
        </div>
      </div>`);
    const dev=root.querySelector("#set-dev"); dev.innerHTML=PHDIA.svg({cls:"lp", labels:false});
    const svg=dev.querySelector("svg");
    const FIX={cloth:"เอาผ้าออกจากโคม", meter:"เปลี่ยนเป็นเครื่องวัดที่สอบเทียบแล้ว", center:"เลื่อนโคมให้อยู่กลางเตียงและขนาน"};
    const key=()=>st.lvl+"|"+st.d+"|"+st.bad;
    function value(){ let e=PHDIA.irr({lvl:st.lvl, dist:st.d, cloth:st.bad==="cloth"}); if(st.bad==="center") e=Math.round(e*0.78*10)/10; return e; }
    function paint(){
      PHDIA.state(svg,{lvl:st.lvl, dist:st.d, cloth:st.bad==="cloth", rad:st.read===null?"--":st.bad==="meter"&&st.readKey===key()?st.read.toFixed(1)+"?":st.read, hi:st.seen&&st.bad?(st.bad==="meter"?"meter":st.bad==="cloth"?"cover":"arm"):[]});
      root.querySelectorAll("#set-lvl [data-m]").forEach(b=>b.classList.toggle("on",b.dataset.m===st.lvl));
      root.querySelector("#set-read").textContent=`${LN[st.lvl]} · ระยะ ${st.d} cm${st.read!==null&&st.readKey===key()?` · วัดได้ ${st.read.toFixed(1)} µW/cm²/nm`:""}`;
      root.querySelector("#set-msg").textContent=st.msg;
      const fx=root.querySelector("#set-fix"); fx.hidden=!(st.seen&&st.bad); if(st.bad) fx.textContent=FIX[st.bad];
    }
    const changed=()=>{ st.read=null; st.readKey=""; };
    root.querySelectorAll("#set-lvl [data-m]").forEach(b=>b.onclick=()=>{ if(st.lvl!==b.dataset.m){ st.lvl=b.dataset.m; changed(); } st.msg=""; paint(); });
    root.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{ const nd=Math.max(P.dMin,Math.min(P.dMax, st.d+(+b.dataset.k)*P.dStep));
      st.msg=nd===st.d?"ถึงขอบเขตที่ปรับได้แล้ว":""; if(nd!==st.d){ st.d=nd; changed(); } paint(); });
    root.querySelector("#set-look").onclick=()=>{ st.seen=true;
      const M={cloth:"มีผ้าพาดอยู่บนโคม บังแสงบางส่วนและปิดช่องระบาย", meter:"เครื่องวัดที่หยิบมาหมดอายุสอบเทียบ 14 เดือน", center:"โคมเยื้องไปทางปลายเท้าและเอียง ไม่ขนานกับเตียง"};
      st.msg=st.bad?M[st.bad]:"โคมอยู่กลางเตียง ขนาน ไม่มีสิ่งบังแสง เครื่องวัดเป็นรุ่นที่ผู้ผลิตแนะนำและยังอยู่ในอายุสอบเทียบ"; paint(); };
    root.querySelector("#set-fix").onclick=()=>{ st.msg=FIX[st.bad]+" เรียบร้อย วัดใหม่อีกครั้ง"; st.bad=""; changed(); paint(); };
    root.querySelector("#set-meas").onclick=()=>{ st.read=value(); st.readKey=key();
      st.msg=st.bad==="meter"?"อ่านค่าได้ แต่เครื่องวัดนี้หมดอายุสอบเทียบ ใช้ยืนยันผลไม่ได้":st.d!==P.dStd?`วัดได้ แต่ระยะไม่ใช่ ${P.dStd} cm ตามคู่มือ เทียบกับเกณฑ์ไม่ได้`:""; paint(); };
    root.querySelector("#set-go").onclick=()=>{
      const okL=st.lvl===O.lvl, okD=st.d===O.d, okP=!st.bad, okM=st.read!==null&&st.readKey===key(), okV=okM&&(O.lvl!=="hi"||st.read>=P.hiMin), all=okL&&okD&&okP&&okM&&okV;
      R.res[R.i]=all;
      const side=root.querySelector("#set-side"), last=R.i===R.orders.length-1;
      root.querySelectorAll(".sxset button").forEach(b=>b.disabled=true);
      side.innerHTML=`<h2>${all?"✓ ตั้งและวัดถูกต้อง +2":"✗ ยังไม่ถูก +0"}</h2>
        <ul class="gl"><li class="${okL?"ok":"bad"}">ระดับ ${LN[st.lvl]} ${okL?"✓":"✗ ควรเป็น "+LN[O.lvl]}</li>
        <li class="${okD?"ok":"bad"}">ระยะ ${st.d} cm ${okD?"✓":"✗ ควรเป็น "+O.d+" cm ตามคู่มือ"}</li>
        <li class="${okP?"ok":"bad"}">โคมและเครื่องวัด ${okP?"✓ พร้อม":"✗ ยังมีปัญหาที่ไม่ได้แก้ (กด “ตรวจโคมและเครื่องวัด” ทุกครั้ง)"}</li>
        <li class="${okM?"ok":"bad"}">${okM?`วัดหลังตั้งเสร็จ ${st.read.toFixed(1)} µW/cm²/nm ✓`:"✗ ยังไม่ได้วัด หรือเปลี่ยนค่าหลังวัด ต้องวัดใหม่"}</li>
        ${O.lvl==="hi"&&okM?`<li class="${okV?"ok":"bad"}">เกณฑ์ ≥ ${P.hiMin} ${okV?"✓ ผ่าน":"✗ ไม่ผ่าน"}</li>`:""}</ul>
        ${!okP?`<div class="msg bad">${st.bad==="meter"?"ค่าที่วัดด้วยเครื่องวัดหมดอายุสอบเทียบใช้ยืนยันผลไม่ได้":"สิ่งบังแสงหรือตำแหน่งโคมทำให้ทารกได้แสงน้อยกว่าที่วัดตอนตั้งถูก"}</div>`:""}
        <div class="tools"><button class="primary" id="set-nx">${last?"ดูผลรวม":"ใบสั่งถัดไป →"}</button></div>`;
      side.querySelector("#set-nx").onclick=()=>{R.i++;viewSet();window.scrollTo(0,0);};
      if(window.innerWidth<900) side.scrollIntoView({behavior:"smooth"});
    };
    paint();
  }
  function setSummary(){
    const R=setRound, ok=R.res.filter(Boolean).length, sc=ok*2, mx=R.orders.length*2;
    const s=R.saved||(R.saved=savePart("set", sc, mx));   // บันทึกครั้งเดียวต่อรอบ
    frame(`<h2>ผลฝึกตั้งและวัดแสง</h2><div class="score ${sc>=8?"ok":sc>=6?"mid":"bad"}"><div class="big">${sc}/${mx}</div><div>ตั้งและวัดถูก ${ok} จาก ${R.orders.length} ใบสั่ง</div></div>
      ${s.done?`<div class="msg ok">ทำครบทั้งสองส่วนแล้ว ส่งคะแนนโมดูลนี้ ${s.score}/${s.max} (${Math.round(s.score/s.max*100)}%)</div>`:`<p class="muted">ทำมุมช่างต่อให้ครบ ระบบจึงจะรวมคะแนนและส่ง</p>`}
      <ol class="recap">${R.orders.map((o,k)=>`<li><b>${R.res[k]?"✓":"✗"} ${esc(o.who)}</b><span>${esc(o.text)}</span></li>`).join("")}</ol>
      <div class="tools"><button id="set-again">ฝึกอีกชุด</button>${s.done?"":`<button class="primary" id="go-tech">ไปมุมช่าง ▶</button>`}</div>`);
    root.querySelector("#set-again").onclick=()=>{ newSetRound(); viewSet(); };
    const g=root.querySelector("#go-tech"); if(g) g.onclick=()=>{ tab="tech"; techRound=null; render(); };
    window.scrollTo(0,0);
  }

  /* ---------- ตรวจก่อนใช้งาน (ไม่เก็บคะแนน) ---------- */
  function viewCheck(){
    const items=D.checklist, bad=new Set(shuffle(items.map((x,k)=>k)).slice(0,D.checkBad)), ans={}; let checked=false;
    function draw(){
      const done=Object.keys(ans).length===items.length;
      frame(`<h2>ตรวจเครื่องก่อนใช้งาน</h2>
        <p class="muted">รายการที่ผู้ใช้ตรวจก่อนใช้กับผู้ป่วย ช่างใช้รายการเดียวกันนี้ตรวจตอนรับแจ้งซ่อมและก่อนส่งคืน อ่านผลที่พบแล้วตัดสินว่าผ่านหรือไม่ผ่าน (ไม่เก็บคะแนน)</p>
        <div class="chk">${items.map((x,k)=>{ const isBad=bad.has(k), a=ans[k];
          const res=checked?((a==="bad")===isBad?"good":"bad"):"";
          return `<div class="chkrow ${res}"><div><b>${k+1}. ${esc(x.n)}</b><p>${esc(isBad?x.bad:x.ok)}</p>
            ${checked&&isBad?`<p class="act">→ ${esc(x.act)}</p>`:""}${checked&&res==="bad"&&!isBad?`<p class="act">รายการนี้ปกติ ใช้งานได้</p>`:""}</div>
            <div class="seg"><button data-k="${k}" data-a="ok" class="${a==="ok"?"on":""}" ${checked?"disabled":""}>ผ่าน</button><button data-k="${k}" data-a="bad" class="${a==="bad"?"on":""}" ${checked?"disabled":""}>ไม่ผ่าน</button></div></div>`; }).join("")}</div>
        ${checked?(()=>{ const right=items.filter((x,k)=>(ans[k]==="bad")===bad.has(k)).length;
            return `<div class="score ${right===items.length?"ok":right>=8?"mid":"bad"}"><div class="big">${right}/${items.length}</div><div>ตัดสินถูก · เครื่องนี้${bad.size?"ยังไม่พร้อมใช้":"พร้อมใช้"}</div></div>`; })():""}
        <div class="tools">${checked?`<button class="primary" id="ck-new">สุ่มเครื่องใหม่</button>`:`<button class="primary" id="ck-go" ${done?"":"disabled"}>ตรวจคำตอบ</button><span class="muted small">ตัดสินแล้ว ${Object.keys(ans).length}/${items.length}</span>`}</div>`);
      root.querySelectorAll(".chk [data-k]").forEach(b=>b.onclick=()=>{ ans[b.dataset.k]=b.dataset.a; const y=window.scrollY; draw(); window.scrollTo(0,y); });
      const g=root.querySelector("#ck-go"); if(g) g.onclick=()=>{ checked=true; draw(); };
      const n=root.querySelector("#ck-new"); if(n) n.onclick=()=>{ viewCheck(); window.scrollTo(0,0); };
    }
    draw();
  }

  /* ---------- มุมช่าง ---------- */
  let techRound=null;
  function viewTech(){
    if(!techRound) techRound={qs:shuffle(D.cases).slice(0,D.techPerRound).map(c=>({...c, ord:shuffle(c.act.map((t,k)=>k))})), i:0, step:1, sc:0, pts:[]};
    const T=techRound;
    if(T.i>=T.qs.length) return techSummary();
    const q=T.qs[T.i];
    frame(`<h2>มุมช่าง: ใช้งานผิดหรือเครื่องเสีย</h2><p class="muted">อ่านใบแจ้งซ่อม ตัดสินสาเหตุ (1 คะแนน) แล้วเลือกสิ่งที่ควรทำต่อ (1 คะแนน)</p>
      <div class="simtop"><span class="kicker">โจทย์ ${T.i+1} / ${T.qs.length}</span><div class="simdots">${T.qs.map((x,k)=>`<i class="${k<T.i?(T.pts[k]===2?"ok":"bad"):k===T.i?"on":""}"></i>`).join("")}</div></div>
      <div class="ticket"><div class="tk-h"><span>ใบแจ้งซ่อม</span></div><p>${esc(q.q)}</p></div>
      <h3>1) สาเหตุน่าจะเป็นแบบไหน</h3>
      <div class="lopts" id="tc-a">${Object.entries(D.causes).map(([k,n])=>`<button class="lopt" data-c="${k}">${esc(n)}</button>`).join("")}</div>
      <div id="tc-2"></div>`);
    let p=0;
    root.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
      const good=b.dataset.c===q.a; if(good) p++;
      root.querySelectorAll("[data-c]").forEach(x=>{ x.disabled=true; if(x.dataset.c===q.a) x.classList.add("good"); else if(x===b) x.classList.add("bad"); });
      const box=root.querySelector("#tc-2");
      box.innerHTML=`<p class="small ${good?"":"bad-t"}">${good?"✓ ถูกต้อง":"✗ คำตอบคือ: "+esc(D.causes[q.a])}</p>
        <h3>2) ควรทำอะไรต่อ</h3><div class="lopts">${q.ord.map(k=>`<button class="lopt" data-x="${k}">${esc(q.act[k])}</button>`).join("")}</div><div id="tc-f"></div>`;
      box.querySelectorAll("[data-x]").forEach(y=>y.onclick=()=>{
        const g2=y.dataset.x==="0"; if(g2) p++;
        box.querySelectorAll("[data-x]").forEach(z=>{ z.disabled=true; if(z.dataset.x==="0") z.classList.add("good"); else if(z===y) z.classList.add("bad"); });
        T.sc+=p; T.pts[T.i]=p;
        box.querySelector("#tc-f").innerHTML=`<div class="fb ${p===2?"good":"bad"}"><b>ได้ ${p}/2 คะแนน</b><p>${esc(q.e)}</p><button class="primary" id="tc-n">${T.i+1<T.qs.length?"โจทย์ถัดไป →":"ดูผล"}</button></div>`;
        box.querySelector("#tc-n").onclick=()=>{ T.i++; viewTech(); window.scrollTo(0,0); };
      });
      if(window.innerWidth<900) box.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }
  function techSummary(){
    const T=techRound, mx=T.qs.length*2, s=T.saved||(T.saved=savePart("tech", T.sc, mx));   // บันทึกครั้งเดียวต่อรอบ
    frame(`<h2>ผลมุมช่าง</h2><div class="score ${T.sc>=13?"ok":T.sc>=10?"mid":"bad"}"><div class="big">${T.sc}/${mx}</div><div>คะแนน</div></div>
      ${s.done?`<div class="msg ok">ทำครบทั้งสองส่วนแล้ว ส่งคะแนนโมดูลนี้ ${s.score}/${s.max} (${Math.round(s.score/s.max*100)}%)</div>`:`<p class="muted">ทำฝึกตั้งและวัดแสงต่อให้ครบ ระบบจึงจะรวมคะแนนและส่ง</p>`}
      <ol class="recap">${T.qs.map((q,k)=>`<li><b>${T.pts[k]}/2 · ${esc(D.causes[q.a].split(" (")[0])}</b><span>${esc(q.q)}</span></li>`).join("")}</ol>
      <div class="tools"><button id="tc-again">ทำอีกชุด</button>${s.done?"":`<button class="primary" id="go-set">ไปฝึกตั้งและวัดแสง ▶</button>`}</div>`);
    root.querySelector("#tc-again").onclick=()=>{ techRound=null; viewTech(); };
    const g=root.querySelector("#go-set"); if(g) g.onclick=()=>{ tab="set"; setRound=null; render(); };
    window.scrollTo(0,0);
  }

  function render(){ ({learn:viewLearn, set:viewSet, check:viewCheck, tech:viewTech})[tab](); }
  window.Views=window.Views||{}; window.Views.tech={show:()=>{ if(!root.innerHTML) render(); }};
})();
