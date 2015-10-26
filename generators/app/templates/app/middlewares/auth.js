'use strict';

var bic = require('@flickmy/bic');
var cfg = bic.config.getAll();

var basicAuth = require('basic-auth');
var conditional = require('express-conditional-middleware');

var logger = require('@flickmy/bic-logger').get('middleware/auth');

var whitelist = cfg.AUTH_HOST_WHITELIST ? cfg.AUTH_HOST_WHITELIST
  .split(',')
  .reduce(function(obj, key) {
    obj[key] = true;
    return obj;
  }, {}) : null;

module.exports = conditional(

  function(req) {

    var host = req.get('host');

    logger.debug('host', host);

    if (whitelist === null) {

      return false;

    } else {

      logger.debug(whitelist[host] ? 'Whitelisted host ==> disable auth' : 'Blacklisted host ==> enable auth');

      return whitelist[host] === true ? false : true;
    }
  },

  function(req, res, next) {

    function unauthorized(res) {

      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');

      return res.sendStatus(401);
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {

      return unauthorized(res);
    }

    if (user.name === cfg.AUTH_USERNAME && user.pass === cfg.AUTH_PASSWORD) {

      return next();

    } else {

      return unauthorized(res);
    }
  }

);
