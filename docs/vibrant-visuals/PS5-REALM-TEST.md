# PS5 / Realm test — phases 1 and 2

Nothing in this change was loaded on a PS5 or in a Realm. `tools/choice_vv/validate_vv.py` only checks JSON. Do this pass before treating VV as done.

Pack on this branch: manifest `1.0.25`, `pack.name` `v26.11.13 Choice Textures`. Build the mcpack from the branch when you test. The earlier 1.0.23 archive does not include the torch and gravel sets. Apply Choice on the Realm as the base pack. Other packs can stay above it for the last check.

## First

1. **VV can be selected.** Save and exit, then Settings → Video → Graphics Mode. With Choice active and no other pack that lacks `pbr`, Vibrant Visuals should be available, not greyed out. Help: incompatible worlds or texture packs disable the mode. If it is greyed out, disable packs above Choice one at a time. Split-screen greys it out on purpose (below).
2. **Choice block colors under VV.** Stand somewhere with stone, grass, and a wood plank. The art should be Choice, not vanilla 16×. This is the texture-set test. If vanilla art shows, the same-pack color rule is still winning and the generated sets are not overriding.
3. **Fancy looks unchanged.** Switch Graphics Mode to Fancy (exit the world first if the toggle is locked). Grass tint, water color, and fog should match Choice-on-Fancy from before this pack. Classic, if you use it, should too. The color layer is the only one Classic uses; the copied biome files keep vanilla fog and water identifiers.

## Then

4. **Day, sunrise, night.** Noon should be only slightly warmer than vanilla VV (sun `255, 223, 204` vs vanilla `255, 227, 215`). Sunrise should still go orange, sunset pink. Night should still read as a cool blue moon, not a warm one. Ice spikes, mushroom fields, pale garden, the Nether, and the End should still look like vanilla VV lighting. Plains or a forest is the right place to judge the noon tweak. Dark forest sun brightness stays at vanilla's 70, not 100.
5. **Caves, torches, gravel, flipbooks.** Deep caves with no torches should stay as dark as vanilla VV (ambient is still white at `0.02`). Torch, soul torch, copper torch (64×64), redstone torch, and suspicious gravel 0–3 should show Choice art under VV. `suspicious_gravel_0_v3` is a Choice-only variation with no vanilla texture set; it should also show the Choice PNG. Glowstone, the lit redstone lamp, seagrass, and the redstone torch should still animate in Fancy and under VV. If VV freezes those frames, that is the untested flipbook-plus-texture-set case. Glowstone and the lit lamp may look less glowy than vanilla VV, because these sets use fully rough, non-emissive MERS. Emissive maps are phase 6.
6. **One mob and one held item.** Vanilla ships entity and item texture sets. Choice did not replace them. A cow, or an apple in hand, may still be vanilla under VV. Expected until phase 11. Fancy should still show Choice art for those.
7. **Fire.** `textures/flame_atlas.png` has no Choice texture set. Flames may still be vanilla under VV. Expected for now.
8. **Performance.** On PS5, walk a forest and a cave with VV on. Favor Performance exists in the video settings if it struggles. This phase adds JSON, not new screen-space effects.

## Expected, not a bug

- A second local player (split-screen) drops the game to Fancy or Simple. [minecraft.net](https://www.minecraft.net/en-us/vibrant-visuals-update) and [Minecraft Help](https://help.minecraft.net/hc/en-us/articles/37413608357773).
- A Realm friend who leaves VV off still plays. Their device does not have to match yours.

## If a pack sits above Choice

Faithful or another pack with its own texture sets replaces Choice's sets for those textures. Judge Choice alone before judging the stack.
