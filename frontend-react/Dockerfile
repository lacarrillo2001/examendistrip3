# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build
COPY --from=build /app/build /usr/share/nginx/html

# Copiar el script de entrada que inyecta las variables de entorno
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
