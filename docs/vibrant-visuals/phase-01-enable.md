# Phase 1 — Enable Vibrant Visuals

Goal: Choice is a valid VV pack, and Choice block colors are what VV samples. Classic and Fancy keep using the color images.

Vanilla baseline for texture-set counts: Mojang `bedrock-samples` tag **v1.26.60.5**.

## Files

| File | Role |
|---|---|
| `development_resource_packs/Choice Textures_rp/manifest.json` | `pbr` capability, `min_engine_version` `[1, 21, 120]`, version `[1, 0, 25]`, `product_type` `addon` |
| `texts/en_US.lang` | `pack.name=v26.11.13 Choice Textures`. Description unchanged: "An EnL Studios blend of Texture Packs." No other lang file defines `pack.name`. |
| `pbr/global.json` | Fallback MERS when a texture set does not supply it |
| `textures/blocks/**/*.texture_set.json` | 1,286 generated sets |
| `tools/choice_vv/generate_block_texture_sets.py` | Re-runnable generator |
| `tools/choice_vv/vanilla_block_texture_sets_v1.26.60.5.txt` | Vanilla block texture-set filenames the generator matches |
| `tools/choice_vv/validate_vv.py` | Schema checks. Not an in-game test. |

UUIDs are unchanged: header `c7eb999a-07ec-4fc9-b41a-4bc952734511`, module `64319acf-204b-4f5c-89ef-38f8d23f2598`.

`min_engine_version` was `[1, 21, 30]`. The stable Learn page says VV needs `[1, 21, 120]` or higher. Choice uses exactly `[1, 21, 120]`, not a later version. Clients older than 1.21.120 will refuse the pack. PS5 on a current stable build is past that.

## `pbr/global.json`

Schema version `"1.21.40"`, as in the [lighting / PBR fallback](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/lightingcustomization?view=minecraft-bedrock-stable) page. One field per group, `global_metalness_emissive_roughness_subsurface`. Values are 0–255. The Learn example is `[0.0, 0.0, 255.0, 0.0]`. Choice uses the same numbers as integers.

| Group | Value | Channel meaning | Why |
|---|---|---|---|
| `blocks` | `[0, 0, 255, 0]` | R metal, G emissive, B roughness, A subsurface | Documented fallback. Fully rough, not metal, not glowing. |
| `actors` | `[0, 0, 255, 0]` | same | Same. Mobs are not restyled in this phase. |
| `particles` | `[0, 0, 255, 0]` | same | Same. |
| `items` | `[0, 0, 255, 0]` | same | Same. |

No other keys. Hex form is legal; Choice uses the array so it matches the example.

## The vanilla color lock

Verified, not inferred:

1. The Texture Sets reference says a set only references images in its own pack, a higher pack's PNG does not override that reference, and sets do not merge.
2. `bedrock-samples` v1.26.60.5 `resource_pack/textures/blocks` contains **1,293** `*.texture_set.json` files. `stone.texture_set.json` is `"color": "stone"` plus `"metalness_emissive_roughness_subsurface": "stone_mers"`. `flame_atlas.texture_set.json` is the same pattern with a uniform MERS.

A Choice `stone.png` with no set of its own leaves vanilla's set in charge, and that set samples vanilla's stone. The fix used here is a Choice set for each Choice block color that vanilla already has a set for.

| Count | Meaning |
|---|---|
| 1,293 | Vanilla block texture sets in v1.26.60.5 |
| 1,286 | Sets written into Choice, including torches and suspicious gravel 0–3 |
| 7 | Not written: Choice has no image. All seven are Education (`border`, `build_allow`, `build_deny`, `camera_back`, `camera_front`, `camera_side`, `camera_top`) |
| 226 | Choice block colors with no vanilla set. The PNG override is enough for those. `pbr/global.json` covers missing MERS. `suspicious_gravel_0_v3` is one of these. |

1,286 + 7 = 1,293. Ten stems exist as both `.png` and `.tga` (`fern_carried`, `tallgrass`, both lilac halves, both mangrove-leaf sheets, both mangrove-root sheets, `pale_oak_leaves`, `grass_side_snowed`). They share one set. The color name has no extension, so the game picks `.tga` over `.png`. Main removed `seagrass.tga` (#80); `seagrass.png` remains, and the set still names `seagrass`. `kelp_top_leaf.tga` was removed and Choice has no replacement image and no texture set for it.

`sandstone_normal`, `red_sandstone_normal`, `piston_top_normal`, and `rail_normal` are color textures. The `_normal` suffix is vanilla's name for that block face, not a normal map. They have sets.

### What a generated set contains

`format_version` `"1.21.30"` (required once MERS, including subsurface, is used). Example `textures/blocks/stone.texture_set.json`:

- `color`: `"stone"` (the filename stem, same folder, no extension). The game resolves `.tga` then `.png` then `.jpg` then `.jpeg`.
- `metalness_emissive_roughness_subsurface`: `[0, 0, 255, 0]`

Color-only was the minimum asked for. The uniform MERS is there as well because sets do not merge: a color-only set would drop vanilla's roughness instead of inheriting it, and the Learn text describes `pbr/global.json` as the fallback when texture-set detail is not provided. Pinning the same four numbers on the set does not depend on that fallback still applying after a set exists. **Untested in-game:** whether a color-only set would have used `pbr/global.json` anyway. The pinned value matches the global file, so either behavior is the same matte default.

Classic uses only the color layer, so Fancy and Classic should look the same as before. **Untested in-game.**

Uniform MERS does not apply to texture *variations* (Learn caution). If a block uses variations, those need an image MERS later. Not changed here.

### Torches, suspicious gravel, and flipbooks

#80 and #83 are on main. The generator now writes sets for every Choice block color that vanilla v1.26.60.5 already locks, including:

- `torch_on`, `soul_torch` (64×64), `copper_torch` (64×64), `redstone_torch_on` (32×896 flipbook strip), `redstone_torch_off`
- `suspicious_gravel_0` through `suspicious_gravel_3`

`suspicious_gravel_0_v3` does not get a set. It is a Choice terrain variation (`terrain_texture.json`, weight 50 next to `suspicious_gravel_0`) and vanilla has no `suspicious_gravel_0_v3.texture_set.json`. Nothing in the vanilla pack can lock that name to a vanilla image. `pbr/global.json` is its MERS fallback.

Flipbook animation is `textures/flipbook_textures.json`, which this branch does not edit. It points `flipbook_texture` at the color image (`textures/blocks/glowstone`, `redstone_lamp_on`, `redstone_torch_on`, the seagrass strips, and the rest). Vanilla ships a texture set for those same stems. The set's `color` field is that image, and the color layer is the only one Classic uses, so Fancy still animates the strip.

The Texture Sets reference does not say a texture set stops flipbook playback. Coexistence is inferred from vanilla shipping both, not from a sentence that says a higher pack's set keeps the frames moving. **Untested in-game.** Uniform MERS is one value for the whole strip, not a per-frame map. Glowstone and the lit redstone lamp therefore lose vanilla's emissive pixels until phase 6. That is the matte default, not a frozen flipbook.

The same reference warns that texture variations do not pick up uniform MERS; they need an image MERS. Suspicious gravel is a variation. **Untested:** whether `suspicious_gravel_0`'s uniform MERS reaches `suspicious_gravel_0_v3`, which has no set of its own. The color PNG for `_v3` is not locked by a vanilla set.

`textures/flame_atlas.png` is outside `textures/blocks`. Vanilla's `flame_atlas.texture_set.json` uses MERS `[0, 255, 255, 0]` (fully emissive). No Choice set was added. Fire can still show the vanilla atlas under VV. That belongs with phase 6.

Items (850 vanilla sets) and entities (848) were not given Choice sets. A cow or a held apple can still show vanilla under VV. Phase 11.

## Re-run

From the repo root, after new block colors land:

```bash
python3 tools/choice_vv/generate_block_texture_sets.py
python3 tools/choice_vv/validate_vv.py
```

The generator will not overwrite a set that references a normal, a heightmap, or an image MERS. When Mojang ships a new stable tag, refresh the filename list from a recursive git tree of `resource_pack/textures/blocks`:

```bash
python3 tools/choice_vv/generate_block_texture_sets.py --from-git-tree /path/to/blocks-tree.json
```
