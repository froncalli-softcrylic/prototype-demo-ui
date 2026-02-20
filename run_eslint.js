const fs = require('fs');
const cp = require('child_process');

try {
  const result = cp.execSync('npx eslint "src/**/*.{ts,tsx}" --format json', { encoding: 'utf-8' });
  console.log('Lint passed');
} catch (error) {
  const errorsOutput = error.stdout;
  fs.writeFileSync('lint_results.json', errorsOutput, 'utf-8');
  console.log('Lint errors saved to lint_results.json');
}
