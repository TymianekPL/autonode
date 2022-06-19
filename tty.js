const tty = require('node:tty');

module.exports = {
     enable: () => {
          const readStream = process.stdin;
          const writeStream = process.stdout;
          readStream.setRawMode(true);
          readStream.resume();
          readStream.setEncoding('utf8');
          readStream.on('data', (key) => {
               if (key === '\u0003') {
                    console.log('Exiting...');
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