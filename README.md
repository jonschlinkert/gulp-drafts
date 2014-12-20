# gulp-drafts [![NPM version](https://badge.fury.io/js/gulp-drafts.svg)](http://badge.fury.io/js/gulp-drafts)

> Gulp plugin for skipping files marked as drafts.

The filtering part of the plugin was inspired by [gulp-filter].

## Install with [npm](npmjs.org)

```bash
npm i gulp-drafts --save
```

## Usage

### Ignore files using glob patterns

```js
var gulp = require('gulp');
var drafts = require('gulp-drafts');

gulp.task('blog', function () {
  gulp.src('posts/**/*.md')
    // remove files from the pipeline if they match the given
    // filepath or glob patterns:
    .pipe(drafts('**/drafts/*.md'))
    .pipe(gulp.dest('dist'));
});
```

### Ignore files with the `draft` property

The plugin automatically filters out files with the `draft` or `data.draft` property set to `true`. Files won't have these properties unless you're setting them on the file object earlier in the pipeline. (_Or, if you're using this plugin with [assemble] or [verb] you can define the `draft` property in front-matter._)

```js
var gulp = require('gulp');
var drafts = require('gulp-drafts');

gulp.task('blog', function () {
  gulp.src('posts/**/*.md')
    // files with {draft: true} or {data: {draft: true}}
    // will be removed
    .pipe(drafts())
    .pipe(gulp.dest('dist'));
});
```

### Ignore files with custom properties

```js
var gulp = require('gulp');
var drafts = require('gulp-drafts');

gulp.task('blog', function () {
  gulp.src('posts/**/*.md')
    // ignore files with the `{foo: ...}` or `{bar: {baz: ...}}`
    // properties
    .pipe(drafts({props: ['foo', 'bar.baz']}))
    .pipe(gulp.dest('dist'));
});
```

## Run tests

Install dev dependencies:

```bash
node i -d && mocha
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/gulp-drafts/issues)

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on December 20, 2014._

[gulp-filter]: https://github.com/sindresorhus/gulp-filter