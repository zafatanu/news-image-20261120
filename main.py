"""Ship the pre-rendered front page to the harness output directory.

The image is built in-session by render.mjs (headless Chrome, file:// only)
and committed as entry.png. At grade time there is no Chromium and no
network, so this program only copies the shipped bytes: deterministic,
stdlib-only, and it never removes or recreates the output directory.
"""

import os
import struct
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent
IMAGE = REPO / "entry.png"
MAX_BYTES = 1048576


def shipped_image() -> bytes:
    data = IMAGE.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        sys.exit("entry.png is not a PNG")
    width, height = struct.unpack(">II", data[16:24])
    if (width, height) != (1024, 1024):
        sys.exit(f"entry.png is {width}x{height}, expected 1024x1024")
    if len(data) > MAX_BYTES:
        sys.exit(f"entry.png is {len(data)} bytes, over the 1 MiB cap")
    return data


def main() -> None:
    data = shipped_image()
    out_dir = Path(os.environ.get("MAKEFUN_OUTPUT_DIR") or "/output")
    out_dir.mkdir(parents=True, exist_ok=True)
    target = out_dir / "entry.png"
    target.write_bytes(data)
    if target.read_bytes() != data:
        sys.exit("output copy does not match the shipped image")


if __name__ == "__main__":
    main()
