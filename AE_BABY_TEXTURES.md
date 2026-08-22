# Animation Essentials — baby texture wiring (2026-08-21)

Branch: `ae-wire-baby-texture-keys`  
Pack: `development_resource_packs/Animation_Essentials/`  
Vanilla baseline: Mojang `bedrock-samples` **v1.26.40.05**

This is **action item 1** from the Choice / AE overlay review. AE sits **on top of Choice Textures**. It replaces whole `client_entity` files, so stale AE JSON was blocking the baby skins and baby armor we just put in Choice.

## Why

1.26 added dedicated baby textures + `geometry.*.baby` + `controller.render.*.v2` / villager `v3`. AE still declared only adult `Texture.default` and old render controllers.

Bedrock does **not** merge entity JSON. AE’s file is the whole client entity. Missing keys means:

- Baby zombies/husks/drowned/cats/bees/sheep/villagers used **scaled adult** skins
- `v.use_dedicated_baby_armor` was never set, so commissioned **baby armor** from Choice did not apply
- Choice `*_baby.png` files existed but were never referenced

## What we changed

Animations, animation controllers, and adult geometry identifiers were **left alone**. No AE (or Choice) PNG was added or deleted.

| Entity file | Added | Render controller |
|---|---|---|
| `zombie.entity.json` | `textures.baby`, `geometry.baby`, `use_dedicated_baby_armor` | `controller.render.zombie.v2` |
| `husk.entity.json` | same | `controller.render.zombie.v2` |
| `drowned.entity.json` | same | `controller.render.zombie.v2` |
| `zombie_pigman.entity.json` | `textures.baby`, `geometry.piglin.baby`, baby armor flag | `controller.render.zombie_pigman.v2` |
| `sheep.entity.json` | `textures.baby`, `geometry.sheep.baby` | `controller.render.sheep.v2` |
| `bee.entity.json` | 4 baby nectar/angry keys, `geometry.bee.baby` | `controller.render.bee.v2` |
| `cat.entity.json` | 22 baby / baby_tame keys, `geometry.cat.baby` | `controller.render.cat.v2` |
| `ocelot.entity.json` | `baby_wild`, `geometry.cat.baby` | **kept** `controller.render.ocelot` (patched) |
| `villager_v2.entity.json` | 13 baby base/biome keys, `geometry.villager.baby` | vanilla `villager_v3_*` |
| `zombie_villager_v2.entity.json` | `unskilled` + 8 baby biomes, `geometry.villagerzombie.baby`, baby armor flag, `num_professions = 15` | vanilla `zombie_villager_v3_*` |

Ocelot is the one exception: vanilla `ocelot.v2` only draws the wild skin and would drop AE’s black/red/siamese adult variants. The AE ocelot render controller was patched instead:

- adults: existing `Array.skins[query.variant]`
- babies: `Texture.baby_wild` + `Geometry.baby`

## Zombie / husk baby sheets (AE art, scaled)

Erik’s AE zombie geo is a **custom face rig** (eyelids/eyeballs) on a 64×32 sheet. Choice `zombie_baby.png` was the other-good 64×64 baby layout and would not match that look.

On this branch we **did not** put the blink bones on the baby model (vanilla `geometry.zombie.baby` stays). We remapped **AE’s adult** `zombie.png` / `husk.png` cube faces onto the vanilla baby 64×64 UV (nearest-neighbor, 128×128). Files live in AE so they win over Choice:

- `textures/entity/zombie/zombie_baby.png` (from AE `zombie.png`)
- `textures/entity/zombie/husk_baby.png` (from AE `husk.png`)

## Cat babies (scaled adult AE geo — no big head)

Bedrock 1.26 **still** ships `geometry.cat.baby` (chibi 32×32, oversized head) plus `scale: 1/0.4` and a 1.5× head anim. That is what Erik was seeing. Vanilla did **not** switch cats to a proportional baby.

Kittens now use **AE adult `geometry.cat`** (blink rig + AE skins) at **`scale 0.5`**. Head scale 1.5 was turned off so they are small AE cats, not chibi. Same for ocelot cubs (`geometry.ocelot.v1.8`, scale 0.5).

The remapped 32×32 `*_baby.png` sheets remain in AE unused; RC is `controller.render.cat` / `controller.render.ocelot` (adult texture arrays).



Zombie-family `controller.render.zombie.v2` lives in vanilla (`zombie.v2.render_controllers.json`). AE does not override that file.

## What we did **not** do (later items)

- Did **not** delete AE’s duplicate adult mob PNGs (those still hide Choice when AE is on top). Action item 2.
- Did **not** merge vanilla spear / swimming / riding scripts into AE entities. That can fight AE animation controllers.
- Did **not** retarget new mobs AE does not override (copper golem, nautilus, creaking, happy ghast). Those already use vanilla entity JSON + Choice textures.
- Attachables were already pointing at Choice item textures. Unchanged.

## How to verify in-game

Enable Choice (bottom) + Animation Essentials (on top). Check:

1. Baby zombie / husk / drowned use Choice `*_baby` skins, not a scaled adult
2. Those babies wear the **commissioned** baby armor, not vanilla iron
3. Kitten variants and baby bees (nectar/angry) match Choice
4. Adult AE animations still play (idle faces, walk, etc.)
5. Adult ocelot black/red/siamese still work if you have those variants

## Pack version

Manifest `1.0.2` → `1.0.3`. Lang name `v25.12.31` → `v26.08.21 Animation Essentials`.
