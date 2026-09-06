# Choice Textures — session guide

Use this file in later Grok / GitKraken work on **Choice Textures_rp**.
It is the realm **base layer**. Other resource packs (Faithful, Conquest, Animation Essentials, etc.) stack **on top** when Erik enables them. Do not turn Choice into a full Faithful clone.

Repo: https://github.com/Rhiostatic/EnL-Texture_Pack_Project-Bedrock  
Owner: Erik Johnson (`Rhiostatic`)  
Pack path: `development_resource_packs/Choice Textures_rp/`

---

## Product rules (do not casually change)

1. **Target:** latest **stable** Bedrock only. No Preview / beta. Vanilla baseline used 2026-08-21: Mojang `bedrock-samples` tag **v1.26.40.05**.
2. **No Vibrant Visuals.** Ignore `_mer` / `_mers` / `_normal` / `_heightmap` / `.texture_set.json` / `sun_vv.png` / PBR lighting.
3. **No Education Edition.** Strip or skip agent, NPC, camera item/block, chalkboards, portfolio, allow/deny/border, related icons. Erik never uses that mode.
4. **Never overwrite existing Choice art** unless Erik explicitly asks. Fill **holes** only (vanilla would otherwise peek through).
5. **Resolution mix is intentional.** Keep it.

### The mix

| Bucket | Source / scale | Notes |
|---|---|---|
| Farm / overworld **animals**, horses (`horse2`), cats, wolves, axolotl, bee, villager2, sniffer, armadillo, turtle, etc. | **Faithful 64** (4× vanilla) | Many Choice files are pixel-identical to Faithful 64 r14 |
| **Classic undead + illager + shulker** (zombie, skeleton, creeper, pillager, vindicator, parched, zombie villager) | **other-good** (~32× / 2× vanilla) | Softer on purpose |
| Showcase hostiles (warden, creaking, breeze, dragon, enderman, spider) | **Faithful 64** | Already in Choice |
| Newer passives (copper golem, happy ghast, nautilus) | **other-good 32×** | Already in Choice — do not “upgrade” to 64× unless asked |
| **Adult armor** | **Commissioned custom** (256×128) | Do not replace with Faithful or other-good |
| **Baby armor** | **Remapped from that custom adult armor** | See below |
| Blocks + items gaps | Faithful 64 r14 placeholders | Existing Choice blocks/items untouched |
| Particles, `dennis` painting, `end_flash` | Faithful 64 r14 | Existing particle atlases untouched |

If a new hole is an **animal / villager / sulfur cube / banner / shield** → Faithful 64.  
If it is **classic undead / illager / shulker / remaining chests** → other-good.  
If both exist and sizes differ, Faithful is almost always 2× other-good.

---

## Source folders (branch `Add_Faithful64-14`)

Not on `main`. Treat as **art libraries**, not packs to merge wholesale.

| Folder | What it is | Typical entity scale vs vanilla |
|---|---|---|
| `Faithful 64x - Release 14/` | Faithful 64x r14 (license in pack + copied to Choice `credits/faithful64/`) | 4× (matches Choice cows/pigs) |
| `other good blocks to add/` | Erik’s preferred 32×-ish entity/block dump | 2× (matches Choice zombies/creepers) |

Faithful license requires credit + unmodified `LICENSE.txt` in any pack that uses their work. Already at:

`development_resource_packs/Choice Textures_rp/credits/faithful64/`

https://faithfulpack.net/

---

## What shipped (2026-08-21)

### On `main` (merged [PR #25](https://github.com/Rhiostatic/EnL-Texture_Pack_Project-Bedrock/pull/25))

- Fill **all missing blocks + items** vs 1.26.40 from Faithful 64 (no overwrites).
- Education textures **removed**.
- Pack bumped to **v26.08.21** / manifest `1.0.11` on that merge; later branch is `1.0.12`.

### On branch `choice-fill-entity-holes-mixed` (local + this file; **push/PR still needed**)

Commits after `main`:

1. Fill entity holes with the mix (283 Faithful + 56 other-good). Existing mobs not replaced.
2. **Baby armor** generated from commissioned `textures/models/armor/*_1` and `*_2` (UV remap onto Bedrock 64×64 baby sheets, output 256×256). Files: `chainmail_baby`, `copper_baby`, `diamond_baby`, `gold_baby`, `iron_baby`, `leather_baby.tga`, `netherite_baby`, `turtle_scute_baby`.
3. Missing particles from Faithful 64 (gust, omens, geysers, sulfur goo, etc.).
4. Painting `dennis.png` from Faithful 64.
5. Environment `end_flash.png` from Faithful 64.

Pack on this branch: **v26.08.21b**, manifest **1.0.12**, `min_engine_version` still `[1, 21, 30]`.

Current shipped pack on `main`: **v26.09.06**, manifest **1.0.14**.

WIP Conquest stone variants live **outside** the pack at `wip/conquest_stone_in_progress/` so they do not ship with Choice. Work that set on its own branch and copy into `textures/blocks/` only when ready.


---

## Baby armor (important)

Mojang added dedicated baby-zombie armor textures. Erik’s adult armor is **commissioned**. Do **not** fill babies from Faithful.

Bedrock baby geos (`resource_pack/models/entity/baby_armor_*.geo.json`) use a **64×64** UV, not the adult **64×32** `*_1`/`*_2` layout. The 2026-08-21 files were built by copying cube faces:

- Helmet ← adult head `[0,0]` 8×8×8 (hat `[32,0]` composited if present)
- Chest/arms/boots ← adult layer 1 body/arm/leg
- Pants ← adult layer 2 body/leg

Nearest-neighbor scale. Adult files were not modified. `cloth_1` / `cloth_2` are leftover leather aliases — skip; `leather_1`/`leather_2` already exist.

If a baby piece looks squashed in-game, tweak that baby sheet only.

---

## Known leftovers (intentional or no source)

Skip unless Erik asks:

| Item | Why |
|---|---|
| Education (NPC, agent, camera, border, allow/deny, chalkboards, portfolio) | Removed on purpose |
| `sun_vv.png` | Vibrant Visuals |
| `textures/environment/clouds.png` | Not in Faithful 64; vanilla clouds still show |
| `ominous_spawning`, `pixel`, `vault_connection` particles | Not in Faithful 64 |
| `cloth_1` / `cloth_2` | Unused leather aliases |
| `cat/graytabby_tame`, `cat/ocelot_tame` | Missing rare tames |
| `dummy`, `enchanting_table_book_shadow`, `end_portal` entity | Unused / no good source |
| `*_none` placeholders (horse markings, armor none, golem cracked_none) | Invisible empty slots |
| Colormaps (grass/foliage) | Vanilla biome tints; not filled |
| Trim palettes `resin`, `copper_darker` | Not filled yet |
| UI (~600 files), CJK fonts, persona thumbs | Out of scope 2026-08-21 |

Blocks + items (non-Education) are **complete**. Paintings (incl. dennis) **complete**.

---

## How to work in a later Grok session

1. Clone `https://github.com/Rhiostatic/EnL-Texture_Pack_Project-Bedrock` (public).
2. Vanilla compare: `git clone --depth 1 --branch v1.26.40.05 https://github.com/Mojang/bedrock-samples` (re-check latest **stable** tag if time has passed).
3. Compare **color** textures only (png/tga). Match by path stem. Fill holes only.
4. Art libraries: fetch branch `Add_Faithful64-14`.
5. **Write access:** fine-grained PAT, this repo only, **Contents: Read and write**, **Pull requests: Read and write**, short expiry. Push a branch, open PR, merge if asked. Never store the token in git. Revoke after. Do not push straight to `main` unless asked.
6. Do not start an app-preview / web scaffold for this pack. It is not a Grok Build web app.

---

## Realm load order (intent)

Choice = bottom / base so vanilla never peeks. Overlay packs Erik may enable on top: Faithful 64, Conquest Lite, Animation Essentials, patterned glass, mob add-on. Overlays win when present; Choice must still look finished **alone**.

### Animation Essentials overlay

AE replaces whole `client_entity` files (it does not merge). On 2026-08-21 we wired 1.26 **baby texture keys** so Choice baby skins + commissioned baby armor apply while AE animations stay. Details: [`AE_BABY_TEXTURES.md`](AE_BABY_TEXTURES.md).

Still open: AE ships duplicate adult mob PNGs that hide Choice (action 2). Do not strip those unless Erik asks.
