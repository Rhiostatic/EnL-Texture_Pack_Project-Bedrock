# Issue 22 — Waxed Torch (grokbot handoff)

**Repo:** Rhiostatic/EnL-Texture_Pack_Project-Bedrock  
**Branch:** `issue-22-waxed-torch` (from `main`)  
**Issue:** https://github.com/Rhiostatic/EnL-Texture_Pack_Project-Bedrock/issues/22  
**Pack:** Bonus Blocks (`els_bb` RP + BP). Not Choice, not Animation Essentials, not Conquest.

## Goal
Add a new **Waxed Torch** to the torch family. Conquest's redstone torch already looks like a wax candle — steal that look for a *new* block. Do **not** replace vanilla/Conquest redstone torch.

## Product rules (Erik)
- Craft: **1 honeycomb (wax) + 1 torch + 1 iron nugget**, shapeless.
- Must work in the **crafting table**, and **by hand (2x2 inventory)** if Bedrock allows it.
- Behaves like a **normal torch** (light, place on floor and walls, instant break, drops itself).
- Name in-game: **Waxed Torch**.

## Constraints
- Bedrock only, latest stable. No experimental toggles.
- Follow existing `els_bb` patterns (namespace `els_bb:`, copy art into the bonus pack, bump pack version, keep UUIDs).
- Copy the Conquest `redstone_torch_on.png` into `els_bb`. Do not make Bonus Blocks depend on Conquest being loaded.
- No scripting unless JSON cannot do floor + wall placement.
- Leave this handoff file in `wip/` or delete it before the PR — either is fine.

## Done when
Sideload Bonus Blocks, craft the torch, place it on floor and wall, confirm light/break/drop match a vanilla torch. Open a PR into `main` and mention #22.
