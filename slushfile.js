'use strict';

var path = require('path');
var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var inquirer = require('inquirer');
var _ = require('lodash');

var prompts = require('./generators/app/project/prompts')({
  project: {
    name: path.basename(process.cwd()),
    title: path.basename(process.cwd())
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
          '!**/.DS_Store'
        ], {
          cwd: path.join(__dirname, 'generators/app/project/templates'),
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
