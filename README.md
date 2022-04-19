## Dependencies
- [Earthly](https://earthly.dev/get-earthly)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker-compose](https://docs.docker.com/compose/install/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)


## To get started with Development
### Requirements
  - Docker ([Ubuntu here](https://docs.docker.com/engine/install/ubuntu/))
  - Docker-compose version 1.28.0 or later ([here](https://docs.docker.com/compose/install/))
  - Earthly (instructions [here](https://earthly.dev/get-earthly))
  - Yarn ([here](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable))
  - The frontend relies on the backend in order to make API calls and store data. View the following section for instructions on running both environments together.  
### Running the development environment
- Clone the Frontend and Backend repos
  - `git clone https://code.il2.dso.mil/platform-one/products/gvsc/sec/dsdp/frontend.git`
  - `git clone https://code.il2.dso.mil/platform-one/products/gvsc/sec/dsdp/backend.git`
- Change directory into the frontend: `cd frontend`
- Run `yarn build-dev-images` to build container images for developing
- Run `yarn server` to bring up docker-compose

## Run tests
- If you haven't already, run `yarn build-dev-images` to build the container images (needed for e2e tests)
- Run `yarn test` to run unit tests
- Run `yarn test:e2e` to run end-to-end tests

## Linting/Formatting runs as a job on every commit.
- Alternatively, run `yarn format` or `yarn lint` to do it manually
