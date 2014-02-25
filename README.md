# gulp-out

Output gulp files with destination files based on the original but varying in a patterned way.

## Usage

The gulp-out task takes a pattern parameter with the following replacement placeholders

`{basename}` - the base name of the file without the directory and without the extension e.g. for `/Users/dylanb/myproj/css/mycss.css`, `{basename}` will be `mycss`.

`{extension}` - the extension of the file with the `.` e.g. for `/Users/dylanb/myproj/css/mycss.css`, `{extension}` will be `.css`.

`{filename}` - the full name of the file without the directory. e.g. for `/Users/dylanb/myproj/css/mycss.css`, `{filename}` will be `mycss.css`.


###Example

If you have a CSS minifier and you would like the output to go to a file with .min in the name, then the gulpfile task will look like::

    var minifyCSS = require('gulp-minify-css'),
        out = require('gulp-out');

    gulp.task('minify-css', function() {
      gulp.src('./testsupport/*.css')
        .pipe(minifyCSS({}))
        .pipe(out('./testoutput/{basename}.min{extension}'))
    });
