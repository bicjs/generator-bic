'use strict';

var path = require('path');
var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var inquirer = require('inquirer');
var _ = require('lodash');

var projectName = path.basename(process.cwd());

var prompts = require('./generators/app/prompts')({
  project: {
    name: projectName,
    title: projectName
      .split('-')
      .reduce(function(title, word) {
        title.push(_.capitalize(word));
        return title;
      }, [])
      .join(' ')
  }
});

gulp.task('default', function(done) {
  inquirer.prompt(prompts,

    function(answers) {

      console.log('answers', answers);

      gulp.src([
          '**',
          '!**/.DS_Store',
          '!**/node_modules',
          '!**/bower_components',
          '!**/generated',
          '!**/dist',
          '!**/.tmp',
          '!**/*.log'
        ], {
          cwd: path.join(__dirname, 'generators/app/templates'),
          dot: true
        }) // Note use of __dirname to be relative to generator
        .pipe(template(answers)) // Lodash template support
        .pipe(conflict('./')) // Confirms overwrites on file conflicts
        .pipe(gulp.dest('./')) // Without __dirname here = relative to cwd
        .pipe(install()) // Run `bower install` and/or `npm install` if necessary
        .on('end', function() {
          done(); // Finished!
        })
        .resume();
    });
});
