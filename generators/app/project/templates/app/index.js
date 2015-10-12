'use strict';

/*=============================
=            Setup            =
=============================*/

// Config
var cfg = require('@flickmy/bic').config
  .init()
  .getAll();

// Removes need for icky relative paths
var rek = require('rekuire');

// Ignoring these will speed things up a lot!
rek.ignore(
  cfg.packages.node,
  cfg.packages.bower,
  cfg.packages.local,
  cfg.dir.generated,
  cfg.dir.temp,
  cfg.dir.dist
);

// Server
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var cacheResponseDirective = require('express-cache-response-directive');

// Logger
var logger = require('@flickmy/bic-logger').get('app');

// Custom middelwares
var auth = rek('app/middlewares/auth');

// Routers
var webRouter = rek('app/routers/web');

/*-----  End of Setup  ------*/

/*===============================
=            Startup            =
===============================*/

// Send options
var oneMinute = 1000 * 60;
var oneHour = oneMinute * 60;
var oneDay = oneHour * 24;
var oneYear = oneDay * 365;

// App
var app = express();
app.use(morgan('dev'));

// Custom middlewares
app.use(auth);

// Middlewares
app.use(compression());
app.use(cacheResponseDirective());
app.use(express.static(cfg.dir.dest, {
  maxAge: oneYear
}));

// Routers
app.use(webRouter(express, {
  maxAge: oneMinute * 5
}));

app.set('port', process.env.PORT || 3002);
app.listen(app.get('port'), function() {
  logger.info('Started on PORT', app.get('port'));
});

// Warm up the cache
logger.info('Warming cache');
var template = rek('app/template');
template('', {});

/*-----  End of Startup  ------*/
