var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    server = require('gulp-server-livereload');
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),

gulp.task('sass', function() {
  return setTimeout(() => {
    return gulp.src('./src/sass/style.sass')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./src/sass'))
  }, 200)
})

gulp.task('concatCss', function() {
  return setTimeout(() => {
    return gulp.src(['./src/lib/css/normalize.css', './src/sass/style.css'])
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano())
      .pipe(gulp.dest('./dist/css'))
    }, 1000)
})

gulp.task('concatJs', function() {
  return gulp.src(['./lib/js/**/*.js', './src/js/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/images']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('concatCss', 'concatJs', 'images');
});

gulp.task('watch', function() {  
  gulp.watch('./src/sass/**/*.sass', ['sass', 'concatCss']);
  gulp.watch('./src/js/**/*.js', ['concatJs']);
  gulp.watch('./src/images/**/*', ['images']);
});

gulp.task('default', ['sass', 'concatCss', 'concatJs', 'watch']);

gulp.task('server', ['watch'], function() {
  gulp.src('.')
      .pipe(server({
        livereload: {
          enable: true
        },
        port: 5012,
        directoryListing: false,
        open: true
      }));
});
