"""Shared constants for Choice Vibrant Visuals phases 1 and 2.

Vanilla baseline: Mojang bedrock-samples tag v1.26.60.5 (latest stable on 2026-11-13).
"""

VANILLA_TAG = "v1.26.60.5"

# Noon sun color on the shared overworld palette.
# Vanilla key "1.000000" is [255, 227, 215]. Choice pulls a little green and
# blue out of that one key. Sunrise, sunset, and night keys stay vanilla.
VANILLA_NOON_SUN = [255, 227, 215]
CHOICE_NOON_SUN = [255, 223, 204]

# Uniform MERS written into generated block texture sets and pbr/global.json.
# Microsoft's documented fallback example: metal 0, emissive 0, roughness 255,
# subsurface 0. Roughness 255 is fully rough (matte). Channels are 0-255.
UNIFORM_MERS = [0, 0, 255, 0]

# Vanilla lighting files whose noon sun uses VANILLA_NOON_SUN, and the Choice
# identifier that replaces the minecraft: one. Filenames stay vanilla so a
# diff against bedrock-samples is readable. lighting/global.json is the
# reserved default filename; its identifier is still choice:default_lighting.
LIGHTING_FILES = {
    "global.json": ("minecraft:default_lighting", "choice:default_lighting"),
    "warmish_lighting.json": ("minecraft:warmish_lighting", "choice:warmish_lighting"),
    "mesa_lighting.json": ("minecraft:mesa_lighting", "choice:mesa_lighting"),
    "desert_lighting.json": ("minecraft:desert_lighting", "choice:desert_lighting"),
    "roofed_forest_lighting.json": (
        "minecraft:roofed_forest_lighting",
        "choice:roofed_forest_lighting",
    ),
    "swampland_lighting.json": ("minecraft:swampland_lighting", "choice:swampland_lighting"),
    "mangrove_swamp_lighting.json": (
        "minecraft:mangrove_swamp_lighting",
        "choice:mangrove_swamp_lighting",
    ),
}

COLOR_EXTENSIONS = (".png", ".tga", ".jpg", ".jpeg")
