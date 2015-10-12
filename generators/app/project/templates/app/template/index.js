'use strict';

var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var rek = require('rekuire');

var logger = require('@flickmy/bic-logger').get('app/utils/template');

var bic = require('@flickmy/bic');
var cfg = bic.config.getAll();

var Render = require('@flickmy/bic-template');
var render = new Render(rek('app/template/config'));

var pageData = cfg.model;
var cache = {};

function getJson(filepath) {

  if (!cache[filepath]) {

    var data = fs.readJsonSync(filepath);
    cache[filepath] = data;
  }

  return cache[filepath];
}

var getJson = _.memoize(function(filepath) {
  return fs.readJsonSync(filepath);
});

module.exports = function(filePath, req) {

  // Absolute path to template file.
  var pagePath = path.join(cfg.dir.root, cfg.dir.pages, filePath);

  // Template data path. Basically appending config.json to the path above.
  var templateDataPath = path.join(pagePath, cfg.templates.page.config);

  // Template data
  pageData.config = getJson(templateDataPath);
  pageData.query = req.query;
  pageData.dynamic = req.dynamic;

  logger.info('Found Jade file at:', pagePath);

  return render.page.html(filePath, pageData);
};
