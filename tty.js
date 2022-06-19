const LoggingLib = require('@tymianekpl/LoggingLib');
const tty = require('node:tty');

const log = new LoggingLib({
     category: "Autonode/tty",
     writeToFile: false
});

module.exports = {
     enable: () => {
          // enable tty
          const readStream = process.stdin;
          readStream.setRawMode(true);
     },
     check: () => {
          return tty.isatty(process.stdin.fd);
     }
};