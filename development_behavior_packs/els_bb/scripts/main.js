import { Direction, GameMode, ItemStack, system, world } from "@minecraft/server";

const CUSTOM_FLAME = "els_bb:waxed_torch_flame";
const VANILLA_FLAME = "minecraft:basic_flame_particle";
const COMPONENT_ID = "els_bb:waxed_torch_particles";
const WALL_COMPONENT = "els_bb:chiseled_end_stone_brick_wall";
const STAIR_COMPONENT = "els_bb:chiseled_end_stone_brick_stairs";
const SLAB_ID = "els_bb:chiseled_end_stone_brick_slab";
const WALL_ID = "els_bb:chiseled_end_stone_brick_wall";
const STAIR_ID = "els_bb:chiseled_end_stone_brick_stairs";

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
			updateWallColumn(e.block);
		} catch (err) {
			warnOnce("wall-tick", "[els_bb] chiseled end stone wall onTick failed", err);
		}
	}
};

const stairComponent = {
	onPlace(e) {
		try {
			updateAround(e.block);
		} catch (err) {
			warnOnce("stair-place", "[els_bb] chiseled end stone stair onPlace failed", err);
		}
	},
	onTick(e) {
		try {
			updateAround(e.block);
		} catch (err) {
			warnOnce("stair-tick", "[els_bb] chiseled end stone stair onTick failed", err);
		}
	}
};

function register(registry) {
	registry.registerCustomComponent(COMPONENT_ID, waxedTorchParticles);
	registry.registerCustomComponent(WALL_COMPONENT, wallComponent);
	registry.registerCustomComponent(STAIR_COMPONENT, stairComponent);
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

function blockHasTag(block, tag) {
	if (!block || typeof block.hasTag !== "function") {
		return false;
	}
	try {
		return block.hasTag(tag) === true;
	} catch (err) {
		warnOnce("block-tag", "[els_bb] block tag check failed", err);
		return false;
	}
}

function isAnyWall(block) {
	if (!block || block.isAir || block.isLiquid) {
		return false;
	}
	const id = block.typeId;
	if (id === WALL_ID) {
		return true;
	}
	if (typeof id === "string" && id.endsWith("_wall")) {
		return true;
	}
	return blockHasTag(block, "minecraft:wall") || blockHasTag(block, "wall");
}

function isLeafBlock(id) {
	return id === "minecraft:leaves" || id.endsWith("_leaves") || id.includes("leaves");
}

function isPaneOrBars(id) {
	return (
		id === "minecraft:iron_bars" ||
		id.endsWith("_bars") ||
		id.includes("glass_pane") ||
		id.endsWith("_pane")
	);
}

function isFenceGate(id) {
	return id === "minecraft:fence_gate" || id.endsWith("_fence_gate") || id.includes("fence_gate");
}

function isFence(id) {
	return (id === "minecraft:fence" || id.endsWith("_fence")) && !isFenceGate(id);
}

// Partial, plant, and utility blocks vanilla walls do not treat as a full face.
function isNonFullBlock(id) {
	if (isLeafBlock(id) || isFence(id) || isFenceGate(id) || isPaneOrBars(id)) {
		return true;
	}
	if (
		id.endsWith("_slab") ||
		id.endsWith("_stairs") ||
		id.endsWith("_door") ||
		id.endsWith("_trapdoor") ||
		id.endsWith("_carpet") ||
		id.endsWith("_pressure_plate") ||
		id.endsWith("_button") ||
		id.endsWith("_sign") ||
		id.endsWith("_banner") ||
		id.endsWith("_rail") ||
		id.endsWith("_candle") ||
		id.endsWith("_lantern") ||
		id.endsWith("_campfire") ||
		id.endsWith("_plant") ||
		id.endsWith("_sapling") ||
		id.endsWith("_fungus") ||
		id.endsWith("_roots") ||
		id.endsWith("_coral") ||
		id.endsWith("_coral_fan") ||
		id.endsWith("_grass") ||
		id === "minecraft:grass" ||
		id === "minecraft:short_grass" ||
		id === "minecraft:tall_grass" ||
		id === "minecraft:fern" ||
		id === "minecraft:large_fern" ||
		id === "minecraft:deadbush" ||
		id === "minecraft:vine" ||
		id === "minecraft:twisting_vines" ||
		id === "minecraft:weeping_vines" ||
		id === "minecraft:cave_vines" ||
		id === "minecraft:seagrass" ||
		id === "minecraft:kelp" ||
		id === "minecraft:bamboo" ||
		id === "minecraft:torch" ||
		id === "minecraft:soul_torch" ||
		id === "minecraft:redstone_torch" ||
		id.endsWith("_torch") ||
		id === "minecraft:ladder" ||
		id === "minecraft:chain" ||
		id === "minecraft:snow_layer" ||
		id === "minecraft:scaffolding" ||
		id === "minecraft:web" ||
		id === "minecraft:cobweb" ||
		id === "minecraft:fire" ||
		id === "minecraft:soul_fire" ||
		id.endsWith("_chest") ||
		id === "minecraft:chest" ||
		id === "minecraft:barrel" ||
		id === "minecraft:hopper" ||
		id === "minecraft:composter" ||
		id.endsWith("_cauldron") ||
		id === "minecraft:enchanting_table" ||
		id === "minecraft:brewing_stand" ||
		id === "minecraft:end_portal_frame" ||
		id === "minecraft:lectern" ||
		id === "minecraft:grindstone" ||
		id === "minecraft:stonecutter_block" ||
		id === "minecraft:bell" ||
		id === "minecraft:conduit" ||
		id === "minecraft:beacon" ||
		id === "minecraft:anvil" ||
		id.endsWith("_anvil") ||
		id.endsWith("_bed") ||
		id === "minecraft:cake" ||
		id === "minecraft:farmland" ||
		id === "minecraft:dirt_path" ||
		id === "minecraft:grass_path" ||
		id.endsWith("_path") ||
		id.endsWith("_head") ||
		id.endsWith("_skull") ||
		id === "minecraft:flower_pot" ||
		id.endsWith("_flower_pot") ||
		id.includes("piston") ||
		id === "minecraft:daylight_detector" ||
		id === "minecraft:repeater" ||
		id === "minecraft:comparator" ||
		id === "minecraft:redstone_wire" ||
		id === "minecraft:lever" ||
		id === "minecraft:tripwire" ||
		id === "minecraft:tripwire_hook" ||
		id === "minecraft:lily_pad" ||
		id === "minecraft:waterlily"
	) {
		return true;
	}
	return false;
}

function safeIsSolid(block) {
	try {
		const solid = block.isSolid;
		if (solid === true || solid === 1) {
			return true;
		}
		if (solid === false || solid === 0) {
			return false;
		}
		return undefined;
	} catch (err) {
		warnOnce("is-solid", "[els_bb] block.isSolid is unavailable; using a full-cube check", err);
		return undefined;
	}
}

function isFullSolid(block) {
	if (!block || block.isAir || block.isLiquid || isAnyWall(block)) {
		return false;
	}
	const id = block.typeId;
	if (typeof id !== "string" || isNonFullBlock(id)) {
		return false;
	}
	const solid = safeIsSolid(block);
	if (solid === false) {
		return false;
	}
	return true;
}

function gateFacing(block) {
	const perm = block.permutation;
	if (!perm || typeof perm.getState !== "function") {
		return undefined;
	}
	const cardinal = readState(perm, "minecraft:cardinal_direction");
	if (cardinal === "north" || cardinal === "south" || cardinal === "east" || cardinal === "west") {
		return cardinal;
	}
	const direction = readState(perm, "direction");
	const byDirection = {
		0: "south",
		1: "west",
		2: "north",
		3: "east"
	};
	if (byDirection[direction] !== undefined) {
		return byDirection[direction];
	}
	if (direction === "0" || direction === "1" || direction === "2" || direction === "3") {
		return byDirection[Number(direction)];
	}
	return undefined;
}

function gateConnectsOnSide(facing, side) {
	if (facing === "north" || facing === "south") {
		return side === "east" || side === "west";
	}
	if (facing === "east" || facing === "west") {
		return side === "north" || side === "south";
	}
	return false;
}

function connectsToWall(block, side) {
	if (!block || block.isAir || block.isLiquid) {
		return false;
	}
	const id = block.typeId;
	if (typeof id !== "string") {
		return false;
	}
	if (isAnyWall(block)) {
		return true;
	}
	if (isPaneOrBars(id)) {
		return true;
	}
	if (isFenceGate(id)) {
		return gateConnectsOnSide(gateFacing(block), side);
	}
	return isFullSolid(block);
}

function straightWall(flags) {
	const ns = flags.north && flags.south && !flags.east && !flags.west;
	const ew = flags.east && flags.west && !flags.north && !flags.south;
	return ns || ew;
}

function ourWallIsPost(block) {
	if (!block || block.typeId !== WALL_ID) {
		return false;
	}
	try {
		return block.permutation.getState("els_bb:wall_post") === true;
	} catch (err) {
		warnOnce("wall-post-read", "[els_bb] wall_post read failed", err);
		return true;
	}
}

function foreignWallHasPost(block) {
	const { dimension, location } = block;
	const flags = {};
	for (const [name, dir] of Object.entries(WALL_DIRS)) {
		flags[name] = connectsToWall(blockAt(dimension, location, dir.x, 0, dir.z), name);
	}
	if (!straightWall(flags)) {
		return true;
	}
	const higher = blockAt(dimension, location, 0, 1, 0);
	if (isFullSolid(higher)) {
		return true;
	}
	return ourWallIsPost(higher);
}

function aboveMakesPost(above) {
	if (!above || above.isAir || above.isLiquid) {
		return false;
	}
	if (above.typeId === WALL_ID) {
		return ourWallIsPost(above);
	}
	if (isAnyWall(above)) {
		return foreignWallHasPost(above);
	}
	return isFullSolid(above);
}

function armIsTall(dimension, location, dir, side) {
	const above = blockAt(dimension, location, 0, 1, 0);
	if (!above || above.isAir || above.isLiquid) {
		return false;
	}
	if (isFullSolid(above)) {
		return true;
	}
	if (isAnyWall(above)) {
		return connectsToWall(blockAt(dimension, location, dir.x, 1, dir.z), side);
	}
	return false;
}

function updateWall(block) {
	if (!block || block.typeId !== WALL_ID) {
		return;
	}
	const { dimension, location } = block;
	const flags = {};
	for (const [name, dir] of Object.entries(WALL_DIRS)) {
		flags[name] = connectsToWall(blockAt(dimension, location, dir.x, dir.y, dir.z), name);
	}
	const above = blockAt(dimension, location, 0, 1, 0);
	// Straight runs hide the post unless the block above is itself a wall
	// post or a non-wall full solid. Ends, corners, junctions, and a lone
	// wall keep the post. An arm is 16 tall when a full solid is above, or
	// the wall above connects on that same world side; otherwise it stays 14.
	const post = !straightWall(flags) || aboveMakesPost(above);
	const tall = {};
	for (const [name, dir] of Object.entries(WALL_DIRS)) {
		tall[name] = flags[name] && armIsTall(dimension, location, dir, name);
	}
	// In game every arm mesh renders 180 degrees from its name: the north
	// bone points south, south points north, east points west, west points
	// east. Drive each state from the opposite neighbor so the mesh and the
	// collision tied to that state point at the connection. Tall uses the
	// same opposite-name mapping. Straight/post still use the real neighbor
	// flags above.
	const next = {
		"els_bb:connection_north": flags.south,
		"els_bb:connection_south": flags.north,
		"els_bb:connection_east": flags.west,
		"els_bb:connection_west": flags.east,
		"els_bb:tall_north": tall.south,
		"els_bb:tall_south": tall.north,
		"els_bb:tall_east": tall.west,
		"els_bb:tall_west": tall.east,
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

function updateWallColumn(block) {
	if (!block) {
		return;
	}
	const { dimension, location } = block;
	updateWall(blockAt(dimension, location, 0, 1, 0));
	updateWall(block);
	updateWall(blockAt(dimension, location, 0, -1, 0));
}

const STAIR_CCW = {
	north: "west",
	west: "south",
	south: "east",
	east: "north"
};

const STAIR_OPP = {
	north: "south",
	south: "north",
	east: "west",
	west: "east"
};

// Bedrock weirdo_direction is the tall back, not the open step.
// 0 east, 1 west, 2 south, 3 north. Vanilla stairs list this state,
// upside_down_bit, and minecraft:corner. They do not list
// minecraft:cardinal_direction.
const WEIRDO_FACING = {
	0: "east",
	1: "west",
	2: "south",
	3: "north"
};

function readState(perm, name) {
	try {
		return perm.getState(name);
	} catch (err) {
		return undefined;
	}
}

function facingFromWeirdo(value) {
	if (value === "north" || value === "south" || value === "east" || value === "west") {
		return value;
	}
	if (value === 0 || value === 1 || value === 2 || value === 3) {
		return WEIRDO_FACING[value];
	}
	if (value === "0" || value === "1" || value === "2" || value === "3") {
		return WEIRDO_FACING[Number(value)];
	}
	return undefined;
}

function halfFromState(value) {
	if (value === "bottom" || value === "top") {
		return value;
	}
	if (value === true || value === 1 || value === "1" || value === "true") {
		return "top";
	}
	if (value === false || value === 0 || value === "0" || value === "false") {
		return "bottom";
	}
	return undefined;
}

function stairFacingAndHalf(block) {
	if (!block || block.isAir) {
		return undefined;
	}
	const id = block.typeId;
	if (typeof id !== "string" || (id !== STAIR_ID && !id.endsWith("_stairs"))) {
		return undefined;
	}
	const perm = block.permutation;
	if (!perm || typeof perm.getState !== "function") {
		return undefined;
	}
	// Returned facing is Java facing: the tall back, in world coordinates.
	// Model Z is mirrored (model -Z is world south) and model X is not
	// (model +X is world east). cardinal_direction is the side toward the
	// player, the open step, so the tall back is the opposite of that state.
	// East and west meshes are mirrored on X so they follow the same rule.
	// Vanilla weirdo_direction is already the tall back.
	let facing;
	if (id === STAIR_ID) {
		const step = facingFromWeirdo(readState(perm, "minecraft:cardinal_direction"));
		facing = step ? STAIR_OPP[step] : undefined;
	} else {
		facing = facingFromWeirdo(readState(perm, "weirdo_direction"));
		if (!facing) {
			facing = facingFromWeirdo(readState(perm, "minecraft:weirdo_direction"));
		}
	}
	let half = halfFromState(readState(perm, "minecraft:vertical_half"));
	if (!half) {
		half = halfFromState(readState(perm, "upside_down_bit"));
	}
	if (!half) {
		half = halfFromState(readState(perm, "minecraft:upside_down_bit"));
	}
	if (!facing || !half) {
		return undefined;
	}
	return { facing: facing, half: half };
}

function sameStairAxis(a, b) {
	const northSouth = a === "north" || a === "south";
	return northSouth === (b === "north" || b === "south");
}

function canTakeStairShape(dimension, location, ourFacing, ourHalf, side) {
	const dir = WALL_DIRS[side];
	const other = stairFacingAndHalf(blockAt(dimension, location, dir.x, dir.y, dir.z));
	if (!other) {
		return true;
	}
	return other.facing !== ourFacing || other.half !== ourHalf;
}

// Java facing is the tall back. Erik's side-by-side placement puts the
// neighbor on the step side, and that case is an outside corner. Keep the
// v26.09.29c left/right names: swapping them moved the quarter from the back
// to the front. The outer cubes are mirrored on the other axis, the one
// parallel to the middle stair's back, so the quarter stays on the back and
// meets that tall back. Inner left/right use the same names; their cubes
// are mirrored on that same axis so the open quarter is on the step half.
// Neighbors count only
// in the same half and only when turned 90°.
function stairShape(block) {
	const self = stairFacingAndHalf(block);
	if (!self) {
		return "straight";
	}
	const { dimension, location } = block;
	const tallDir = WALL_DIRS[self.facing];
	const tallNeighbor = stairFacingAndHalf(blockAt(dimension, location, tallDir.x, tallDir.y, tallDir.z));
	if (tallNeighbor && tallNeighbor.half === self.half && !sameStairAxis(tallNeighbor.facing, self.facing)) {
		if (canTakeStairShape(dimension, location, self.facing, self.half, STAIR_OPP[tallNeighbor.facing])) {
			return tallNeighbor.facing === STAIR_CCW[self.facing] ? "inner_left" : "inner_right";
		}
	}
	const stepDir = WALL_DIRS[STAIR_OPP[self.facing]];
	const stepNeighbor = stairFacingAndHalf(blockAt(dimension, location, stepDir.x, stepDir.y, stepDir.z));
	if (stepNeighbor && stepNeighbor.half === self.half && !sameStairAxis(stepNeighbor.facing, self.facing)) {
		if (canTakeStairShape(dimension, location, self.facing, self.half, stepNeighbor.facing)) {
			return stepNeighbor.facing === STAIR_CCW[self.facing] ? "outer_left" : "outer_right";
		}
	}
	return "straight";
}

function updateStair(block) {
	if (!block || block.typeId !== STAIR_ID) {
		return;
	}
	const shape = stairShape(block);
	const perm = block.permutation;
	if (perm.getState("els_bb:stair_shape") !== shape) {
		block.setPermutation(perm.withState("els_bb:stair_shape", shape));
	}
}

function updateAround(block) {
	if (!block) {
		return;
	}
	const { dimension, location } = block;
	updateWall(blockAt(dimension, location, 0, 1, 0));
	updateWall(block);
	updateStair(block);
	for (const dir of Object.values(WALL_DIRS)) {
		const neighbor = blockAt(dimension, location, dir.x, dir.y, dir.z);
		updateWall(neighbor);
		updateStair(neighbor);
	}
	updateWall(blockAt(dimension, location, 0, -1, 0));
	updateWall(block);
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
				// The placed block and the walls beside, above, and below it.
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
