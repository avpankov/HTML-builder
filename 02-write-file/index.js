const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output, stdin } = require('process');

const rl = readline.createInterface({ input, output });

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.pipe(writeStream);

rl.question('File text.txt was created. Add something: ', (input) => {
  if (input === 'exit') {
    exit();
  }
  console.log(`Received: ${input}`);
});

rl.on('line', (input) => {
  if (input === 'exit') {
    exit();
  };
  console.log(`Received: ${input}`);
});

rl.on('close', () => {
  exit();
});

function exit() {
  console.log('Goodbye 👋');
  process.exit(0);
}