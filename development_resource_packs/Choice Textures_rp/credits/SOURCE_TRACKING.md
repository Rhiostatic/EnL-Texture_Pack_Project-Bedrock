# Choice Textures — texture source ledger

Running list of **where files came from**.
We cannot retroactively tag every PNG already in the pack. New fills **must** get a dated entry here. Known buckets from earlier sessions are recorded below so we stop guessing.

Pack path: `development_resource_packs/Choice Textures_rp/`

## How to log a fill

1. Fill **holes only**. If the file already exists in Choice, do not replace it and do not claim it in a new source row.
2. Add a dated section with: Minecraft version, source pack + version, rule used, file list.
3. Credit licenses stay under `credits/` (do not edit Faithful `LICENSE.txt`).
4. Skip Vibrant Visuals (`_mer` / `_mers` / `_normal` / `_heightmap` / `.texture_set.json`) and Education Edition.

## 2026-09-19 — Choice boats: plain Faithful 32x 26.x entity hulls (#46 / #47)

- **Branch:** `cursor/choice-faithful-boat-hulls-5c6f`
- **Issue:** #46 Choice boat colors did not match Faithful wood (Conquest palette).
- **Course correction:** Erik will snip rope in Blockbench himself. Do **not**
  composite Choice/Conquest rope onto Faithful hulls. Entity sheets are
  unmodified Faithful hull PNGs only.
- **Intended source:** `https://github.com/Rhiostatic/EnL-Texture-References`
  `Packs Used to Build EnL from/32x/Faithful/Faithful 32x - 26.x/textures/entity/boat/`
- **Access note:** the Cloud Agent GitHub App installation only includes
  `EnL-Texture_Pack_Project-Bedrock`. Clone of `EnL-Texture-References` returned
  404. Used the same Faithful 32x 26.x / September 2026 pack from
  `Faithful-Resource-Pack/Faithful-32x-Bedrock` `@bedrock-latest`
  (`da7460bb4f99`, 2026-09-17). PNGs only; ignored `.texture_set.json` / `_mers`.
- **Rule:** replace Choice `textures/entity/boat/*.png` with Faithful hulls.
  Keep Choice `models/entity/boat.geo.json` / `chest_boat.geo.json` (128×64 UV,
  256×128 sheets). Do not modify Animation Essentials, els_bb, or Conquest_Lite_RP.
- **Item icons:** restored to `main` (pre-PR Conquest/Choice icons). Entity sheets
  only.
- **Also:** listed missing `poplar_boat` / `chest_boat_poplar` (entity + items) in
  `textures/textures_list.json`.
- **Imperfect / skipped:**
  - Private reference repo not readable this run; confirm hashes against
    EnL-Texture-References when that repo is in the installation.
  - Faithful chest boats are 256×256 (vanilla chest unwrap). Choice chest-boat
    geo expects 256×128, so `chest_boat_*.png` currently ship the matching
    unmodified Faithful **hull** (same pixels as `boat_oak.png` etc.). No chest
    tiles and no rope — Erik adds both in Blockbench.
  - `boat.png` entity alias is 128×64; nearest-neighbor scale of Faithful oak.

## 2026-09-16 — Straw bed (26.50 Wilderness Bound hole)

- **Branch:** `choice-fill-26.50-faithful32-wilderness`
- **Source:** official Faithful 32x Bedrock (`Faithful-Resource-Pack/Faithful-32x-Bedrock`, `bedrock-latest`, September 2026 hotfix lineage)
- **Rule:** holes only. Choice had no `straw_bed` color files yet. Do not overwrite existing Choice hay.
- **Why not the Discord preview:** that attachment is a side-by-side *in-game render* (Faithful look on the left, vanilla on the right), not a UV sheet. Cropping it would smear pixels onto the 26.50 `straw_bed_head` / `straw_bed_foot` geos (`texture_width`/`texture_height` 16).
- **Vanilla sheet sizes (bedrock-samples v1.26.50.4):** block `64x64`, item `16x16`, particle `16x16`.
- **Faithful 32x sheet sizes (2× vanilla):** block `128x128`, item `32x32`, particle `32x32`.
- **Files:**
  - `textures/blocks/straw_bed.png`
  - `textures/items/straw_bed.png`
  - `textures/particle/straw_bed_particle.png`
- **Skipped:** `*.texture_set.json` and `*_mers` (Vibrant Visuals).
- **Note:** GitHub connector cannot ship binary PNGs cleanly from this session. Drop the three files from `artifacts/choice-fill-straw-bed/` onto this branch on Minecraft-DEV, then commit.

## 2026-09-15 — Bedrock 26.50 / Wilderness Bound hole-fill

- **Branch:** `choice-fill-26.50-faithful32-wilderness`
- **Source:** Faithful 32x September 2026
- **Rule:** holes only
- **Count:** 85 color PNG files (uploading in follow-up commits)
