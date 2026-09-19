import { system, world } from "@minecraft/server";

const CUSTOM_FLAME = "els_bb:waxed_torch_flame";
const VANILLA_FLAME = "minecraft:basic_flame_particle";
const COMPONENT_ID = "els_bb:waxed_torch_particles";

const warned = {};

function warnOnce(key, message, err) {
	if (warned[key]) {
		return;
	}
	warned[key] = true;
	const detail = err && (err.message || String(err));
	console.warn(detail ? `${message}: ${detail}` : message);
}

/**
 * Floor: center, y + 0.7 (top of standing shaft).
 * Wall: 0.27 toward the attached face (south-hugging wall geo tip ~0.76) and y + 0.82.
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
		py = y + 0.82;
	} else if (face === "south") {
		pz -= 0.27;
		py = y + 0.82;
	} else if (face === "west") {
		px += 0.27;
		py = y + 0.82;
	} else if (face === "east") {
		px -= 0.27;
		py = y + 0.82;
	}
	return { x: px, y: py, z: pz };
}

function spawnFlames(dimension, loc) {
	// Vanilla torch flame is the visibility guarantee (Choice recolors via particles.png when loaded).
	try {
		dimension.spawnParticle(VANILLA_FLAME, loc);
	} catch (err) {
		warnOnce("vanilla", "[els_bb] spawnParticle(minecraft:basic_flame_particle) failed", err);
	}
	// In-pack copy of the MS basic_flame sample so Bonus Blocks still has a flame without Choice.
	try {
		dimension.spawnParticle(CUSTOM_FLAME, loc);
	} catch (err) {
		warnOnce("custom", "[els_bb] spawnParticle(els_bb:waxed_torch_flame) failed", err);
	}
}

const waxedTorchParticles = {
	onTick(e) {
		try {
			spawnFlames(e.dimension, flameLocation(e.block));
		} catch (err) {
			warnOnce("tick", "[els_bb] waxed torch onTick failed", err);
		}
	}
};

function register(registry) {
	registry.registerCustomComponent(COMPONENT_ID, waxedTorchParticles);
	console.warn("[els_bb] registered els_bb:waxed_torch_particles");
}

function subscribeStartup() {
	const startup = system.beforeEvents && system.beforeEvents.startup;
	if (!startup) {
		return false;
	}
	startup.subscribe((event) => {
		register(event.blockComponentRegistry);
	});
	return true;
}

function subscribeWorldInitialize() {
	world.beforeEvents.worldInitialize.subscribe((event) => {
		register(event.blockComponentRegistry);
	});
}

try {
	if (!subscribeStartup()) {
		subscribeWorldInitialize();
	}
} catch (err) {
	warnOnce("startup", "[els_bb] system.beforeEvents.startup unavailable, using worldInitialize", err);
	try {
		subscribeWorldInitialize();
	} catch (err2) {
		warnOnce("register", "[els_bb] custom component registration failed", err2);
	}
}
