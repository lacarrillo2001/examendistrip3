# Sistema distribuido - Emisión de pólizas

Este repositorio implementa el caso de estudio **Cliente – PlanSeguro – Póliza** con un backend REST en Spring Boot 3 (Java 17), una interfaz web en React (CDN) y dos bases de datos (MySQL y PostgreSQL). El backend usa MySQL para `Cliente` y `PlanSeguro`, y PostgreSQL para `Póliza` con referencias lógicas a las dos entidades independientes.

## Arquitectura

- **Backend**: Spring Boot 3, RESTful.
- **Frontend**: React (CDN) con formularios CRUD.
- **Base de datos**:
  - MySQL: `clientes`, `planes_seguro`.
  - PostgreSQL: `polizas`.
- **Contenedores**: Docker + docker-compose.
- **Orquestación**: Kubernetes (manifiestos en `k8s/`).

## Endpoints REST

- `GET /api/clientes`
- `POST /api/clientes`
- `PUT /api/clientes/{id}`
- `DELETE /api/clientes/{id}`

- `GET /api/planes`
- `POST /api/planes`
- `PUT /api/planes/{id}`
- `DELETE /api/planes/{id}`

- `GET /api/polizas`
- `POST /api/polizas`
- `PUT /api/polizas/{id}`
- `DELETE /api/polizas/{id}`

## Variables de entorno

El backend requiere las siguientes variables:

```
MYSQL_URL=jdbc:mysql://mysql:3306/seguros
MYSQL_USER=root
MYSQL_PASSWORD=root
POSTGRES_URL=jdbc:postgresql://postgres:5432/polizas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## Ejecución con Docker Compose

```
docker compose up --build
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000

## Despliegue en Kubernetes

1. Construir y publicar imágenes:

```
docker build -t colina-backend:latest .
docker build -t colina-frontend:latest ./frontend
```

2. Cargar las imágenes en el clúster (ejemplo con kind):

```
kind load docker-image colina-backend:latest
kind load docker-image colina-frontend:latest
```

3. Aplicar manifiestos:

```
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

## Evidencias solicitadas

Incluye en tu reporte capturas de pantalla de:

- Pods en ejecución: `kubectl get pods`
- Services: `kubectl get services`
- Frontend funcionando en navegador
- Operaciones CRUD ejecutadas correctamente desde la interfaz

## Notas

- La validación de `clienteId` y `planSeguroId` se realiza en el backend antes de emitir una póliza.
- En PostgreSQL se guardan las referencias lógicas (`clienteId`, `planSeguroId`).
