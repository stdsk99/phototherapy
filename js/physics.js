/* ===== โมดูล 1: ฟิสิกส์ของแสงรักษา (บทเรียน + เครื่องจำลอง 5 ชุด) =====
   อ่านข้อมูลจาก window.PHYSICS (data/physics.js) แสดงใน #physics · ไม่เก็บคะแนน (คะแนนอยู่ที่สอบท้ายโมดูล) */
(function(){
  const D=window.PHYSICS, root=document.getElementById("physics");
  if(!D||!root) return;
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let cur=D.lessons[0].id;

  /* ---------- กราฟสเปกตรัม ---------- */
  const X0=30, X1=350, NM0=380, NM1=700, YB=132, YH=104;
  const xOf=nm=>X0+(nm-NM0)*(X1-X0)/(NM1-NM0);
  const absorb=nm=>Math.exp(-Math.pow((nm-462)/(nm<462?34:27),2));
  const emit=(S,nm)=>Math.min(1.1, S.reduce((a,[c,w,h])=>a+h*Math.exp(-Math.pow((nm-c)/w,2)),0));
  const path=f=>{ let d=""; for(let nm=NM0;nm<=NM1;nm+=4){ d+=(d?" L":"M")+xOf(nm).toFixed(1)+" "+(YB-f(nm)*YH).toFixed(1); } return d; };
  const area=f=>path(f)+` L${X1} ${YB} L${X0} ${YB} Z`;
  const STOPS=[[380,"#7a00c8"],[430,"#3b2cff"],[465,"#0a84ff"],[495,"#00c8b0"],[520,"#3cd200"],[570,"#e3e000"],[590,"#ffb000"],[620,"#ff5a00"],[700,"#b00000"]];
  function chart(S, opt){
    opt=opt||{};
    const grad=`<linearGradient id="rb${opt.k||""}" x1="0" x2="1">${STOPS.map(([nm,c])=>`<stop offset="${((nm-NM0)/(NM1-NM0)).toFixed(3)}" stop-color="${c}"/>`).join("")}</linearGradient>`;
    const ticks=[400,450,500,550,600,650,700].map(nm=>`<line class="sp-tk" x1="${xOf(nm)}" y1="${YB}" x2="${xOf(nm)}" y2="${YB+4}"/><text class="sp-tx" x="${xOf(nm)}" y="${YB+24}" text-anchor="middle">${nm}</text>`).join("");
    return `<svg class="sp" viewBox="0 0 360 170" role="img" aria-label="${esc(opt.label||"กราฟการดูดกลืนแสงของบิลิรูบินตามความยาวคลื่น")}">
      <defs>${grad}</defs>
      <rect class="sp-band" x="${xOf(460)}" y="${YB-YH-6}" width="${xOf(490)-xOf(460)}" height="${YH+6}"/>
      <text class="sp-bt" x="${(xOf(460)+xOf(490))/2}" y="${YB-YH-10}" text-anchor="middle">460–490 nm</text>
      ${S?`<path class="sp-eff" d="${area(nm=>emit(S,nm)*absorb(nm))}"/><path class="sp-em" d="${path(nm=>emit(S,nm))}"/>`:`<path class="sp-abf" d="${area(absorb)}"/>`}
      <path class="sp-ab" d="${path(absorb)}"/>
      <line class="sp-ax" x1="${X0}" y1="${YB}" x2="${X1}" y2="${YB}"/>
      <rect x="${X0}" y="${YB+5}" width="${X1-X0}" height="6" fill="url(#rb${opt.k||""})" rx="2"/>
      ${ticks}
      <text class="sp-tx" x="${X1}" y="${YB+36}" text-anchor="end">ความยาวคลื่น (nm)</text>
      ${S&&opt.uv?`<text class="sp-uv" x="${X0+2}" y="${YB-8}">← มี UV</text>`:""}
    </svg>`;
  }
  const legend=S=>`<div class="sp-lg"><span><i class="lg-ab"></i>การดูดกลืนของบิลิรูบิน</span>${S?`<span><i class="lg-em"></i>แสงที่ปล่อยออกมา</span><span><i class="lg-eff"></i>ส่วนที่ซ้อนกัน (ใช้รักษาได้)</span>`:""}</div>`;

  /* ---------- เครื่องจำลองแต่ละบท ---------- */
  const SIMS={
    absorb(box){
      box.innerHTML=`<div class="phsim"><h3>กราฟ: บิลิรูบินดูดกลืนแสงช่วงไหน</h3>${chart(null,{k:"a"})}${legend(null)}
        <p class="small muted">ยอดของกราฟอยู่ในช่วงสีฟ้า บิลิรูบินแทบไม่ดูดกลืนแสงสีเหลือง ส้ม และแดง จึงสะท้อนแสงช่วงนั้นออกมาให้ตาเห็นเป็นสีเหลือง</p></div>`;
    },
    iso(box){
      box.innerHTML=`<div class="phsim"><h3>ภาพเคลื่อนไหว: โฟตอนพลิกรูปโมเลกุล</h3>
        <svg class="iso" viewBox="0 0 360 150" role="img" aria-label="ภาพเคลื่อนไหว โฟตอนแสงฟ้าชนโมเลกุลบิลิรูบินที่พับตัว โมเลกุลพลิกเป็นรูปที่ละลายน้ำได้ แล้วถูกขับออกทางน้ำดีและปัสสาวะ">
          <path class="iso-ph" d="M10 20 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0"/><circle class="iso-pd" cx="98" cy="20" r="4"/>
          <g class="iso-m1"><path d="M110 92 l18 -26 l18 26 l18 -26 l18 26"/><path class="iso-hb" d="M128 66 q18 40 36 0"/><circle cx="110" cy="92" r="4"/><circle cx="182" cy="92" r="4"/></g>
          <g class="iso-m2"><path d="M100 70 l20 18 l20 -18 l20 18 l20 -18 l20 18"/><circle cx="100" cy="70" r="4"/><circle cx="200" cy="88" r="4"/></g>
          <text class="iso-l1" x="146" y="122" text-anchor="middle">บิลิรูบิน (พับตัว ละลายน้ำได้น้อย)</text>
          <text class="iso-l2" x="150" y="122" text-anchor="middle">ไอโซเมอร์ใหม่ (ละลายน้ำได้ดีขึ้น)</text>
          <g class="iso-out"><path class="iso-ar" d="M226 80 H282"/><path class="iso-ar" d="M276 74 l8 6 l-8 6"/><text class="iso-tx" x="292" y="72">ขับออก</text><text class="iso-tx" x="292" y="86">ทางน้ำดี</text><text class="iso-tx" x="292" y="100">และปัสสาวะ</text></g>
        </svg>
        <p class="sx-cap" id="iso-cap" aria-live="polite">กด ▶ เพื่อดูทีละขั้น</p>
        <div class="tools"><button class="primary" id="iso-go">▶ เล่น</button></div></div>`;
      const svg=box.querySelector(".iso"), cap=box.querySelector("#iso-cap"), go=box.querySelector("#iso-go");
      const ST=[["s1","โฟตอนแสงฟ้า-เขียวเดินทางมาถึงผิวทารก"],["s1 s2","โมเลกุลบิลิรูบินดูดกลืนพลังงานของโฟตอน"],["s1 s2 s3","พลังงานทำให้โมเลกุลพลิกรูป พันธะที่ยึดให้พับตัวคลายออก"],["s1 s2 s3 s4","รูปใหม่ละลายน้ำได้ดีขึ้น ร่างกายขับออกได้โดยไม่ต้องรอตับ"]];
      let t=null;
      go.onclick=()=>{ clearTimeout(t); svg.setAttribute("class","iso"); let i=0;
        (function step(){ svg.setAttribute("class","iso "+ST[i][0]); cap.textContent=`${i+1}/${ST.length} · ${ST[i][1]}`; i++; if(i<ST.length) t=setTimeout(step,2200); else go.textContent="↻ เล่นอีกครั้ง"; })(); };
    },
    source(box){
      let sel="led";
      const draw=()=>{ const S=D.sources.find(x=>x.id===sel);
        box.innerHTML=`<div class="phsim"><h3>เครื่องจำลอง: เลือกแหล่งแสง</h3>
          <div class="chips">${D.sources.map(x=>`<button data-s="${x.id}" class="${x.id===sel?"on":""}">${esc(x.n)}</button>`).join("")}</div>
          ${chart(S.s,{k:"s",uv:S.id==="sun",label:"กราฟการปล่อยแสงของ "+S.n+" ซ้อนกับการดูดกลืนของบิลิรูบิน"})}${legend(true)}
          <div class="ov-tbl"><table><tbody>
            <tr><td>ใช้รักษาได้</td><td><b>${esc(S.ok)}</b></td></tr>
            <tr><td>ความเข้มในช่วงรักษา (µW/cm²/nm)</td><td>${esc(S.irr)}</td></tr>
            <tr><td>รังสียูวี</td><td>${esc(S.uv)}</td></tr><tr><td>ความร้อน</td><td>${esc(S.heat)}</td></tr><tr><td>ควบคุมและวัดได้</td><td>${esc(S.ctrl)}</td></tr>
          </tbody></table></div>
          <div class="hint">💡 ${esc(S.note)}</div>
          <p class="small muted">รูปกราฟและตัวเลขเป็นค่าตัวอย่างเพื่อการเปรียบเทียบ ยกเว้นแสงแดดผ่านฟิล์มซึ่งอ้างอิงงานวิจัยของ Slusher และคณะ (2014)</p></div>`;
        box.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{ sel=b.dataset.s; const y=window.scrollY; draw(); window.scrollTo(0,y); }); };
      draw();
    },
    meter(box){
      let src="led", m="ok";
      const draw=()=>{ const M=D.meters.find(x=>x.id===m);
        box.innerHTML=`<div class="phsim"><h3>เครื่องจำลอง: วัดเครื่องเดียวกันด้วยเครื่องวัดต่างแบบ</h3>
          <p class="small">แหล่งแสงบนเตียง (ระยะ 30 cm)</p>
          <div class="seg">${[["led","เครื่อง LED ฟ้า"],["fl","เครื่องหลอดขาวรุ่นเก่า"]].map(([k,n])=>`<button data-l="${k}" class="${k===src?"on":""}">${n}</button>`).join("")}</div>
          <p class="small">เครื่องวัด</p>
          <div class="lopts">${D.meters.map(x=>`<button class="lopt ${x.id===m?"on":""}" data-m="${x.id}">${esc(x.n)}</button>`).join("")}</div>
          <div class="phread ${M.good?"ok":"bad"}"><div class="phr-n">ค่าที่อ่านได้</div><div class="phr-v">${esc(src==="led"?M.led:M.fl)}</div></div>
          <div class="${M.good?"msg ok":"msg bad"}">${M.good?"✓ ":"✗ "}${esc(M.e)}</div>
          <p class="small muted">ลองสลับแหล่งแสงขณะใช้ lux meter จะเห็นว่าหลอดขาวได้ค่าความสว่างสูงกว่า แต่เครื่องวัดแสงที่ถูกต้องอ่านได้ต่ำกว่าเครื่อง LED มาก (ค่าตัวอย่าง)</p></div>`;
        box.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{ src=b.dataset.l; const y=window.scrollY; draw(); window.scrollTo(0,y); });
        box.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{ m=b.dataset.m; const y=window.scrollY; draw(); window.scrollTo(0,y); }); };
      draw();
    },
    dist(box){
      const st={d:30, lvl:"hi"};
      box.innerHTML=`<div class="phsim"><h3>เครื่องจำลอง: ปรับระยะโคม</h3>
        <div class="phdist"><div class="lpbox" id="pd-dev">${PHDIA.svg({cls:"lp", labels:false})}</div>
        <div><div class="seg" id="pd-l"><button data-l="hi" class="on">HIGH</button><button data-l="lo">LOW</button></div>
          <label class="nlab">ระยะแผง LED ถึงผิวเตียง: <b id="pd-dv">30 cm</b><input id="pd-d" type="range" min="20" max="60" step="5" value="30"></label>
          <div class="phread" id="pd-r1"><div class="phr-n">ความเข้มกลางเตียง</div><div class="phr-v" id="pd-i"></div></div>
          <div class="phread" id="pd-r2"><div class="phr-n">ความกว้างแสงตกตามแนวยาวเตียง (โดยประมาณ)</div><div class="phr-v" id="pd-f"></div></div>
          <div class="imsg small" id="pd-m" role="status"></div>
          <p class="small muted">เครื่องจำลองนี้กำหนดระยะใช้งานตามคู่มือไว้ที่ 30 cm ค่าทั้งหมดเป็นค่าตัวอย่าง เครื่องจริงดูจากคู่มือของรุ่นนั้น</p></div></div></div>`;
      const svg=box.querySelector("svg"), $=s=>box.querySelector(s);
      const paint=()=>{ const v={lvl:st.lvl, dist:st.d}, e=PHDIA.irr(v), ok=e>=30;
        PHDIA.state(svg, Object.assign({rad:e}, v));
        $("#pd-dv").textContent=st.d+" cm"; $("#pd-i").textContent=e.toFixed(1)+" µW/cm²/nm "+(ok?"✓":"✗"); $("#pd-r1").className="phread "+(ok?"ok":"bad");
        $("#pd-f").textContent="≈ "+PHDIA.foot(st.d)+" cm";
        $("#pd-m").textContent=st.d<30?"ใกล้กว่าระยะตามคู่มือ: เข้มขึ้นแต่พื้นที่แสงตกแคบลง ทารกบางส่วนอาจอยู่นอกแสง และการวัดที่ระยะนี้เทียบกับ baseline ไม่ได้":st.d>30?"ไกลกว่าระยะตามคู่มือ: ครอบคลุมกว้างขึ้นแต่ความเข้มลดลงเร็ว":(st.lvl==="hi"?"ระยะตามคู่มือ HIGH: ผ่านเกณฑ์การส่องไฟแบบเข้มข้น":"ระยะตามคู่มือ LOW: ต่ำกว่าเกณฑ์แบบเข้มข้น ใช้ตามคำสั่งการรักษาของแพทย์"); };
      $("#pd-d").addEventListener("input",e=>{ st.d=+e.target.value; paint(); });
      box.querySelectorAll("#pd-l [data-l]").forEach(b=>b.onclick=()=>{ st.lvl=b.dataset.l; box.querySelectorAll("#pd-l button").forEach(x=>x.classList.toggle("on",x===b)); paint(); });
      paint();
    }
  };

  function block([t,c]){
    if(t==="p") return `<p>${c}</p>`;
    if(t==="ul") return `<ul>${c.map(x=>`<li>${x}</li>`).join("")}</ul>`;
    if(t==="ol") return `<ol>${c.map(x=>`<li>${x}</li>`).join("")}</ol>`;
    if(t==="tip") return `<div class="hint">💡 ${c}</div>`;
    if(t==="warn") return `<div class="msg bad">⚠️ ${c}</div>`;
    if(t==="tbl") return `<div class="ov-tbl"><table><thead><tr>${c.h.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${c.r.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return "";
  }
  function render(){
    const L=D.lessons.find(x=>x.id===cur), i=D.lessons.indexOf(L);
    root.innerHTML=`<h1>${esc(D.title)}</h1><p class="muted">${esc(D.intro)}</p>
      <div class="clgrid">
      <nav class="clnav">${D.lessons.map(x=>`<button data-l="${x.id}" class="${x.id===cur?"on":""}">${esc(x.n)}</button>`).join("")}</nav>
      <article class="lesson"><h2>${esc(L.n)}</h2>${L.b.map(block).join("")}<div id="ph-sim"></div>
        <div class="tools">${i>0?`<button data-go="${D.lessons[i-1].id}">◀ ${esc(D.lessons[i-1].n)}</button>`:""}
        ${i<D.lessons.length-1?`<button class="primary" data-go="${D.lessons[i+1].id}">${esc(D.lessons[i+1].n)} ▶</button>`:""}</div>
        ${i===D.lessons.length-1?`<div class="srcs"><b>แหล่งอ้างอิง</b><ul>${D.src.map(([n,u])=>`<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul></div>
        <a class="ov-3d" href="3d/">ดูเครื่องแบบ 3 มิติ<small>หมุน แยกชิ้นส่วน และดูแสงตกบนเตียง</small><span aria-hidden="true">→</span></a>
        <p class="muted small">อ่านครบแล้ว ทำสอบท้ายโมดูลด้านล่าง</p>`:""}
      </article></div>`;
    if(L.sim && SIMS[L.sim]) SIMS[L.sim](root.querySelector("#ph-sim"));
    root.querySelectorAll("[data-l],[data-go]").forEach(b=>b.onclick=()=>{ cur=b.dataset.l||b.dataset.go; render(); if(window.innerWidth<900) root.querySelector(".lesson").scrollIntoView({behavior:"smooth"}); });
  }
  render();
})();
