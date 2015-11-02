/**
 * @fileoverview Returns the minfied contents of the file path. Accepts a single
 * path or an array of paths.
 */

'use strict';

var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var minify = require('html-minifier').minify;
var uglify = require('uglify-js');
var csso = require('csso');

var logger = require('@flickmy/bic-logger').get('Get File Contents');

var readFileSync = _.memoize(function(filePath) {

  return fs.readFileSync(filePath, {
    encoding: 'utf-8'
  });
});

var getMinifiedContents = _.memoize(function(filePath) {

  var contents = readFileSync(filePath);
  var ext = path.extname(filePath);

  if (ext === '.js') {

    logger.debug('Uglify JS');

    contents = uglify.minify(contents, {
      fromString: true
    }).code;

  } else if (ext === '.css') {

    logger.debug('Optimize CSS');

    contents = csso.justDoIt(contents);

  } else if (ext === '.html' || ext === '.svg') {

    logger.debug('Minify Markup');

    contents = minify(contents);

  } else {

    contents = contents.toString().replace(/\s+/g, '');
  }

  return contents;
});

module.exports = function getFileContents(options) {

  var basePath = options.basePath || '';

  function getFile(filePath) {

    filePath = path.join(basePath, filePath);

    logger.info(filePath);

    return getMinifiedContents(filePath);
  }

  return function(filePath) {

    if (Array.isArray(filePath)) {

      return filePath.reduce(function(fileContents, filePath) {

        return fileContents += getFile(filePath);
      }, '');

    } else {

      return getFile(filePath);
    }
  };
};
