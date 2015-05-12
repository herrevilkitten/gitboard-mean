var gulp = require('gulp');
var inject = require('gulp-inject');
var babel = require('gulp-babel');
var annotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var es = require('event-stream');
var buildDir = './build';
var destinationDir = './build/web';
var path = require('path');
var map = require('map-stream');
var del = require('del');

gulp.task('clean', function(cb) {
    del([buildDir], cb);
});

gulp.task('scripts', function() {
    var javascripts = gulp.src('./src/**/*.es6')
        .pipe(babel());

    var typescripts = gulp.src('./src/**/*.ts')
        .pipe(ts({
            target: 'ES5'
        }));

    es.merge(typescripts.js, javascripts)
        .pipe(annotate())
        .pipe(gulp.dest(destinationDir));
});

gulp.task('styles', function() {
    gulp.src('./src/**/*.css')
        .pipe(gulp.dest(destinationDir));
    return gulp.src('./src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(destinationDir));
});

gulp.task('templates', function() {
    return gulp.src('./src/**/*.tpl.html')
        .pipe(gulp.dest(destinationDir));
});

gulp.task('bower', function() {
    return gulp
        .src([
            './bower_components/**/*'
        ])
        .pipe(gulp.dest(path.join(destinationDir, 'bower_components')));
});

gulp.task('index', ['bower', 'scripts', 'styles', 'templates'], function() {

    var target = gulp.src('./src/index.html');

    var js = gulp.src([
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
        './app/**/!(app).js',
        './app/app.js'
    ], {read: false, cwd: destinationDir});

    var css = gulp.src([
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/angular-ui-bootstrap-bower/ui-bootstrap-csp.css',

        './styles/**/*.css'
    ], {read: false, cwd: destinationDir});

    target
        .pipe(inject(js, {addRootSlash: false}))
        .pipe(inject(css, {addRootSlash: false}))
        .pipe(gulp.dest(destinationDir));

    gulp.src('./src/boards.html')
        .pipe(inject(js, {addRootSlash: false}))
        .pipe(inject(css, {addRootSlash: false}))
        .pipe(gulp.dest(destinationDir));
});

gulp.task('watch', ['index'], function() {

    gulp.watch(['./src/**/*.es6', './src/**/*.ts'], ['scripts']);
    gulp.watch('./src/**/*.less', ['styles']);
    gulp.watch('./src/**/*.tpl.html', ['templates']);
    gulp.watch('./src/index.html', ['index']);

});

gulp.task('default', ['index']);
