#!/bin/bash

echo "🔄 Reseteando base de datos con datos iniciales..."

# Parar contenedores y eliminar volúmenes
docker-compose down -v

# Reiniciar con datos frescos
docker-compose up -d

echo "✅ Base de datos reseteada con datos iniciales"
echo "🌐 Accede a: http://localhost"
echo "👤 Usuario: admin | Contraseña: admin123"