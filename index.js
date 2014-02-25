/*
 * Copyright (C) 2014 Dylan Barrell, all rights reserved
 *
 * Licensed under the MIT license
 *
 */

var path = require('path');
var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');

module.exports = function (pattern) {
    return through2.obj(function (file, encoding, cb) {
        var fullpath, basename, filename, extension, outname;

        if (!file.path) {
            this.emit('error', new gutil.PluginError('gulp-out', 'Streaming not supported'));
            return cb();
        }
        if (pattern) {
            fullpath = path.normalize(file.path);
            extension = path.extname(fullpath);
            basename = path.basename(fullpath);
            filename = basename;
            if (extension) {
                basename = basename.replace(extension, '');
            }
            outname = pattern.replace('{filename}', filename);
            outname = outname.replace('{basename}', basename);
            outname = outname.replace('{extension}', extension);
            outname = path.resolve(outname);
            if (outname === file.path) {
                this.emit('error', new gutil.PluginError('gulp-out', 'Pattern would result in overwriting the source file'));
                return cb();            
            }
            fs.writeFileSync(outname, file.contents || '');
        } else {
            this.emit('error', new gutil.PluginError('gulp-out', 'Must supply a pattern to avoid overwriting the source files'));
            return cb();            
        }
        this.push(file);
        cb();
    },
    function (cb) {
        cb();
    });
};

