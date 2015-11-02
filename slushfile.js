'use strict';

var path = require('path');
var gulp = require('gulp');
var sequence = require('gulp-sequence');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var inquirer = require('inquirer');
var _ = require('lodash');

var _projectName = path.basename(process.cwd());

var _answers;

var _globPatterns = [
  '**/*',
  '!**/node_modules/**',
  '!**/bower_components/**',
  '!**/generated/**',
  '!**/dist/**',
  '!**/.tmp/**',
  '!**/.DS_Store',
  '!**/*.log'
];

var prompts = require('./generators/app/prompts')({
  project: {
    name: _projectName,
    title: _projectName
      .split('-')
      .reduce(function(title, word) {
        title.push(_.capitalize(word));
        return title;
      }, [])
      .join(' ')
  }
});

gulp.task('copy', function() {

  return gulp.src(_globPatterns, {
      cwd: path.join(__dirname, 'generators/app/src'),
      dot: true
    }) // Note use of __dirname to be relative to generator
    .pipe(conflict('./')) // Confirms overwrites on file conflicts
    .pipe(gulp.dest('./')) // Without __dirname here = relative to cwd
});

gulp.task('template', function() {

  return gulp.src(_globPatterns, {
      cwd: path.join(__dirname, 'generators/app/templates'),
      dot: true
    }) // Note use of __dirname to be relative to generator
    .pipe(template(_answers)) // Lodash template support
    .pipe(conflict('./')) // Confirms overwrites on file conflicts
    .pipe(gulp.dest('./')) // Without __dirname here = relative to cwd
});

gulp.task('install', function() {

  return gulp.src([
      'package.json',
      'bower.json'
    ], {
      cwd: './'
    })
    .pipe(install()); // Run `bower install` and/or `npm install` if necessary
});

gulp.task('default', function(done) {

  inquirer.prompt(prompts,

    function(answers) {

      _answers = answers;

      sequence('copy', 'template', 'install')(done);

    });
});
