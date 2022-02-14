## Dependencies
- [Earthly](https://earthly.dev/get-earthly)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker-compose](https://docs.docker.com/compose/install/)


## To get started with Development
- Clone the Repo
- Run `yarn build-dev-images` to build container images for developing
- Run `yarn server` to bring up docker-compose

## Run tests
- If you haven't already, run `yarn build-dev-images` to build the container images (needed for e2e tests)
- Run `yarn test` to run unit tests
- Run `yarn test:e2e` to run end-to-end tests

## Linting/Formatting runs as a job on every commit.
- Alternatively, run `yarn format` or `yarn lint` to do it manually
