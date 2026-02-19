const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function findEnvFile(startDir) {
  let currentDir = startDir;
  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, '.env');
    if (fs.existsSync(envPath)) {
      return envPath;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

function load() {
  const envPath = process.env.ENV_PATH || findEnvFile(__dirname) || findEnvFile(process.cwd());

  if (envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.warn(`[EnvLoader] Failed to parse .env file at ${envPath}:`, result.error);
    } else {
      // console.log(`[EnvLoader] Loaded environment from ${envPath}`);
    }
    return result.parsed;
  } else {
    console.warn('[EnvLoader] No .env file found in parent directories.');
    return {};
  }
}

// Auto-load on require if desired, or just export the loader
const parsed = load();

module.exports = {
  load,
  parsed
};
