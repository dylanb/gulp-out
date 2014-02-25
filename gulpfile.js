var gulp = require('gulp'),
    cover = require('gulp-coverage'),
    out = require('./index'),
    jasmineTask = require('gulp-jasmine'),
    through2 = require('through2'),
    minifyCSS = require('gulp-minify-css');

var jasmineDeps = [];

function synchro (done) {
    return through2.obj(function (data, enc, cb) {
        cb();
    },
    function (cb) {
        cb();
        done();
    });
}

function jasmine (done) {
    gulp.src('test/*.js')
        .pipe(cover.instrument({
            pattern: ['index.js']
        }))
        .pipe(jasmineTask({
        }))
        .pipe(cover.gather())
        .pipe(cover.format({
            outFile: 'coverage.html'
        }))
        .pipe(gulp.dest('./'))
        .pipe(synchro(done));
}

function setup () {
    gulp.task('test', jasmineDeps, jasmine);
}

/*
 * Actual task defn
 */

gulp.task('default', function() {
    // Setup the chain of dependencies
    jasmineDeps = [];
    setup();
    gulp.run('test');
});

setup();

/*
 * Test tasks
 */

gulp.task('minify-css', function() {

  gulp.src('./testsupport/*.css')
    .pipe(minifyCSS({}))
    .pipe(out('./testoutput/{basename}.min{extension}'))
});