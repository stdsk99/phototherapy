/* ===== เครื่องส่องไฟรักษาทารกตัวเหลืองแบบ LED 3 มิติ =====
   หน่วย = เซนติเมตร (ประมาณ) แกน Y ขึ้น ด้านหน้าเครื่องหันไป +Z
   ทุกชิ้นสร้างจากรูปทรงพื้นฐาน เป็นเครื่องจำลองทั่วไป ไม่ได้ใช้โมเดลของผู้ผลิต
   โครงหน้า (กล้อง ป้ายชื่อ แผงด้านขวา โหมดฝึก) ดัดแปลงจากหน้า 3D ของวิชาตู้อบ */
import * as THREE from "three";
import { OrbitControls } from "./lib/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "./lib/CSS2DRenderer.js";

const MODE = "tech";
const PARTS = Object.assign({}, window.PARTS || {}, window.EXTRA3D || {});
const GROUPS = window.GROUPS3D || [];
const NARROW = matchMedia("(max-width:900px), (orientation:portrait) and (max-width:1200px)");
const MOBILE = NARROW.matches;
const R = 70;   // รัศมีโดยประมาณของฉาก ใช้จัดกล้องให้พอดีจอ

/* ---------- renderer / scene ---------- */
const stage = document.getElementById("stage");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2));
stage.prepend(renderer.domElement);
const labelR = new CSS2DRenderer();
labelR.domElement.className = "labels";
stage.appendChild(labelR.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.minDistance = 40; controls.maxDistance = 500;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8a96a8, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(60, 120, 90); scene.add(sun);
const fillL = new THREE.DirectionalLight(0xdfe8ff, 0.6); fillL.position.set(-80, 50, -60); scene.add(fillL);
{
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, "rgba(30,40,55,.32)"); gr.addColorStop(1, "rgba(30,40,55,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(150, 110), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(14, 0.05, 0); scene.add(m);
}

/* ---------- วัสดุ ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o));
const M = {
  shell: mat(0xeef0f4), panel: mat(0xdfe7e6), dark: mat(0x3a4250), black: mat(0x1f242b), rubber: mat(0x2b3138, { roughness: 0.9 }),
  steel: mat(0xb8c0c9, { metalness: 0.7, roughness: 0.3 }), pcb: mat(0x1f7a46, { roughness: 0.6 }), chip: mat(0x22262c), alu: mat(0xc9ced6, { metalness: 0.6, roughness: 0.35 }),
  ledPcb: mat(0x26313d), led: new THREE.MeshStandardMaterial({ color: 0x7db4ff, emissive: 0x2f7df6, emissiveIntensity: 0, roughness: 0.3 }),
  lens: new THREE.MeshStandardMaterial({ color: 0xcfe2ff, transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false }),
  matt: mat(0xcfe6ef, { roughness: 0.7 }), tray: mat(0xe6ebee),
  side: new THREE.MeshStandardMaterial({ color: 0xd6eeff, transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide }),
  skin: mat(0xf3cfb3, { roughness: 0.8 }), mask: mat(0x1d2430), nappy: mat(0xffffff), cable: mat(0x1f242b, { roughness: 0.7 }),
  screen: mat(0x14303a, { emissive: 0x0a2a30 }), ledG: mat(0x2fbf71, { emissive: 0x0a3a1e }), ledR: mat(0x7a3a3a),
  psu: mat(0x2b3138), fuse: mat(0xe9eef3, { metalness: 0.3 }), cover: mat(0xeef0f4), knob: mat(0x2b3138), meter: mat(0xf2c94c), fanB: mat(0x2b3138)
};

/* ---------- ตัวช่วยสร้างรูปทรง ---------- */
function box(w, h, d, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
function cyl(rt, rb, h, m, x = 0, y = 0, z = 0, parent, seg = 28) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
function grp(parent, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }
function tag(obj, id) { obj.traverse(o => { if (o.isMesh) o.userData.part = id; }); }
function tube(points, r, m, parent) {
  const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const o = new THREE.Mesh(new THREE.TubeGeometry(c, 40, r, 10, false), m); if (parent) parent.add(o); return o;
}
const nodes = [];
function reg(node, explode = [0, 0, 0]) {
  node.userData.base = { p: node.position.clone(), r: node.rotation.clone() };
  node.userData.ex = new THREE.Vector3(...explode); node.userData.fx = [];
  nodes.push(node); return node;
}
const partRoot = {}, labelAt = {};
const dev = grp(scene);

/* ========== เตียงทารก (แยกจากเครื่อง) ผิวที่นอน y = 48 ========== */
const bassG = grp(dev, -4, 0, 0); partRoot.bassinet = bassG;
[[-26, 14], [26, 14], [-26, -14], [26, -14]].forEach(([x, z]) => { box(3, 40, 3, M.panel, x, 22, z, bassG); cyl(2, 2, 2.4, M.rubber, x, 1.4, z, bassG).rotation.x = Math.PI / 2; });
box(64, 4, 38, M.tray, 0, 43, 0, bassG);
box(60, 3, 34, M.matt, 0, 46.5, 0, bassG);
box(64, 14, 0.6, M.side, 0, 52, 19, bassG); box(64, 14, 0.6, M.side, 0, 52, -19, bassG); box(0.6, 14, 38, M.side, -32, 52, 0, bassG); box(0.6, 14, 38, M.side, 32, 52, 0, bassG);
/* ทารกจำลอง ปิดตา ใส่ผ้าอ้อม */
const bh = new THREE.Mesh(new THREE.SphereGeometry(4.6, 20, 14), M.skin); bh.position.set(-16, 51, 0); bassG.add(bh);
box(2, 2.2, 7, M.mask, -12.4, 52, 0, bassG);
const bb = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), M.skin); bb.scale.set(10, 3.6, 6.5); bb.position.set(-2, 50.5, 0); bassG.add(bb);
box(6, 4, 9, M.nappy, 6, 51, 0, bassG);
[[14, 49.8, 2.8], [14, 49.8, -2.8]].forEach(p => { const l = cyl(1.3, 1.1, 9, M.skin, ...p, bassG); l.rotation.z = Math.PI / 2; });
tag(bassG, "bassinet"); labelAt.bassinet = [bassG, [-28, 30, 18]];
/* เครื่องวัดแสงบนที่นอน */
const meterG = reg(grp(dev, 14, 48.6, 9), [0, 6, 8]); partRoot.meter = meterG;
box(8, 2, 5, M.meter, 0, 0, 0, meterG); box(5, 0.3, 2.6, M.screen, 0, 1.1, -0.6, meterG); cyl(1.2, 1.2, 0.8, M.black, 0, 1.2, 1.6, meterG);
tag(meterG, "meter"); labelAt.meter = [meterG, [0, 4, 2]];

/* ========== ฐาน เสา และภาคจ่ายไฟ ========== */
const standG = grp(dev); partRoot.arm = standG;
box(36, 3, 44, M.dark, 50, 4, 0, standG);
[[36, 18], [64, 18], [36, -18], [64, -18]].forEach(([x, z]) => { cyl(2.4, 2.4, 2.6, M.rubber, x, 1.6, z, standG).rotation.x = Math.PI / 2; });
box(6, 104, 6, M.shell, 50, 72, -6, standG);
box(9, 4, 9, M.knob, 50, 92, -6, standG);   // ปุ่มล็อกความสูง
tag(standG, "arm"); labelAt.arm = [standG, [56, 40, -4]];
const baseCab = grp(dev, 50, 14, -6); partRoot.housingBase = baseCab;
box(22, 16, 16, M.shell, 0, 0, -1, baseCab);
tag(baseCab, "psu");
const baseCoverG = reg(grp(dev, 50, 14, 2.6), [0, 0, 10]);
const coverParts = [box(22, 16, 1, M.cover, 0, 0, 0, baseCoverG)];
[-6, 0, 6].forEach(x => box(3, 1, 0.3, M.dark, x, -4, 0.6, baseCoverG));
tag(baseCoverG, "psu");
const psuG = reg(grp(dev, 50, 13, -4), [0, 0, 18]); partRoot.psu = psuG;
box(14, 9, 9, M.psu, 0, 0, 0, psuG);
const fz = cyl(0.7, 0.7, 3.6, M.fuse, -4, 5.4, 3, psuG); fz.rotation.z = Math.PI / 2;
tube([[7, -3, -4], [14, -5, -12], [24, -10, -22]], 0.6, M.cable, psuG);
tag(psuG, "psu"); labelAt.psu = [psuG, [0, 7, 4]];
/* แผงควบคุมบนเสา */
const panelG = reg(grp(dev, 50, 66, -1.4), [12, 0, 10]); partRoot.panel = panelG;
box(14, 18, 3, M.shell, 0, 0, 0, panelG);
box(11, 7, 0.4, M.screen, 0, 4, 1.6, panelG);
const LED = [cyl(0.8, 0.8, 0.6, M.ledR, -4, -3, 1.7, panelG), cyl(0.8, 0.8, 0.6, M.ledG, -1, -3, 1.7, panelG)]; LED.forEach(l => l.rotation.x = Math.PI / 2);
const dial = cyl(2.2, 2.2, 1.2, M.knob, 3, -5, 1.8, panelG); dial.rotation.x = Math.PI / 2;
tag(panelG, "panel"); labelAt.panel = [panelG, [0, 12, 2]];

/* ========== แขนและโคม (ขยับขึ้นลงตามระยะ) ผิวที่นอน 48 + ระยะ 30 = 78 ========== */
const rig = grp(dev, 0, 78, 0);
const armG = grp(rig); box(50, 4, 5, M.shell, 24, 10, -6, armG); box(9, 8, 9, M.shell, 50, 10, -6, armG); tag(armG, "arm");
const headG = grp(rig, -4, 0, 0);
box(66, 5, 36, M.shell, 0, 2.5, 0, headG); tag(headG, "housing");
const finG = grp(headG); for (let i = -28; i <= 28; i += 4) box(1, 3, 30, M.alu, i, 6.5, 0, finG); tag(finG, "fan");
const ledG = reg(grp(headG, 0, 0.2, 0), [0, -10, 0]); partRoot.led = ledG;
box(60, 0.8, 30, M.ledPcb, 0, 0.6, 0, ledG);
const leds = [];
for (let x = -24; x <= 24; x += 6) for (let z = -9; z <= 9; z += 6) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 8), M.led); l.position.set(x, 0, z); ledG.add(l); leds.push(l); }
tag(ledG, "led"); labelAt.led = [ledG, [-22, -2, 16]];
const coverG3 = reg(grp(headG, 0, -0.9, 0), [0, -18, 0]); partRoot.cover = coverG3;
box(62, 0.6, 32, M.lens, 0, 0, 0, coverG3);
tag(coverG3, "cover"); labelAt.cover = [coverG3, [24, -2, 17]];
const fanG = reg(grp(headG, 14, 7.5, 0), [0, 10, 0]); partRoot.fan = fanG;
cyl(5.6, 5.6, 3, M.dark, 0, 0, 0, fanG);
const blades = grp(fanG, 0, 1.7, 0);
for (let i = 0; i < 5; i++) { const b = box(4.6, 0.3, 1.6, M.fanB, 2.3, 0, 0); const pv = grp(blades); pv.rotation.y = i * Math.PI * 2 / 5; pv.add(b); }
tag(fanG, "fan"); labelAt.fan = [fanG, [0, 4, 0]];
const drvG = reg(grp(headG, -16, 7, 4), [-8, 12, 0]); partRoot.driver = drvG;
box(18, 1, 12, M.pcb, 0, 0, 0, drvG); box(5, 2, 4, M.chip, -3, 1.4, 0, drvG); cyl(1.2, 1.2, 3, M.black, 5, 2, 2, drvG);
tag(drvG, "driver"); labelAt.driver = [drvG, [0, 4, 0]];
/* ฝาบนโคม (ถอดได้) */
const topG = reg(grp(headG, 0, 10, 0), [0, 14, 0]); partRoot.housing = topG;
const topParts = [box(66, 2, 36, M.cover, 0, 0, 0, topG)];
[-20, -12, -4, 4, 12, 20].forEach(x => box(4, 0.4, 20, M.dark, x, 1.1, 0, topG));
tag(topG, "housing"); labelAt.housing = [topG, [-26, 3, 0]];
tube([[-0, 10, -6], [0, 18, -6], [40, 18, -6]], 0.5, M.cable, rig);

/* แสงสีฟ้าจากแผง LED ลงที่นอน (กรวยสี่เหลี่ยม) */
const beamMat = new THREE.MeshBasicMaterial({ color: 0x4f9bff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const beam = new THREE.Mesh(new THREE.BufferGeometry(), beamMat); beam.renderOrder = 2; scene.add(beam);
function beamGeo(h) {
  const w1 = 30, d1 = 15, k = 1 + h / 60, w2 = w1 * k, d2 = d1 * k, y1 = 48 + h - 1, y2 = 48.2, cx = -4;
  const P = [[-w1, y1, -d1], [w1, y1, -d1], [w1, y1, d1], [-w1, y1, d1], [-w2, y2, -d2], [w2, y2, -d2], [w2, y2, d2], [-w2, y2, d2]].map(([x, y, z]) => [x + cx, y, z]);
  const idx = [0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7];
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P.flat(), 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const blueLight = new THREE.PointLight(0x4f8cff, 0, 140, 1.4); blueLight.position.set(-4, 70, 0); scene.add(blueLight);

/* ---------- การกระทำ (ขยับชิ้นส่วน) ----------
   fx: [โหนด, ระยะเลื่อน [x,y,z], มุมหมุน]  ·  req: ต้องทำการกระทำเหล่านี้ก่อน */
const A = {
  cover:     { on: "ถอดฝาครอบเลนส์", off: "ใส่ฝาครอบเลนส์กลับ", fx: [[coverG3, [0, -16, 22]]] },
  led:       { on: "ปลดแผง LED ลงมา", off: "ใส่แผง LED กลับ", req: ["cover"], fx: [[ledG, [0, -12, 30]]] },
  topcover:  { on: "ถอดฝาบนโคม", off: "ปิดฝาบนโคม", fx: [[topG, [0, 14, -8]]] },
  fan:       { on: "ยกพัดลมออก", off: "ใส่พัดลมกลับ", req: ["topcover"], fx: [[fanG, [10, 12, 14]]] },
  driver:    { on: "ยกวงจรขับออก", off: "ใส่วงจรขับกลับ", req: ["topcover"], fx: [[drvG, [-10, 12, 14]]] },
  panel:     { on: "ดึงแผงควบคุมออกจากเสา", off: "ใส่แผงควบคุมกลับ", fx: [[panelG, [10, 0, 12]]] },
  basecover: { on: "ถอดฝาฐาน", off: "ปิดฝาฐาน", fx: [[baseCoverG, [0, 0, 16]]] },
  psu:       { on: "ยกภาคจ่ายไฟออก", off: "ใส่ภาคจ่ายไฟกลับ", req: ["basecover"], fx: [[psuG, [0, 0, 26]]] },
  meter:     { on: "ยกเครื่องวัดแสงออก", off: "วางเครื่องวัดแสงกลางเตียง", fx: [[meterG, [10, 6, 14]]] }
};
const PART_ACTIONS = { led: ["cover", "led"], cover: ["cover"], fan: ["topcover", "fan"], driver: ["topcover", "driver"], housing: ["topcover"],
  panel: ["panel"], psu: ["basecover", "psu"], meter: ["meter"], arm: [], bassinet: [] };
for (const k in A) { const a = A[k]; a.t = 0; a.v = 0; (a.fx || []).forEach(([n, dp, dr]) => n.userData.fx.push([a, dp, dr])); }
function isOn(k) { return !!A[k].t; }
function toggle(k) {
  const a = A[k], turnOn = !a.t;
  if (turnOn) { const miss = (a.req || []).filter(r => !A[r].t); if (miss.length) { toast("ต้อง" + A[miss[0]].on + "ก่อน"); return; } }
  else { const dep = Object.keys(A).find(o => A[o].t && (A[o].req || []).includes(k)); if (dep) { toast("ต้อง" + A[dep].off + "ก่อน"); return; } }
  if (turnOn && running && k !== "meter") stopRun("ปิดเครื่องและรอให้เย็นก่อนถอดชิ้นส่วน");
  a.t = turnOn ? 1 : 0; refresh();
  if (window.Task3D) Task3D.onToggle(k, turnOn);
}

/* ---------- เปิดไฟ: อนุภาคแสงสีฟ้าตกลงที่นอน ---------- */
const NA = MOBILE ? 70 : 140;
const fGeo = new THREE.BufferGeometry();
fGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NA * 3), 3));
const flowPts = new THREE.Points(fGeo, new THREE.PointsMaterial({ size: 1.1, color: 0x6fa8ff, transparent: true, opacity: 0.9, depthWrite: false }));
flowPts.visible = false; flowPts.renderOrder = 3; scene.add(flowPts);
const fu = Array.from({ length: NA }, () => Math.random()), fx0 = Array.from({ length: NA }, () => [(Math.random() - 0.5) * 56, (Math.random() - 0.5) * 26]);
let running = false, lightV = 0, distCm = 30, distV = 30;
function stepFlow(dt) {
  const pos = fGeo.attributes.position.array, top = 48 + distV - 1, k = 1 + distV / 60;
  for (let i = 0; i < NA; i++) {
    fu[i] = (fu[i] + dt * 0.7) % 1; const u = fu[i], s = 1 + (k - 1) * u;
    pos[i * 3] = -4 + fx0[i][0] * s; pos[i * 3 + 1] = top - u * (top - 48.4); pos[i * 3 + 2] = fx0[i][1] * s;
  }
  fGeo.attributes.position.needsUpdate = true;
}

/* ---------- ป้ายชื่อ ---------- */
const SHORT = { led: "แผง LED", cover: "ฝาครอบเลนส์", driver: "วงจรขับ LED", fan: "พัดลม + ครีบระบาย", housing: "ฝาบนโคม", arm: "เสาและแขน",
  panel: "แผงควบคุม", psu: "ภาคจ่ายไฟ + ฟิวส์", meter: "เครื่องวัดแสง", bassinet: "เตียงทารก" };
const labels = {}, labelObj = {};
for (const id in labelAt) {
  const [node, p] = labelAt[id];
  const el = document.createElement("div"); el.className = "lbl"; el.textContent = SHORT[id] || id;
  el.addEventListener("pointerdown", e => e.stopPropagation());
  el.addEventListener("click", e => { e.stopPropagation(); select(id); });
  const o = new CSS2DObject(el); o.position.set(...p); node.add(o); labels[id] = el; labelObj[id] = o;
}
const INSIDE = { driver: "topcover", fan: "topcover", psu: "basecover" };
let coverMode = 0;
function labelVis() { for (const id in INSIDE) labelObj[id].visible = selected === id || exV > 0.25 || A[INSIDE[id]].v > 0.5 || coverMode > 0; }

/* ---------- เลือกชิ้นส่วน ---------- */
const selBox = new THREE.BoxHelper(undefined, 0xe8590c); selBox.visible = false; selBox.material.depthTest = false; selBox.renderOrder = 5; scene.add(selBox);
let selected = null;
function select(id) {
  selected = id;
  for (const k in labels) labels[k].classList.toggle("sel", k === id);
  if (id && partRoot[id]) { selBox.setFromObject(partRoot[id]); selBox.visible = true; } else selBox.visible = false;
  renderSide();
}
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let down = null;
renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener("pointerup", e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { down = null; return; }
  down = null; const hit = pick(e); select(hit ? hit.object.userData.part : null);
});
renderer.domElement.addEventListener("pointermove", e => { if (e.buttons) return; renderer.domElement.style.cursor = pick(e) ? "pointer" : "grab"; });
function pick(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(scene.children, true).filter(h => h.object.isMesh && h.object.visible && h.object.userData.part);
  const solid = hits.find(h => h.object.material !== M.side && h.object.material !== M.lens && !(coverMode === 1 && (coverParts.includes(h.object) || topParts.includes(h.object))));
  return solid || hits[0] || null;
}

/* ---------- แผงด้านขวา ---------- */
const side = document.getElementById("side");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function groupOf(id) { const g = GROUPS.find(g => g.ids.includes(id)); return g ? g.t : ""; }
function renderSide() {
  side.parentElement.scrollTop = 0;
  if (!selected) {
    side.innerHTML = `<h2>ชิ้นส่วนทั้งหมด</h2><p class="en">หน้าที่ หลักการ อาการเสีย และวิธีตรวจ</p>
      ${GROUPS.map(g => `<div class="grp">${esc(g.t)}</div><div class="plist">${g.ids.map(id => `<button data-id="${id}">${esc(SHORT[id] || id)}</button>`).join("")}</div>`).join("")}
      <p class="note">กด “เปิดไฟ” เพื่อดูแสงสีฟ้าจากแผง LED ตกลงบนที่นอน กดปุ่มระยะเพื่อยกโคมจาก 30 เป็น 50 cm แล้วดูแสงกระจายกว้างขึ้นและจางลง ลองถอดตามลำดับจริง: ฝาครอบเลนส์ → แผง LED หรือ ฝาบน → พัดลม ถ้าข้ามขั้น ระบบจะบอกว่าต้องทำอะไรก่อน</p>`;
    side.querySelectorAll("[data-id]").forEach(b => b.onclick = () => select(b.dataset.id));
    return;
  }
  const Pt = PARTS[selected] || {};
  const acts = (PART_ACTIONS[selected] || []).map(k => {
    const on = isOn(k), a = A[k], lock = !on && (a.req || []).some(r => !A[r].t);
    const need = lock ? `<small>ต้อง${esc(A[(a.req || []).find(r => !A[r].t)].on)}ก่อน</small>` : "";
    return `<button data-a="${k}" class="${on ? "on" : ""}${lock ? " lock" : ""}">${esc(on ? a.off : a.on)}${need}</button>`;
  }).join("");
  side.innerHTML = `<button class="link" id="all">← รายการทั้งหมด</button><br>
    <span class="chip">${esc(groupOf(selected))}</span>
    <h2>${esc(Pt.th || SHORT[selected])}</h2><div class="en">${esc(Pt.n || "")}</div>
    <p>${esc(Pt.f || "")}</p>
    ${acts ? `<h3>สั่งให้ขยับ</h3><div class="acts">${acts}</div>` : ""}
    ${Pt.h ? `<h3>หลักการทำงาน</h3><p>${esc(Pt.h)}</p>` : ""}
    ${Pt.x ? `<h3>อาการเสียที่พบบ่อย</h3><ul>${Pt.x.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
    ${Pt.c ? `<h3>วิธีตรวจเบื้องต้น</h3><ol>${Pt.c.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}`;
  side.querySelector("#all").onclick = () => select(null);
  side.querySelectorAll("[data-a]").forEach(b => b.onclick = () => toggle(b.dataset.a));
}
function refresh() { if (selected) renderSide(); }

let toastT = 0;
function toast(msg, ok) {
  const t = document.getElementById("toast"); t.textContent = msg; t.className = "toast" + (ok ? " ok" : ""); t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800);
}

/* ---------- แถบเครื่องมือ ---------- */
const VIEWS = { iso: [[90, 110, 120], [12, 56, 0]], front: [[12, 60, 170], [12, 56, 0]], side: [[170, 66, 0], [12, 56, 0]], top: [[12, 210, 20], [12, 40, 0]] };
let camAnim = null, curView = "iso", barH = 0;
function fitPos(v) {
  const [p, t] = VIEWS[v], tv = new THREE.Vector3(...t), dir = new THREE.Vector3(...p).sub(tv).normalize();
  const h = stage.clientHeight || 1, k = Math.max(0.3, (h - barH) / h);
  const vf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * k), hf = 2 * Math.atan(Math.tan(vf / 2) * stage.clientWidth / (h * k));
  const dist = R / Math.sin(Math.min(vf, hf) / 2) * 1.04;
  return [tv.clone().addScaledVector(dir, dist), tv];
}
function view(v, instant) {
  curView = v; const [p1, t1] = fitPos(v);
  if (instant) { camAnim = null; camera.position.copy(p1); controls.target.copy(t1); }
  else camAnim = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1, t1 };
  document.querySelectorAll("#views button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
}
document.querySelectorAll("#views button").forEach(b => b.onclick = () => view(b.dataset.v));
const bLbl = document.getElementById("b-lbl");
bLbl.onclick = () => { const on = bLbl.classList.toggle("on"); labelR.domElement.classList.toggle("off", !on); };
const COVER_MODES = ["ปกติ", "โปร่ง", "ซ่อน"];
const bCover = document.getElementById("b-cover");
const coverGlass = new THREE.MeshStandardMaterial({ color: 0xdfe7ee, transparent: true, opacity: 0.18, depthWrite: false });
bCover.onclick = () => {
  coverMode = (coverMode + 1) % 3;
  [baseCoverG, topG].forEach(g => g.children.forEach(o => { if (!o.isMesh) return; o.visible = coverMode < 2; o.material = coverMode === 1 ? coverGlass : ((coverParts.includes(o) || topParts.includes(o)) ? M.cover : M.dark); }));
  labels.housing.style.visibility = coverMode < 2 ? "" : "hidden";
  bCover.textContent = "ฝาครอบ: " + COVER_MODES[coverMode]; bCover.classList.toggle("on", coverMode > 0);
};
const bAir = document.getElementById("b-air"), bFill = document.getElementById("b-fill");
function stopRun(msg) { running = false; flowPts.visible = false; bAir.classList.remove("on"); bAir.textContent = "▶ เปิดไฟ"; if (msg) toast(msg); }
const irrAt = d => (36 * Math.pow(30 / d, 1.4)).toFixed(1);
bAir.onclick = () => {
  if (running) return stopRun();
  if (Object.keys(A).some(k => A[k].t && k !== "meter")) { toast("ประกอบกลับให้ครบก่อนเปิดเครื่อง"); return; }
  running = true; flowPts.visible = true; bAir.classList.add("on"); bAir.textContent = "■ ปิดไฟ";
  toast(`HIGH ระยะ ${distCm} cm: แสงฟ้าจากแผง LED ผ่านฝาครอบลงที่นอน เครื่องวัดกลางเตียงอ่านได้ราว ${irrAt(distCm)} µW/cm²/nm (ค่าตัวอย่าง) พัดลมหมุนระบายความร้อน`, true);
};
bFill.onclick = () => {
  distCm = distCm === 30 ? 50 : 30; bFill.classList.toggle("on", distCm !== 30); bFill.textContent = "ระยะ " + distCm + " cm";
  toast(distCm === 30 ? "ระยะตามคู่มือ 30 cm: กลางเตียงราว 36 µW/cm²/nm (ค่าตัวอย่าง)" : `ยกโคมเป็น 50 cm: แสงกระจายกว้างขึ้น แต่กลางเตียงเหลือราว ${irrAt(50)} µW/cm²/nm ต่ำกว่าเกณฑ์ 30`, distCm === 30);
};
const exInput = document.getElementById("explode");
let exT = 0, exV = 0;
exInput.oninput = () => { if (window.Task3D && Task3D.active()) { exInput.value = 0; toast("โหมดฝึก: ปิดการแยกชิ้นส่วนอัตโนมัติ"); return; } if (running) stopRun(); exT = exInput.value / 100; };
document.getElementById("b-reset").onclick = () => {
  if (window.Task3D && Task3D.active()) { toast("โหมดฝึก: ประกอบกลับทีละชิ้นด้วยตัวเอง"); return; }
  for (const k in A) A[k].t = 0; exT = 0; exInput.value = 0; refresh();
};

/* ---------- วนเฟรม ---------- */
const tmpV = new THREE.Vector3();
function applyNodes() {
  for (const n of nodes) {
    const b = n.userData.base;
    n.position.copy(b.p).addScaledVector(n.userData.ex, exV); n.rotation.copy(b.r);
    for (const [a, dp, dr] of n.userData.fx) {
      if (!a.v) continue;
      if (dp) n.position.add(tmpV.set(dp[0], dp[1], dp[2]).multiplyScalar(a.v));
      if (dr) { n.rotation.x += dr[0] * a.v; n.rotation.y += dr[1] * a.v; n.rotation.z += dr[2] * a.v; }
    }
  }
}
const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); labelR.setSize(w, h);
  const tb = document.querySelector(".bar");
  barH = tb && tb.parentElement === stage ? Math.min(tb.offsetHeight + 24, h * 0.4) : 0;
  camera.aspect = w / Math.max(h, 1);
  if (barH) camera.setViewOffset(w, h, 0, barH / 2, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
let lastAspect = 0, refitT = 0;
new ResizeObserver(() => {
  resize();
  if (Math.abs(camera.aspect - lastAspect) > 0.15) { lastAspect = camera.aspect; clearTimeout(refitT); refitT = setTimeout(() => view(curView, true), 60); }
}).observe(stage);
resize(); lastAspect = camera.aspect; view("iso", true);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  for (const k in A) { const a = A[k]; a.v += Math.sign(a.t - a.v) * Math.min(Math.abs(a.t - a.v), dt * 2.2); }
  exV += (exT - exV) * Math.min(1, dt * 6);
  applyNodes(); labelVis();
  /* แสง ระยะโคม และพัดลม */
  lightV += ((running ? 1 : 0) - lightV) * Math.min(1, dt * 3);
  const dPrev = distV; distV += (distCm - distV) * Math.min(1, dt * 2.2); rig.position.y = 48 + distV;
  if (Math.abs(dPrev - distV) > 0.01 || !beam.userData.h) { beam.geometry.dispose(); beam.geometry = beamGeo(distV); beam.userData.h = distV; }
  const k = Math.pow(30 / distV, 1.4);
  M.led.emissiveIntensity = lightV * 2.4; beamMat.opacity = lightV * 0.16 * Math.min(1.2, k); blueLight.intensity = lightV * 2.2;
  blueLight.position.y = 48 + distV - 6; beam.visible = lightV > 0.02;
  if (running) { stepFlow(dt); blades.rotation.y += dt * 18; }
  if (camAnim) {
    camAnim.t = Math.min(1, camAnim.t + dt * 1.4); const e = ease(camAnim.t);
    camera.position.lerpVectors(camAnim.p0, camAnim.p1, e); controls.target.lerpVectors(camAnim.t0, camAnim.t1, e);
    if (camAnim.t >= 1) camAnim = null;
  }
  controls.update();
  if (selBox.visible && selected) selBox.setFromObject(partRoot[selected]);
  renderer.render(scene, camera); labelR.render(scene, camera);
});

const bar = document.querySelector(".bar");
function layout(narrow) {
  if (narrow) document.querySelector(".main").insertBefore(bar, side.parentElement); else stage.appendChild(bar);
  resize(); view(curView, true);
}
layout(MOBILE);
if (MOBILE) { bLbl.classList.remove("on"); labelR.domElement.classList.add("off"); }
NARROW.addEventListener("change", e => layout(e.matches));
document.getElementById("loading").remove();
renderSide();
if (window.Task3D) Task3D.init({ A, MODE, toast, reset: () => { exT = 0; exInput.value = 0; if (running) stopRun(); select(null); } });
window.__ph3d = { A, toggle, select, view };   // ใช้ทดสอบ
