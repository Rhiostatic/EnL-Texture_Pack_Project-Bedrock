# Phase 2 — Sky and lighting

Goal: start from vanilla's Vibrant Visuals lighting and warm noon a little, in line with Choice's Faithful art. No new sky style. No atmosphere, fog, water, or color grading files.

Vanilla baseline: Mojang `bedrock-samples` tag **v1.26.60.5**, `resource_pack/lighting/*.json` and `resource_pack/biomes/*.client_biome.json`.

Schemas used:

- [Light sources](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/lightingcustomization?view=minecraft-bedrock-stable) (current schema, format `1.26.0` adds keyframes for sky and ambient; we do not use those keyframes)
- [1.21.70 lighting reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/deferredrendering/lightinggroup_lightingimpl_1_21_70?view=minecraft-bedrock-stable) (sun and moon sit directly under `directional_lights`)
- [Per-biome customization](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/biomecustomization?view=minecraft-bedrock-stable)
- [Keyframe JSON](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/keyframejsonsyntax?view=minecraft-bedrock-stable): time `0` and `1` are noon, `0.25` sunset, `0.5` midnight, `0.75` sunrise. Vanilla's keys are not on those exact marks. Choice does not move them.

## Why biomes are copied

Since Bedrock 1.21.90, vanilla per-biome lighting wins over a pack's `lighting/global.json`. The Learn page says you assign your lighting by identifier on each client biome. In v1.26.60.5, 48 biomes already point at `minecraft:default_lighting`, and others point at named presets. A Choice `global.json` alone would not replace those assignments.

Choice copies the vanilla client biome file and changes only `lighting_identifier`. Fog, water color, atmosphere identifier, color grading identifier, and sounds stay on `minecraft:` names. Choice does not ship `atmospherics/`, `fogs/`, `water/`, `color_grading/`, `local_lighting/`, or cubemaps, so those names still resolve to vanilla.

The copy is the whole file from that tag. `tools/choice_vv/apply_overworld_lighting.py` refuses to write a biome if any field other than the lighting identifier differs from the vanilla JSON. **Untested in-game:** that the client applies a higher pack's client biome this way on PS5. Fancy grass and water in the checklist are the check. If a future stable tag adds a biome component, these copies hide it until the script is re-run.

`lighting_identifier` is the VV lighting hook. The other copied fields are the vanilla values Fancy already used.

## Files

| Choice file | Identifier | Vanilla format | Biomes pointed at it |
|---|---|---|---|
| `lighting/global.json` | `choice:default_lighting` | `1.21.80` (orbital + End flash) | 48 |
| `lighting/warmish_lighting.json` | `choice:warmish_lighting` | `1.21.70` | 16 |
| `lighting/mesa_lighting.json` | `choice:mesa_lighting` | `1.21.70` | 6 |
| `lighting/desert_lighting.json` | `choice:desert_lighting` | `1.21.70` | 3 |
| `lighting/swampland_lighting.json` | `choice:swampland_lighting` | `1.21.70` | 2 |
| `lighting/roofed_forest_lighting.json` | `choice:roofed_forest_lighting` | `1.21.70` | 2 |
| `lighting/mangrove_swamp_lighting.json` | `choice:mangrove_swamp_lighting` | `1.21.70` | 1 |

78 biome files under `biomes/`. `sulfur_caves.client_biome.json` keeps vanilla `format_version` `1.26.0`. The other 77 keep `1.21.120`.

Not shipped, and not retargeted (they do not use the shared warm-white noon):

| Vanilla identifier | Why it stayed |
|---|---|
| `minecraft:ice_plains_spikes_lighting` | Noon sun is `[215, 224, 255]` (cool), not the shared white |
| `minecraft:mushroom_island_lighting` | Noon sun is `[221, 214, 255]` |
| `minecraft:pale_garden_lighting` | Noon sun is `[195, 216, 255]` |
| `minecraft:nether_lighting` | Sun and moon are white `[255, 255, 255]`, ambient illuminance `0.5` |
| `minecraft:end_lighting` | White sun and moon, End flash illuminance `3.0` color `[228, 93, 255]`, ambient illuminance `0.125` |
| (none) `dappled_forest` | No lighting identifier in the vanilla file. It picks up `lighting/global.json` because that filename is the default. Inferred from the biome doc, not tested. |

`cold_lighting.json`, `coolish_lighting.json`, and `hot_lighting.json` exist in the samples and are not referenced by any of the 89 client biomes in this tag. They were not copied.

## The one deliberate change

Shared overworld noon sun, key `1.000000`:

| | R | G | B |
|---|---|---|---|
| Vanilla | 255 | 227 | 215 |
| Choice | 255 | 223 | 204 |
| Delta | 0 | −4 | −11 |

Noon is already a warm white in vanilla. This steps it slightly toward the sunrise gold without touching the sunrise and sunset keys, which are already orange and pink. Illuminance is unchanged, so brightness and the time the sun switches off stay vanilla.

Every other sun color key is vanilla, on every file in the table above:

| Key (day fraction) | RGB | Left as |
|---|---|---|
| `0.140811` | 255, 173, 81 | morning gold |
| `0.216944` | 255, 155, 82 | |
| `0.242908` | 255, 127, 0 | orange |
| `0.269504` | 255, 127, 0 | orange |
| `0.314561` | 255, 154, 154 | pink |
| `0.506998` | 255, 105, 0 | deep orange; sun illuminance is ~0 here, so this key is dim |
| `0.717949` | 255, 133, 133 | pink |
| `0.801062` | 255, 173, 81 | gold |
| `1.000000` | **255, 223, 204** | the Choice noon. Vanilla was 255, 227, 215 |

There is no `0.0` sun-color key in these files. Choice did not add one. How the engine samples color exactly at time 0, between key `1.0` and key `0.140811`, was not tested. `1.0` is the noon key vanilla authored, so it is the key that was warmed.

## Values that were copied and not changed

### Sun illuminance

The Learn example uses about `109880` lux at noon. The vanilla files use a **0–100** curve. Choice keeps the file values. Swapping in the textbook lux figure would not match vanilla VV. Inferred, not tested: it would be much brighter than the game's own VV.

Same curve on `global`, `warmish`, `mesa`, `desert`, `swampland`, and `mangrove_swamp`:

| Key | Value |
|---|---|
| `0.000000` | 100 |
| `0.050000` | 100 |
| `0.282000` | 1 |
| `0.291500` | 0.01 |
| `0.292000` | 0 |
| `0.709000` | 0 |
| `0.719000` | 1 |
| `0.950000` | 100 |
| `1.000000` | 100 |

Documented illuminance range on the 1.21.70 reference is up to 110000. These values sit inside it.

`roofed_forest` uses the same keys, with the bright ones at **70** instead of 100 (`0.000000`, `0.050000`, `0.950000`, `1.000000`). The 70 was kept. Dark-forest shade stays vanilla; only the noon color moved.

### Moon

Illuminance, same on every shipped overworld file (vanilla):

| Key | Value |
|---|---|
| `0.000000` | 0 |
| `0.200000` | 0 |
| `0.225000` | 0.4 |
| `0.735000` | 0.4 |
| `0.750000` | 0 |
| `1.000000` | 0 |

Moon color was not warmed. Night stays night.

| File | Moon RGB (both `0.0` and `1.0`) |
|---|---|
| `global`, `swampland`, `roofed_forest` | 163, 182, 255 |
| `warmish`, `mesa`, `mangrove_swamp` | 88, 129, 255 |
| `desert` | 62, 108, 255 |

### `lighting/global.json` only

The 1.21.70 biome files do not include these objects. Vanilla omitted them, so Choice omitted them too. The Learn page's defaults, if ambient or sky are absent, are ambient `#FFFFFF` / `0.02` and sky intensity `1.0`. Choice did not rely on that for `global.json`; the file sets them explicitly, matching vanilla.

| Field | Value | What it does | Why it was not edited |
|---|---|---|---|
| `orbital_offset_degrees` | `0.0` | Rotates the sun/moon orbit. Range on the 1.21.70 reference is up to 359.99. Not blendable across biomes (biome doc). | Vanilla is already 0. A tilt would be a new sky. |
| `flash.illuminance` | `10.0` | Peak End-flash brightness on this lighting definition | End biomes still use vanilla `minecraft:end_lighting` (flash `3.0`). This copy stays so default lighting matches vanilla if a flash is evaluated on it. |
| `flash.color` | `[228, 93, 255]` | End-flash color | Same reason. |
| `emissive.desaturation` | `0.0` | How far emissive pixels move toward grey. Range 0–1. The Learn example uses `0.1`. | Vanilla's file is `0.0`. Phase 6 owns emissive look. |
| `ambient.color` | `#FFFFFF` | Fill light where nothing else shines. Hex or RGB, 0–255. | A warm ambient would tint caves. Caves stay vanilla. |
| `ambient.illuminance` | `0.02` | Ambient strength. Range 0–5. Documented default is `0.02`. | Same. |
| `sky.intensity` | `1.0` | Sky's share of indirect light. Range 0.1–1. Default `1.0`. Lower is darker shadows. | Vanilla shadow depth. |

Biome lighting files also omit `orbital_offset_degrees`. It was not added. The 1.21.70 schema allows it; vanilla left it out, which is the default (0).

## Re-run

```bash
python3 tools/choice_vv/apply_overworld_lighting.py \
  --lighting-dir /path/to/bedrock-samples/resource_pack/lighting \
  --biomes-dir /path/to/bedrock-samples/resource_pack/biomes
python3 tools/choice_vv/validate_vv.py
```

The script reads vanilla and writes the pack. It does not treat the pack copies as the source.
