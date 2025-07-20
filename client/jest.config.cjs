module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};
