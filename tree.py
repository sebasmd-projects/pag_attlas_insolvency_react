from pathlib import Path

EXCLUDE = {"node_modules", ".next", ".continue", ".git"}

def tree(directory, prefix=""):
    entries = [
        e for e in sorted(directory.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
        if e.name not in EXCLUDE
    ]

    for i, entry in enumerate(entries):
        connector = "+-- " if i < len(entries) - 1 else "\\-- "
        print(prefix + connector + entry.name)

        if entry.is_dir():
            extension = "|   " if i < len(entries) - 1 else "    "
            tree(entry, prefix + extension)

tree(Path("."))