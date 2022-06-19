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
          const writeStream = process.stdout;
          readStream.setRawMode(true);
          readStream.resume();
          readStream.setEncoding("utf8"); // set encoding to utf8 for proper handling of special characters
          readStream.on("data", (key) => { // since we are in raw mode, node won't terminate the process on ctrl+c
               if (key === '\u0003') { // if ctrl+c
                    log.info("CTRL+C was pressed, exiting...");
                    process.exit();
               } else {
                    writeStream.write(key);
               }
          });

     },
     check: () => {
          return tty.isatty(process.stdin.fd);
     }
};