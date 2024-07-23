module.exports = {
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
