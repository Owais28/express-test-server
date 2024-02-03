const fs = require('fs');
const readline = require('readline');

function readFileLineByLine(filePath, callback) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: readStream });

    rl.on('line', async (line) => {
      try {
        await callback(line);
      } catch (error) {
        // Handle errors during line processing
        console.error(`Error processing line: ${error.message}`);
        reject(error);
      }
    });

    rl.on('close', () => {
      // File reading completed
      resolve();
    });

    readStream.on('error', (error) => {
      // Handle file read error
      console.error(`Error reading file: ${error.message}`);
      reject(error);
    });
  });
}

module.exports = readFileLineByLine;
