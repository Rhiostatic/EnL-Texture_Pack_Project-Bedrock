#!/usr/bin/env python3
"""Validate Choice Vibrant Visuals JSON against the documented schemas.

Checks the manifest, pbr/global.json, lighting files, generated block texture
sets, and the client biomes this phase ships. Does not claim an in-game pass.

    python3 tools/choice_vv/validate_vv.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from constants import (
    CHOICE_NOON_SUN,
    COLOR_EXTENSIONS,
    EXCLUDED_BLOCK_FILENAMES,
    LIGHTING_FILES,
    UNIFORM_MERS,
    VANILLA_NOON_SUN,
)

REPO = Path(__file__).resolve().parents[2]
PACK = REPO / "development_resource_packs" / "Choice Textures_rp"
REPORT1 = Path(__file__).resolve().parent / "phase1_block_texture_set_report.json"
REPORT2 = Path(__file__).resolve().parent / "phase2_lighting_report.json"

# Shared overworld sun colors from bedrock-samples v1.26.60.5, except noon.
VANILLA_SUN_COLORS_EXCEPT_NOON = {
    "0.717949": [255, 133, 133],
    "0.242908": [255, 127, 0],
    "0.140811": [255, 173, 81],
    "0.216944": [255, 155, 82],
    "0.314561": [255, 154, 154],
    "0.269504": [255, 127, 0],
    "0.506998": [255, 105, 0],
    "0.801062": [255, 173, 81],
}

ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"missing {path}")
    except json.JSONDecodeError as exc:
        fail(f"{path}: {exc}")
    return None


def in_range(value, low, high) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and low <= float(value) <= high


def check_color(value, channels: int, label: str) -> None:
    if isinstance(value, str):
        hex_body = value[1:] if value.startswith("#") else value
        if len(hex_body) not in (6, 8) or any(c not in "0123456789abcdefABCDEF" for c in hex_body):
            fail(f"{label}: bad hex color {value}")
        return
    if not isinstance(value, list) or len(value) != channels:
        fail(f"{label}: expected {channels} color numbers, got {value}")
        return
    for channel in value:
        if not in_range(channel, 0, 255):
            fail(f"{label}: color channel out of 0-255: {value}")
            return


def check_keyframes(value, label: str, kind: str) -> None:
    if not isinstance(value, dict):
        if kind == "float" and not in_range(value, 0, 110000):
            fail(f"{label}: illuminance out of range: {value}")
        if kind == "color3":
            check_color(value, 3, label)
        return
    for key, item in value.items():
        try:
            t = float(key)
        except ValueError:
            fail(f"{label}: keyframe key is not a number: {key}")
            continue
        if not 0.0 <= t <= 1.0:
            fail(f"{label}: keyframe {key} outside 0-1")
        if kind == "float" and not in_range(item, 0, 110000):
            fail(f"{label}: keyframe {key} illuminance out of range: {item}")
        if kind == "color3":
            check_color(item, 3, f"{label} @ {key}")


def directional_sun_moon(lights: dict) -> tuple[dict, dict]:
    if "orbital" in lights:
        orbital = lights["orbital"]
        return orbital["sun"], orbital["moon"]
    return lights["sun"], lights["moon"]


def check_manifest() -> None:
    data = load_json(PACK / "manifest.json")
    if not data:
        return
    header = data.get("header", {})
    if header.get("min_engine_version") != [1, 21, 120]:
        fail(f"min_engine_version is {header.get('min_engine_version')}, expected [1, 21, 120]")
    if header.get("version") != [1, 0, 23]:
        fail(f"header version is {header.get('version')}")
    modules = data.get("modules") or []
    if not modules or modules[0].get("version") != [1, 0, 23]:
        fail("module version is not [1, 0, 23]")
    if header.get("uuid") != "c7eb999a-07ec-4fc9-b41a-4bc952734511":
        fail("header uuid changed")
    if modules and modules[0].get("uuid") != "64319acf-204b-4f5c-89ef-38f8d23f2598":
        fail("module uuid changed")
    if data.get("capabilities") != ["pbr"]:
        fail(f"capabilities are {data.get('capabilities')}")
    if data.get("metadata", {}).get("product_type") != "addon":
        fail("product_type is not addon")
    if data.get("format_version") != 2:
        fail("manifest format_version changed")


def check_lang() -> None:
    lang_dir = PACK / "texts"
    found = False
    for path in lang_dir.glob("*.lang"):
        text = path.read_text(encoding="utf-8")
        if "pack.name=" in text:
            found = True
            for line in text.splitlines():
                if line.startswith("pack.name=") and line != "pack.name=v26.11.13 Choice Textures":
                    fail(f"{path.name} pack.name is {line}")
                if line.startswith("pack.description=") and not line.split("=", 1)[1].strip():
                    fail(f"{path.name} pack.description is empty")
    if not found:
        fail("no lang file defines pack.name")


def check_pbr() -> None:
    data = load_json(PACK / "pbr" / "global.json")
    if not data:
        return
    if data.get("format_version") != "1.21.40":
        fail("pbr/global.json format_version is not 1.21.40")
    settings = data.get("minecraft:pbr_fallback_settings")
    if not isinstance(settings, dict):
        fail("pbr/global.json missing minecraft:pbr_fallback_settings")
        return
    for group in ("blocks", "actors", "particles", "items"):
        value = (settings.get(group) or {}).get("global_metalness_emissive_roughness_subsurface")
        if value != UNIFORM_MERS:
            fail(f"pbr/global.json {group} MERS is {value}")


def check_lighting() -> None:
    lighting_dir = PACK / "lighting"
    expected = set(LIGHTING_FILES)
    present = {path.name for path in lighting_dir.glob("*.json")} if lighting_dir.exists() else set()
    if present != expected:
        fail(f"lighting files {sorted(present)} != {sorted(expected)}")
    for filename, (_old, new_id) in LIGHTING_FILES.items():
        data = load_json(lighting_dir / filename)
        if not data:
            continue
        version = data.get("format_version")
        if filename == "global.json":
            if version != "1.21.80":
                fail("global.json format_version is not 1.21.80")
        elif version != "1.21.70":
            fail(f"{filename} format_version is not 1.21.70")
        settings = data.get("minecraft:lighting_settings") or {}
        ident = (settings.get("description") or {}).get("identifier")
        if ident != new_id or ":" not in (ident or ""):
            fail(f"{filename} identifier is {ident}")
        lights = settings.get("directional_lights") or {}
        try:
            sun, moon = directional_sun_moon(lights)
        except KeyError as exc:
            fail(f"{filename}: missing sun/moon ({exc})")
            continue
        colors = sun.get("color")
        if not isinstance(colors, dict):
            fail(f"{filename}: sun color is not keyframed")
            continue
        if colors.get("1.000000") != CHOICE_NOON_SUN:
            fail(f"{filename}: noon sun {colors.get('1.000000')}")
        for key, expected_color in VANILLA_SUN_COLORS_EXCEPT_NOON.items():
            if colors.get(key) != expected_color:
                fail(f"{filename}: sun {key} changed to {colors.get(key)}")
        if VANILLA_NOON_SUN in colors.values():
            fail(f"{filename}: vanilla noon sun still present")
        check_keyframes(sun.get("illuminance"), f"{filename} sun illuminance", "float")
        check_keyframes(sun.get("color"), f"{filename} sun color", "color3")
        check_keyframes(moon.get("illuminance"), f"{filename} moon illuminance", "float")
        check_keyframes(moon.get("color"), f"{filename} moon color", "color3")
        if filename == "global.json":
            orbital = lights.get("orbital") or {}
            offset = orbital.get("orbital_offset_degrees")
            if offset != 0.0:
                fail(f"orbital_offset_degrees is {offset}")
            flash = lights.get("flash") or {}
            if flash.get("illuminance") != 10.0:
                fail("end flash illuminance changed")
            if flash.get("color") != [228, 93, 255]:
                fail("end flash color changed")
            emissive = settings.get("emissive") or {}
            if emissive.get("desaturation") != 0.0:
                fail("emissive desaturation changed")
            ambient = settings.get("ambient") or {}
            if ambient.get("color") != "#FFFFFF" or ambient.get("illuminance") != 0.02:
                fail(f"ambient changed: {ambient}")
            sky = settings.get("sky") or {}
            if sky.get("intensity") != 1.0:
                fail(f"sky intensity changed: {sky}")
            if not in_range(sky.get("intensity"), 0.1, 1.0):
                fail("sky intensity out of documented 0.1-1.0")
            if not in_range(ambient.get("illuminance"), 0.0, 5.0):
                fail("ambient illuminance out of documented 0-5")
            if not in_range(emissive.get("desaturation"), 0.0, 1.0):
                fail("emissive desaturation out of documented 0-1")


def check_texture_sets() -> None:
    report = load_json(REPORT1)
    blocks = PACK / "textures" / "blocks"
    sets = list(blocks.rglob("*.texture_set.json")) if blocks.exists() else []
    if report:
        expected = report.get("generated", report.get("written", 0) + report.get("unchanged", 0))
        if len(sets) != expected:
            fail(f"texture set count {len(sets)} != report {expected}")
    for path in sets:
        if path.name.replace(".texture_set.json", "") and Path(path.name).stem:
            pass
        data = load_json(path)
        if not data:
            continue
        if data.get("format_version") != "1.21.30":
            fail(f"{path.name}: format_version is not 1.21.30")
            continue
        body = data.get("minecraft:texture_set")
        if not isinstance(body, dict) or "color" not in body:
            fail(f"{path.name}: color layer missing")
            continue
        if "normal" in body and "heightmap" in body:
            fail(f"{path.name}: normal and heightmap both set")
        if "metalness_emissive_roughness" in body and "metalness_emissive_roughness_subsurface" in body:
            fail(f"{path.name}: MER and MERS both set")
        color = body["color"]
        if not isinstance(color, str) or not color or "/" in color or "\\" in color:
            fail(f"{path.name}: color must be a same-folder texture name")
            continue
        parent = path.parent
        matches = [parent / f"{color}{ext}" for ext in COLOR_EXTENSIONS if (parent / f"{color}{ext}").exists()]
        if not matches:
            fail(f"{path.name}: color {color} has no image beside it")
        mers = body.get("metalness_emissive_roughness_subsurface")
        if mers != UNIFORM_MERS:
            fail(f"{path.name}: MERS is {mers}")
        if path.name.replace(".texture_set.json", ".png") in EXCLUDED_BLOCK_FILENAMES or any(
            (path.parent / name).with_suffix(".texture_set.json") == path and name in EXCLUDED_BLOCK_FILENAMES
            for name in EXCLUDED_BLOCK_FILENAMES
        ):
            fail(f"excluded file got a texture set: {path.name}")
    for name in EXCLUDED_BLOCK_FILENAMES:
        for path in blocks.rglob(name):
            sibling = path.with_suffix(".texture_set.json")
            if sibling.exists():
                fail(f"excluded texture has a texture set: {sibling.relative_to(PACK)}")


def check_biomes() -> None:
    report = load_json(REPORT2)
    biome_dir = PACK / "biomes"
    present = sorted(path.name for path in biome_dir.glob("*.client_biome.json")) if biome_dir.exists() else []
    if not report:
        return
    expected = report.get("biome_files") or []
    if present != expected:
        fail(f"biome file list drifted ({len(present)} on disk, {len(expected)} in report)")
    allowed_lighting = {new for _old, new in LIGHTING_FILES.values()}
    for name in present:
        data = load_json(biome_dir / name)
        if not data:
            continue
        version = data.get("format_version")
        # Versions copied from bedrock-samples v1.26.60.5. 1.26.0 is sulfur_caves only.
        if version not in {"1.21.120", "1.26.0"}:
            fail(f"{name}: unexpected format_version {version}")
        biome = data.get("minecraft:client_biome") or {}
        ident = (biome.get("description") or {}).get("identifier")
        if not ident or ":" not in ident:
            fail(f"{name}: biome identifier missing a namespace")
        lighting = ((biome.get("components") or {}).get("minecraft:lighting_identifier") or {}).get(
            "lighting_identifier"
        )
        if lighting not in allowed_lighting:
            fail(f"{name}: lighting_identifier {lighting}")
        # These pointers must keep resolving to vanilla. This phase does not ship those JSON files.
        components = biome.get("components") or {}
        for key, field in (
            ("minecraft:atmosphere_identifier", "atmosphere_identifier"),
            ("minecraft:color_grading_identifier", "color_grading_identifier"),
            ("minecraft:water_identifier", "water_identifier"),
            ("minecraft:fog_appearance", "fog_identifier"),
        ):
            block = components.get(key)
            if isinstance(block, dict) and field in block and not str(block[field]).startswith("minecraft:"):
                fail(f"{name}: {field} no longer points at vanilla ({block[field]})")


def check_absent_dirs() -> None:
    for name in ("atmospherics", "color_grading", "fogs", "water", "local_lighting", "cubemaps"):
        path = PACK / name
        if path.exists():
            fail(f"phase 2 must not ship {name}/")
    flipbook = PACK / "textures" / "flipbook_textures.json"
    if not flipbook.exists():
        fail("flipbook_textures.json is missing")


def main() -> int:
    check_manifest()
    check_lang()
    check_pbr()
    check_lighting()
    check_texture_sets()
    check_biomes()
    check_absent_dirs()
    if ERRORS:
        print(f"{len(ERRORS)} problem(s):")
        for message in ERRORS:
            print(f"  {message}")
        return 1
    print("VV JSON checks passed")
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    raise SystemExit(main())
