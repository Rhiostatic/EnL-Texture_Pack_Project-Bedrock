import { Direction, GameMode, ItemStack, system, world } from "@minecraft/server";

const CUSTOM_FLAME = "els_bb:waxed_torch_flame";
const VANILLA_FLAME = "minecraft:basic_flame_particle";
const COMPONENT_ID = "els_bb:waxed_torch_particles";
const WALL_COMPONENT = "els_bb:chiseled_end_stone_brick_wall";
const SLAB_ID = "els_bb:chiseled_end_stone_brick_slab";
const WALL_ID = "els_bb:chiseled_end_stone_brick_wall";

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
 * Floor: center, y + 0.80 (top of standing shaft after geo update).
 * Wall: 0.30 toward the attached face (south-hugging wall geo tip ~0.76) and y + 0.97.
 * @param {import("@minecraft/server").Block} block
 */
function flameLocation(block) {
	const { x, y, z } = block.location;
	let px = x + 0.5;
	let py = y + 0.80;
	let pz = z + 0.5;
	const face = block.permutation.getState("minecraft:block_face");
	if (face === "north") {
		pz += 0.18;
		py = y + 0.97;
	} else if (face === "south") {
		pz -= 0.18;
		py = y + 0.97;
	} else if (face === "west") {
		px += 0.18;
		py = y + 0.97;
	} else if (face === "east") {
		px -= 0.18;
		py = y + 0.97;
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

const wallComponent = {
	onPlace(e) {
		try {
			updateAround(e.block);
		} catch (err) {
			warnOnce("wall-place", "[els_bb] chiseled end stone wall onPlace failed", err);
		}
	},
	onTick(e) {
		try {
			updateWall(e.block);
		} catch (err) {
			warnOnce("wall-tick", "[els_bb] chiseled end stone wall onTick failed", err);
		}
	}
};

function register(registry) {
	registry.registerCustomComponent(COMPONENT_ID, waxedTorchParticles);
	registry.registerCustomComponent(WALL_COMPONENT, wallComponent);
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

const WALL_DIRS = {
	north: { x: 0, y: 0, z: -1 },
	south: { x: 0, y: 0, z: 1 },
	west: { x: -1, y: 0, z: 0 },
	east: { x: 1, y: 0, z: 0 }
};

const slabMergePending = new Set();

function blockAt(dimension, loc, dx, dy, dz) {
	return dimension.getBlock({ x: loc.x + dx, y: loc.y + dy, z: loc.z + dz });
}

function connectsToWall(block) {
	if (!block || block.isAir || block.isLiquid) {
		return false;
	}
	const id = block.typeId;
	if (id === WALL_ID) {
		return true;
	}
	if (
		id === "minecraft:iron_bars" ||
		id.endsWith("_bars") ||
		id.includes("glass_pane") ||
		id.endsWith("_pane") ||
		id === "minecraft:fence" ||
		id.endsWith("_fence") ||
		id.includes("fence_gate")
	) {
		return false;
	}
	return block.isSolid === true;
}

function updateWall(block) {
	if (!block || block.typeId !== WALL_ID) {
		return;
	}
	const { dimension, location } = block;
	const flags = {};
	for (const [name, dir] of Object.entries(WALL_DIRS)) {
		flags[name] = connectsToWall(blockAt(dimension, location, dir.x, dir.y, dir.z));
	}
	const above = blockAt(dimension, location, 0, 1, 0);
	const straightNS = flags.north && flags.south && !flags.east && !flags.west;
	const straightEW = flags.east && flags.west && !flags.north && !flags.south;
	const covered = !!(above && !above.isAir);
	const post = !((straightNS || straightEW) && !covered);
	const next = {
		"els_bb:connection_north": flags.north,
		"els_bb:connection_south": flags.south,
		"els_bb:connection_east": flags.east,
		"els_bb:connection_west": flags.west,
		"els_bb:wall_post": post
	};
	let perm = block.permutation;
	let changed = false;
	for (const [state, value] of Object.entries(next)) {
		if (perm.getState(state) !== value) {
			perm = perm.withState(state, value);
			changed = true;
		}
	}
	if (changed) {
		block.setPermutation(perm);
	}
}

function updateAround(block) {
	if (!block) {
		return;
	}
	updateWall(block);
	const { dimension, location } = block;
	for (const dir of Object.values(WALL_DIRS)) {
		updateWall(blockAt(dimension, location, dir.x, dir.y, dir.z));
	}
	updateWall(blockAt(dimension, location, 0, -1, 0));
}

function isPickaxe(item) {
	if (!item) {
		return false;
	}
	if (typeof item.hasTag === "function") {
		try {
			if (item.hasTag("minecraft:is_pickaxe")) {
				return true;
			}
		} catch (err) {
			warnOnce("pickaxe-tag", "[els_bb] pickaxe tag check failed", err);
		}
	}
	return typeof item.typeId === "string" && item.typeId.endsWith("_pickaxe");
}

function onSlabInteract(event) {
	try {
		if (event.isFirstEvent === false) {
			return;
		}
		const player = event.player;
		if (!player || player.isSneaking) {
			return;
		}
		const mode = player.getGameMode();
		if (mode !== GameMode.survival && mode !== GameMode.creative) {
			return;
		}
		const held = event.itemStack;
		if (!held || held.typeId !== SLAB_ID) {
			return;
		}
		const block = event.block;
		if (!block || block.typeId !== SLAB_ID) {
			return;
		}
		if (block.permutation.getState("els_bb:double") === true) {
			return;
		}
		const half = block.permutation.getState("minecraft:vertical_half");
		const face = event.blockFace;
		const merge =
			(half === "bottom" && face === Direction.Up) ||
			(half === "top" && face === Direction.Down);
		if (!merge) {
			return;
		}
		const loc = block.location;
		const dimId = (block.dimension && block.dimension.id) || "";
		const key = `${loc.x},${loc.y},${loc.z},${dimId}`;
		if (slabMergePending.has(key)) {
			return;
		}
		slabMergePending.add(key);
		event.cancel = true;
		const dimension = block.dimension;
		system.run(() => {
			slabMergePending.delete(key);
			try {
				const current = dimension.getBlock(loc);
				if (!current || current.typeId !== SLAB_ID) {
					return;
				}
				if (current.permutation.getState("els_bb:double") === true) {
					return;
				}
				current.setPermutation(current.permutation.withState("els_bb:double", true));
				if (player.getGameMode() === GameMode.creative) {
					return;
				}
				const inventory = player.getComponent("minecraft:inventory");
				const container = inventory && inventory.container;
				if (!container) {
					return;
				}
				const slot = player.selectedSlotIndex;
				const stack = container.getItem(slot);
				if (!stack || stack.typeId !== SLAB_ID) {
					return;
				}
				if (stack.amount > 1) {
					stack.amount -= 1;
					container.setItem(slot, stack);
				} else {
					container.setItem(slot, undefined);
				}
			} catch (err) {
				warnOnce("slab-merge", "[els_bb] chiseled end stone slab merge failed", err);
			}
		});
	} catch (err) {
		warnOnce("slab-interact", "[els_bb] chiseled end stone slab interact failed", err);
	}
}

function onBlockBroken(event) {
	try {
		updateAround(event.block);
		const perm = event.brokenBlockPermutation;
		const brokenId = perm && ((perm.type && perm.type.id) || perm.typeId);
		if (brokenId !== SLAB_ID || perm.getState("els_bb:double") !== true) {
			return;
		}
		const player = event.player;
		if (!player || player.getGameMode() === GameMode.creative) {
			return;
		}
		if (!isPickaxe(event.itemStackBeforeBreak)) {
			return;
		}
		const loc = event.block.location;
		const dimension = event.block.dimension || event.dimension;
		dimension.spawnItem(new ItemStack(SLAB_ID, 1), {
			x: loc.x + 0.5,
			y: loc.y + 0.5,
			z: loc.z + 0.5
		});
	} catch (err) {
		warnOnce("break", "[els_bb] chiseled end stone break handler failed", err);
	}
}

function subscribeWorldEvents() {
	const before = world.beforeEvents;
	if (before && before.playerInteractWithBlock) {
		before.playerInteractWithBlock.subscribe(onSlabInteract);
	} else {
		warnOnce("slab-event", "[els_bb] playerInteractWithBlock is unavailable; slab doubling will not run");
	}
	const after = world.afterEvents;
	if (after && after.playerPlaceBlock) {
		after.playerPlaceBlock.subscribe((event) => {
			try {
				updateAround(event.block);
			} catch (err) {
				warnOnce("place", "[els_bb] chiseled end stone place handler failed", err);
			}
		});
	}
	if (after && after.playerBreakBlock) {
		after.playerBreakBlock.subscribe(onBlockBroken);
	}
	if (after && after.blockExplode) {
		after.blockExplode.subscribe((event) => {
			try {
				updateAround(event.block);
			} catch (err) {
				warnOnce("explode", "[els_bb] chiseled end stone explode handler failed", err);
			}
		});
	}
}

subscribeWorldEvents();
