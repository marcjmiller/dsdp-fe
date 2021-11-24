FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs16:16.5.0 AS builder

USER node

WORKDIR /home/node
COPY --chown=node:node . .
EXPOSE 8080
RUN npm run build

# Stage 2
FROM registry1.dso.mil/ironbank/opensource/nginx/nginx:1.21.1
USER nginx

COPY --from=builder --chown=nginx:nginx /home/node/build /var/www
COPY --from=builder --chown=nginx:nginx /home/node/src /app/src

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]
