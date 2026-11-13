# PS5 / Realm test — phases 1 and 2

Nothing in this change was loaded on a PS5 or in a Realm. `tools/choice_vv/validate_vv.py` only checks JSON. Do this pass before treating VV as done.

Build: `Choice_Textures_v26.11.13.mcpack` (manifest at the archive root, `docs/` not included). Apply it on the Realm as the base pack, the way Choice is used now. Other packs can stay above it for the last check.

## First

1. **VV can be selected.** Save and exit, then Settings → Video → Graphics Mode. With Choice active and no other pack that lacks `pbr`, Vibrant Visuals should be available, not greyed out. Help: incompatible worlds or texture packs disable the mode. If it is greyed out, disable packs above Choice one at a time. Split-screen greys it out on purpose (below).
2. **Choice block colors under VV.** Stand somewhere with stone, grass, and a wood plank. The art should be Choice, not vanilla 16×. This is the texture-set test. If vanilla art shows, the same-pack color rule is still winning and the generated sets are not overriding.
3. **Fancy looks unchanged.** Switch Graphics Mode to Fancy (exit the world first if the toggle is locked). Grass tint, water color, and fog should match Choice-on-Fancy from before this pack. Classic, if you use it, should too. The color layer is the only one Classic uses; the copied biome files keep vanilla fog and water identifiers.

## Then

4. **Day, sunrise, night.** Noon should be only slightly warmer than vanilla VV (sun `255, 223, 204` vs vanilla `255, 227, 215`). Sunrise should still go orange, sunset pink. Night should still read as a cool blue moon, not a warm one. Ice spikes, mushroom fields, pale garden, the Nether, and the End should still look like vanilla VV lighting. Plains or a forest is the right place to judge the noon tweak. Dark forest sun brightness stays at vanilla's 70, not 100.
5. **Caves and torches.** Deep caves with no torches should stay as dark as vanilla VV (ambient is still white at `0.02`). Torches, soul torches, redstone torches, copper torches, and suspicious gravel were **not** given texture sets. Under VV they may still show vanilla art. That is expected until PRs #80 and #83 land and a later phase adds sets. Note what you see; do not treat vanilla torch art as a surprise failure of phase 1.
6. **One mob and one held item.** Vanilla ships entity and item texture sets. Choice did not replace them. A cow, or an apple in hand, may still be vanilla under VV. Expected until phase 11. Fancy should still show Choice art for those.
7. **Fire.** `textures/flame_atlas.png` has no Choice texture set. Flames may still be vanilla under VV. Expected for now.
8. **Performance.** On PS5, walk a forest and a cave with VV on. Favor Performance exists in the video settings if it struggles. This phase adds JSON, not new screen-space effects.

## Expected, not a bug

- A second local player (split-screen) drops the game to Fancy or Simple. [minecraft.net](https://www.minecraft.net/en-us/vibrant-visuals-update) and [Minecraft Help](https://help.minecraft.net/hc/en-us/articles/37413608357773).
- A Realm friend who leaves VV off still plays. Their device does not have to match yours.

## If a pack sits above Choice

Faithful or another pack with its own texture sets replaces Choice's sets for those textures. Judge Choice alone before judging the stack.
