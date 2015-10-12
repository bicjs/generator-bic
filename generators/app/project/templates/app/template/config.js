'use strict';

var rootDir = require('app-root-path').path;
var os = require('os');
var path = require('path');
var fs = require('fs-extra');
var faker = require('faker');
var ips = require('img-placeholder-src')({
  serviceOverride: 'placeimg'
});

var rek = require('rekuire');

var logger = require('@flickmy/bic-logger').get('app/utils/template/config');

var flint = require('@flickmy/bic');
var cfg = flint.config.getAll();

var baseDir = path.join(rootDir, cfg.dir.source);
var mixins = fs.readFileSync(path.join(cfg.dir.root, cfg.dir.source, 'mixins.jade'), {
  encoding: 'utf-8'
});

var getFilePath = rek('app/template/plugins/get-file-path')({
  basePath: '/',
  manifestPath: path.join(cfg.dir.root, cfg.model.file.manifest)
});

var getFileContents = rek('app/template/plugins/get-file-contents')({
  basePath: rootDir
});

var config = {
  rootDir: rootDir,
  pageDir: cfg.dir.pages,
  moduleDir: cfg.dir.modules,
  process: {

    jade: [
      function prependMixins(source) {
        return mixins + os.EOL + source;
      }

    ],

    html: []
  },
  jade: {
    // compileDebug: true,
    // debug: true,
    doctype: 'html',
    pretty: false,
    basedir: baseDir,
    rootdir: rootDir,

    isProduction: cfg.ENV === cfg.envType.PRODUCTION,
    isRelease: cfg.release === true,

    // For constructing dynamic page links
    path: path,

    // logger.debug(data.module)
    logger: logger,

    // https://github.com/marak/Faker.js/#nodejs ==> faker.lorem.sentences()
    faker: faker,

    // https://github.com/matbrady/img-placeholder-src#usage ==> ips.src({ height: 100, width: 100 })
    ips: ips,

    // Helpers
    getFilePath: getFilePath,
    getFileContents: getFileContents
  }
};

module.exports = config;
