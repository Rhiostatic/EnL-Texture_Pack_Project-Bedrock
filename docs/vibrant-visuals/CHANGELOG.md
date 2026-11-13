# Changelog

## v26.11.13 — manifest 1.0.25

Vibrant Visuals phases 1 and 2, merged with main after #80 (`4c3c6e7f`, torches and flipbooks) and #83 (`db0651c6`, suspicious gravel). Main was `1.0.24`. This branch is `1.0.25`. No `.mcpack` is committed.

- Manifest: `capabilities` `pbr`, `min_engine_version` `[1, 21, 120]`, header and module version `[1, 0, 25]`. UUIDs unchanged. `product_type` stays `addon`.
- `pack.name` stays `v26.11.13 Choice Textures`. Description unchanged. Main already used that display name, so the lang file did not conflict.
- `pbr/global.json` fallback MERS `[0, 0, 255, 0]` for blocks, actors, particles, and items.
- 1,286 block texture sets so VV samples Choice colors, including torches (`copper_torch` and `soul_torch` are the 64×64 sheets from #80) and `suspicious_gravel_0`–`3`. Uniform MERS matches the global fallback. `suspicious_gravel_0_v3` has no vanilla texture set, so none was generated.
- Overworld lighting copied from bedrock-samples v1.26.60.5. Noon sun only: `[255, 227, 215]` → `[255, 223, 204]`. 78 client biomes retargeted. Nether, End, ice spikes, mushroom fields, and pale garden stay on vanilla lighting.
- Policy: `CHOICE_PACK.md` rule 2 and `credits/SOURCE_TRACKING.md` allow VV in phases. PBR map images still need a phase and a provenance entry.
