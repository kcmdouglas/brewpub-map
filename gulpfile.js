var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var browserSync = require('browser-sync').create();
var lib = require('bower-files')({
  "overrides": {
    "bootstrap": {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap",
        "dist/css/bootstrap.js"
      ]
    }
  }
});

var buildProduction = utilities.env.production;

gulp.task('jsBower', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bower', ['jsBower', 'cssBower']);

gulp.task("cssBower", function() {
  return gulp.src(lib.ext("css").files)
    .pipe(concat("vendor.css"))
    .pipe(gulp.dest("./build/css"));
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task("minifyScripts", ["jsBrowserify"], function() {
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

gulp.task("clean", function() {
  return del(["build", "tmp"]);
});

gulp.task("build", ["clean"], function() {
  if (buildProduction) {
    gulp.start("minifyScripts");
  } else {
    gulp.start("jsBrowserify");
  }
  gulp.start('bower');
});

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });

  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
});

gulp.task('jsBuild', ['jsBrowserify'], function() {
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
});
