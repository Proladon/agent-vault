"""
archive.py
Moves a completed feature folder from temp/ to temp/archive/.

Usage:
    python archive.py <feature-name>

Moves: temp/<feature-name>/ -> temp/archive/<feature-name>/
"""

import argparse
import shutil
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Archive a completed staged-task-execution feature folder."
    )
    parser.add_argument("feature_name", help="kebab-case feature name (e.g. my-feature)")
    args = parser.parse_args()

    source = Path("temp") / args.feature_name
    archive_dir = Path("temp") / "archive"
    destination = archive_dir / args.feature_name

    if not source.exists():
        print(f"Error: feature folder not found: {source}", file=sys.stderr)
        sys.exit(1)

    if destination.exists():
        print(f"Error: archive destination already exists: {destination}", file=sys.stderr)
        sys.exit(1)

    archive_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(source), str(destination))

    print(f"Archived: {source} -> {destination}")


if __name__ == "__main__":
    main()
