const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive')
//const sass = require('gulp-sass');
const sass = require('gulp-ruby-sass');
//const child = require('child_process');
const spawn = require('cross-spawn');
const path = require('path');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const del = require('del');
const fs = require('fs')

//const jekyll = process.platform ==="win32" ? "jekyll.bat" : "jekyll";
//const bundle = process.platform ==="win32" ? "bundle.bat" : "bundle";

gulp.task('imageresize', function() {

    let settings = { width: '360px' };

    return gulp.src('_imgstage/*.{png,jpg,jpeg,webp}')
        .pipe(responsive({
            '**/*.*': settings
        },
        {
          quality: 70,
          progressive: true,
          withMetadata: false,
          stats: true,
          errorOnUnusedConfig: false,
          errorOnUnusedImage: false,
          passThroughUnused: true,
          errorOnEnlargement: false,
        }
        ))
        .pipe(gulp.dest('_imgstage'));

});

gulp.task('imagecompressclear', function() {
//gifs destroy this crap and it seriously needs to backup and clear, and pass on even uncompressed images. come on
    return gulp.src('_imgstage/*.{png,svg,jpg,webp,jpeg}')
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('../assets/img'));

});

gulp.task('sassed4md', function(cb) {

    sass('../_sass/main.scss')
    .pipe(rename('sassed4md.css'))
    .pipe(gulp.dest('./'));

    cb();
});

gulp.task('tags', function(cb) {
    
    const tagGen = spawn('python3', [ 'tag_generator.py' ]);

    const tagGenLogger = (buffer) => {
        buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Python: ' + message));
    };

    tagGen.stdout.on('data', tagGenLogger);
    tagGen.stderr.on('data', tagGenLogger);

    cb();
});

gulp.task('build', function(cb) {
    
    const parentDirectory = path.resolve(process.cwd(), '..');

    const runjekyll = spawn('bundle exec jekyll', ['serve', '--watch', '--incremental'], {cwd: parentDirectory});

    const jekyllLogger = (buffer) => {
        buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    runjekyll.stdout.on('data', jekyllLogger);
    runjekyll.stderr.on('data', jekyllLogger);

    cb();
});

gulp.task('default', gulp.series('imageresize', 'imagecompressclear', 'sassed4md', 'tags', 'build'));