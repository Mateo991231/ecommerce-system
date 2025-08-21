#!/bin/bash

echo "🔄 Reconstruyendo aplicación con código más reciente..."

# Parar contenedores, eliminar volúmenes e imágenes
docker-compose down -v --rmi all

# Reconstruir imágenes sin cache
docker-compose build --no-cache

# Iniciar con código y datos frescos
docker-compose up -d

echo "✅ Aplicación reconstruida con código y datos frescos"
echo "🌐 Accede a: http://localhost"
echo "👤 Usuario: admin | Contraseña: admin123"