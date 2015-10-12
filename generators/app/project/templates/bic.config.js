'use strict';

// Project specific configuration

var fs = require('fs-extra');
var path = require('path');

module.exports = function(cfg) {

  // TODO: Read and assign contents of inputs and generated files to data model

  return {

    // Data model
    model: {
      site: fs.readJsonSync(path.join(cfg.dir.inputs, 'data', 'site.json')),
      file: {
        icons: path.join(cfg.dir.generated, 'svg', 'icons.svg'),
        modernizr: path.join(cfg.dir.generated, 'js', 'modernizr.js'),
        version: path.join(cfg.dir.generated, 'json', 'version.json'),
        manifest: path.join(cfg.dir.generated, 'json', 'manifest.json')
      }
    },

    // Plugin specific

    plugins: {
      autoprefixer: {
        browsers: [
          '> 1%',
          'Last 2 versions'
        ]
      }
    }
  };
};
