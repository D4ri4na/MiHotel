module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'components/**/*.js',
    'utils/**/*.js',
    '!vendor/**', 
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage',
        filename: 'report.html',
        pageTitle: 'Test Report',
        expand: true,
        openReport: false
      }
    ]
  ]
};