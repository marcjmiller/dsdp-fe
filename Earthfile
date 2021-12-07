FROM node:16-alpine
WORKDIR /app

deps:
  COPY package.json tsconfig.json yarn.lock ./
  RUN yarn install
  COPY src/ src/
  COPY public/ public/

test:
  FROM +deps
  RUN yarn test --watchAll=false

build:
  FROM +deps
  RUN yarn build
  SAVE ARTIFACT build/

build-dev-image:
  FROM +deps
  ENTRYPOINT ["yarn", "start"]
  SAVE IMAGE frontend:dev-build

run-dev:
  LOCALLY
  RUN earthly +build-dev-image
  RUN docker-compose up
