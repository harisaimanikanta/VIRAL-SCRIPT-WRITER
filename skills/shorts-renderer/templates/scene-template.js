// Scene template - copy next to your script, rename, fill in. Render: node <skill>/scripts/render.mjs scene.js --preview
import * as THREE from 'three';
import { makeRenderer, studio, makeCharacter, timeline, captionsFromLines, prog, easeInOut, lerp, aim } from 'kit';

export const duration = 20;
export const fps = 30;

// Voiceover lines with start times (seconds). With real audio, set t from the recording.
const narration = [
  { t: 0.2, text: 'He did something nobody could explain.' },
  { t: 3.0, text: 'You see, ...' },
];
export const captions = captionsFromLines(narration);

const T = timeline([
  { name: 'hook', start: 0, end: 3 },
  { name: 'context', start: 3, end: 20.01 },
]);

export async function setup({ canvas, width, height }) {
  const renderer = makeRenderer(canvas, width, height);
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 500);
  const scene = new THREE.Scene();
  studio(scene);
  const hero = makeCharacter({ shirt: '#b8452f' });
  scene.add(hero.group);

  return {
    render(t) {
      const { name, local, p } = T.at(t);
      hero.idle(t);
      if (name === 'hook') {
        aim(camera, new THREE.Vector3(0, 1.4, lerp(3.2, 2.4, easeInOut(p))), new THREE.Vector3(0, 1.3, 0), 40);
      } else {
        aim(camera, new THREE.Vector3(1.5, 1.2, 4), new THREE.Vector3(0, 1, 0), 40);
      }
      renderer.render(scene, camera);
    },
  };
}
