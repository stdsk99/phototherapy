/* ===== รายการหัวข้อที่ต้องเปิดดูก่อนสอบท้ายโมดูล (แอปซ่อมรุ่นใหม่: ดูด เครื่องอุ่น ส่องไฟ) =====
   โหลดหลัง js/app.js และก่อน js/mgate.js · ไม่นับเครื่องจำลอง/แบบฝึก นับเฉพาะเนื้อหาที่ต้องอ่าน */
(function(){
  if(!window.Seen) return;
  const later=f=>setTimeout(f,60);
  const toView=v=>{ if(location.hash!=="#"+v) location.hash="#"+v; };
  const near=el=>{ if(el) el.scrollIntoView({behavior:"smooth",block:"center"}); };
  const fromDom=scope=>()=>{ const seen=new Set(), out=[];
    document.querySelectorAll(`[data-seen^="${scope}|"]`).forEach(el=>{ const id=el.dataset.seen.slice(scope.length+1); if(seen.has(id)) return; seen.add(id);
      const s=el.tagName==="DETAILS"?el.querySelector("summary"):el; out.push({id, n:(s?s.textContent:id).trim().replace(/^✓\s*/,"")}); });
    return out; };
  const openDetails=(view,scope)=>id=>{ toView(view); later(()=>{ const el=document.querySelector(`details[data-seen="${scope}|${id}"]`); if(el){ el.open=true; near(el); } }); };

  /* โมดูล 1 ภาพรวม */
  if(window.PHYSICS){
    Seen.define("overview", ()=>PHYSICS.lessons.map(l=>({id:l.id, n:l.n||l.t||l.id})),
      id=>{ toView("overview"); later(()=>{ const b=document.querySelector(`#physics [data-l="${id}"]`); if(b){ b.click(); near(document.getElementById("physics")); } }); });
  } else if(document.getElementById("ov-panel")){
    Seen.define("overview", fromDom("overview"), openDetails("overview","overview"));
  }
  /* โมดูล 2 ชิ้นส่วน */
  if(window.PARTS) Seen.define("parts", ()=>Object.entries(PARTS).map(([id,o])=>({id, n:o.th||id})),
    id=>{ toView("parts"); later(()=>{ if(typeof select==="function") select(id,true); }); });
  /* โมดูล 3 การใช้งานสำหรับช่าง: บทเรียนทุกบท */
  if(window.TECHUSE) Seen.define("tech", ()=>TECHUSE.lessons.map(l=>({id:l.id, n:l.n||l.id})),
    id=>{ toView("tech"); later(()=>{ const t=document.querySelector('#tech .pmtabs [data-t="learn"]'); if(t && !t.classList.contains("on")) t.click();
      later(()=>{ const b=document.querySelector(`#tech [data-l="${id}"]`); if(b) b.click(); near(document.getElementById("tech")); }); }); });
  /* ด่านความปลอดภัย */
  if(window.SAFETY && document.getElementById("safety")) Seen.define("safety", fromDom("safety"), openDetails("safety","safety"));
  /* ตรวจรับและ PM: บทเรียนของแต่ละส่วน */
  const SC=window.SEEN_SCOPE||{};
  const learnTab=(view,rootId,sub)=>()=>{ toView(view); later(()=>{ if(sub && typeof svcTab==="function") svcTab(sub);
    const b=document.querySelector(`#${rootId} .pmtabs [data-t="learn"]`); if(b) b.click(); near(document.getElementById(rootId)); }); };
  if(window.SVC){
    if(SC.accept && SC.accept===SC.pmplan){
      const sc=SC.accept, A=learnTab(sc,"accept","accept"), B=learnTab(sc,"pmplan","pmplan");
      Seen.define(sc, ()=>[{id:"accept-learn", n:"บทเรียนตรวจรับเครื่อง"},{id:"pm-learn", n:"บทเรียน PM ตามรอบ"}], id=>id==="accept-learn"?A():B());
    } else {
      if(SVC.accept) Seen.define("accept", ()=>[{id:"accept-learn", n:"บทเรียนตรวจรับเครื่อง"}], learnTab("accept","accept"));
      if(SVC.pm) Seen.define("pmplan", ()=>[{id:"pm-learn", n:"บทเรียน PM ตามแผน"}], learnTab("pmplan","pmplan"));
    }
  }
  /* วิเคราะห์อาการ: เปิดอ่านทุกอาการ (เครื่องจำลองไม่นับ) */
  if(window.TROUBLE) Seen.define("repair", ()=>TROUBLE.map(a=>({id:a.id, n:a.n})),
    id=>{ toView("repair"); later(()=>{ try{ pf="all"; document.querySelectorAll("#pf button").forEach(x=>x.classList.toggle("on",x.dataset.p==="all"));
      const q=document.getElementById("q"); if(q) q.value=""; openAlarm=id; repTab("trouble"); }catch(e){} }); });
  /* ทดสอบหลังซ่อม: ทุกหัวข้อการทดสอบ (แบบฝึกสั่งซื้อไม่นับ) */
  if(window.PM) Seen.define("test", ()=>PM.map(x=>({id:x.id, n:x.n||x.t||x.id})),
    id=>{ toView("test"); later(()=>{ try{ testTab("pm"); }catch(e){} later(()=>{ const b=document.querySelector(`#pm .pmtabs [data-id="${id}"]`); if(b) b.click(); near(document.getElementById("pm")); }); }); });
})();
