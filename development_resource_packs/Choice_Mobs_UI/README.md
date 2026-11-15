# Choice Mobs & UI

Standalone resource pack cut from Choice Textures so it can sit **on top of any other texture pack**.

Issue: [#86](https://github.com/Rhiostatic/EnL-Texture_Pack_Project-Bedrock/issues/86)

With this pack above another pack, mobs use Choice's mob art, the clock and compass use Choice's art, and the UI uses Choice's UI. Blocks and other items stay with the pack underneath.

It does not need Choice Textures enabled. Choice has no mob client-entity files, no mob geometry, and no mob render controllers, so this pack does not ship those either. Mobs use vanilla geometry unless a pack below replaces the client entity.

Display name: `v26.11.15 Choice Mobs & UI`. Manifest `1.0.0`. `min_engine_version` `[1, 21, 30]` (Choice's non-Vibrant Visuals value). `metadata.product_type` is `addon`. No `pbr` capability.

Art sources: [`credits/SOURCES.md`](credits/SOURCES.md). The Natural animal sheets are private Marketplace art. Do not publish this pack as a GitHub Release.

## Load order

In Bedrock the pack **higher in the list wins** for each file it contains. Put this pack at the **top**, above the third-party pack.

Suggested global resources list, top to bottom:

1. **Choice Mobs & UI** (this pack)
2. Animation Extended, only if you still want its animations
3. Animation Essentials, only if you still want its animations
4. The third-party texture pack
5. Choice Textures, optional, if you also want Choice blocks and items as the base

This pack only overrides files it contains. The pack below still draws its own blocks, items, boats, signs, chests, and banners.

### Animation Essentials and Animation Extended

Both ship their own mob textures and **replace whole client entity files**. This pack does not. Their entity JSON, geometry, and animations still apply no matter which pack is higher. Only the PNG (or TGA) wins by list order, and only when both packs use the same path.

Put **this pack above both** when the goal is Choice's mob art.

- Shared paths (zombie, skeleton, creeper, spider, villager, most animals, and the rest of the sheets this pack copies) then show Choice's art on whatever geometry the animation pack still supplies.
- Animation Essentials' custom geometry does not always match Choice's UVs. The zombie-family blink rig is the known case (`AE_BABY_TEXTURES.md`): Choice's sheets are vanilla-layout, and AE's face rig is not. Those mobs can look wrong with AE on. Cat and ocelot babies in AE also use AE's adult geometry at half scale. Turn AE off for those mobs if you want Choice's art on vanilla geometry.
- Animation Extended points four mobs at texture paths Choice does not use. While Extended is enabled, those four keep Extended's art regardless of order:

  | Mob | Extended path | Choice path this pack ships |
  |---|---|---|
  | Allay | `textures/entity/allay/0` | `textures/entity/allay/allay` |
  | Evoker | `textures/entity/illager/evoker_anim` | `textures/entity/illager/evoker` |
  | Vex | `textures/entity/vex/0`, `1`, `spawn` | `textures/entity/vex/vex`, `vex_charging` |
  | Polar bear | `textures/entity/polar_bear/polar_bear` | `textures/entity/polar_bear.png` and `polarbear.png` (adult), `polar_bear/polar_bear_baby` |

  Extended's creeper uses `textures/entity/creeper/creeper`, which this pack does override when it is above Extended. Turn Animation Extended off to see Choice's allay, evoker, vex, and polar bear.

AE also references `textures/entity/iron_golem/cracked_none`, `textures/entity/xp_orb`, and `textures/entity/dummy`. Choice does not have those files, so this pack does not add them.

## What is included

Copied from Choice Textures. Nothing here was redrawn.

- **Mobs** under `textures/entity/`: animals, monsters, villagers, the wandering trader, illagers, iron/snow/copper golems, bosses (ender dragon, wither, warden), tamed variants, babies, and the other creature sheets Choice ships. 551 files (463 PNG, 88 TGA).
- **Mob tack** that lives on the mob, not in the inventory icon: `horse/` and `horse2/` armor, llama decor, nautilus armor, happy-ghast `harness/`, and `saddle.png` / `saddle_v2.png`. Wolf armor or collar sheets are included only when Choice put them in `textures/entity/wolf/`.
- **Clock and compass:** `textures/items/clock_item.png` (one 32×32 frame; Choice does not ship a multi-frame clock strip), `compass_item.png`, `lodestonecompass_item.png`, `recovery_compass_item.png`, and the three atlases `compass_atlas.png`, `lodestonecompass_atlas.png`, `recovery_compass_atlas.png` (each 32×1024, 32 frames). Bedrock samples those atlas paths itself. Choice has no `item_texture.json`, and a partial one would replace the whole item atlas and hide the other pack's items, so this pack does not add one. Choice's `flipbook_textures.json` and `terrain_texture.json` are block animations and block tiles only, so they are not copied either. A lower pack that points the clock or compass at different filenames will keep its own art.
- **UI:** all of `textures/ui/` (1233 PNG, 12 nineslice JSON) and `font/` (`default8.png`, `ascii_sga.png`, `font_metadata.json`). Choice does not ship a `ui/` screen-definition folder or `textures/gui/`. `font_metadata.json` is the same file Choice ships; it names `font/minecraft-ten` and `font/smooth/smooth_`, which are not files in Choice.
- `pack_icon.png`, `texts/languages.json`, and a `textures/textures_list.json` trimmed to the textures this pack actually contains (1790 paths). Two UI sheets (`textures/ui/hanging_sign_poplar`, `textures/ui/poplar_sign`) were not in Choice's preload list; they are in this one because the PNGs are part of Choice's UI.

## What is left out

On purpose, so the pack underneath still shows:

- **Spawn eggs.** No `spawn_egg_*` files, no legacy `egg_*` icons, and no `item_texture.json` entries for them. Eggs stay with the other pack for now.
- **Blocks**, including block-entity sheets that would repaint blocks: chests, beds, signs, hanging signs, banners, bells, piston arms, the enchanting-table book, the beacon beam.
- **Other items and non-mob entities:** boats, minecarts, shields and shield patterns, spears, tridents, arrows, fireworks, the fishing hook, the spyglass, the wind charge, leads, player skins (`steve`, `alex`, `char`, `cape_invisible`).
- **Mob-head blocks** (`textures/entity/skulls/`: creeper, skeleton, wither skeleton, zombie). The mob bodies are included; placed heads and worn head items are not.
- **Sulfur cube** sheets. In Choice those were grouped with banners and shields, not with mobs.
- **End crystal**, **experience orb**, and **armor stand**.
- **Player armor** (`textures/models/armor/`, including the commissioned baby armor). An armored zombie or skeleton still wears the lower pack's armor. Horse armor on the horse is included, because that sheet is under `textures/entity/`.
- **Map icons** (`textures/map/`), particles, environment, paintings, trims.
- Choice's `blocks.json`, `terrain_texture.json`, and `flipbook_textures.json`.

Shulker boxes use the same sheets as the shulker mob (`textures/entity/shulker/`). Including the mob also restyles shulker boxes. That is the one block-like side effect.

## Vibrant Visuals

If the pack below uses Vibrant Visuals entity `texture_set.json` files, those sets can still hide these PNGs while Vibrant Visuals is on. A texture set only references textures inside its own pack. This pack does not ship texture sets, `_mer` / `_mers` / `_normal` / `_heightmap` maps, or the `pbr` capability. Turn Vibrant Visuals off to see these mobs.
