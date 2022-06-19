const fs = require('fs');
const tty = require('./tty');

/**
 *
 * @param {{ src: string, tty: true }} options
*/
const start = (options) => {
     if (typeof options === "undefined")
          throw new Error("No options specified");
     let {src} = options;
     if (!src) {
          throw new Error('No source specified');
     }
     if (!fs.existsSync(src)) {
          throw new Error(`Source ${src} does not exist`);
     }
     if (fs.statSync(src).isDirectory())
          src = `${src}/index.js`;
     if (!fs.existsSync(src)) {
          throw new Error(`Source ${src} does not exist`);
     }

     if (options.tty && !tty.check())
          throw new Error('TTY is not supported');
     tty.enable();

     let folder;
     folder = src.split(/[\\\/]/);
     folder.pop();
     folder = folder.join("/");

     let isReloading = true;
     setTimeout(() => {
          run(options);
          isReloading = false;
     }, 100);

     fs.watch(folder, (event, filename) => {
          if (isReloading) return;
          isReloading = true;
          if (filename.endsWith('.js')) {
               console.log(`${filename}: ${event}`);
               setTimeout(() => {
                    run(options);
                    isReloading = false;
               }, 100);
          }
     });
};

const run = (options) => {
     if (typeof options === "undefined")
          throw new Error("No options specified");
     const {src} = options;

     // start node src
     const node = require('child_process').fork(src);
     node.on("exit", (code) => {
          console.log(`Node exited with code ${code}`);
     });
};

module.exports = start;