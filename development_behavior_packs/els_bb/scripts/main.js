import { world } from "@minecraft/server";

const FLAME_PARTICLE = "els_bb:waxed_torch_flame";

/**
 * Vanilla-like torch flame position from `minecraft:block_face`.
 * Floor: center, y + 0.7. Wall: 0.27 toward the attached face, y + 0.92 (tip).
 * @param {import("@minecraft/server").Block} block
 */
function flameLocation(block) {
	const { x, y, z } = block.location;
	let px = x + 0.5;
	let py = y + 0.7;
	let pz = z + 0.5;
	const face = block.permutation.getState("minecraft:block_face");
	if (face === "north") {
		pz += 0.27;
		py += 0.22;
	} else if (face === "south") {
		pz -= 0.27;
		py += 0.22;
	} else if (face === "west") {
		px += 0.27;
		py += 0.22;
	} else if (face === "east") {
		px -= 0.27;
		py += 0.22;
	}
	return { x: px, y: py, z: pz };
}

world.beforeEvents.worldInitialize.subscribe((event) => {
	event.blockComponentRegistry.registerCustomComponent("els_bb:waxed_torch_particles", {
		onTick(e) {
			try {
				e.dimension.spawnParticle(FLAME_PARTICLE, flameLocation(e.block));
			} catch {
				// Chunk unloaded or location out of world — skip this tick.
			}
		}
	});
});
