const LoggingLib = require('@tymianekpl/LoggingLib');
const fs = require('fs');
const tty = require('./tty');

const log = new LoggingLib({
     category: "Autonode/Server",
     writeToFile: false
})

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

     log.info(`Starting node ${src}...`);
     // start node src
     const node = require('child_process').fork(src);
     log.success(`Node ${src} started`);
     node.on("exit", (code) => {
          if(code === 0)
               log.success(`Node ${src} exited with code ${code}`);
          else
               log.error(`Node ${src} exited with code ${code}`);
     });
};

module.exports = start;