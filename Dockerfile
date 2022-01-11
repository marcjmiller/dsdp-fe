FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs16:16.5.0 AS builder

USER node

WORKDIR /home/node

COPY --chown=node:node . .

RUN npm run build

# Stage 2
FROM registry1.dso.mil/ironbank/opensource/nginx/nginx:1.21.1

WORKDIR /etc/nginx/html

USER nginx

COPY --from=builder --chown=nginx:nginx /home/node/build .

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]
