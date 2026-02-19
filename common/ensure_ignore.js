const fs = require('fs');
const path = require('path');

const IGNORE_FILES = [
  'node_modules',
  '.env',
  '.DS_Store',
  'coverage',
  'dist',
  'package-lock.json',
  '.git',
  '.github',
  '.idea',
  '.vscode'
];

const IGNORE_CONTENT = IGNORE_FILES.join('\n') + '\n';

async function main() {
  const skillsDir = path.resolve(__dirname, '../../skills');
  const skills = fs.readdirSync(skillsDir);

  for (const skill of skills) {
    const skillPath = path.join(skillsDir, skill);
    if (!fs.statSync(skillPath).isDirectory()) continue;
    if (skill === 'common') continue; // Skip common lib for now

    const ignorePath = path.join(skillPath, '.npmignore');
    let currentContent = '';

    if (fs.existsSync(ignorePath)) {
      currentContent = fs.readFileSync(ignorePath, 'utf8');
    }

    let newContent = currentContent;
    let modified = false;

    // Check if critical items are missing
    if (!currentContent.includes('node_modules')) {
      newContent += '\nnode_modules\n';
      modified = true;
    }
    if (!currentContent.includes('.env')) {
      newContent += '\n.env\n';
      modified = true;
    }

    // Also verify package-lock.json exclusion for clean publishes
    if (!currentContent.includes('package-lock.json')) {
        newContent += '\npackage-lock.json\n';
        modified = true;
    }

    if (modified || !fs.existsSync(ignorePath)) {
      console.log(`[UPDATE] Adding .npmignore rules to ${skill}`);
      fs.writeFileSync(ignorePath, newContent.trim() + '\n');
    }
  }
}

main().catch(console.error);
