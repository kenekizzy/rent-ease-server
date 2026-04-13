const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts', { encoding: 'utf-8' });
  fs.writeFileSync('mig-output.txt', output);
} catch (e) {
  fs.writeFileSync('mig-output.txt', e.stdout + '\n' + e.stderr + '\n' + e.message);
}
