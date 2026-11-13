# Adding a later phase

Read [the roadmap](ROADMAP.md) and the phase that came before. One phase per PR. Do not add atmosphere, fog, water, or color grading inside a lighting tweak, and do not add MERS images inside a JSON-only phase.

## New JSON (lighting, fog, water, grading)

1. Copy the vanilla file from the latest **stable** `bedrock-samples` tag, not a preview tag. Record the tag in the phase doc.
2. Keep that file's `format_version` unless you use a feature that needs a newer one. Sky and ambient keyframes need lighting `1.26.0`. End flash needs `1.21.80`. MERS texture sets need `1.21.30`. `pbr/global.json` is `1.21.40`.
3. Put a namespaced identifier on it (`choice:...`). Point biomes at it by copying the vanilla client biome and changing only that identifier. Re-use `tools/choice_vv/apply_overworld_lighting.py` as the pattern: it refuses a biome write if anything else changed.
4. Document every value you change: what it does, the vanilla number, and why. Leave the rest identical.
5. Run `python3 tools/choice_vv/validate_vv.py` and extend it when you add a new folder.

`lighting/global.json` does not override vanilla per-biome lighting. A filename of `global.json`, `atmospherics.json`, `color_grading.json`, or `water.json` is the default for biomes that do not name their own.

## Texture sets and PBR maps

Naming, same folder as the color texture:

| Layer | Filename stem | Channels |
|---|---|---|
| Color | `stone.png` (already in Choice) | RGB, or RGBA |
| MERS | `stone_mers` | R metalness, G emissive, B roughness, A subsurface. `format_version` `1.21.30`. |
| MER | `stone_mer` | R metal, G emissive, B roughness. Do not set MER and MERS on the same set. |
| Normal | `stone_normal` | RGB normal. Do not set normal and heightmap on the same set. |
| Heightmap | `stone_heightmap` | One channel. Not valid on items. |

The set file is `stone.texture_set.json`. `color` is the string `stone`, not a path. The image has to be in that pack, in that folder. Extension priority is `.tga`, `.png`, `.jpg`, `.jpeg`.

**Pixel size:** make the MERS, normal, or heightmap the same width and height as the color texture so each texel lines up. The Texture Sets reference lists channel counts and missing files as invalid; it does not print a separate size rule. Choice still requires a size match. If you ship a different size, say so in the phase doc and check it in-game.

Metal and subsurface fight each other. The higher channel wins; a tie favors subsurface. Roughness `0` is mirror-smooth, `255` is fully rough. The phase 1 uniform `[0, 0, 255, 0]` is the matte default, not a material.

`tools/choice_vv/generate_block_texture_sets.py` will not overwrite a set that already has a normal, a heightmap, or a string MERS. After you hand-author one, leave it out of the generator's reach (that skip is the protection).

Uniform MERS does not apply to texture variations. Variations need an image.

## Provenance

`credits/SOURCE_TRACKING.md` gets a dated entry for every new map: Minecraft version, source pack and version, and the file list. Faithful's `LICENSE.txt` stays unmodified. Do not log generated JSON as if it were someone else's art.

Bump Choice's manifest one patch from current `main`, keep both UUIDs, and set `pack.name` in every lang file that has it. Do not commit `.mcpack` or `.mcaddon` files.

Docs stay in `docs/vibrant-visuals/`, not inside the pack folder.
