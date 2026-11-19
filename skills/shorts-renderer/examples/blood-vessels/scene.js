// Test recreation of the "scale ladder" explainer format (ref: Zack D. Films "How Long Are Your Blood Vessels?").
// Original narration and procedural assets - a technique test, not a copy for publishing.
// Fact basis: adult vessel length is commonly estimated at ~60,000 miles (~100,000 km) - a rough, debated figure, so it's hedged.
// Earth's circumference ≈ 24,901 miles → ~2.4 laps.
import * as THREE from 'three';
import { makeRenderer, studio, makeCharacter, makeVessels, growLine, footballFieldTexture, loadWorld, mapTexture,
  makeGlobe, makeFlatMap, stars, label, timeline, captionsFromLines, prog, smooth, easeInOut, easeOut, lerp, aim } from 'kit';

export const duration = 39;
export const fps = 30;

const narration = [
  { t: 0.2, text: 'If you could pull every blood vessel out of your body' },
  { t: 3.9, text: 'and lay them end to end,' },
  { t: 5.6, text: "you'd probably guess they'd stretch across a football field." },
  { t: 8.8, text: 'Not even close.', end: 9.9 },
  { t: 10.0, text: 'Your body is packed with vessels thinner than a hair,' },
  { t: 13.6, text: 'woven through every inch of you.', end: 16.0 },
  { t: 16.2, text: 'Start the line in New York,' },
  { t: 18.2, text: 'and it crosses the entire country before it even slows down.', end: 21.8 },
  { t: 22.0, text: 'It keeps going, over the Pacific,' },
  { t: 24.2, text: 'across Asia, through Europe,' },
  { t: 26.0, text: 'all the way back to where it started.', end: 28.6 },
  { t: 28.8, text: 'And then it does it again.', end: 30.8 },
  { t: 31.2, text: "That's roughly 60,000 miles of blood vessels.", end: 34.4 },
  { t: 34.6, text: 'Inside you.', end: 35.8 },
  { t: 36.0, text: 'Right now.', end: 37.6 },
];
export const captions = captionsFromLines(narration);
export const script = narration.map(l => l.text).join(' ');

const T = timeline([
  { name: 'peel', start: 0, end: 5.6 },
  { name: 'field', start: 5.6, end: 8.8 },
  { name: 'shrug', start: 8.8, end: 10.0 },
  { name: 'xray', start: 10.0, end: 16.2 },
  { name: 'usa', start: 16.2, end: 22.0 },
  { name: 'globe', start: 22.0, end: 31.2 },
  { name: 'space', start: 31.2, end: 39.01 },
]);

export async function setup({ THREE: _T, canvas, width, height }) {
  const renderer = makeRenderer(canvas, width, height);
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 500);

  // ---- scene 1: studio + character + vessels ----
  const s1 = new THREE.Scene();
  studio(s1);
  const man = makeCharacter({ shirt: '#2d4f93', pants: '#7d9cc4', style: 'cartoon' });
  s1.add(man.group);
  const seg = man.segments();
  const vessels = makeVessels(seg.list, seg.heart, { seed: 11, branches: 12, depth: 2 });
  const vGroup = new THREE.Group(); vGroup.add(vessels.mesh); s1.add(vGroup);

  // ---- scene 2: football field with a line ----
  const s2 = new THREE.Scene();
  studio(s2, { ground: '#3f8f34', groundSize: 200 });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(110, 48.8), new THREE.MeshStandardMaterial({ map: footballFieldTexture(), roughness: 0.9 }));
  field.rotation.x = -Math.PI / 2; field.position.y = 0.05; field.receiveShadow = true; s2.add(field);
  const man2 = makeCharacter({ shirt: '#2d4f93', pants: '#7d9cc4' }); man2.group.position.set(-50, 0.01, 4); man2.group.rotation.y = Math.PI / 2; s2.add(man2.group);
  const fieldLine = growLine([new THREE.Vector3(-49.5, 0.15, 3.6), new THREE.Vector3(-20, 0.15, 3.0), new THREE.Vector3(10, 0.15, 3.8), new THREE.Vector3(50, 0.15, 3.2)], { radius: 0.55, segments: 300 });
  s2.add(fieldLine.group);

  // ---- scene 3: USA flat map ----
  const world = await loadWorld('50m');
  const usBounds = { lon0: -128, lon1: -64, lat0: 22, lat1: 52 };
  const s3 = new THREE.Scene(); s3.background = new THREE.Color('#9fd3f5');
  s3.add(new THREE.HemisphereLight('#ffffff', '#335533', 1.6));
  const sun3 = new THREE.DirectionalLight('#ffffff', 1.6); sun3.position.set(10, 30, 10); s3.add(sun3);
  const usMap = makeFlatMap(mapTexture(world, { ...usBounds, w: 4096, h: 1920 }), { ...usBounds, scale: 1 });
  s3.add(usMap.mesh);
  const usPath = [[-74.0, 40.7], [-77, 40.2], [-82, 40.0], [-87.6, 41.8], [-93, 41.3], [-98, 40.6], [-104.9, 39.7], [-109, 38.6], [-112.1, 36.1], [-116, 35.6], [-120, 35.8], [-122.4, 37.8], [-125, 38.2]]
    .map(([lo, la]) => usMap.lonLat(lo, la, 0.12));
  const usLine = growLine(usPath, { radius: 0.12, segments: 800 }); s3.add(usLine.group);
  const nyPin = label('NEW YORK', { size: 0.55 }); nyPin.position.copy(usMap.lonLat(-78.5, 42.2, 2.2)); s3.add(nyPin);
  const pin = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#e0141e' }));
  pin.rotation.x = Math.PI; pin.position.copy(usMap.lonLat(-74.0, 40.7, 0.5)); s3.add(pin);

  // ---- scene 4: globe + space ----
  const s4 = new THREE.Scene(); s4.background = new THREE.Color('#02040a');
  s4.add(stars(3000, 120));
  s4.add(new THREE.AmbientLight('#ffffff', 0.55));
  const sun4 = new THREE.DirectionalLight('#ffffff', 2.4); sun4.position.set(5, 3, 8); s4.add(sun4);
  const globe = makeGlobe(mapTexture(world, { w: 4096, h: 2048 }), 1); s4.add(globe.group);
  const LAPS = 2.4, N = 900, gpts = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, lon = -74 - u * LAPS * 360, lat = 40.7 - u * LAPS * 7 + 2.5 * Math.sin(u * LAPS * Math.PI * 6);
    gpts.push(globe.lonLat(((lon + 540) % 360) - 180, lat, 0.012));
  }
  const gLine = growLine(gpts, { radius: 0.006, segments: 2400, radial: 6 }); globe.group.add(gLine.group);

  const lookUS = new THREE.Vector3();
  return {
    render(t) {
      const { name, local, p } = T.at(t);
      let scene;
      if (name === 'peel' || name === 'shrug' || name === 'xray') {
        scene = s1; camera.up.set(0, 1, 0);
        man.idle(t);
        if (name === 'peel') {
          man.setOpacity(1);
          vessels.setGrow(smooth(prog(t, 0.6, 3.4)) * 1.02);
          const out = easeInOut(prog(t, 2.2, 4.2));
          vGroup.position.set(lerp(0, 0.75, out), 0, lerp(0, 0.05, out)); vGroup.visible = t > 0.6;
          const surprise = easeOut(prog(t, 2.4, 3.0));
          man.joints.shoulderL.rotation.z = 0.12 + 0.5 * surprise; man.joints.shoulderR.rotation.z = -0.12 - 0.5 * surprise;
          man.joints.elbowL.rotation.x = man.joints.elbowR.rotation.x = -0.6 * surprise;
          man.group.position.x = lerp(0, -0.45, out);
          aim(camera, new THREE.Vector3(lerp(0, 0.15, out), 1.1, lerp(4.4, 5.6, out)), new THREE.Vector3(lerp(0, 0.15, out), 0.98, 0), 40);
        } else if (name === 'shrug') {
          man.setOpacity(1); vGroup.visible = false; man.group.position.x = 0;
          const k = easeOut(prog(local, 0, 0.35));
          man.joints.shoulderL.rotation.z = 0.12 + 0.9 * k; man.joints.shoulderR.rotation.z = -0.12 - 0.9 * k;
          man.joints.elbowL.rotation.x = man.joints.elbowR.rotation.x = -1.1 * k; man.joints.head.rotation.z = 0.15 * k;
          aim(camera, new THREE.Vector3(0, 1.5, lerp(2.6, 2.3, p)), new THREE.Vector3(0, 1.45, 0), 40);
        } else {
          man.group.position.x = 0; man.joints.head.rotation.z = 0;
          man.setOpacity(lerp(1, 0.18, smooth(prog(local, 0, 0.8))));
          vGroup.visible = true; vGroup.position.set(0, 0, 0); vessels.setGrow(1.02);
          const k = easeInOut(p);
          // full body → push in to the chest and arm
          aim(camera, new THREE.Vector3(lerp(0.2, 0.55, k), lerp(1.0, 1.35, k), lerp(4.4, 1.25, k)), new THREE.Vector3(lerp(0, 0.2, k), lerp(0.95, 1.3, k), 0), 40);
        }
      } else if (name === 'field') {
        scene = s2;
        man2.idle(t);
        fieldLine.setProgress(easeInOut(prog(local, 0.2, 2.6)));
        const k = easeInOut(prog(local, 0, 2.2));
        camera.near = 0.5; camera.updateProjectionMatrix();
        // rise from behind the man to straight overhead; blend 'up' so the field ends up running vertically in the 9:16 frame
        camera.up.set(lerp(0, 1, k), lerp(1, 0, k), 0).normalize();
        aim(camera, new THREE.Vector3(lerp(-56, 0, k), lerp(2.0, 175, k), lerp(4, 0.01, k)), new THREE.Vector3(lerp(-46, 0, k), 0, lerp(3.6, 0, k)), lerp(50, 40, k));
      } else if (name === 'usa') {
        scene = s3; camera.up.set(0, 1, 0);
        const lp = easeInOut(prog(local, 0.3, 5.6)) * 0.97;
        usLine.setProgress(lp);
        const tip = usLine.tipAt(lp), tan = usLine.tangentAt(lp);
        const intro = 1 - easeOut(prog(local, 0, 1.6));        // start high over New York, drop into chase cam
        const back = tan.clone().multiplyScalar(-6), cam = tip.clone().add(back).add(new THREE.Vector3(0, 3.2 + 14 * intro, 0));
        lookUS.copy(tip).add(tan.clone().multiplyScalar(5));
        aim(camera, cam, lookUS, 50);
        nyPin.visible = local < 2.5;
      } else {
        scene = s4; camera.up.set(0, 1, 0);
        const total = LAPS;
        let lp;                                   // line progress across 2.4 laps
        if (name === 'globe') lp = lerp(0.03, 2 / total, easeInOut(prog(t, 22.0, 31.0)));
        else lp = lerp(2 / total, 1, easeOut(prog(t, 31.2, 33.6)));
        gLine.setProgress(lp);
        // rotate globe so the line tip faces the camera
        const lonTip = -74 - lp * total * 360;
        const spinTo = -(lonTip + 90) * Math.PI / 180;
        globe.group.rotation.y = name === 'globe' ? spinTo : spinTo + (t - 31.2) * 0.12;
        globe.group.rotation.x = 0.35;
        const dist = name === 'globe' ? lerp(1.9, 2.6, smooth(prog(t, 22, 31))) : lerp(2.6, 9.5, easeInOut(prog(t, 31.2, 38.5)));
        aim(camera, new THREE.Vector3(0, 0, dist), new THREE.Vector3(0, name === 'globe' ? 0.25 * (1 - prog(t, 22, 31)) : 0, 0), 40);
      }
      if (name !== 'field' && camera.near !== 0.01) { camera.near = 0.01; camera.updateProjectionMatrix(); }
      renderer.render(scene, camera);
    },
  };
}
