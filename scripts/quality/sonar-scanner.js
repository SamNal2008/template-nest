import sonarqubeScanner from 'sonarqube-scanner';

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.test.inclusions':
        'src/**/*.spec.ts,src/**/*.spec.ts,src/**/*.test.js,src/**/*.test.ts',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      'sonar.login': 'd6596e8b90ee5860b90ae41cc75589e9b57397d4',
    },
  },
  () => console.error('Sonar could not be launched'),
);
