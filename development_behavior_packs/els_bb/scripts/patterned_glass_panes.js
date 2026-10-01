// Loaded by scripts/main.js. Bonus Blocks has one script module entry.
// Pane connections update from place, break, and explode events. There is
// no minecraft:tick on these blocks: a looping tick would run updatePane on
// every loaded pane several times a second, and those events already refresh
// the pane and its neighbors.
import { system, world } from "@minecraft/server";

const PANE_COMPONENT = "patterned:glass_pane";
const PANE_PREFIX = "patterned:patterned_glass_pane";

const warned = {};

function warnOnce(key, message, err) {
	if (warned[key]) {
		return;
	}
	warned[key] = true;
	const detail = err && (err.message || String(err));
	console.warn(detail ? `${message}: ${detail}` : message);
}

const paneComponent = {
	onPlace(e) {
		try {
			updateAround(e.block);
		} catch (err) {
			warnOnce("pane-place", "[patterned] glass pane onPlace failed", err);
		}
	}
};

function register(registry) {
	registry.registerCustomComponent(PANE_COMPONENT, paneComponent);
	console.warn("[patterned] registered patterned:glass_pane");
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
	warnOnce("startup", "[patterned] system.beforeEvents.startup unavailable, using worldInitialize", err);
	try {
		subscribeWorldInitialize();
	} catch (err2) {
		warnOnce("register", "[patterned] glass pane registration failed", err2);
	}
}

// World axes. -Z is north, +X is east. Same as the Bonus Blocks wall.
const DIRS = {
	north: { x: 0, y: 0, z: -1 },
	south: { x: 0, y: 0, z: 1 },
	west: { x: -1, y: 0, z: 0 },
	east: { x: 1, y: 0, z: 0 }
};

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
		warnOnce("block-tag", "[patterned] block tag check failed", err);
		return false;
	}
}

function isAnyWall(block) {
	if (!block || block.isAir || block.isLiquid) {
		return false;
	}
	const id = block.typeId;
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
		id.endsWith("_grate") ||
		id === "minecraft:glass_pane" ||
		id.endsWith("_stained_glass_pane") ||
		id.includes("glass_pane") ||
		id.endsWith("_pane")
	);
}

function isPatternedPane(id) {
	return id === PANE_PREFIX || id.startsWith(PANE_PREFIX + "_");
}

function isPatternedGlassBlock(id) {
	if (isPatternedPane(id)) {
		return false;
	}
	return id === "patterned:patterned_glass" || id.startsWith("patterned:patterned_glass_");
}

function isVanillaGlassBlock(id) {
	if (id === "minecraft:glass_pane" || id.endsWith("_stained_glass_pane") || id.endsWith("_pane")) {
		return false;
	}
	return id === "minecraft:glass" || id === "minecraft:tinted_glass" || id.endsWith("_stained_glass");
}

function isFenceGate(id) {
	return id === "minecraft:fence_gate" || id.endsWith("_fence_gate") || id.includes("fence_gate");
}

function isFence(id) {
	return (id === "minecraft:fence" || id.endsWith("_fence")) && !isFenceGate(id);
}

// Partial blocks vanilla panes do not treat as a full face.
function isNonFullBlock(id) {
	if (isLeafBlock(id) || isFence(id) || isFenceGate(id) || isPaneOrBars(id)) {
		return true;
	}
	if (
		id.endsWith("_slab") ||
		id.endsWith("_stairs") ||
		id.endsWith("_wall") ||
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
		id === "minecraft:waterlily" ||
		id === "minecraft:barrier" ||
		id === "minecraft:structure_void"
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
		warnOnce("is-solid", "[patterned] block.isSolid is unavailable; using a full-cube check", err);
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

function connectsTo(block) {
	if (!block || block.isAir || block.isLiquid) {
		return false;
	}
	const id = block.typeId;
	if (typeof id !== "string") {
		return false;
	}
	// Patterned panes, vanilla and stained panes, iron and copper bars, copper grates.
	if (isPaneOrBars(id)) {
		return true;
	}
	// Patterned glass blocks, vanilla glass, and stained glass.
	if (isPatternedGlassBlock(id) || isVanillaGlassBlock(id)) {
		return true;
	}
	return isFullSolid(block);
}

function isOurPane(block) {
	return !!block && typeof block.typeId === "string" && isPatternedPane(block.typeId);
}

function updatePane(block) {
	if (!isOurPane(block)) {
		return;
	}
	const { dimension, location } = block;
	const flags = {};
	for (const [name, dir] of Object.entries(DIRS)) {
		const neighbor = blockAt(dimension, location, dir.x, dir.y, dir.z);
		flags[name] = {
			connects: connectsTo(neighbor),
			patterned: isOurPane(neighbor)
		};
	}
	// Same orientation fix as els_bb:chiseled_end_stone_brick_wall. In game the
	// arm meshes render 180 degrees from their names: the north bone points
	// south, south points north, east points west, west points east. Drive
	// each state from the opposite neighbor so the mesh and the collision
	// tied to that state point at the connection.
	// end_* uses that same swap. It is true only when the arm's neighbor
	// connects and is not another patterned pane, so the arm tip draws the
	// pane-top strip against vanilla panes, bars, grates, glass, and solids.
	const next = {
		"patterned:connection_north": flags.south.connects,
		"patterned:connection_south": flags.north.connects,
		"patterned:connection_east": flags.west.connects,
		"patterned:connection_west": flags.east.connects,
		"patterned:end_north": flags.south.connects && !flags.south.patterned,
		"patterned:end_south": flags.north.connects && !flags.north.patterned,
		"patterned:end_east": flags.west.connects && !flags.west.patterned,
		"patterned:end_west": flags.east.connects && !flags.east.patterned
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
	const { dimension, location } = block;
	updatePane(block);
	for (const dir of Object.values(DIRS)) {
		updatePane(blockAt(dimension, location, dir.x, dir.y, dir.z));
	}
}

function subscribeWorldEvents() {
	const after = world.afterEvents;
	if (after && after.playerPlaceBlock) {
		after.playerPlaceBlock.subscribe((event) => {
			try {
				updateAround(event.block);
			} catch (err) {
				warnOnce("place", "[patterned] glass pane place handler failed", err);
			}
		});
	}
	if (after && after.playerBreakBlock) {
		after.playerBreakBlock.subscribe((event) => {
			try {
				updateAround(event.block);
			} catch (err) {
				warnOnce("break", "[patterned] glass pane break handler failed", err);
			}
		});
	}
	if (after && after.blockExplode) {
		after.blockExplode.subscribe((event) => {
			try {
				updateAround(event.block);
			} catch (err) {
				warnOnce("explode", "[patterned] glass pane explode handler failed", err);
			}
		});
	}
}

subscribeWorldEvents();
