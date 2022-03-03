## Dependencies
- [Earthly](https://earthly.dev/get-earthly)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker-compose](https://docs.docker.com/compose/install/)


## To get started with Development
### Requirements
  - Docker ([Ubuntu here](https://docs.docker.com/engine/install/ubuntu/))
  - Docker-compose version 1.28.0 or later ([here](https://docs.docker.com/compose/install/))
  - Earthly (instructions [here](https://earthly.dev/get-earthly))
  - Yarn ([here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable))
  - The frontend relies on the backend in order to make API calls and store data. A requirement for the frontend is to have the backend image built and tagged as `backend:dev-image`. Do this by changing directory to the backend and running `earthly +build-dev-image` 
### Running the development environment
- Clone the Repo
- Run `earthly +run-dev` to build container images for developing and start the whole project.

## Run tests
- If you haven't already, run `yarn build-dev-images` to build the container images (needed for e2e tests)
- Run `yarn test` to run unit tests
- Run `yarn test:e2e` to run end-to-end tests

## Linting/Formatting runs as a job on every commit.
- Alternatively, run `yarn format` or `yarn lint` to do it manually
