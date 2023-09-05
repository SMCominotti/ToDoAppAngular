
# Etapa 1: Construir la aplicación Angular
FROM node:16-alpine AS build

# Establecer un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Compilar la aplicación Angular en modo de producción
RUN npm run build --prod

RUN ls -alt

# Etapa 2: Crear la imagen de Nginx para servir la aplicación
FROM nginx:1.17.1-alpine

# Copiar los archivos de la etapa de construcción (etapa 1) al directorio de Nginx
COPY --from=build /usr/src/app/dist/to-do-app /usr/share/nginx/html

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
# Opcional: Exponer el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# El comando CMD de Nginx por defecto arrancará Nginx automáticamente
