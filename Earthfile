VERSION 0.6
FROM node:16-alpine
WORKDIR /app

test:
  RUN yarn test --watchAll=false

build-dev-image:
  ENTRYPOINT ["yarn", "start"]
  SAVE IMAGE frontend:dev-build

run-dev:
  LOCALLY
  BUILD +build-dev-image
  RUN yarn build-backend
  RUN yarn install
  RUN docker compose up
