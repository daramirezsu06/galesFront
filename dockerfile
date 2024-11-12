# Paso 1: Definir la imagen base
FROM node:18-alpine

# Paso 2: Crear y establecer el directorio de trabajo
WORKDIR /app

# Paso 3: Copiar el package.json y el package-lock.json (si existe)
COPY package.json package-lock.json ./

# Paso 4: Instalar las dependencias
RUN npm install

# Paso 5: Copiar el resto del código fuente
COPY . .

# Paso 6: Construir la aplicación Next.js
RUN npm run build

# Paso 7: Exponer el puerto en el que corre Next.js
EXPOSE 3000

# Paso 8: Ejecutar la aplicación Next.js
CMD ["npm", "start"]
