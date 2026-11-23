# FROM node:18 as builder
# WORKDIR /usr/src/app
# COPY package.json package.json
# COPY . .
# RUN npm install
# RUN npm install vite
# RUN npm run build

# FROM nginx:1.23.1-alpine
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html


FROM node:22 as builder
WORKDIR /usr/src/app
# COPY package.json package.json
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm install vite
RUN npm run build

FROM nginx:1.23.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
