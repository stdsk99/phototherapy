# Phototherapy Repair Trainer

สื่อฝึกซ่อมและบำรุงรักษาเครื่องส่องไฟรักษาทารกตัวเหลืองแบบ LED (วิชาช่าง) ของศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์

- เว็บ: https://stdsk99.github.io/phototherapy/ · หน้า 3D: `/3d/`
- รหัสแอป `photo` · คีย์ในเครื่อง `pht-` · เลขที่เกียรติบัตร `PHT-` (ตั้งค่าใน `data/config.js` ต้องตรงกับ `APPS.photo` ใน Code.gs)
- สมัคร เข้าสู่ระบบ และลงทะเบียนทำที่เว็บหลัก `stdsk99/medtechcenter` · Code.gs อยู่ใน `stdsk99/oxygen-concentrator` และ `stdsk99/infant-incubator-trainer` (ต้องเหมือนกัน)

## 6 โมดูล
1. ฟิสิกส์ของแสงรักษา (`data/physics.js`, `js/physics.js`): การดูดกลืนของบิลิรูบิน แหล่งแสงแต่ละแบบ ความเข้มแสง µW/cm²/nm เครื่องวัด และระยะโคม
2. ส่วนประกอบ 8 ชิ้น (`data/parts.js`) ภาพเครื่อง `js/dia.js` (PHDIA)
3. การใช้งานและความปลอดภัย (`data/tech.js`) สอบท้ายโมดูลเป็นด่านความปลอดภัย `mq:tech` ต้องถูกครบ 5 ข้อ
4. ตรวจรับและ PM ตามรอบ (`data/svc.js`)
5. วิเคราะห์อาการและซ่อม 6 เคส (`data/trouble.js`, `data/cases.js`, `data/learn.js`)
6. ทดสอบหลังซ่อม (`data/pm.js`) และลำดับขั้นตอน 2 งาน (`data/order.js`)

เกณฑ์ 30 µW/cm²/nm และช่วงคลื่น 460–490 nm อ้างอิงแนวทาง American Academy of Pediatrics ตัวเลขอื่นเป็นค่าตัวอย่างของเครื่องจำลอง

ใช้ `?preview` ต่อท้าย URL เพื่อดูทุกหน้าโดยไม่ต้องเข้าสู่ระบบ
