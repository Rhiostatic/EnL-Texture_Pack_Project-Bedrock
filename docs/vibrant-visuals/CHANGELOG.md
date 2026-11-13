# Changelog

## v26.11.13 — manifest 1.0.23

Vibrant Visuals phases 1 and 2. No color art was replaced. No `.mcpack` is committed.

- Manifest: `capabilities` `pbr`, `min_engine_version` `[1, 21, 120]`, header and module version `[1, 0, 23]`. UUIDs unchanged. `product_type` stays `addon`.
- `pack.name` is `v26.11.13 Choice Textures`. Description unchanged.
- `pbr/global.json` fallback MERS `[0, 0, 255, 0]` for blocks, actors, particles, and items.
- 1,277 block texture sets so VV samples Choice colors. Uniform MERS matches the global fallback. Torch and suspicious-gravel stems skipped.
- Overworld lighting copied from bedrock-samples v1.26.60.5. Noon sun only: `[255, 227, 215]` → `[255, 223, 204]`. 78 client biomes retargeted. Nether, End, ice spikes, mushroom fields, and pale garden stay on vanilla lighting.
- Policy: `CHOICE_PACK.md` rule 2 and `credits/SOURCE_TRACKING.md` now allow VV in phases. PBR map images still need a phase and a provenance entry.

Open PR #83 is also manifest `1.0.23`. Open PR #80 was still `1.0.22` on `cursor/choice-flipbook-animations-d118` when this branch was cut. Whichever `1.0.23` PR merges second needs a new patch version.
