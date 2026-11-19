---
name: shorts-renderer
description: Turn a finished Shorts script (from script-writer) into a vertical 1080x1920 MP4 - stylised 3D characters, camera moves, maps/globes, growing lines, captions and voiceover - by writing a Three.js scene with the bundled kit and rendering it frame by frame (headless Chromium + ffmpeg). Use when the user wants to render, animate, produce or preview a video from a script/storyboard, or recreate the visual style of a reference Short.
argument-hint: "<script.md or story slug> [--audio voice.mp3]"
---

# Shorts Renderer

Script → scene module → MP4. The renderer is deterministic (every frame is a pure function of time), so the result is smooth,
reproducible and can be re-rendered after any fix. Skill folder: `${CLAUDE_SKILL_DIR}`.

## Setup (ask the user first, once)
`bash ${CLAUDE_SKILL_DIR}/scripts/setup.sh`: installs npm deps (three, world-atlas, topojson-client) into the skill folder and checks
for ffmpeg + Playwright Chromium. Works on CPU (software WebGL): ~0.3–1 s per 1080p frame.

## Workflow
1. **Inputs.** A `script.md` from script-writer (voiceover + storyboard table) and, ideally, the user's **voiceover audio** (mp3/wav).
   If there's no audio, time the captions from the script at ~3.5 words/s, and tell the user the video will be silent until they add a voice.
2. **Plan shots.** Turn the storyboard rows into a shot list `{name, start, end}`, merging rows that share a set. Pick sets/props from the kit
   (`references/kit-api.md`). Keep ~1 visual change every 1–2 s *inside* shots (camera move, new object, growth) as well as cuts.
3. **Narration timing.** Put the voiceover lines in `narration = [{t, text, end?}]`. With audio: listen to the timing (or ask the user for
   line start times, or get word timings from a transcription tool if available) and set `t` per line. `captionsFromLines` splits the lines into 1–3-word captions.
4. **Write the scene** at `research/scripts/<slug>/scene.js` (or any folder), starting from `templates/scene-template.js`.
   Study `examples/blood-vessels/scene.js` for a full 39 s worked example (character, vessel peel-out, football field, US map flight, globe laps, space pull-back).
5. **Check stills first** (seconds each):
   `node ${CLAUDE_SKILL_DIR}/scripts/render.mjs <scene.js> --preview --still 1 --still 5 --still 12 …` → `out/<name>-<t>s.jpg`.
   View them with Read. Fix framing (9:16 crops easily), z-fighting (raise planes or set camera.near), caption overlap, and empty frames.
6. **Preview video** (fast, low-res): `node …/render.mjs <scene.js> --preview`.
7. **Final:** `node …/render.mjs <scene.js> out/<slug>.mp4 --audio voice.mp3 [--music bed.mp3 --music-db -22]` (1080x1920 @ 30 fps).
   Render in the background for long videos. Spot-check frames with ffmpeg afterwards.

## Rules
- Use stylised looks (simple characters, flat colours). The renderer can't do photoreal humans; say so if asked (see `references/kit-api.md` → Limits).
- Label dramatizations in the description; never imitate a real channel's branding, characters or exact visuals when publishing.
- Text in the frame: captions are drawn by the harness; keep 3D labels to short names/numbers, away from the caption band (y ≈ 66%).
- Check every shot with stills before the full render; never deliver a video you haven't spot-checked.
