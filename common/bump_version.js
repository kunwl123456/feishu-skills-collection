const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.log('Usage: node bump_version.js <skill-name>');
  process.exit(1);
}

const skillName = process.argv[2];
const packagePath = path.resolve(__dirname, `../../skills/${skillName}/package.json`);

if (!fs.existsSync(packagePath)) {
  console.error(`Skill ${skillName} not found at ${packagePath}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = pkg.version.split('.');
version[2] = parseInt(version[2]) + 1;
pkg.version = version.join('.');

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Bumped ${skillName} to version ${pkg.version}`);
