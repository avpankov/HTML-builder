const path = require('path');
const fs = require('node:fs/promises');
const { mkdir } = require('node:fs/promises');

async function copyDir(src, dest) {
  await fs.rm(dest, { recursive: true, force: true });

  await mkdir(dest, { recursive: true });
  const files = await fs.readdir(src, { withFileTypes: true });
  for (let file of files) {
    if (file.isDirectory()) {
      copyDir(path.join(src, file.name), path.join(dest, file.name));
    } else {
      fs.copyFile(path.join(src, file.name), path.join(dest, file.name), 0, (err) => {
        console.log(err);
      });
      console.log(`File ${file.name} copied`);
    }
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));