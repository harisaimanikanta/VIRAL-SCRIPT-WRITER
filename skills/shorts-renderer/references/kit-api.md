# Kit API (`import { … } from 'kit'`)

Scene module contract (see `templates/scene-template.js`):
```js
export const duration = 40, fps = 30;
export const captions = captionsFromLines([{ t: 0.2, text: '…' }, …]);   // or [] / custom [{t0,t1,text}]
export const captionStyle = { y: 0.66, size: 0.062 };                     // optional; { off: true } to hide
export async function setup({ THREE, canvas, width, height }) { …; return { render(t) { … } }; }
```

| Function | What |
|---|---|
| `clamp, lerp, smooth, easeIn, easeOut, easeInOut, prog(t,a,b), rng(seed)` | Timing and maths. `prog` = 0..1 progress of t through [a,b]. Use a seeded `rng`, never `Math.random`. |
| `timeline([{name,start,end}])` → `.at(t)` = `{name, local, p}` | Shot list lookup |
| `captionsFromLines(lines)` | Narration lines → 1–3-word timed captions |
| `makeRenderer(canvas,w,h)` | WebGL renderer (ACES, sRGB, soft shadows, preserveDrawingBuffer) |
| `studio(scene, {sky, ground, groundSize})` | Bright explainer set: flat sky, ground disc, key light with shadows |
| `makeCharacter({shirt, pants, skin, hair, shoes, style:'cartoon'|'plain'})` | Posable stylised human (~1.8 m). `.joints` (pelvis, chest, neck, head, shoulderL/R, elbowL/R, hipL/R, kneeL/R), `.idle(t)`, `.setOpacity(a)` (x-ray), `.segments()` (limb lines for vessel networks) |
| `makeVessels(segments, origin, {seed, branches, depth, color})` | Branching tube network grown from `origin`; `.setGrow(0..1)`. Also works as roots, cracks, lightning, rivers |
| `growLine(points, {radius, color, segments, tip})` | Tube that draws itself: `.setProgress(p)`, `.tipAt(p)`, `.tangentAt(p)` (chase cameras) |
| `footballFieldTexture()` | Scale-reference prop texture |
| `loadWorld('110m'|'50m'|'10m')` | Country polygons (world-atlas) |
| `mapTexture(world, {lon0,lon1,lat0,lat1,w,h,ocean,palette})` | Stylised equirectangular map texture (whole world or a region) |
| `makeGlobe(texture, r)` → `{group, lonLat(lon,lat,alt)}` | Earth with atmosphere glow |
| `makeFlatMap(texture, bounds)` → `{mesh, lonLat(lon,lat,y)}` | Flat regional map on the ground plane |
| `stars(n, radius)`, `label(text,{size})`, `canvasTexture(w,h,draw)`, `aim(camera,pos,target,fov)` | Space backdrop, map pins / number tags, custom textures, camera placement |

## Recipes
- **Peel-out / reveal:** build the hidden thing at the subject, `setGrow` 0→1, then slide it out with `easeInOut`.
- **Scale ladder:** one continuous `growLine` across bigger and bigger sets (field → city map → globe → space); a chase camera via `tipAt`/`tangentAt`; cut on the narration's new unit.
- **X-ray:** `char.setOpacity(0.18)` with the network visible inside.
- **Top-down on 9:16:** blend `camera.up` toward the long axis of the subject so it runs vertically; raise near-plane or offset planes to avoid z-fighting.
- **Comedy beats:** quick pose snaps (`shoulder.rotation.z`, `elbow.rotation.x`), a hold, then a cut.

## Limits (be honest with the user)
- Characters are stylised primitives, not photoreal humans. For realistic humans use Blender (+ a Blender MCP server) or a game engine on the user's machine, or AI video generators per shot.
- External 3D models (.glb) work if the user supplies them (put them next to the scene; load with `GLTFLoader` from `three/addons/loaders/GLTFLoader.js`, URL `/scene/<file>.glb`).
- Rendering runs on the CPU in cloud sessions: keep geometry moderate (< ~1M triangles visible) and use `--preview` while iterating.
