'use strict';

let glob = require('globby');
let path = require('path');
let gulp = require('gulp');
let sequence = require('gulp-sequence');
let conflict = require('gulp-conflict');
let template = require('gulp-template');
let inquirer = require('inquirer');
let _ = require('lodash');

let _projectName = path.basename(process.cwd());

let _answers;

let _src = [
  '**/*',
  '!**/node_modules/**',
  '!**/bower_components/**',
  '!**/generated/**',
  '!**/dist/**',
  '!**/.tmp/**',
  '!**/.DS_Store',
  '!**/*.log'
];

let prompts = require('./generators/app/prompts')({
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

const SRC_DIR = path.join(__dirname, 'generators/app/src');
const TEMPLATE_DIR = path.join(__dirname, 'generators/app/templates');

gulp.task('src', function() {

  // Ignore files used as templates.
  let src = _src.concat(glob.sync([
      '**/*.*',
      '!**/.tmp/**',
      '!**/.DS_Store',
      '!**/*.log'
    ], {
      cwd: TEMPLATE_DIR,
      dot: true
    })
    .map((pattern) => {
      return `!${path.join('**', pattern)}`;
    }));

  return gulp.src(src, {
      cwd: SRC_DIR,
      dot: true
    }) // Note use of __dirname to be relative to generator
    .pipe(conflict('./')) // Confirms overwrites on file conflicts
    .pipe(gulp.dest('./')); // Without __dirname here = relative to cwd
});

gulp.task('templates', function() {

  _answers.year = new Date().getFullYear();
  _answers.license = _answers.license.toUpperCase();

  return gulp.src(_src, {
      cwd: TEMPLATE_DIR,
      dot: true
    }) // Note use of __dirname to be relative to generator
    .pipe(template(_answers)) // Lodash template support
    .pipe(conflict('./')) // Confirms overwrites on file conflicts
    .pipe(gulp.dest('./')); // Without __dirname here = relative to cwd
});

gulp.task('default', function(done) {

  inquirer.prompt(prompts,

    function(answers) {

      _answers = answers;

      sequence('src', 'templates')(done);
    });
});
