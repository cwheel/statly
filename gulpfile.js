var gulp = require('gulp'),
	sass = require('gulp-sass'),
	server = require('gulp-develop-server'),
	shell  = require('gulp-shell'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	concat = require('gulp-concat');

gulp.task('scss', function() {
  return gulp.src('./public/scss/**/*.scss')
    .pipe(sass())
    .pipe(minifycss())
    .pipe(autoprefixer())
    .pipe(concat('./public/statly.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('db', shell.task(["rethink"]));

gulp.task('watch', function() {
  	gulp.watch('./app/scss/**/*.scss', ['scss']);
});

gulp.task('server:start', function() {
    server.listen({path: './server.js'});
});

gulp.task('server:restart', function() {
    gulp.watch(['./server.js', './routes/*.js'], server.restart);
});

gulp.task('default', ['db', 'scss', 'watch', 'server:start', 'server:restart'], function() {});