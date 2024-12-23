import importLocal from 'import-local';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!importLocal(import.meta.url)) {
  const jestPath = resolve(__dirname, 'node_modules', 'jest-cli', 'bin', 'jest.js');

  execFile('node', ['--experimental-vm-modules', jestPath], (error, stdout, stderr) => {
    if (error) {
      console.error('Ошибка запуска Jest:', error);
      process.exit(error.code);
    } else {
      console.log(stdout);
      console.error(stderr);
    }
  });
}