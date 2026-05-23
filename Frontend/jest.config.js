module.exports = {
  testEnvironment: 'node', // Cumple la rúbrica (sin DOM)
  coverageReporters: ['html', 'text-summary'], // 'html' genera tu reporte visual clásico
  collectCoverageFrom: [
    'utils/**/*.js' // Solo evaluamos la lógica pura
  ],
  coverageDirectory: 'coverage',
};