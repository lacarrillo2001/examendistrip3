# Frontend React - Emisión de Pólizas

Frontend React para la administración de clientes, planes y pólizas.

## Estructura del proyecto

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Componente principal
│   ├── App.css         # Estilos
│   └── index.js        # Punto de entrada
├── .env                # Variables de entorno (desarrollo)
├── .env.production     # Variables de entorno (producción)
├── Dockerfile          # Configuración Docker
├── nginx.conf          # Configuración Nginx
└── docker-entrypoint.sh # Script de entrada Docker
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE` | URL base del API backend | `http://localhost:8080/api` |

### Desarrollo

Edita el archivo `.env`:
```
REACT_APP_API_BASE=http://localhost:8080/api
```

### Docker

La variable se puede configurar en `docker-compose.yml`:
```yaml
frontend-react:
  environment:
    REACT_APP_API_BASE: http://localhost:8080/api
```

## Docker

### Build manual

```bash
docker build -t frontend-react .
docker run -p 3001:80 -e REACT_APP_API_BASE=http://localhost:8080/api frontend-react
```

### Con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up frontend-react
```

El frontend React estará disponible en `http://localhost:3001`

## Funcionalidades

- **Clientes**: CRUD de clientes (nombres, identificación, email, teléfono)
- **Planes**: CRUD de planes de seguro (nombre, tipo, prima base, cobertura máxima)
- **Pólizas**: CRUD de pólizas (número, fechas, prima mensual, estado, cliente, plan)
