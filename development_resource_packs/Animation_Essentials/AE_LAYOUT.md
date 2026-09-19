# Animation Essentials layout

Pack: `development_resource_packs/Animation_Essentials/`  
P0 (#41) and P1 (#42) already split entity-owned files **strict per-mob**.  
P2 shelves **intentional** cross-mob utilities so they are not mistaken for grab-bag dumps.

Identifier strings are unchanged. Entity / attachable JSON does not need edits when files move.

## Load-path decision

Bedrock loads animations from `animations/` (and subfolders of that folder) and controllers from `animation_controllers/` (and subfolders). A pack-root `_shared/animations/` tree would **not** load: `_shared` is not a resource-pack type folder.

This pack already nests other types (`models/entity/attachable/`), which matches that rule.

**Shelf used here:**

| Kind | Path |
|---|---|
| Shared animations | `animations/shared/` |
| Shared controllers | `animation_controllers/shared/` |

The subdirectory is named `shared/` (no leading underscore) so it is ordinary pack content. Some tooling treats `_`-prefixed folders as hidden/private; a leading-underscore pack-root shelf would also fail the type-folder rule above.

Do **not** put shared JSON at pack root. Do **not** prefix files as `animations/_shared_*.json` unless a future engine stops scanning subfolders — subfolders under the type directories are the supported layout.

## Shared utilities (P2)

These files are **meant** to be referenced by more than one mob or attachable. Deleting one mob should **not** delete this shelf.

| File | Role | Identifiers (selected) | Who maps them today |
|---|---|---|---|
| `animations/shared/timers.animation.json` | Dummy-length timers plus leftover player-action keys | `animation.jump_timer`, `animation.idle_timer`, `animation.hurt_timer`, `animation.action.*` | Creeper + armor stand (`jump_timer`). Other keys unused by current AE entities; kept because they are shared helpers, not a mob dump. |
| `animations/shared/blink.animation.json` | Generic blink helpers | `animation.blink.0/1`, `animation.step.blink*`, `animation.motion.blink`, `animation.vertical.blink` | No current AE entity maps these (P0 mobs own their own blink keys). Kept as the shared blink library. |
| `animations/shared/look_at_target.animation.json` | Look-at-target helpers | `animation.anthro.target`, `animation.humanoid.target`, `animation.local_space.target`, … | Creeper uses `animation.anthro.target`. Other target variants unused today; same library. |
| `animation_controllers/shared/jump_fall_land.animation_controllers.json` | Jump / fall / land / in-air, plus on-fire, idle, splash, particles | `controller.animation.jump`, `.fall`, `.land`, `.in_air`, `controller.animation.entity.on_fire`, `.particles`, `.idle*` | Creeper (jump/fall/land/in_air/on_fire), phantom (on_fire), xp orb (particles). |
| `animation_controllers/shared/attack_hurt_ride.animation_controllers.json` | Attack / hurt / rotate / ride / pose / crossbow | `controller.animation.entity.rotate`, `.attack`, `.hurt`, `.riding`, `.ridden`, `.pose`, `controller.animation.crossbow_anim` | Creeper uses `.rotate`. Other keys unused today; kept as shared combat/ride helpers. |
| `animations/shared/player_item.animation.json` | Default attachable 1st/3rd-person hold | `animation.player_item.first_person_hold`, `.third_person_hold` | Most AE attachables. |
| `animations/shared/player_item_rod.animation.json` | Rod hold | `animation.player_item_rod.*` | `attachables/breeze_rod.json` |
| `animations/shared/player_item_fishing_rod.animation.json` | Fishing-rod hold | `animation.player_item_fishing_rod.*` | `attachables/warped_fungus_on_a_stick.json` |

Attachable JSON itself stays under `attachables/` (Bedrock type folder). The hold animations they share live on this shelf.

### Not on the shared shelf

| File | Why it stays put |
|---|---|
| `animations/villager_v2.animation.json`, `villager_actions.animation.json`, `villager_move_cycle.animation.json` | Villager-family names / leftovers. Not a cross-mob utility shelf. P2 does not restructure per-mob further. |
| `animations/squid.animation.json` | Squid-named; no AE squid entity. Left alone (not a listed P2 utility, not a P1 particle orphan). |
| `render_controllers/item_size.render_controllers.json`, `prop.render_controllers.json`, `models/entity/item_size.geo.json` | Attachable/render helpers; type folders already make ownership clear. Not moved. |

### Deleted in P2 (unused, documented)

| File | Choice |
|---|---|
| `animations/held_item.animation.json` | **Deleted.** No AE entity or attachable mapped `animation.item.*`. Live attachables use `animation.player_item*` (now under `animations/shared/`). |
| `animation_controllers/items.animation_controllers.json` | **Deleted.** No AE client mapped `controller.animation.in_use` / `.drinking` / `.eating` / `controller.animation.item.*`. |
| `particles/spell_gold.particle.json` (`act:spell_gold`) | **Deleted.** Unreferenced in AE after P1 removed the competing leftover evoker. Actions&St still has its own copies. |
| `particles/spell_blue.particle.json` (`act:spell_blue`) | Same. |
| `particles/telepill.particle.json` (`act:telepill`) | Same. |

## Per-mob delete sets

Deleting a mob later means deleting **that row’s files** only. Do not delete `animations/shared/` or `animation_controllers/shared/` unless you are sure no remaining entity/attachable maps those identifiers.

Sibling files may still define the same identifier strings (intentional after P0). That is copy-ownership, not the shared shelf.

### Zombie family (P0)

| Mob | Owns |
|---|---|
| zombie | `entity/zombie.entity.json`, `animations/zombie.animation.json`, `animation_controllers/zombie.animation_controllers.json`, `models/entity/zombie.geo.json` |
| husk | `entity/husk.entity.json`, `animations/husk.animation.json`, `animation_controllers/husk.animation_controllers.json`, `models/entity/husk.geo.json` |
| drowned | `entity/drowned.entity.json`, `animations/drowned.animation.json`, `animation_controllers/drowned.animation_controllers.json`, `models/entity/drowned.geo.json` |
| zombie_villager_v2 | `entity/zombie_villager_v2.entity.json`, `animations/zombie_villager_v2.animation.json`, `animation_controllers/zombie_villager_v2.animation_controllers.json`, `models/entity/zombie_villager_v2.geo.json` |
| zombie_pigman | `entity/zombie_pigman.entity.json`, `animations/zombified_piglin.animation.json`, `animation_controllers/zombie_piglin.animation_controllers.json`, `models/entity/zombie_piglin.geo.json` |

`geometry.zombie.baby` is vanilla, not an AE dump.

### Skeleton family (P0)

| Mob | Owns |
|---|---|
| skeleton | `entity/skeleton.entity.json`, `animations/skeleton.animation.json`, `animation_controllers/skeleton.animation_controllers.json`, `models/entity/skeleton.geo.json` |
| stray | `entity/stray.entity.json`, `animations/stray.animation.json`, `animation_controllers/stray.animation_controllers.json`, `models/entity/stray.geo.json`, `models/entity/stray_armor.geo.json` |
| bogged | `entity/bogged.entity.json`, `animations/bogged.animation.json`, `animation_controllers/bogged.animation_controllers.json`, `models/entity/bogged.geo.json`, `models/entity/bogged_armor.geo.json` |

### Spider family (P0)

| Mob | Owns |
|---|---|
| spider | `entity/spider.entity.json`, `animations/spider.animation.json`, `animation_controllers/spider.animation_controllers.json`, `render_controllers/spider.render_controllers.json`, `models/entity/spider.geo.json` (`geometry.spider`) |
| cave_spider | `entity/cave_spider.entity.json`, `animations/cave_spider.animation.json`, `animation_controllers/cave_spider.animation_controllers.json`, `render_controllers/cave_spider.render_controllers.json`, `models/entity/cave_spider.geo.json` (`geometry.cave_spider`) |

### Illager family (P1)

| Mob | Owns |
|---|---|
| evoker (`minecraft:evocation_illager`) | `entity/evocation_illager.entity.json`, `animations/evoker.animation.json`, `animation_controllers/evoker.animation_controllers.json`, `models/entity/evoker.geo.json`, `render_controllers/evoker.render_controllers.json` |
| vindicator | `entity/vindicator.entity.json`, `animations/vindicator.animation.json`, `animation_controllers/vindicator.animation_controllers.json`, `models/entity/vindicator.geo.json`, `render_controllers/vindicator.render_controllers.json` |
| pillager | `entity/pillager.entity.json`, `animations/pillager.animation.json`, `animation_controllers/pillager.animation_controllers.json`, `models/entity/pillager.geo.json`, `render_controllers/pillager.render_controllers.json` |
| evocation_fang | `entity/evocation_fang.entity.json`, `render_controllers/evocation_fang.render_controllers.json`, `render_controllers/evocation_fang_oh.render_controllers.json` |

### Other AE client entities

| Mob | Typical owns (filename match) |
|---|---|
| creeper | `entity/creeper.entity.json`, `animations/creeper.animation.json`, `animation_controllers/creeper.animation_controllers.json`, `models/entity/creeper.geo.json`, `render_controllers/creeper.render_controllers.json` — **also maps shared** look-at-target, jump_timer, jump/fall/land/in_air, rotate, on_fire |
| phantom | per-mob phantom files — **also maps shared** `controller.animation.entity.on_fire` |
| xp_orb | `entity/experience_orb.entity.json`, `animations/experience_orb.animation.json`, `models/entity/xp_orb.geo.json` — **also maps shared** `controller.animation.entity.particles` |
| armor_stand | per-mob armor_stand files — **also maps shared** `animation.jump_timer` |
| cat, ocelot, bee, sheep, witch, villager_v2, wandering_trader, iron_golem, piglin_brute | matching `entity/`, `animations/`, `animation_controllers/`, `models/entity/`, and (where present) `render_controllers/` files named for that mob |

Creeper still maps `animation.skeleton.idle_anim_3` (Actions&St leftover, not defined in AE). Unchanged.

## Smoke-test (Bedrock client)

Enable Animation Essentials (optionally on top of Choice Textures). Do **not** need Actions&St for these:

1. **Creeper** — head look (`animation.anthro.target` from `animations/shared/look_at_target.animation.json`); jump / fall / land / in-air controllers from `animation_controllers/shared/jump_fall_land.animation_controllers.json`; on-fire particles via `controller.animation.entity.on_fire`.
2. **Phantom** — on-fire controller still plays (`controller.animation.entity.on_fire`).
3. **Armor stand** — pose timer still uses `animation.jump_timer`.
4. **Any blinking mob** — P0 per-mob blink keys are unchanged; the shared blink library is unused until an entity maps it.
5. **Held items** — apple / music disc / breeze rod / warped fungus on a stick still use `animation.player_item*` from `animations/shared/`.
6. Content log should not report missing `animation.anthro.target`, `animation.jump_timer`, `controller.animation.jump` / `.on_fire`, or `animation.player_item.first_person_hold`.
