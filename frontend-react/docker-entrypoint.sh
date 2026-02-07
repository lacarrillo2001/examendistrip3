#!/bin/sh

# Script que inyecta las variables de entorno en el JS de React en runtime
# Esto permite configurar la URL del API sin tener que rebuild la imagen

# Crear archivo de configuración con las variables de entorno
cat <<EOF > /usr/share/nginx/html/env-config.js
window.REACT_APP_API_BASE = "${REACT_APP_API_BASE:-http://localhost:8080/api}";
EOF

# Inyectar el script en index.html si no existe
if ! grep -q "env-config.js" /usr/share/nginx/html/index.html; then
    sed -i 's|<head>|<head><script src="/env-config.js"></script>|g' /usr/share/nginx/html/index.html
fi

# Ejecutar nginx
exec "$@"
