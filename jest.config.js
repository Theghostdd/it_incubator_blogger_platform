/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/e2e/modules/",
    "/__tests__/Dto",
    "/__tests__/integration/modules/",
  ],
  testTimeout: 10000
};