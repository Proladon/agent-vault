"""
setup.py
Creates the standard session folder structure for a staged-task-execution feature.

Usage:
    python setup.py <feature-name>

Output:
    temp/<feature-name>/
    ├── tasks.md
    ├── progress.md
    └── references/
"""

import argparse
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Create a staged-task-execution session folder."
    )
    parser.add_argument("feature_name", help="kebab-case feature name (e.g. my-feature)")
    args = parser.parse_args()

    base = Path("temp") / args.feature_name

    if base.exists():
        print(f"Warning: session folder already exists: {base}", file=sys.stderr)
        sys.exit(0)

    (base / "references").mkdir(parents=True)
    (base / "tasks.md").touch()
    (base / "progress.md").touch()

    print(f"Session folder created: {base}")
    print(f"  {base / 'tasks.md'}")
    print(f"  {base / 'progress.md'}")
    print(f"  {base / 'references'}/")


if __name__ == "__main__":
    main()
