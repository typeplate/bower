// Gulp
// =======================================================
// Installation:
// $ npm install gulp -g
//
// Gulp Tutorials:
// - http://gulpjs.com
// - https://laracasts.com/lessons/gulp-this
// - http://markgoodyear.com/2014/01/getting-started-with-gulp
// =======================================================

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var zip          = require('gulp-zip');
var browserSync  = require('browser-sync').create();
var del          = require('del');

var paths_dir = {
  docs: 'docs',
  docsasset: 'assets',
  site: 'dev',
  templates : 'templates',
  dist: 'dist',
  sitejs: 'js',
  sitecss: 'css',
  sitesass: 'scss'
};

var paths = {
  docs: paths_dir.docs,
  docsasset: paths_dir.docs + '/' + paths_dir.docsasset,
  site: paths_dir.site,
  templates: paths_dir.site + '/' + paths_dir.templates,
  dist: paths_dir.dist,
  sitejs: paths_dir.site + '/' + paths_dir.sitejs,
  sitecss: paths_dir.site + '/' + paths_dir.sitecss,
  sitesass: paths_dir.site + '/' + paths_dir.sitesass
};


// ===================================================
// Styling
// ===================================================

gulp.task('sass', function() {
  var stream = gulp.src(paths.sitesass + '/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitecss))
    .pipe(browserSync.reload);

  return stream;
});


// ===================================================
// Serving
// ===================================================

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: [paths.site]
    }
  });
});


// ===================================================
// Watching
// ===================================================

gulp.task('watch', function() {
  gulp.watch(paths.sitesass + '/**/*.scss', ['sass']);
});


// ===================================================
// Cleaning
// ===================================================

gulp.task('cleandev', function(cb) {
  del([
    'dev/scss/*.css',
    'dev/{css,scss}/*.css.map'
  ], cb);
});

gulp.task('cleandist', function(cb) {
  del([
    'dist/scss/typeplate.scss',
    'dist/scss/*.css',
    'dist/scss/*.css.map'
  ], cb);
});


// ===================================================
// Copying
// ===================================================

gulp.task('copy', function() {
  gulp.src('dev/css/**')
    .pipe(gulp.dest('dist/css'));

  gulp.src('dev/scss/**')
    .pipe(gulp.dest('dist/scss'));

  gulp.src('{README,package,license}.{json,md,package,txt}')
    .pipe(gulp.dest('dist'));

  gulp.src('dev/*.{md,json}')
    .pipe(gulp.dest('dist'));
});


// ===================================================
// Packaging
// ===================================================

gulp.task('zipit', function() {
  return gulp.src('dev/scss/_**.scss')
    .pipe(zip('typeplate-sk.zip'))
    .pipe(gulp.dest('.'));
});


// ===================================================
// Tasking
// ===================================================

gulp.task('default', ['serve', 'watch']);
gulp.task('sweep', ['cleandev']);
gulp.task('build', ['copy']);
gulp.task('cleanse', ['cleandist']);
gulp.task('ship', ['zipit']);
