# Vibrant Visuals roadmap

Status is for Choice Textures. "In this PR" means the branch that adds phases 1 and 2 (`v26.11.13`, manifest `1.0.23`). Later phases are not started. Do not start them by dropping maps into the pack without a design note and a `SOURCE_TRACKING.md` entry.

| Phase | What | Status |
|---|---|---|
| 1 | Enable VV: `pbr` capability, engine version, `pbr/global.json`, block color texture sets | In this PR. See [phase 1](phase-01-enable.md). |
| 2 | Sky and lighting: sun, moon, ambient, orbital offset, day/night colors | In this PR. See [phase 2](phase-02-sky-lighting.md). No atmosphere, fog, water, or color grading. |
| 3 | Atmosphere and biome fog | Not started. |
| 4 | Water | Not started. |
| 5 | Color grading | Not started. |
| 6 | Emissive blocks | Not started. Waits on PR #80 (torch / flipbook). Torch and suspicious-gravel texture sets were left out of phase 1 for the same reason (PR #83 owns suspicious gravel). |
| 7 | Metals and gems | Not started. Per-texture MERS, with provenance. |
| 8 | Above-ground materials | Not started. |
| 9 | Below-ground stone and ores | Not started. |
| 10 | Nether and End | Not started. Phase 2 leaves Nether and End on vanilla lighting. |
| 11 | Mobs and items | Not started. Vanilla already ships 848 entity and 850 item texture sets (samples v1.26.60.5), so Choice mob and item art can stay hidden under VV until this phase. |

Each later phase should follow [Adding a phase](ADDING-A-PHASE.md).
