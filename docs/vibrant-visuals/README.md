# Choice Textures — Vibrant Visuals

Choice Textures (`development_resource_packs/Choice Textures_rp`) is a Bedrock resource pack. Erik plays it on PS5 through a Realm, as the bottom pack in the stack. These notes live at the repo root on purpose: the `.mcpack` is a zip of the pack folder only, so this directory is not shipped.

Vibrant Visuals (VV) is a local graphics mode. It does not change gameplay. Each player turns it on in Settings → Video → Graphics Mode. Friends on a Realm do not have to use the same mode. Sources: [Introducing Vibrant Visuals](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/introvibrantvisuals?view=minecraft-bedrock-stable), [minecraft.net](https://www.minecraft.net/en-us/vibrant-visuals-update).

## What makes a pack valid

Microsoft's [Vibrant Visuals resource packs](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/vvresourcepacks?view=minecraft-bedrock-stable) page (stable view, checked 2026-11-13) says a pack opts in by:

- adding `"pbr"` to `manifest.json` `capabilities` (prefer `pbr` over `raytraced`; RTX is a subset and is not cross-platform)
- setting `min_engine_version` to `[1, 21, 120]` or higher

Choice does both. `metadata.product_type` stays `addon`. Manifest `format_version` stays `2` (the Learn snippet uses `1` as a short example; Choice was already on format 2).

PBR surface data is a [texture set](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/texturesetsreference/texturesetsconcepts/texturesetsintroduction?view=minecraft-bedrock-stable). Lighting is separate JSON under `lighting/` and `pbr/`. See the phase 1 and phase 2 docs for the files Choice actually ships.

## How texture sets stack

From the Texture Sets reference, Resource Stack Behavior:

- A texture set can only reference images in the **same** resource pack.
- A color PNG in a higher pack does **not** replace the color image a lower pack's texture set points at.
- Texture sets for the same texture do **not** merge. The higher pack's whole set replaces the lower one.

Vanilla `bedrock-samples` tag **v1.26.60.5** (latest stable on 2026-11-13; preview tags were not used) ships texture sets that point at vanilla's own colors:

| Folder under `resource_pack/textures` | `.texture_set.json` count |
|---|---|
| `blocks` | 1,293 |
| `items` | 850 |
| `entity` | 848 |
| `flame_atlas.texture_set.json` (textures root) | 1 |

So a Choice color PNG, with no texture set of its own, stays hidden under VV wherever vanilla has a set. Phase 1 generates sets for Choice **block** colors only. Items, entities, and `textures/flame_atlas.png` are still on vanilla's sets. That is a known gap, not a guess. Confirm it on PS5 (see the test checklist).

Choice is the Realm base. A pack above Choice replaces Choice's texture set entirely if it ships one for the same texture. Faithful, if enabled on top and if it ships texture sets, wins those textures.

Classic and Fancy read the color layer only. The reference says the color layer is the only layer the Classic pipeline uses.

## PS5 and Realms

From [minecraft.net](https://www.minecraft.net/en-us/vibrant-visuals-update) and [Minecraft Help](https://help.minecraft.net/hc/en-us/articles/37413608357773), checked 2026-11-13:

- PS5 is a supported device. PS4 is listed too, with VV disabled by default on the base PS4 models in the wiki's device table; Erik plays on PS5.
- VV is per device. Realm play does not require everyone to turn it on.
- Local split-screen is not supported. The game switches to Fancy or Simple when a second local player joins. That is expected.
- If a world or texture pack is not compatible, the VV graphics mode is disabled. Help lists this under "Vibrant Visuals is grayed out and cannot be selected" → Conflicting Add-Ons. One incompatible pack in the Realm stack is enough to grey it out. Choice alone, with `pbr`, should not be that pack. Other packs on the Realm still can be.

Not tested in-game from this repo. The checklist is the first PS5 pass.
