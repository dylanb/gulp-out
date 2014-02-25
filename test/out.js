var assert = require('assert'),
    out = require('../index.js'),
    through2 = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util');

describe('gulp-out', function () {
    var writer, reader;
    beforeEach(function () {
        writer = through2.obj(function (chunk, enc, cb) {
            this.push(chunk);
            cb();
        }, function (cb) {
            cb();
        });
    });
    it('should emit an error is called without a pattern', function (done) {
        writer.pipe(out().on('error', function(err) {
            assert.equal(err.message, 'Must supply a pattern to avoid overwriting the source files');
            done();
        }));
        writer.push({
            path: require.resolve('../testsupport/test.html')
        });
        writer.end();
    });
    it('should emit an error if the resulting output file is the same as the original file name', function (done) {
        writer.pipe(out('testsupport/{filename}').on('error', function(err) {
            assert.equal(err.message, 'Pattern would result in overwriting the source file');
            done();
        }));
        writer.push({
            path: require.resolve('../testsupport/test.html')
        });
        writer.end();
    });
    it('should emit an error if the resulting output file is the same as the original file name', function (done) {
        writer.pipe(out('testsupport/{basename}{extension}').on('error', function(err) {
            assert.equal(err.message, 'Pattern would result in overwriting the source file');
            done();
        }));
        writer.push({
            path: require.resolve('../testsupport/test.html')
        });
        writer.end();
    });
    it('should emit an error if passed a real stream', function(done) {
        writer = through2(function (chunk, enc, cb) {
            this.push(chunk);
            cb();
        }, function (cb) {
            cb();
        });
        writer.pipe(out('{filename}').on('error', function(err) {
            assert.equal(err.message, 'Streaming not supported');
            done();                
        }));
        writer.write('Some bogus data');
        writer.end();
    });
    it('should output the contents to the a file with the same filename but in a different directory if given the appropriate params', function (done) {
        var file = new gutil.File({
          base: path.join(__dirname, './testsupport/'),
          cwd: __dirname,
          path: path.join(__dirname, './testsupport/test.html'),
          contents: new Buffer('contents')
        });
        var reader = through2.obj(function (chunk, enc, cb) {
            this.push(chunk);
            cb();
        },
        function (cb) {
            assert.ok(fs.existsSync('testoutput/test.html'));
            done();
            cb();
        });
        if (fs.existsSync('testoutput/test.html')) {
            fs.unlinkSync('testoutput/test.html');
        }
        writer.pipe(out('testoutput/{filename}'))
            .pipe(reader);
        writer.push(file);
        writer.end();
    });
    it('should output the contents to the a file with the same basename but in a different extension if given the appropriate params', function (done) {
        var file = new gutil.File({
          base: path.join(__dirname, './testsupport/'),
          cwd: __dirname,
          path: path.join(__dirname, './testsupport/test.html'),
          contents: new Buffer('contents')
        });
        var reader = through2.obj(function (chunk, enc, cb) {
            this.push(chunk);
            cb();
        },
        function (cb) {
            assert.ok(fs.existsSync('testoutput/test.coffee'));
            done();
            cb();
        });
        if (fs.existsSync('testoutput/test.coffee')) {
            fs.unlinkSync('testoutput/test.coffee');
        }
        writer.pipe(out('testoutput/{basename}.coffee'))
            .pipe(reader);
        writer.push(file);
        writer.end();
    });
    it('should output the contents to the a file with the same extension but in a different name if given the appropriate params', function (done) {
        var file = new gutil.File({
          base: path.join(__dirname, './testsupport/'),
          cwd: __dirname,
          path: path.join(__dirname, './testsupport/test.html'),
          contents: new Buffer('contents')
        });
        var reader = through2.obj(function (chunk, enc, cb) {
            this.push(chunk);
            cb();
        },
        function (cb) {
            assert.ok(fs.existsSync('testoutput/test.modded.html'));
            done();
            cb();
        });
        if (fs.existsSync('testoutput/test.modded.html')) {
            fs.unlinkSync('testoutput/test.modded.html');
        }
        writer.pipe(out('testoutput/{basename}.modded{extension}'))
            .pipe(reader);
        writer.push(file);
        writer.end();
    });
});
