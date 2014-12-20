/*!
 * gulp-drafts <https://github.com/jonschlinkert/gulp-drafts>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var get = require('get-first');
var typeOf = require('kind-of');
var through = require('through2');
var mm = require('multimatch');

module.exports = function drafts(pattern, opts) {
  opts = opts || {};

  if (typeOf(pattern) === 'object') {
    opts = pattern;
    pattern = null;
  }

  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    var isDraft = false;
    if (pattern) {
      if (typeof pattern === 'function') {
        isDraft = pattern(file);
      } else {
        isDraft = mm(file.relative, pattern, opts).length > 0;
      }
    }

    var drafts = ['draft', 'data.draft'].concat(opts.props || []);
    if (isDraft || Boolean(get(file, drafts))) {
      cb();
      return;
    }

    this.push(file);
    return cb();
  });
};
