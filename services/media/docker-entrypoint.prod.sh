#!/bin/sh
set -e

mkdir -p /uploads

for file in /app/assets/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    if [ ! -e "/uploads/$filename" ]; then
      cp "$file" "/uploads/$filename"
    fi
  fi
done

exec node index.js
