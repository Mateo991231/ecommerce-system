# 🚀 E-Commerce System - Docker Setup

## Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ecommerce-system
```

### 2. Ejecutar con Docker
```bash
docker-compose up -d
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Base de datos**: localhost:5432

### 4. Credenciales de prueba
- **Usuario**: admin
- **Contraseña**: admin123

## 🛠️ Comandos Útiles

### Iniciar servicios
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Detener servicios
```bash
docker-compose down
```

### Reconstruir imágenes
```bash
docker-compose up -d --build
```

### Limpiar todo (incluyendo datos)
```bash
docker-compose down -v
docker system prune -a
```

## 📊 Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 80 | React App con Nginx |
| Backend | 8080 | Spring Boot API |
| Database | 5432 | PostgreSQL |

## 🔧 Desarrollo

### Ver estado de contenedores
```bash
docker-compose ps
```

### Acceder a contenedor
```bash
docker exec -it ecommerce-backend bash
docker exec -it ecommerce-frontend sh
docker exec -it ecommerce-postgres psql -U postgres -d ecommerce_db
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
```

## 📝 Notas

- Los datos de la base de datos se persisten en un volumen Docker
- El frontend incluye proxy automático al backend
- La aplicación se inicializa automáticamente con datos de prueba
- Todos los servicios se reinician automáticamente si fallan