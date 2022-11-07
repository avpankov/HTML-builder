const path = require('path');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises');


buildPage();

async function buildPage() {

  await fsPromises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });

  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

  await fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'), 0);

  let data = await fsPromises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf8');

  const components = await fsPromises.readdir(path.join(__dirname, 'components'));

  for (let component of components) {
    if (path.extname(path.join(__dirname, 'components', component)) === '.html') {
      const componentData = await fsPromises.readFile(path.join(__dirname, 'components', component), 'utf8');
      data = data.replace(`{{${component.substring(0, component.lastIndexOf('.'))}}}`, componentData);
    } else {
      console.log(`Component ${component} is not html file`);
    }
  }

  await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data);
  mergeStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
  copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

async function mergeStyles(src, dest) {
  const writeStream = fs.createWriteStream(dest);
  const styles = await fsPromises.readdir(src, { withFileTypes: true });
  for (let style of styles) {
    if (path.extname(style.name) === '.css') {
      const readStyle = fs.createReadStream(path.join(src, style.name), 'utf8');
      readStyle.on('data', chunk => {
        writeStream.write(`${chunk.toString()}\n`);
      });
    }
  }
}

async function copyAssets(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  const assets = await fsPromises.readdir(src, { withFileTypes: true });
  for (let asset of assets) {
    if (asset.isDirectory()) {
      copyAssets(path.join(src, asset.name), path.join(dest, asset.name));
    } else {
      fsPromises.copyFile(path.join(src, asset.name), path.join(dest, asset.name));
    }
  }
}