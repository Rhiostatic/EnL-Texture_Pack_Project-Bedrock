#!/usr/bin/env python3
"""Copy vanilla overworld lighting into Choice and warm the noon sun one step.

Reads Mojang bedrock-samples lighting JSON and client biomes, then writes:

- lighting/*.json with the same numbers, except the shared noon sun color and
  a choice: identifier
- biomes/*.client_biome.json copied in full, with only lighting_identifier
  retargeted at those choice: ids

Biomes on ice, mushroom, pale garden, nether, or end lighting are not copied.
Those presets do not use the shared warm-white noon, and this phase does not
restyle them.

    python3 tools/choice_vv/apply_overworld_lighting.py \\
        --lighting-dir /path/to/bedrock-samples/resource_pack/lighting \\
        --biomes-dir /path/to/bedrock-samples/resource_pack/biomes

The script checks that each written biome differs from vanilla only in the
lighting identifier. It refuses to write if that check fails.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from constants import CHOICE_NOON_SUN, LIGHTING_FILES, VANILLA_NOON_SUN, VANILLA_TAG

REPO = Path(__file__).resolve().parents[2]
PACK = REPO / "development_resource_packs" / "Choice Textures_rp"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one {old!r}, found {count}")
    return text.replace(old, new, 1)


def warm_noon_color(text: str, label: str) -> str:
    old_spaced = "[ " + ", ".join(str(n) for n in VANILLA_NOON_SUN) + " ]"
    new_spaced = "[ " + ", ".join(str(n) for n in CHOICE_NOON_SUN) + " ]"
    old_tight = "[" + ", ".join(str(n) for n in VANILLA_NOON_SUN) + "]"
    new_tight = "[" + ", ".join(str(n) for n in CHOICE_NOON_SUN) + "]"
    spaced = text.count(old_spaced)
    tight = text.count(old_tight)
    if spaced + tight != 1:
        raise SystemExit(f"{label}: expected one noon color, found spaced={spaced} tight={tight}")
    if spaced:
        return text.replace(old_spaced, new_spaced, 1)
    return text.replace(old_tight, new_tight, 1)


def sun_color_at_noon(data: dict) -> list:
    lights = data["minecraft:lighting_settings"]["directional_lights"]
    sun = lights.get("sun")
    if sun is None:
        sun = lights["orbital"]["sun"]
    color = sun["color"]
    if isinstance(color, dict):
        return color["1.000000"]
    return color


def apply_lighting(lighting_dir: Path, dest_dir: Path) -> list[str]:
    dest_dir.mkdir(parents=True, exist_ok=True)
    written = []
    id_map = {}
    for filename, (old_id, new_id) in LIGHTING_FILES.items():
        id_map[old_id] = new_id
        source = lighting_dir / filename
        if not source.exists():
            raise SystemExit(f"missing vanilla lighting file: {source}")
        text = source.read_text(encoding="utf-8")
        text = replace_once(text, f'"identifier": "{old_id}"', f'"identifier": "{new_id}"', filename)
        text = warm_noon_color(text, filename)
        data = json.loads(text)
        if data["minecraft:lighting_settings"]["description"]["identifier"] != new_id:
            raise SystemExit(f"{filename}: identifier was not updated")
        noon = sun_color_at_noon(data)
        if noon != CHOICE_NOON_SUN:
            raise SystemExit(f"{filename}: noon sun is {noon}, expected {CHOICE_NOON_SUN}")
        (dest_dir / filename).write_text(text, encoding="utf-8")
        written.append(filename)
    return written


def lighting_id(data: dict) -> str | None:
    components = data["minecraft:client_biome"]["components"]
    block = components.get("minecraft:lighting_identifier")
    if not block:
        return None
    return block.get("lighting_identifier")


def apply_biomes(biomes_dir: Path, dest_dir: Path) -> list[str]:
    dest_dir.mkdir(parents=True, exist_ok=True)
    id_map = {old: new for old, new in LIGHTING_FILES.values()}
    written = []
    for source in sorted(biomes_dir.glob("*.client_biome.json")):
        original = source.read_text(encoding="utf-8")
        data = json.loads(original)
        current = lighting_id(data)
        if current not in id_map:
            continue
        new_id = id_map[current]
        needle = f'"lighting_identifier": "{current}"'
        text = replace_once(original, needle, f'"lighting_identifier": "{new_id}"', source.name)
        updated = json.loads(text)
        # Put the vanilla id back in a copy of the parsed update and compare.
        check = json.loads(text)
        check["minecraft:client_biome"]["components"]["minecraft:lighting_identifier"][
            "lighting_identifier"
        ] = current
        if check != data:
            raise SystemExit(f"{source.name}: biome JSON changed besides lighting_identifier")
        if lighting_id(updated) != new_id:
            raise SystemExit(f"{source.name}: lighting identifier was not updated")
        (dest_dir / source.name).write_text(text, encoding="utf-8")
        written.append(source.name)
    if not written:
        raise SystemExit("no biomes were retargeted")
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lighting-dir", type=Path, required=True)
    parser.add_argument("--biomes-dir", type=Path, required=True)
    parser.add_argument("--pack", type=Path, default=PACK)
    args = parser.parse_args()

    lighting_written = apply_lighting(args.lighting_dir, args.pack / "lighting")
    biomes_written = apply_biomes(args.biomes_dir, args.pack / "biomes")
    manifest = {
        "vanilla_tag": VANILLA_TAG,
        "noon_sun_vanilla": VANILLA_NOON_SUN,
        "noon_sun_choice": CHOICE_NOON_SUN,
        "lighting_files": lighting_written,
        "biome_files": biomes_written,
    }
    out = Path(__file__).resolve().parent / "phase2_lighting_report.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"lighting files: {len(lighting_written)}")
    print(f"biomes retargeted: {len(biomes_written)}")
    print(f"report: {out}")
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    raise SystemExit(main())
