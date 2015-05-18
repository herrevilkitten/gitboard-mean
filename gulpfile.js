var gulp = require('gulp');
var inject = require('gulp-inject');
var babel = require('gulp-babel');
var annotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var es = require('event-stream');
var buildDir = './build';
var destinationDir = buildDir + '/web';
var path = require('path');
var map = require('map-stream');
var del = require('del');
var server = require('gulp-express');

gulp.task('clean', function(cb) {
    del([buildDir], cb);
});

gulp.task('scripts', function() {
    var javascripts = gulp.src('./web/**/*.es6')
        .pipe(babel());

    var typescripts = gulp.src('./web/**/*.ts')
        .pipe(ts({
            target: 'ES5'
        }));

    es.merge(typescripts.js, javascripts)
        .pipe(annotate())
        .pipe(gulp.dest(destinationDir));
});

gulp.task('styles', function() {
    gulp.src('./web/**/*.css')
        .pipe(gulp.dest(destinationDir));
    return gulp.src('./web/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(destinationDir));
});

gulp.task('templates', function() {
    return gulp.src('./web/**/*.tpl.html')
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
    gulp.src('./web/assets/**/*')
        .pipe(gulp.dest(path.join(destinationDir, 'assets')));

    var target = gulp.src('./web/index.html');

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
        './bower_components/font-awesome/css/font-awesome.css',
        './styles/**/*.css'
    ], {read: false, cwd: destinationDir});

    target
        .pipe(inject(js, {addRootSlash: false}))
        .pipe(inject(css, {addRootSlash: false}))
        .pipe(gulp.dest(destinationDir));

    gulp.src('./web/boards.html')
        .pipe(inject(js, {addRootSlash: false}))
        .pipe(inject(css, {addRootSlash: false}))
        .pipe(gulp.dest(destinationDir));
});

gulp.task('watch', ['index'], function() {
    gulp.watch(['./web/**/*.es6', './web/**/*.ts'], ['scripts']);
    gulp.watch('./web/**/*.less', ['styles']);
    gulp.watch('./web/**/*.tpl.html', ['templates']);
    gulp.watch(['./web/index.html', './web/board.html'], ['index']);
});

gulp.task('server', function() {
    // Start the server at the beginning of the task
    server.run(['app/server.js']);
});

gulp.task('default', ['index']);
