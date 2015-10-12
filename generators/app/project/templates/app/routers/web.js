'use strict';

var path = require('path');
var fs = require('fs');
var errorHandler = require('errorhandler');
var rek = require('rekuire');

var logger = require('@flickmy/bic-logger').get('routers/web');

var bic = require('@flickmy/bic');
var cfg = bic.config.getAll();

var template = rek('app/template');

var pageNames = [];

// Get the name of each page to check for 404s.
pageNames = fs
  .readdirSync(cfg.dir.pages)
  .filter(function(file) {

    // https://stackoverflow.com/questions/8905680/nodejs-check-for-hidden-files
    if ((/(^|.\/)\.+[^\/\.]/g).test(file) === false) {

      return fs.statSync(path.join(cfg.dir.root, cfg.dir.pages, file)).isDirectory();
    }
  });

module.exports = function(express, sendOptions) {

  var router = express.Router();

  // Index Page
  router.get('/', function(req, res) {

    res.cacheControl(sendOptions);
    res.send(template('', req));

  });

  // Static Page
  router.get('/:page', function(req, res, next) {

    logger.info('Page', req.params.page);

    if (pageNames.indexOf(req.params.page) > -1) {

      res.cacheControl(sendOptions);
      res.send(template(req.params.page, req));

    } else {

      next();
    }
  });

  // CMS Page
  router.get('/:page/:id', function(req, res, next) {

    var cmsPageDataKey = path.join(req.params.page, req.params.id);

    if (cfg.model.cms.active.pages[cmsPageDataKey]) {

      res.cacheControl(sendOptions);

      res.send(template(path.join(req.params.page, 'template'), req, cmsPageDataKey));

    } else {

      next();
    }
  });

  router.use(function(req, res) {

    res.status(404).send(template('404', req));
  });

  // Handle errors
  if (cfg.NODE_ENV === cfg.envType.DEVELOPMENT) {

    router.use(errorHandler());

  } else {

    // Express requires the `next` parameter to be there even if it's not used.
    // Without it, this middleware won't be used as an error handler.

    router.use(function(err, req, res, next) {// jshint ignore:line

      logger.error(err.stack);

      res.status(500).send(template('500', req));
    });
  }

  return router;
};
