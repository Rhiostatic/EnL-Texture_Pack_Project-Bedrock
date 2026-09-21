Some textures in this pack are from Faithful 32x September 2026 (Wilderness Bound / 26.x),
used as hole-fills, Choice boat entity hulls, and boat/raft item icons under the
Faithful License.

Intended source snapshot (Erik’s private reference repo):
https://github.com/Rhiostatic/EnL-Texture-References
Packs Used to Build EnL from/32x/Faithful/Faithful 32x - 26.x

Boat entity sheets: textures/entity/boat/*.png from that 26.x pack
(boat_oak, boat_acacia, …, mangrove_boat, cherry_boat, pale_oak_boat,
poplar_boat, bamboo_raft). These are unmodified Faithful hulls so rope can
be added in Blockbench. Choice geo stays 128×64 UV / 256×128 sheets.

Boat/raft item icons: textures/items/*boat* and *raft* PNGs from the same
26.x pack (inventory/hotbar). Entity sheets were not changed in the 2026-09-21
item-icon pass.

This Cloud Agent GitHub App token could not read the private reference repo
(installation scope is only EnL-Texture_Pack_Project-Bedrock). Entity boat
PNGs (2026-09-19) came from Faithful-32x-Bedrock `bedrock-latest`
(commit da7460bb4f99, 2026-09-17). Item boat icons (2026-09-21) came from
the same branch at commit 7ceeb1ecf18e (2026-09-21 autopush). Re-run against
the EnL-Texture-References path above if those files ever diverge.

https://faithfulpack.net/
https://faithfulpack.net/faithful32x/2026-September
https://faithfulpack.net/license
