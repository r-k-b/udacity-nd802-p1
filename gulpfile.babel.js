'use strict';

import gulp from 'gulp';
import {merge} from 'ramda';
import gutil from 'gulp-util';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import BrowserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';

const browserSync = BrowserSync.create({
  logLevel: 'info'
});

const customBrowserifyOpts = merge(watchify.args, {
  ignoreWatch:  true,
  entries:      ['./js/main.js'],
  transform:    ['babelify'],
  debug:        true,
  cache:        {},
  packageCache: {},
  plugin:       [
    'watchify'
  ]
});
const brwsrfy = browserify(customBrowserifyOpts);

brwsrfy.plugin('minifyify', {
  map: 'ugbundle.js.map',
  output: __dirname + '/dist/map.json'
});

const bundle = () => brwsrfy.bundle()
  // log errors if they happen
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  // Add transformation tasks to the pipeline here.
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());


gulp.task('watchify', bundle);
brwsrfy.on('update', bundle);
brwsrfy.on('log', gutil.log);


gulp.task('sync', () =>
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })
);

gulp.watch('./*.html').on('change', browserSync.reload);

gulp.task('watchTests', () => {
  gulp.watch('./spec/*.js').on('change', () => {
    // todo: `npm run test` (tape) from here (how?)
  });
});

gulp.task('default', ['sync', 'watchify']);