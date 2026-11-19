# script-writer

A Claude Code skill that writes **fact-checked YouTube Shorts scripts** for a *Historical WTF* channel (real events that sound fake). It writes in the **True Mechanism Parable** style, reverse-engineered frame by frame from five viral reference Shorts (6.8M–35.1M views), while keeping every plot beat historically true.

Feed it a story, or an **IDEA CARD** from the companion skill **[idea-creator](https://github.com/harisaimanikanta/CONTENT-IDEA-CREATOR-)**. It returns:
**A** research with sources and evidence buckets · **B** five scored hooks · **C** a ~60 s voiceover · **D** a timestamped storyboard with image/video prompts · **E** editing direction · **F** titles, description, hashtags and pinned comment · **G** a quality report (revised until ≥ 85/100).

## Install
**Option 1: plugin (recommended).**
```
/plugin marketplace add harisaimanikanta/VIRAL-SCRIPT-WRITER
/plugin install script-writer@script-writer
```
Run `/script-writer:script-writer` and paste an IDEA CARD or a story name.

**Option 2: clone the repo.** The skill loads automatically from `.claude/skills/script-writer` (a symlink to `skills/script-writer`).

**Option 3: copy it.** Copy `skills/script-writer/` to `~/.claude/skills/script-writer/`.

**Option 4: just paste the link.** Tell Claude "install the skill from https://github.com/harisaimanikanta/VIRAL-SCRIPT-WRITER".

## Use
- `/script-writer:script-writer` followed by a pasted `IDEA CARD …` block writes the full package.
- `/script-writer:script-writer Hanoi rat bounty` researches and writes from a story name.
- `/script-writer:script-writer analyze <youtube urls>` gives a frame-by-frame + transcript breakdown of reference videos.
- `/script-writer:script-writer research` refreshes the competitor research.

## Knowledge base included
| Path (under `skills/script-writer/`) | What |
|---|---|
| `references/reference-style-analysis.md` | Beat map, pacing (3.3–3.8 words/s), visuals (a cut every ~1.2 s), accuracy audit and True-Parable rules from 5 reference Shorts |
| `references/scriptwriting-framework.md` | Beat sheet, voice rules, hook types, QC rubric |
| `references/viral-storytelling-playbook.md` | Patterns from research rounds 1–2 |
| `references/historical-research-guidelines.md` | Source tiers, evidence buckets, fact-check process |
| `references/visual-storytelling-guidelines.md` | Stylised 3D look, shot grammar, prompts, sound |
| `research/competitor-database.md` | 64 Shorts (Round 1) + 144 videos with real stats (Round 2) + the reference set |
| `research/data/` | Raw yt-dlp data and the reference-video frame sheets |
| `research/scripts/` | Worked examples: Zhang Heng seismoscope (parable), Eiffel Tower / Lustig (documentary) |
| `research/story-ideas.md` | 30 + 10 story pitches |
| `scripts/` | `storyboard.py` (frame-by-frame), `yt_research.py` + `analyze_round.py` (competitor research), `script_stats.py`, `validate_skill.py`, `setup.sh` |

## Setup (optional)
Video analysis and competitor research need `yt-dlp` (and ideally Node.js) and YouTube network access: `bash skills/script-writer/scripts/setup.sh`. Writing scripts needs only web search.
