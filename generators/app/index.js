'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var sequence = require('gulp-sequence');

/**
 * Require Slushfile with `default` task
 */
require('../../slushfile.js');

module.exports = yeoman.generators.Base.extend({

  /**
   * Hi...
   */
  greet: function() {

    this.log('Welcome to the ' + chalk.red('Bic') + ' generator.');
  },

  /**
   * Do stuff...
   */
  exec: function() {

    var done = this.async();

    sequence('default')(function() {

      this.log(chalk.red('✔ Done'));

      done();

    }.bind(this));
  }
});
