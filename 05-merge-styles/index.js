const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function mergeStyles() {
  const styles = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  for (let style of styles) {
    if (path.extname(style.name) === '.css') {
      const readStyle = fs.createReadStream(path.join(__dirname, 'styles', style.name), 'utf8');
      readStyle.on('data', chunk => {
        writeStream.write(`${chunk.toString()}\n`);
      });
    }
  }
}

mergeStyles();