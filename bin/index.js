#! /usr/bin/env node

const UsageError = require('../UsageError');

const options = {
     src: null,
     tty: true
};

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
          console.error(err.message);
          console.error('Usage: node server.js <source>');
     } else {
          console.error(err);
     }
}