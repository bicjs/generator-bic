'use strict';

module.exports = function(options) {

  return [{
    type: 'input',
    name: 'author',
    message: 'Your name?',
    default: 'Author Name',
    store: true
  }, {
    type: 'input',
    name: 'email',
    message: 'Your email?',
    default: 'author@email.com',
    store: true
  }, {
    type: 'input',
    name: 'username',
    message: 'Your GitHub username?',
    default: 'username',
    store: true
  }, {
    type: 'input',
    name: 'name',
    message: 'Your project name?',
    default: options.project.name,
    store: true
  }, {
    type: 'input',
    name: 'title',
    message: 'Your project title?',
    default: options.project.title,
    store: true
  }, {
    type: 'input',
    name: 'description',
    message: 'Your project description?',
    default: 'Web site for ' + options.project.title + '.',
    store: true
  }, {
    type: 'input',
    name: 'buildpack',
    message: 'Your Heroku buildpack?',
    default: 'https://github.com/heroku/heroku-buildpack-nodejs',
    store: true
  }];
};
