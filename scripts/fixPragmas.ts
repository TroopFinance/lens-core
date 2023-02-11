import fs from 'fs/promises';
import path from 'path';

async function fixPragmas(rootDir: string) {
  const rootDirEntries = await fs.readdir(rootDir, {
    withFileTypes: true,
  });
  for (const entry of rootDirEntries) {
    if (entry.isFile() && entry.name.endsWith('.sol')) {
      const fullFilePath = path.resolve(rootDir, entry.name);
      const content = await fs.readFile(fullFilePath, {
        encoding: 'utf-8',
      });
      const lines = content.split('\n').map((line) => {
        if (line.startsWith('pragma solidity')) {
          return 'pragma solidity ^0.8;';
        }

        return line;
      });
      await fs.writeFile(fullFilePath, lines.join('\n'), {
        encoding: 'utf-8',
      });
    }

    if (entry.isDirectory()) {
      await fixPragmas(path.resolve(rootDir, entry.name));
    }
  }
}

fixPragmas(path.resolve(__dirname, '../contracts'))
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
