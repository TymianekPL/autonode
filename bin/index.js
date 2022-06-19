#! /usr/bin/env node

const LoggingLib = require('@tymianekpl/LoggingLib');
const UsageError = require('../UsageError');

const options = {
     src: null,
     tty: true
};

const log = new LoggingLib({
     category: "Autonode/Main",
     writeToFile: false
});

try {
     // check if package was ran or required
     if (module === require.main) {
          // start the server
          const server = require('../server');
          if (process.argv.length <= 2)
               throw new UsageError('No source specified');
          options.src = process.argv[2];
          server(options);
     } else {
          // export the function
          module.exports = (src) => {
               // start the server
               const server = require('../server');
               server(Object.assign({}, options, {src}));
          };
     }

} catch (err) {
     if (err instanceof UsageError) {
          log.error(err.message);
          log.error("Usage: node index.js <source>");
     } else {
          log.error(err);
     }
}