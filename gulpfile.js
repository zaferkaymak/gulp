'use strict';

var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var mode = require('gulp-mode')({
    modes: ["production", "development"],
    default: "development",
    verbose: false
});

var inject = require('gulp-inject-string');
var clean = require('gulp-clean');

var myHash = Date.now();

gulp.task('clean-styles', function () {
    return gulp.src('./assets/css/*.css', {read: false})
        .pipe(clean());
});

gulp.task('clean-script', function () {
    return gulp.src('./assets/javascript/*.js', {read: false})
        .pipe(clean());
});


var scssFile = './src/scss/main.scss';
var cssExportFolder = './assets/css';

gulp.task('styles', function() {
    return gulp.src(scssFile)
        .pipe(concat('main.' + myHash + '.min.css'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(cssExportFolder));
});

var jsFiles = [
    './src/js/variables.js'
];
var jsExportFolder = './assets/javascript/';
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(mode.development(sourcemaps.init()))
        .pipe(concat('bundle.'+myHash+'.js'))
        .pipe(mode.production(uglify()))
        .pipe(mode.development(sourcemaps.write()))
        .pipe(gulp.dest(jsExportFolder));
});

var jsPath = './src/js/*.js';
var scssPath = './src/scss/**/*.scss';
gulp.task('watch', function() {
    gulp.watch(jsPath, gulp.series('scripts'));
    gulp.watch(scssPath, gulp.series('styles'));
});

// gulp.task('HTMLHashInject', function () {
//     return gulp.src('./src/main/resources/templates/main_layout.html')
//         .pipe(inject.replace('/css/*.*.*.css', '/css/main.' + myHash + '.min.css'))
//         .pipe(inject.replace('/javascript/*.*.js', '/javascript/bundle.' + myHash + '.js'))
//         .pipe(gulp.dest('./src/main/resources/templates/'));
// });


gulp.task('clean', () => del(['bundle']));
var isProduction = mode.production();
if(isProduction){
    // gulp.task('default', gulp.series(gulp.parallel('clean', 'clean-styles', 'clean-script', 'styles', 'scripts', 'HTMLHashInject')));
    gulp.task('default', gulp.series(gulp.parallel('clean', 'clean-styles', 'clean-script', 'styles', 'scripts')));
}else {
    gulp.task('default', gulp.series(gulp.parallel('clean', 'clean-styles', 'clean-script' ,'watch', 'styles', 'scripts')));
}

