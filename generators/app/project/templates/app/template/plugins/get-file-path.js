'use strict';

var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

var logger = require('@flickmy/bic-logger').get('Get File Path');

module.exports = function getFilePath(options) {

  var basePath = options.basePath || '';

  var manifest = {};

  if (options.manifestPath !== undefined) {

    try {

      manifest = fs.readJsonSync(options.manifestPath);

    } catch (err) {

      logger.debug('Manifest file specified, but not found.');
    }
  }

  logger.debug('Revisioned file manifest', manifest);

  manifest = _.mapValues(manifest, function(val) {

    return path.join(basePath, val);
  });

  return function(filePath) {

    return manifest[path.relative(basePath, filePath)] || filePath;
  };
};
