'use strict';

/* deps:mocha */
var File = require('vinyl');
var assert = require('assert');
var drafts = require('./');

/**
 * Tests are patterned based on the tests in [sindresorhus/gulp-filter].
 */

describe('drafts()', function () {
  it('should not filter files that are not marked as drafts:', function (cb) {
    var stream = drafts();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'post.md');
      cb();
    });
    stream.end();
  });

  it('should filter files when `draft` is `true`:', function (cb) {
    var stream = drafts();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/a.md'
    }));

    var file = new File({
      base: __dirname,
      path: __dirname + '/b.md'
    });

    file.draft = true;
    stream.write(file);

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'a.md');
      cb();
    });
    stream.end();
  });

  it('should filter out files using a custom `drafts` property:', function (cb) {
    var stream = drafts({props: ['bar.baz']});
    var buffer = [];

    var a = new File({base: __dirname, path: __dirname + '/a.md'});
    a.foo = true;
    stream.write(a);

    var b = new File({base: __dirname, path: __dirname + '/b.md'});
    b.bar = {};
    b.bar.baz = true;
    stream.write(b);

    var c = new File({base: __dirname, path: __dirname + '/c.md'});
    stream.write(c);

    var d = new File({base: __dirname, path: __dirname + '/d.md'});
    stream.write(d);

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 3);
      assert.equal(buffer[0].relative, 'a.md');
      assert.equal(buffer[1].relative, 'c.md');
      assert.equal(buffer[2].relative, 'd.md');
      cb();
    });
    stream.end();
  });

  it('should filter out files using multiple custom `drafts` properties:', function (cb) {
    var stream = drafts({props: ['foo', 'bar.baz']});
    var buffer = [];

    var a = new File({base: __dirname, path: __dirname + '/a.md'});
    a.foo = true;
    stream.write(a);

    var b = new File({base: __dirname, path: __dirname + '/b.md'});
    b.bar = {};
    b.bar.baz = true;
    stream.write(b);

    var c = new File({base: __dirname, path: __dirname + '/c.md'});
    stream.write(c);

    var d = new File({base: __dirname, path: __dirname + '/d.md'});
    stream.write(d);

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 2);
      assert.equal(buffer[0].relative, 'c.md');
      assert.equal(buffer[1].relative, 'd.md');
      cb();
    });
    stream.end();
  });

  it('should filter files when `data.draft` is `true`:', function (cb) {
    var stream = drafts();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/a.md'
    }));

    var file = new File({
      base: __dirname,
      path: __dirname + '/b.md'
    });

    file.data = {};
    file.data.draft = true;
    stream.write(file);

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'a.md');
      cb();
    });
    stream.end();
  });

  it('should filter files from glob patterns and the `draft` property:', function (cb) {
    var stream = drafts('{d,e}.md');
    var buffer = [];

    stream.write(new File({base: __dirname, path: __dirname + '/a.md'}));

    var b = new File({base: __dirname, path: __dirname + '/b.md'});
    b.data = {};
    b.data.draft = true;
    stream.write(b);

    var c = new File({base: __dirname, path: __dirname + '/c.md'});
    c.draft = true;
    stream.write(c);

    stream.write(new File({base: __dirname, path: __dirname + '/d.md'}));
    stream.write(new File({base: __dirname, path: __dirname + '/e.md'}));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'a.md');
      cb();
    });
    stream.end();
  });

  it('should filter the given filepath as a draft:', function (cb) {
    var stream = drafts('post-draft.md');
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'post.md');
      cb();
    });
    stream.end();
  });

  it('should pass options to multimatch:', function (cb) {
    var stream = drafts('*-draft.md');
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post-draft.md'
    }));

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/post.md'
    }));

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'post.md');
      cb();
    });
    stream.end();
  });

  it('should filter drafts using a function', function (cb) {
    var stream = drafts(function (file) {
      return file.path === 'drafts/post.md';
    });

    var buffer = [];

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].path, 'post.md');
      cb();
    });

    stream.write(new File({path: 'post.md'}));
    stream.write(new File({path: 'drafts/post.md'}));
    stream.end();
  });

  it('should filter drafts with negation patterns and leading dot', function (cb) {
    var stream = drafts(['*', '!*.js', '!*.md'], {dot: true});
    var buffer = [];

    stream.on('data', function (file) {
      buffer.push(file);
    });

    stream.on('end', function () {
      assert.equal(buffer.length, 2);
      assert.equal(buffer[0].path, 'post.md');
      assert.equal(buffer[1].path, 'app.js');
      cb();
    });

    stream.write(new File({path: 'post.md'}));
    stream.write(new File({path: 'package.json'}));
    stream.write(new File({path: '.jshintrc'}));
    stream.write(new File({path: 'app.js'}));
    stream.end();
  });
});
