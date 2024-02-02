const fs = require('fs');
const readline = require('readline');

/**
 * Read a file line by line and invoke a callback for each line.
 * @param {string} filePath - The path of the file to read.
 * @param {function} callback - The callback function to invoke for each line.
 * @returns {Promise} A promise that resolves when the file reading is completed.
 */
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
