FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs16:16.13.1 AS builder

USER node

WORKDIR /home/node

COPY --chown=node:node . .

ENV REACT_APP_BASE_URL=https://dsdp.staging.dso.mil/backend

RUN INLINE_RUNTIME_CHUNK=false npm run build

# Stage 2
FROM registry1.dso.mil/ironbank/opensource/nginx/nginx:1.21.4

WORKDIR /etc/nginx/html

USER nginx

COPY --from=builder --chown=nginx:nginx /home/node/build .

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]
