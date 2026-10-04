# Choice Textures — texture source ledger

Running list of **where files came from**.
We cannot retroactively tag every PNG already in the pack. New fills **must** get a dated entry here. Known buckets from earlier sessions are recorded below so we stop guessing.

Pack path: `development_resource_packs/Choice Textures_rp/`

## How to log a fill

1. Fill **holes only**. If the file already exists in Choice, do not replace it and do not claim it in a new source row.
2. Add a dated section with: Minecraft version, source pack + version, rule used, file list.
3. Credit licenses stay under `credits/` (do not edit Faithful `LICENSE.txt`).
4. Skip Vibrant Visuals (`_mer` / `_mers` / `_normal` / `_heightmap` / `.texture_set.json`) and Education Edition.

## 2026-10-04 — Tame cats and wolves, leftover adults → Natural Texture Pack 1.0.89

- **Branch:** `choice/natural-tame`
- **Issue:** #75 follow-up. Erik approved this Marketplace art in Choice.
- **Source:** Natural Texture Pack 1.0.89, pack path `Packs Used to Build EnL from/32x/Natural_1.0.89`. Files came from the attached export (pack-relative paths), not a fresh clone. Credit: Natural Texture Pack by Mojang / Marketplace.
- **Scope:** Choice Textures entity textures only. Animation Essentials, Animation Extended, and spawn eggs were not changed. Display name stays `v26.10.04 Choice Textures`. Manifest header and module `1.0.19` → `1.0.20`. UUIDs and `pack.description` unchanged.
- **Converted:** seven baby-cat `.tga` files in the export are PNG data (`persian`, `ragdoll`, `redtabby`, `siamese`, `tabby`, `tuxedo`, `white` tame babies). Choice’s copies were real TGA, so those seven were rewritten as uncompressed 32-bit TGA (RGBA, bottom-up, alpha kept) before they replaced Choice. The other tame sheets were already real TGA and were copied as bytes.
- **Replaced tame sheets (23):** the nine cat and fourteen wolf tame / tame-baby files listed in the 2026-10-04 animal entry as still on the previous art. Each Natural sheet is exactly half the previous Choice size on both axes (same aspect) and still has an alpha channel.
- **Replaced adults that still differed:** `dolphin.png`, `polarbear.png`, `polar_bear.png`, `sea_turtle.png`, `squid.png`. Same half-size, same aspect, alpha kept. Natural’s `polarbear.png` and `polar_bear.png` are the same bytes, so both Choice paths now share that sheet.
- **Already identical to this Natural build, left as-is:** `glow_squid/glow_squid.tga`, all `fish/tropical_a` / `tropical_b` body and pattern sheets, `cat/allblackcat.png`, `cat/allblackcat_tame.tga`, `cat/redtabby.png`, `cat/redtabby_tame.tga`, `cat/siamesecat.png`, `cat/siamesecat_tame.tga`.
- **Left alone:** `cat/blackcat.png`, `cat/red.png`, `cat/siamese.png`. Choice has no entity or client-entity JSON. The only mention is a preload row in `textures_list.json`, so they were not remapped onto `allblackcat` / `redtabby` / `siamesecat`. `fish/clownfish.png` and `fish/fish.png` stay, because Natural has no entity sheet for them.
- **Odd:** Natural’s adult wolf tame sheets, including ashen, black, and chestnut from the earlier copy, are a collar only: 108 opaque pixels in a 16×14 block at the top, and the rest is fully transparent. Adult cat tame sheets (`tuxedo_tame`, `white_tame`, and the persian / ragdoll / other tame adults already in Choice) keep a body, but almost all of those pixels are alpha 1–16. About 96 collar pixels sit above alpha 16. Baby wolf tame sheets are the same idea at half size: a faint body (alpha 1–16) plus a small solid mark. That mark’s alpha mask still lines up with the previous baby (IoU about 0.96). Baby cat tame sheets are fully opaque and match the wild baby silhouette already taken from Natural. The previous Choice baby-cat tame sheets were a small mark, and `tabby_tame_baby.tga` had only 120 opaque pixels. Dolphin, polar bear, sea turtle, and squid alpha masks match the previous sheets (IoU 0.98–1.00) at half the old size. Natural’s `polarbear.png` and `polar_bear.png` are the same file.

## 2026-10-04 — Animal entities → Natural Texture Pack 1.0.89

- **Branch:** `choice/natural-animals`
- **Issue:** #75. Erik approved replacing existing Choice animal entity art (rule 4 exception).
- **Source:** Natural Texture Pack 1.0.89, Minecraft Marketplace (Mojang). Reference path `Packs Used to Build EnL from/32x/Natural_1.0.89`. The pack has no custom entity models; these sheets use vanilla UVs. Credit: Natural Texture Pack by Mojang / Marketplace.
- **Scope:** Choice Textures entity textures only. Animation Essentials and Animation Extended were not changed. Spawn eggs were not changed. Zombie, villager, creeper, dragon, and allay were not changed. Hoglin, strider, ghast, and happy ghast were not changed.
- **Resolution:** Natural is the 32× pack. 246 sheets are exactly half Choice’s previous size on both axes (same aspect). 29 sheets were already the same pixel size. Two differ from that 2× pattern and were still copied because the aspect and UV silhouette match: `bat_v2.png` (Choice 32×32 → Natural 64×64) and `sheep/sheep_baby.tga` (Choice 128×128 → Natural 32×32).
- **Copied:** 277 entity files whose path matched. 259 of those bytes changed. The legacy `textures/entity/horse/` set (18 files, including donkey, mule, markings, and horse armor) was already byte-identical to this Natural build, so those files are unchanged. Live horse skins are `textures/entity/horse2/`.
- **Follow-up:** 27 more Natural 1.0.89 sheets (7 cat baby PNGs, 18 wolf PNGs, 2 horse2 baby PNGs) copied at the same paths. Each is half the previous Choice size on both axes, same aspect. `horse2/horse_skeleton_baby.png` is more transparent than the old sheet (bone gaps); its opaque bounds still scale 2×, so the UV layout matches.
- **Left on the previous art:** 23 tame / tame-baby `.tga` files that are still unavailable. Cat: `persian_tame_baby.tga`, `ragdoll_tame_baby.tga`, `redtabby_tame_baby.tga`, `siamese_tame_baby.tga`, `tabby_tame_baby.tga`, `tuxedo_tame.tga`, `tuxedo_tame_baby.tga`, `white_tame.tga`, `white_tame_baby.tga`. Wolf: `wolf_tame.tga`, `wolf_tame_baby.tga`, `wolf_black_tame_baby.tga`, `wolf_chestnut_tame_baby.tga`, and the tame plus tame-baby sheets for rusty, snowy, spotted, striped, and woods. Also left because Natural had no matching path: `dolphin.png`, `polarbear.png`, `polar_bear.png`, `sea_turtle.png`, `squid.png`, `cat/blackcat.png`, `cat/red.png`, `cat/siamese.png`, `fish/clownfish.png`, `fish/fish.png`. Zombie horse, zombie nautilus, and zombified piglin sheets were not touched.
- **In Natural, not added** (Choice has no file at that path): `redcow.png`, `sheep/sheep_fur.png`, `rabbit/black.png`, `rabbit/caerbannog.png`, `wolf/wolf_collar.png`, `horse/armor/horse_armor_leather.png` (Choice keeps the `.tga`, which already matched Natural’s `.tga`).
- **Pack rev:** display `v26.10.04 Choice Textures`; manifest header+module `1.0.19`; UUIDs unchanged; `pack.description` unchanged. The follow-up did not bump the manifest again.

## 2026-09-30 — Spawn eggs → Faithful 64x r14, legacy egg icons removed

- **Branch:** `cursor/choice-faithful-spawn-eggs-1216`
- **Rule exception:** Erik explicitly approved replacing five existing Choice spawn eggs (rule 4). Everything else in `textures/items/spawn_eggs/` was already byte-identical to Faithful 64x Release 14 and was left as-is.
- **Source:** Faithful 64x Release 14 (`Add_Faithful64-14`), PNGs only. Replaced: `spawn_egg_allay`, `spawn_egg_bee`, `spawn_egg_chicken`, `spawn_egg_parrot`, `spawn_egg_rabbit`.
- **Check:** all 88 Choice `textures/items/spawn_eggs/*.png` match that Faithful tree. `spawn_egg_agent` stays out (Education).
- **Removed legacy system** (not used by current `spawn_egg_<mob>` keys in bedrock-samples v1.26.50.4): 57 `textures/items/egg_*.png` files (including `egg_null`; `egg_bee` is only the leftover atlas key, live bee egg is `spawn_egg_bee`; `egg_fish`, `egg_glow_squid`, and `egg_wanderingtrader` are not in that item atlas), plus `textures/items/spawn_egg.png` and `textures/items/spawn_egg_overlay.png`. Dropped the matching `textures_list.json` rows.
- **Restored from `main` (unchanged Faithful 64x r14 copies):** `egg_villager.png`, `egg_zombievillager.png`, `egg_evoker.png`, `egg_vex.png`. In-game these four still take their icon from the legacy `spawn_egg` array (indices 14, 42, 40, 41), even though `spawn_egg_villager` / `spawn_egg_zombie_villager` / `spawn_egg_evoker` / `spawn_egg_vex` keys also exist. Every other legacy-array mob has a dedicated `spawn_egg_<mob>` key (renames included: mooshroom, zombified piglin, magma cube, elder guardian, polar bear, skeleton horse, zombie horse, tropical fish). `egg_npc` / `egg_mask` / `egg_agent` were never in Choice (Education). `egg_null` is a placeholder, not a mob, and stays deleted.
- **Kept:** those four legacy icons, throwable `egg` / `blue_egg` / `brown_egg`, and carried `sniffer_egg` / `turtle_egg` item icons. No other packs touched.
- **Pack rev:** display `v26.09.30b Choice Textures`; manifest header+module `1.0.19`; UUIDs unchanged; `pack.description` unchanged.

## 2026-09-21 — Choice boat/raft **item** icons → Faithful 32x 26.x

- **Branch:** `cursor/choice-faithful-boat-item-icons-7dc4`
- **Rule:** replace inventory/item boat icons only (`textures/items/*boat*` / `*raft*`). Do **not** touch `textures/entity/boat/` (already handled in #47).
- **Intended source:** `https://github.com/Rhiostatic/EnL-Texture-References`
  `Packs Used to Build EnL from/32x/Faithful/Faithful 32x - 26.x/textures/items/`
- **Access note:** GitHub App token still cannot read the private reference repo (404). Fallback is the same Faithful 32x 26.x line as #47: `Faithful-Resource-Pack/Faithful-32x-Bedrock` `@bedrock-latest` (`7ceeb1ecf18e`, 2026-09-21 autopush). PNGs only; ignored `.texture_set.json` / `_mers`.
- **Matching filenames copied:** acacia/birch/cherry/jungle/mangrove/oak/pale_oak/spruce/dark_oak chest boats; bamboo raft + chest raft; cherry/mangrove/pale_oak boats; `boat.png`; `boat_oak` / `boat_spruce` / `boat_birch` / `boat_jungle` / `boat_acacia` / `boat_darkoak` / `boat_dark_oak`.
- **Verified Bedrock aliases** (vanilla `item_texture.json` `boat` atlas uses `boat_oak`, not `oak_boat`; Choice also keeps the Java-style names): `oak_boat` ← `boat_oak`, `acacia_boat` ← `boat_acacia`, `birch_boat` ← `boat_birch`, `spruce_boat` ← `boat_spruce`, `jungle_boat` ← `boat_jungle`, `dark_oak_boat` ← `boat_darkoak`.
- **Poplar:** Faithful-32x-Bedrock already has `poplar_boat.png` / `poplar_chest_boat.png` byte-identical to Choice; left in place (no visual change).
- **Pack rev:** display `v26.09.21 Choice Textures`; manifest header+module `1.0.16`; UUIDs unchanged; `pack.description` unchanged.

## 2026-09-20 — Dark-oak mash mask applied to other woods (#47)

- **Branch:** `cursor/choice-faithful-boat-hulls-5c6f`
- **Method:** coordinate mask from Erik’s `ad46e2a7` dark oak mash vs plain
  Faithful dark oak at `c53fd415`. Regular boats use `boat_darkoak` mask
  (7894 px). Chest boats use `chest_boat_darkoak` mask (7661 px). At those
  coordinates only, copy RGBA from Conquest_Lite_RP (main) onto the current
  Faithful hull. Dark oak files left as Erik’s mash.
- **Poplar:** Conquest has no poplar boats. Base = Faithful poplar from
  `c53fd415`; donor = `main` Choice `poplar_boat.png` / `chest_boat_poplar.png`.
- **Footer leftovers:** Conquest unused fill bars that sit on masked
  coordinates (e.g. spruce/cherry/poplar bottom strips) come through by
  design — the mask is a raw RGBA inequality, not a rope-only paint.

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
- **Deleted unused aliases** (not in vanilla/Faithful/Conquest entity paths;
  were byte-identical to the canonical sheets): `oak.png`, `acacia.png`,
  `birch.png`, `spruce.png`, `jungle.png`, `dark_oak.png`, `mangrove.png`,
  and leftover `boat.png`. Dropped matching `textures_list.json` rows.
- **Imperfect / skipped:**
  - Private reference repo not readable this run; confirm hashes against
    EnL-Texture-References when that repo is in the installation.
  - Faithful chest boats are 256×256 (vanilla chest unwrap). Choice chest-boat
    geo expects 256×128, so `chest_boat_*.png` currently ship the matching
    unmodified Faithful **hull** (same pixels as `boat_oak.png` etc.). No chest
    tiles and no rope — Erik adds both in Blockbench.

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
