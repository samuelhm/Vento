#!/bin/bash

printf "🔍 Verificando tamaños de archivo (Máx 2MB)...\n"

FOUND=$(find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) -size +2M)

if [ -n "$FOUND" ]; then
  printf "❌ Error: Se encontraron archivos que superan los 2MB:\n"
  printf "$FOUND\n"
  exit 1
else
  printf "✅ Todas las imágenes cumplen el límite de tamaño.\n"
  exit 0
fi
