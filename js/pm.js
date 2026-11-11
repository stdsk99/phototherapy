/* ===== โมดูล 6: การทดสอบหลังซ่อม (เครื่องส่องไฟ) ===== */
(function(){
  const D = window.PM;
  const root = document.getElementById("pm");
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rnd = (a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
  const r1 = x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
  let cur = "irr";

  /* ---------- โจทย์ฝึก: สร้างแบบสุ่ม (เกณฑ์ตัวอย่างของเครื่องจำลอง) ---------- */
  const ri=(a,b)=>Math.round(rnd(a,b));
  const GEN = {
    irr(){
      const t=pick(["hi","trend"]);
      if(t==="hi"){ const v=r1(Math.random()<.55?rnd(30.4,40):rnd(18,29.6)), p=v>=30;
        return {q:`HIGH ระยะ 30 cm กลางเตียง วัดด้วยเครื่องวัดที่สอบเทียบแล้วได้ ${v.toFixed(1)} µW/cm²/nm ผ่านเกณฑ์การส่องไฟแบบเข้มข้นหรือไม่`, pass:p,
          ex:`เกณฑ์ ≥ 30 → ${p?"ผ่าน":"ไม่ผ่าน ตรวจฝาครอบ ชั่วโมงใช้งาน และกระแสวงจรขับ"}`}; }
      const base=r1(rnd(35,38)), now=r1(Math.random()<.5?base*rnd(0.88,0.97):base*rnd(0.8,0.84)), d=Math.round((base-now)/base*100), p=d<=15;
      return {q:`baseline ${base.toFixed(1)} วันนี้ ${now.toFixed(1)} µW/cm²/nm (เงื่อนไขเดียวกัน) ลดลงกี่เปอร์เซ็นต์ และยังไม่ต้องวางแผนเปลี่ยนแผง LED ใช่หรือไม่ (เกณฑ์วางแผน: ลดเกิน 15%)`,
        num:{label:"ร้อยละที่ลดลง (%)", ans:d, tol:1}, pass:p,
        ex:`(${base.toFixed(1)} − ${now.toFixed(1)}) ÷ ${base.toFixed(1)} × 100 ≈ ${d}% → ${p?"ผ่าน ยังไม่ถึงเกณฑ์วางแผน แต่บันทึกแนวโน้ม":"ไม่ผ่าน ลดเกิน 15% วางแผนเปลี่ยนแผง LED แม้ค่ายังเกิน 30"}`};
    },
    uni(){
      const mid=r1(rnd(33,38)), cs=[0,0,0,0].map(()=>r1(mid*rnd(0.72,0.82)));
      if(Math.random()<.45){ const k=ri(0,3); cs[k]=r1(mid*rnd(0.42,0.56)); }
      const all=[mid,...cs], mn=Math.min(...all), mx=Math.max(...all), u=r2(mn/mx), p=u>=0.6;
      return {q:`กลาง ${mid.toFixed(1)} · มุม ${cs.map(x=>x.toFixed(1)).join(" / ")} µW/cm²/nm ความสม่ำเสมอ (ต่ำสุด ÷ สูงสุด) เท่าไร และผ่านหรือไม่`,
        num:{label:"ต่ำสุด ÷ สูงสุด", ans:u, tol:0.015}, pass:p,
        ex:`${mn.toFixed(1)} ÷ ${mx.toFixed(1)} = ${u.toFixed(2)} เกณฑ์ ≥ 0.6 → ${p?"ผ่าน":"ไม่ผ่าน มุมหนึ่งแสงต่ำ ตรวจโคมเอียงก่อน แล้วดูแถว LED ด้านนั้น"}`};
    },
    meter(){
      const c=pick([
        {s:"เครื่องวัดรุ่นที่ผู้ผลิตแนะนำ สอบเทียบล่าสุด 7 เดือนก่อน (รอบ 12 เดือน)",p:true,e:"ผ่าน ใช้ยืนยันผลได้"},
        {s:"เครื่องวัดรุ่นที่ผู้ผลิตแนะนำ สอบเทียบล่าสุด 15 เดือนก่อน (รอบ 12 เดือน)",p:false,e:"ไม่ผ่าน หมดอายุสอบเทียบ ใช้ยืนยันผลไม่ได้"},
        {s:"เครื่องวัดที่ออกแบบสำหรับหลอดฟลูออเรสเซนต์ช่วงกว้าง สอบเทียบแล้ว ใช้วัดเครื่อง LED แถบแคบ",p:false,e:"ไม่ผ่าน ช่วงคลื่นและการสอบเทียบไม่ตรงกับเครื่อง ค่าที่อ่านผิด"},
        {s:"ใช้ lux meter วัดได้ 1,200 lux",p:false,e:"ไม่ผ่าน lux วัดความสว่างตามตาคน ไม่ใช่ความเข้มแสงในช่วงที่ใช้รักษา"}]);
      return {q:c.s+" ใช้ยืนยันผลการวัดแสงได้หรือไม่", pass:c.p, ex:c.e};
    },
    thermal(){
      const t=pick(["temp","case"]);
      if(t==="temp"){ const v=ri(Math.random()<.55?38:62, Math.random()<.55?58:82), p=v<=60;
        return {q:`เปิด HIGH 30 นาที แผ่นระบายความร้อนวัดได้ ${v} °C พัดลมหมุน ไม่มีไฟเตือน ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ ≤ 60 °C → ${p?"ผ่าน":"ไม่ผ่าน ตรวจพัดลม ฝุ่นที่ครีบ และช่องระบาย"}`}; }
      const c=pick([
        {s:"เปลี่ยนพัดลมแล้ว เปิดทดสอบ 5 นาที พัดลมหมุน ส่งคืน (อาการเดิมเกิดที่นาทีที่ 20)",p:false,e:"ไม่ผ่าน ทดสอบสั้นกว่าเวลาที่อาการเคยเกิด ต้องเปิด 30 นาทีขึ้นไป"},
        {s:"เปิด 40 นาที ไม่ตัด แผ่นระบายความร้อน 47 °C แสงคงที่",p:true,e:"ผ่าน"},
        {s:"เปิด 30 นาที ไม่ตัด แต่พัดลมมีเสียงครูดเป็นระยะ",p:false,e:"ไม่ผ่าน ลูกปืนพัดลมสึก เปลี่ยนก่อนพัดลมหยุด"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    hours(){
      const t=pick(["pct","case"]);
      if(t==="pct"){ const h=ri(Math.random()<.5?6000:18200, Math.random()<.5?17500:21000), pc=Math.round(h/20000*100), p=h<=18000;
        return {q:`ชั่วโมงใช้งาน LED ${h.toLocaleString("en-US")} h อายุ LED 20,000 h คิดเป็นร้อยละเท่าไรของอายุ และยังไม่ต้องวางแผนเปลี่ยนใช่หรือไม่ (เกณฑ์วางแผน > 18,000 h)`,
          num:{label:"ร้อยละของอายุ (%)", ans:pc, tol:1}, pass:p, ex:`${h.toLocaleString("en-US")} ÷ 20,000 × 100 ≈ ${pc}% → ${p?"ผ่าน ยังไม่ถึงเกณฑ์วางแผน":"ไม่ผ่าน เกิน 18,000 h วางแผนจัดซื้อแผง LED"}`}; }
      const c=pick([
        {s:"PM ครั้งก่อน 4,200 h ครั้งนี้ 4,200 h ทั้งที่หน่วยงานใช้เครื่องทุกวัน",p:false,e:"ไม่ผ่าน ตัวนับไม่เดิน แจ้งซ่อม และประเมินชั่วโมงจากบันทึกการใช้"},
        {s:"เปลี่ยนแผง LED แล้ว บันทึกชั่วโมงเดิม 23,400 h แล้วรีเซ็ตตามคู่มือ",p:true,e:"ผ่าน ทำตามขั้นตอน"},
        {s:"ไม่ได้เปลี่ยนแผง LED แต่รีเซ็ตตัวนับเป็น 0 เพื่อให้ดูเหมือนเครื่องใหม่",p:false,e:"ไม่ผ่าน ห้ามรีเซ็ตโดยไม่มีเหตุ ทำให้ติดตามอายุ LED ไม่ได้"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    mech(){
      const c=pick([
        {s:"ตั้งความสูงแล้วรอ 10 นาที โคมลดลง 0.5 cm",p:true,e:"ผ่าน ไม่เกิน 1 cm"},
        {s:"ตั้งความสูงแล้วรอ 10 นาที โคมลดลง 6 cm",p:false,e:"ไม่ผ่าน ปุ่มล็อกสึก ระยะเปลี่ยนระหว่างรักษา ซ่อมก่อนใช้"},
        {s:"หมุนแขนแล้วโคมเอียง ด้านหนึ่งสูงกว่าอีกด้าน 5 cm",p:false,e:"ไม่ผ่าน แสงไม่สม่ำเสมอ ปรับหรือซ่อมจุดยึดแขน"},
        {s:"ล็อกล้อทั้งหมดแล้วดันเครื่อง เครื่องไม่เคลื่อน",p:true,e:"ผ่าน"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    esa(){
      const t=pick(["pe","eq"]);
      if(t==="pe"){ const v=r2(pick([rnd(0.05,0.28),rnd(0.32,0.9)])), p=v<=0.3;
        return {q:`เครื่องส่องไฟ Class I ความต้านทานสายดินป้องกันวัดได้ ${v} Ω ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ ≤ 0.3 Ω → ${p?"ผ่าน":"ไม่ผ่าน ตรวจสายไฟ ปลั๊ก และจุดต่อสายดินในเครื่อง"}`}; }
      const v=Math.round(pick([rnd(40,480),rnd(520,900)])), p=v<=500;
      return {q:`กระแสรั่วของเครื่อง Class I วัดได้ ${v} µA ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ ≤ 500 µA → ${p?"ผ่าน":"ไม่ผ่าน ตรวจภาคจ่ายไฟและสายภายใน"}`};
    }
  };

  function practice(id){
    const box=root.querySelector("#pm-pr"), N=5; let i=0, ok=0, q=null, step=0;
    function next(){
      if(i>=N){ box.innerHTML=`<div class="score ${ok>=4?"ok":ok>=3?"mid":"bad"}"><div class="big">${ok}/${N}</div><div>ตอบถูก</div></div><div class="tools"><button class="primary" id="pr-again">ฝึกอีกชุด</button></div>`;
        window.Score&&Score.record({key:"pm:"+id, mod:"6-ทดสอบหลังซ่อม", item:"ฝึกตัดสินผล: "+D.find(x=>x.id===id).n, score:ok, max:N});
        box.querySelector("#pr-again").onclick=()=>practice(id); return; }
      q=GEN[id](); step=q.num?0:1; draw();
    }
    function draw(fb){
      box.innerHTML=`<div class="kicker">ข้อ ${i+1} / ${N}</div><p class="pq">${esc(q.q)}</p>
        ${q.num?`<label class="nlab">${esc(q.num.label)}<input id="pr-n" type="number" step="0.01" inputmode="decimal" ${step>0?"disabled":""}></label>`:""}
        ${step===0?`<div class="tools"><button class="primary" id="pr-c">ตรวจตัวเลข</button></div>`:
          `<div class="tools"><button class="pf" data-v="1">✓ ผ่าน</button><button class="pf" data-v="0">✗ ไม่ผ่าน</button></div>`}
        <div id="pr-fb">${fb||""}</div>`;
      const c=box.querySelector("#pr-c");
      if(c) c.onclick=()=>{ const v=parseFloat(box.querySelector("#pr-n").value);
        if(isNaN(v)){ box.querySelector("#pr-fb").innerHTML=`<div class="msg bad">กรอกตัวเลขก่อน</div>`; return; }
        q.numOk=Math.abs(v-q.num.ans)<=q.num.tol; step=1;
        draw(`<div class="msg ${q.numOk?"ok":"bad"}">${q.numOk?"ตัวเลขถูกต้อง":"ยังไม่ถูก คำตอบคือ "+q.num.ans} · ต่อไปตัดสินว่าผ่านหรือไม่</div>`);
        box.querySelector("#pr-n").value=v; };
      box.querySelectorAll(".pf").forEach(b=>b.onclick=()=>{
        const good=(b.dataset.v==="1")===q.pass && (q.num?q.numOk:true);
        if(good) ok++;
        box.querySelectorAll(".pf").forEach(x=>x.disabled=true);
        box.querySelector("#pr-fb").innerHTML=`<div class="fb ${good?"good":"bad"}"><b>${good?"✓ ถูกต้อง":"✗ ยังไม่ถูก"}</b><p>${esc(q.ex)}</p><button class="primary" id="pr-nx">${i+1<N?"ข้อต่อไป →":"ดูผล"}</button></div>`;
        box.querySelector("#pr-nx").onclick=()=>{i++;next();};
      });
    }
    next();
  }

  /* ---------- เครื่องคำนวณ ---------- */
  function calc(id){
    if(id==="irr") return `<div class="calc"><h3>เครื่องคำนวณแนวโน้มความเข้มแสง</h3>
      <div class="cgrid"><label>baseline (µW/cm²/nm)<input id="c-b" type="number" value="37.0" step="0.1" inputmode="decimal"></label>
      <label>ค่าวันนี้ (µW/cm²/nm)<input id="c-n" type="number" value="31.2" step="0.1" inputmode="decimal"></label></div><div id="c-o" class="cout"></div></div>`;
    if(id==="uni") return `<div class="calc"><h3>เครื่องคำนวณความสม่ำเสมอ</h3>
      <div class="cgrid">${["กลาง","มุม 1","มุม 2","มุม 3","มุม 4"].map((n,i)=>`<label>${n}<input class="c-u" type="number" value="${[36.2,28.1,28.6,27.8,28.9][i]}" step="0.1" inputmode="decimal"></label>`).join("")}</div><div id="c-o" class="cout"></div></div>`;
    if(id==="hours") return `<div class="calc"><h3>เครื่องคำนวณอายุ LED</h3>
      <div class="cgrid"><label>ชั่วโมงปัจจุบัน (h)<input id="c-h" type="number" value="18600" step="100" inputmode="numeric"></label><label>อายุ LED (h)<input id="c-l" type="number" value="20000" step="1000" inputmode="numeric"></label></div><div id="c-o" class="cout"></div></div>`;
    return "";
  }
  function bindCalc(id){
    const $=s=>root.querySelector(s), o=$("#c-o"); if(!o) return;
    const run=()=>{
      if(id==="irr"){ const b=+$("#c-b").value, n=+$("#c-n").value, d=b?Math.round((b-n)/b*100):0, okv=n>=30, okd=d<=15;
        o.innerHTML=`ลดลง <b>${d}%</b> จาก baseline · ค่าวันนี้ ${okv?"≥ 30 ✓":"< 30 ✗"} <span class="pfb ${okv&&okd?"ok":"bad"}">${!okv?"ไม่ผ่าน":okd?"ผ่าน":"ผ่าน แต่วางแผนเปลี่ยน LED"}</span>`; }
      if(id==="uni"){ const v=[...root.querySelectorAll(".c-u")].map(x=>+x.value), u=Math.min(...v)/Math.max(...v), okm=v[0]>=30, oku=u>=0.6;
        o.innerHTML=`ต่ำสุด ÷ สูงสุด = <b>${u.toFixed(2)}</b> ${oku?"✓":"✗"} · กลาง ${v[0].toFixed(1)} ${okm?"✓":"✗"} <span class="pfb ${okm&&oku?"ok":"bad"}">${okm&&oku?"ผ่าน":"ไม่ผ่าน"}</span>`; }
      if(id==="hours"){ const h=+$("#c-h").value, l=+$("#c-l").value||1, pc=Math.round(h/l*100), ok=h<=l*0.9;
        o.innerHTML=`ใช้ไปแล้ว <b>${pc}%</b> ของอายุ <span class="pfb ${ok?"ok":"bad"}">${ok?"ยังไม่ถึงเกณฑ์วางแผน":"วางแผนเปลี่ยนแผง LED"}</span>`; }
    };
    root.querySelectorAll(".calc input").forEach(i=>i.addEventListener("input",run)); run();
  }

  /* ---------- แบบบันทึกผล PM ---------- */
  function form(){
    return `<details class="grp"><summary>แบบบันทึกผลการทดสอบ (คัดลอกไปใช้ได้)</summary><div class="acts" style="display:block">
      <div class="cgrid"><label>เลขครุภัณฑ์<input id="f-id"></label><label>ยี่ห้อ/รุ่น<input id="f-md"></label><label>หน่วยงาน<input id="f-w"></label><label>ผู้ทดสอบ<input id="f-by"></label></div>
      ${D.map(t=>`<label class="fchk"><span>${esc(t.n)}</span><select data-t="${t.id}"><option value="">ไม่ได้ทำ</option><option>ผ่าน</option><option>ไม่ผ่าน</option></select><input data-v="${t.id}" placeholder="ค่าที่วัดได้"></label>`).join("")}
      <div class="tools"><button class="primary" id="f-cp">สร้างข้อความบันทึก</button></div><div id="f-o"></div></div></details>`;
  }
  function bindForm(){
    const b=root.querySelector("#f-cp"); if(!b) return;
    b.onclick=async()=>{
      const v=s=>root.querySelector(s).value.trim();
      const rows=D.map(t=>{const r=root.querySelector(`[data-t="${t.id}"]`).value, m=root.querySelector(`[data-v="${t.id}"]`).value.trim(); return r?`- ${t.n}: ${r}${m?" ("+m+")":""}`:null;}).filter(Boolean);
      const all=rows.length&&rows.every(r=>r.includes(": ผ่าน"));
      const txt=`บันทึกการทดสอบเครื่องส่องไฟรักษาทารกตัวเหลือง (Phototherapy)\nวันที่: ${new Date().toLocaleDateString("th-TH")}\nเลขครุภัณฑ์: ${v("#f-id")||"-"} · รุ่น: ${v("#f-md")||"-"} · หน่วยงาน: ${v("#f-w")||"-"}\n${rows.join("\n")||"- ยังไม่ได้เลือกผล"}\nสรุป: ${all?"ผ่าน พร้อมใช้งาน":"ไม่ผ่าน/ไม่ครบ ห้ามใช้งาน"}\nผู้ทดสอบ: ${v("#f-by")||"-"}`;
      const ta=document.createElement("textarea"); ta.className="copybox"; ta.value=txt; root.querySelector("#f-o").replaceChildren(ta);
      try{ await navigator.clipboard.writeText(txt); b.textContent="คัดลอกแล้ว ✓"; }catch(e){ ta.select(); }
    };
  }

  function render(){
    const t=D.find(x=>x.id===cur);
    root.innerHTML=`<h1>โมดูล 6 · การทดสอบหลังซ่อม</h1>
      <p class="muted">ทุกงานซ่อมต้องจบด้วยการทดสอบที่ตรงกับสิ่งที่ซ่อม ก่อนส่งเครื่องกลับไปใช้กับผู้ป่วย เลือกหัวข้อการทดสอบ อ่านวิธีและเกณฑ์ แล้วฝึกตัดสินผลทางขวา (ฝึกได้ไม่จำกัด ไม่นับคะแนนผ่าน) จากนั้นไปแท็บ “ลำดับขั้นตอนงาน”</p>
      <div class="chips pmtabs">${D.map(x=>`<button data-id="${x.id}" data-seen="test|${x.id}" class="${x.id===cur?"on":""}">${esc(x.n)}</button>`).join("")}</div>
      <div class="pmgrid">
        <div>
          <h2>${esc(t.th)}</h2><p>${esc(t.why)}</p>
          <h3>อุปกรณ์</h3><ul>${t.tools.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          <h3>ขั้นตอน</h3><ol>${t.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
          ${t.limits?`<h3>${esc(t.limTitle||"เกณฑ์")}</h3><table class="lim">${t.limits.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>`:""}
          <div class="formula">${esc(t.formula).replace(/\n/g,"<br>")}</div>
          <h3>ข้อควรระวัง</h3><ul>${t.tips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          ${calc(cur)}
        </div>
        <aside class="logbox"><h2>ฝึกตัดสินผล</h2><div id="pm-pr"></div></aside>
      </div>
      ${form()}`;
    if(window.Seen) Seen.mark("test", cur, root);
    root.querySelectorAll(".pmtabs button").forEach(b=>b.onclick=()=>{cur=b.dataset.id;render();});
    bindCalc(cur); bindForm(); practice(cur);
  }

  window.Views=window.Views||{}; window.Views.pm={show:()=>{ if(!root.innerHTML) render(); }};
})();
