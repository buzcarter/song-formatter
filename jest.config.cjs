const { resolve } = require('path');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/js/**/*.js',
    '<rootDir>/src/js/**/*.ts',
  ],
  coveragePathIgnorePatterns: [
    '/__tests__/',
    '/data/',
    '/interfaces/',
    '/vendor/',
  ],
  coverageReporters: [
    'lcov',
    'text',
    'text-summary',
  ],
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 40,
      functions: 40,
      lines: 40,
    },
  },
  rootDir: resolve(__dirname, './'),
  setupFilesAfterEnv: [],
  testMatch: [
    '<rootDir>/src/js/**/__tests__/**/*.test.js',
  ],
};
