# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

# Perhatikan path hasil build terbaru Angular (dist/wms-fe)
COPY --from=build /app/dist/wms-fe ./dist/wms-fe

EXPOSE 4000

# Menjalankan server SSR
CMD ["node", "dist/wms-fe/server/server.mjs"]