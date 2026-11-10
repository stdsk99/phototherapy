/* ===== ภาพเครื่องส่องไฟรักษาทารกตัวเหลืองแบบ LED จำลอง (ใช้ร่วมกันทุกโมดูล) =====
   PHDIA.svg({id, cls, labels})  คืน SVG ชิ้นส่วนอยู่ใน <g class="part" data-id="…">
   PHDIA.state(svg, v)            ตั้งสถานะภาพ
     off:true        เครื่องดับ
     lvl:"hi"|"lo"   ความเข้มสูง / ต่ำ (ค่าเริ่มต้น hi)
     dist:ตัวเลข     ระยะจากแผง LED ถึงผิวเตียง (cm) 20–60 ค่าเริ่มต้น 30 (โคมขยับขึ้นลงบนภาพ)
     dim:0–1         ความสว่างที่เหลือของ LED (LED เสื่อมตามอายุ) ค่าเริ่มต้น 1
     dark:true       LED แถวกลางดับหนึ่งแถว (เกิดแถบมืดบนเตียง)
     cover:"dirty"   ฝาครอบเลนส์ขุ่นหรือมีคราบ      cloth:true  มีผ้าพาดบนโคม
     fan:"stop"      พัดลมไม่หมุน     hot:true  ร้อนเกิน (ไฟเตือนอุณหภูมิ)
     alarm:"ข้อความ" ข้อความเตือนบนจอ (ไฟแดงกะพริบ)
     hours:ตัวเลข    ชั่วโมงใช้งานบนจอ    rad:ตัวเลข|"ข้อความ"  ค่าบนเครื่องวัดแสงที่วางกลางเตียง (ไม่ใส่ = ไม่แสดงเครื่องวัด)
     baby:false      ไม่มีทารกบนเตียง     hi:"id" หรือ ["id",…]  เน้นชิ้นส่วน
   ชิ้นส่วน: led cover driver fan panel arm psu meter */
(function(){
  const LEDX=[]; for(let i=0;i<9;i++) LEDX.push(72+i*19);
  function svg(o){
    o=o||{};
    const L=o.labels!==false, id=o.id?` id="${o.id}"`:"";
    const t=(x,y,s,a)=>L?`<text class="lbl s" x="${x}" y="${y}"${a?` text-anchor="${a}"`:""}>${s}</text>`:"";
    const leds=LEDX.map((x,i)=>`<circle class="ph-led${i>=3&&i<=5?" mid":""}" cx="${x}" cy="56" r="4.2"/>`).join("");
    const fins=[0,1,2,3,4,5,6].map(i=>`<line x1="${64+i*8}" y1="14" x2="${64+i*8}" y2="24"/>`).join("");
    return `<svg${id} class="dia sx ph ${o.cls||""}" viewBox="-30 -8 390 308" role="img" aria-label="ภาพเครื่องส่องไฟรักษาทารกตัวเหลืองแบบ LED จำลอง: โคมด้านบนมีแผง LED สีฟ้าและฝาครอบเลนส์ ด้านบนโคมมีแผ่นระบายความร้อน วงจรขับ LED และพัดลม แสงสีฟ้าส่องลงเตียงทารกที่ปิดตา บนเตียงมีเครื่องวัดแสง โคมติดแขนบนเสาปรับระดับ เสามีแผงควบคุม ฐานมีภาคจ่ายไฟและฟิวส์">
  <defs><linearGradient id="phg${o.id||""}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ph-blue)" stop-opacity=".75"/><stop offset="1" stop-color="var(--ph-blue)" stop-opacity=".18"/></linearGradient></defs>
  <!-- เสา แขน ฐาน -->
  <g class="part" data-id="arm">
    <rect class="hit" x="282" y="30" width="30" height="250" rx="6"/>
    <rect class="ph-col" x="290" y="40" width="14" height="236" rx="4"/>
    <rect class="ph-knob" x="284" y="196" width="26" height="10" rx="3"/>
    <rect class="ph-base" x="232" y="276" width="124" height="7" rx="3"/>
    <circle class="ph-wheel" cx="244" cy="290" r="6"/><circle class="ph-wheel" cx="344" cy="290" r="6"/>
    ${t(320,192,"เสาและแขน","middle")}
  </g>
  <!-- แสง -->
  <g class="ph-beam">
    <polygon class="ph-cone" points="62,68 230,68 262,200 30,200" fill="url(#phg${o.id||""})"/>
    <polygon class="ph-band" points="117,68 172,68 178,200 110,200"/>
  </g>
  <!-- เตียงและทารก -->
  <rect class="ph-crib" x="34" y="200" width="226" height="40" rx="6"/>
  <rect class="ph-matt" x="40" y="194" width="214" height="10" rx="5"/>
  <g class="ph-baby"><ellipse cx="104" cy="184" rx="13" ry="11"/><rect class="ph-mask" x="94" y="179" width="18" height="6" rx="3"/><ellipse cx="148" cy="186" rx="32" ry="11"/><rect class="ph-nap" x="164" y="178" width="18" height="16" rx="5"/><path d="M178 182 q14 -2 22 4 M178 190 q14 2 22 -2"/></g>
  <rect class="ph-legs" x="60" y="240" width="8" height="40"/><rect class="ph-legs" x="226" y="240" width="8" height="40"/>
  <rect class="ph-base" x="46" y="278" width="200" height="5" rx="2"/>
  <!-- เครื่องวัดแสง -->
  <g class="part ph-mg" data-id="meter">
    <rect class="hit" x="198" y="168" width="54" height="32" rx="6"/>
    <rect class="ph-mbody" x="204" y="172" width="44" height="24" rx="5"/>
    <rect class="ph-mscr" x="208" y="176" width="36" height="12" rx="2"/>
    <text class="ph-mv" x="226" y="185.5" text-anchor="middle">--</text>
    <text class="ph-mu" x="226" y="194" text-anchor="middle">µW/cm²/nm</text>
    ${t(226,164,"เครื่องวัดแสง","middle")}
  </g>
  <!-- โคม (ขยับขึ้นลงตามระยะ) -->
  <g class="ph-headg">
    <rect class="ph-armh" x="226" y="34" width="72" height="9" rx="4"/>
    <rect class="ph-head" x="52" y="26" width="186" height="36" rx="10"/>
    <g class="part" data-id="driver">
      <rect class="hit" x="56" y="8" width="64" height="20" rx="4"/>
      <g class="ph-sink">${fins}</g>
      <rect class="ph-brd" x="60" y="17" width="54" height="8" rx="2"/>
      ${t(84,4,"วงจรขับ LED","middle")}
    </g>
    <g class="part" data-id="fan">
      <rect class="hit" x="142" y="6" width="48" height="22" rx="5"/>
      <rect class="ph-fbox" x="148" y="10" width="36" height="16" rx="4"/>
      <g class="ph-fan"><path d="M166 18 l-8 -5 M166 18 l8 5 M166 18 l5 -7 M166 18 l-5 7"/><circle cx="166" cy="18" r="2.2"/></g>
      ${t(196,8,"พัดลมระบายความร้อน")}
    </g>
    <g class="part" data-id="led">
      <rect class="hit" x="60" y="44" width="172" height="18" rx="5"/>
      <rect class="ph-pcb" x="62" y="48" width="166" height="13" rx="3"/>
      ${leds}
      ${t(40,46,"แผง LED","end")}
    </g>
    <g class="part" data-id="cover">
      <rect class="hit" x="56" y="60" width="180" height="12" rx="4"/>
      <rect class="ph-cov" x="58" y="62" width="174" height="6" rx="3"/>
      <g class="ph-dirt"><circle cx="90" cy="65" r="2.4"/><circle cx="142" cy="64" r="3"/><circle cx="196" cy="65.5" r="2.2"/><circle cx="118" cy="66" r="1.8"/></g>
      ${t(40,70,"ฝาครอบเลนส์","end")}
    </g>
    <path class="ph-cloth" d="M70 24 q30 -14 70 -4 q40 10 80 -2 v26 q-40 10 -80 2 q-40 -8 -70 4z"/>
  </g>
  <!-- แผงควบคุมบนเสา -->
  <g class="part" data-id="panel">
    <rect class="hit" x="280" y="70" width="78" height="100" rx="8"/>
    <rect class="ph-pbox" x="286" y="74" width="68" height="92" rx="7"/>
    <rect class="ph-scr" x="291" y="80" width="58" height="46" rx="4"/>
    <text class="ph-mode" x="320" y="92" text-anchor="middle">HIGH</text>
    <text class="ph-k" x="295" y="106">LED</text><text class="ph-hrs" x="346" y="106" text-anchor="end">0 h</text>
    <text class="ph-alm" x="320" y="120" text-anchor="middle"></text>
    <circle class="ph-ind r" cx="298" cy="138" r="4"/><circle class="ph-ind g" cx="310" cy="138" r="4"/>
    <circle class="ph-dial" cx="334" cy="142" r="9"/><path class="ph-dialm" d="M334 142 l5 -6"/>
    ${t(320,68,"แผงควบคุม","middle")}
  </g>
  <!-- ภาคจ่ายไฟที่ฐาน -->
  <g class="part" data-id="psu">
    <rect class="hit" x="250" y="236" width="104" height="38" rx="6"/>
    <rect class="ph-cab" x="256" y="240" width="92" height="30" rx="6"/>
    <rect class="ph-psu" x="262" y="246" width="44" height="18" rx="3"/>
    <rect class="ph-fuse" x="312" y="248" width="26" height="8" rx="3"/>
    <path class="ph-cord" d="M348 262 H358"/>
    ${t(302,232,"ภาคจ่ายไฟ ฟิวส์","middle")}
  </g>
</svg>`;
  }

  /* ความเข้มแสงจำลองที่กลางเตียง (µW/cm²/nm) : HIGH 36 ที่ 30 cm, LOW 18 · เปลี่ยนตามระยะ ~ (30/d)^1.4 */
  function irr(v){
    v=v||{}; if(v.off) return 0;
    const base=v.lvl==="lo"?18:36, d=+v.dist||30;
    let e=base*Math.pow(30/d,1.4)*(v.dim===undefined?1:v.dim);
    if(v.cover==="dirty") e*=0.68;
    if(v.cloth) e*=0.15;
    return Math.round(e*10)/10;
  }
  /* พื้นที่แสงตก (ความกว้างตามแนวยาวของเตียง cm) โตตามระยะ */
  function foot(d){ d=+d||30; return Math.round(30+d*1.2); }

  function state(svg, v){
    v=v||{};
    const on=(c,b)=>svg.classList.toggle(c,!!b), off=!!v.off;
    on("off", off); on("dark", v.dark && !off); on("dirty", v.cover==="dirty"); on("cloth", v.cloth);
    on("fanstop", v.fan==="stop" || off); on("hot", v.hot); on("alarm", v.alarm && !off); on("nobaby", v.baby===false);
    const d=Math.max(20,Math.min(60, +v.dist||30)), lv=irr(Object.assign({},v,{off:false}));
    const k=off?0:Math.max(0.06, Math.min(1.25, lv/36));
    svg.style.setProperty("--lvl", k.toFixed(2));
    const g=svg.querySelector(".ph-headg"), dy=-(d-30)*0.7;
    if(g) g.setAttribute("transform", `translate(0 ${dy.toFixed(1)})`);
    const spread=(d-30)*1.1, top=68+dy;
    const cone=svg.querySelector(".ph-cone"); if(cone) cone.setAttribute("points", `62,${top} 230,${top} ${(262+spread).toFixed(0)},200 ${(30-spread).toFixed(0)},200`);
    const band=svg.querySelector(".ph-band"); if(band) band.setAttribute("points", `117,${top} 172,${top} ${(178+spread*0.2).toFixed(0)},200 ${(110-spread*0.2).toFixed(0)},200`);
    const q=s=>svg.querySelector(s);
    const md=q(".ph-mode"); if(md) md.textContent=off?"":(v.lvl==="lo"?"LOW":"HIGH");
    const hr=q(".ph-hrs"); if(hr) hr.textContent=off?"":(v.hours===undefined?"1,240":Number(v.hours).toLocaleString("en-US"))+" h";
    const al=q(".ph-alm"); if(al) al.textContent=off?"":(v.alarm||"");
    const dm=q(".ph-dialm"); if(dm) dm.setAttribute("d", v.lvl==="lo"?"M334 142 l-6 -4":"M334 142 l5 -6");
    const mg=q(".ph-mg"), mv=q(".ph-mv");
    if(mg){ mg.style.display=v.rad===null||v.rad===undefined?"none":""; if(mv) mv.textContent=typeof v.rad==="number"?v.rad.toFixed(1):String(v.rad||""); }
    const hi=[].concat(v.hi||[]);
    svg.querySelectorAll(".part").forEach(p=>p.classList.toggle("hl", hi.includes(p.dataset.id)));
  }
  window.PHDIA = {svg, state, irr, foot};
})();
