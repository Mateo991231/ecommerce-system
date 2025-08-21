# 🛒 E-Commerce System

[![CI Pipeline](https://github.com/mateo991231/ecommerce-system/actions/workflows/ci.yml/badge.svg)](https://github.com/TU_USUARIO/ecommerce-system/actions/workflows/ci.yml)
[![Docker Images](https://github.com/mateo991231/ecommerce-system/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/TU_USUARIO/ecommerce-system/actions/workflows/docker-publish.yml)

Sistema de e-commerce completo desarrollado con **Spring Boot** y **React**, que incluye gestión de productos, inventarios, órdenes y sistema de descuentos.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker & Docker Compose
- Git

### Instalación
```bash
git clone https://github.com/mateo991231/ecommerce-system.git
cd ecommerce-system
docker-compose up -d
```

### Acceso
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Credenciales**: admin / admin123

## ✨ Características

### 🔐 Autenticación y Autorización
- JWT Authentication
- Control de acceso por roles (Admin/Customer)
- Gestión completa de usuarios

### 📦 Gestión de Productos
- CRUD completo de productos
- Búsqueda y filtros avanzados
- Gestión de inventarios
- Control de stock

### 🛒 Sistema de Órdenes
- Creación de órdenes
- Estados de órdenes (Pending, Approved, Cancelled)
- Historial completo

### 💰 Sistema de Descuentos
- **5% automático** para clientes frecuentes
- **10% por tiempo** (configurable por admin)
- **50% aleatorio** (aplicable por admin)
- Descuentos acumulables
- Identificación visual por colores

### 📊 Reportes
- Top 5 productos más vendidos
- Top 5 clientes frecuentes
- Productos activos
- Estadísticas de ventas

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Spring Boot 3.2.0
- **Java**: OpenJDK 17
- **Seguridad**: Spring Security + JWT
- **Base de Datos**: PostgreSQL
- **ORM**: Spring Data JPA
- **Testing**: JUnit 5 + Mockito

### Frontend
- **Framework**: React 18.2.0 + TypeScript
- **UI**: Material-UI (MUI) 5.14.20
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Build**: Vite

### DevOps
- **Containerización**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Análisis de Código**: Jacoco
- **Base de Datos**: PostgreSQL en Docker

## 📁 Estructura del Proyecto

```
ecommerce-system/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/         # Configuraciones
│   │   ├── controller/     # REST Controllers
│   │   ├── service/        # Lógica de negocio
│   │   ├── repository/     # Acceso a datos
│   │   ├── entity/         # Entidades JPA
│   │   ├── dto/           # Data Transfer Objects
│   │   └── security/      # Configuración de seguridad
│   └── Dockerfile
├── frontend/              # React App
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── Dockerfile
├── .github/workflows/     # CI/CD Pipelines
├── docker-compose.yml     # Orquestación de servicios
└── database-schema.sql    # Esquema de BD
```

## 🧪 Testing

### Ejecutar Tests Localmente
```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
```

### CI/CD Pipeline
El proyecto incluye pipelines automatizados que se ejecutan en cada push:

- ✅ **Tests Backend**: JUnit + Mockito
- ✅ **Tests Frontend**: Jest + React Testing Library
- ✅ **Build Docker**: Verificación de imágenes
- ✅ **Code Quality**: Análisis estático
- ✅ **Coverage Reports**: Reportes de cobertura

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/products` - Listar productos (paginado)
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/{id}` - Eliminar producto (Admin)
- `GET /api/products/search` - Buscar productos

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/user/{userId}` - Órdenes por usuario
- `POST /api/orders/apply-random-discount` - Aplicar descuento aleatorio (Admin)
- `POST /api/orders/apply-time-discount` - Aplicar descuento por tiempo (Admin)

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

### Reportes (Admin)
- `GET /api/products/top-selling` - Top productos
- `GET /api/orders/frequent-customers` - Top clientes

## 🔧 Desarrollo

### Configuración Local
```bash
# Clonar repositorio
git clone https://github.com/mateo991231/ecommerce-system.git
cd ecommerce-system

# Ejecutar con Docker
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Variables de Entorno
El sistema usa las siguientes variables (configuradas en docker-compose.yml):

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

## 🚀 Despliegue

### Producción
```bash
# Construir imágenes optimizadas
docker-compose -f docker-compose.prod.yml up -d

# O usar imágenes publicadas
docker pull mateo991231/ecommerce-backend:latest
docker pull mateo991231/ecommerce-frontend:latest
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- Mateo Quintero Acevedo