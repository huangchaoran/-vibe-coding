module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/config/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    '^./middlewares/auth$': '<rootDir>/tests/__mocks__/authMiddleware.js',
    '^./middlewares/rateLimit$': '<rootDir>/tests/__mocks__/rateLimit.js',
    '^../middlewares/auth$': '<rootDir>/tests/__mocks__/authMiddleware.js',
    '^../middlewares/rateLimit$': '<rootDir>/tests/__mocks__/rateLimit.js',
    '^./wechatService$': '<rootDir>/tests/__mocks__/wechatService.js',
    '^../services/wechatService$': '<rootDir>/tests/__mocks__/wechatService.js',
    '^./services/wechatService$': '<rootDir>/tests/__mocks__/wechatService.js'
  }
};