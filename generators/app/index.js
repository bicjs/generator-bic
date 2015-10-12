'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var sequence = require('gulp-sequence');

var slush = require('../../slushfile.js');

module.exports = yeoman.generators.Base.extend({
  greet: function() {

    this.log('Welcome to the ' + chalk.red('Bic') + ' generator.');
  },

  exec: function() {

    var done = this.async();

    sequence('default')(function() {
      this.log(chalk.red('✔ Done'));
      done();
    }.bind(this));
  }
});
