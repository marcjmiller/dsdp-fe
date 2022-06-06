VERSION 0.6
FROM node:16-alpine
WORKDIR /app

test:
  RUN yarn test --watchAll=false

build-dev-image:
  ENTRYPOINT ["yarn", "start"]
  SAVE IMAGE frontend:dev-build

build-dev:
  BUILD +build-dev-image
  LOCALLY
  RUN yarn build-backend
  RUN yarn install
