const {defaults} = require('jest-config')
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testEnvironment: "jsdom",
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};

module.exports = config;