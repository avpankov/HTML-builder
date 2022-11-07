const path = require('path');
const fs = require('node:fs/promises');
const { stat } = require('fs');

async function readFiles(src) {

  const files = await fs.readdir(src, { withFileTypes: true });

  for (let file of files) {
    stat(path.join(src, file.name), (err, stats) => {
      if (err) {
        console.log(err);
      } else {
        if (!stats.isDirectory()) {
          console.log(file.name.substring(0, file.name.lastIndexOf('.')) + '-' +
            path.extname(file.name).replace(/^\./, '') + '-' +
            convertBytes(stats.size));
        }
      }
    });
  }
}

function convertBytes(bytes) {
  const sizes = ['b', 'kb'];
  if (bytes === 0) return '0b';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes}${sizes[i]}`;
  return `${(bytes / (1024 ** i)).toFixed(2)}${sizes[i]}`;
}

readFiles(path.join(__dirname, 'secret-folder'));