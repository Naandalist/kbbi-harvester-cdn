#!/usr/bin/env bash
# Generate per-letter zip archives for offline use.
# Usage: bash scripts/build_releases.sh
# Output: releases/A.zip ... releases/Z.zip + releases/checksums.txt

set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$DIR/releases"

rm -rf "$OUT"
mkdir -p "$OUT"

echo "Building per-letter zip archives..."
for letter in A B C D E F G H I J K L M N O P Q R S T U V W X Y Z; do
  src="$DIR/word-details/$letter"
  [ -d "$src" ] || continue
  zip -j "$OUT/$letter.zip" "$src"/*.json > /dev/null 2>&1
  echo "  $letter.zip"
done

# Checksums
(cd "$OUT" && sha256sum *.zip > checksums.txt)
echo "Done: $OUT/"
echo "Checksums: $OUT/checksums.txt"
