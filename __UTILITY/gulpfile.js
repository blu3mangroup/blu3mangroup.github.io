const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive')
const sass = require('gulp-sass');
//const child = require('child_process');
const spawn = require('cross-spawn');
const path = require('path');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const del = require('del');
//const jekyll = process.platform ==="win32" ? "jekyll.bat" : "jekyll";
//const bundle = process.platform ==="win32" ? "bundle.bat" : "bundle";

//image checking function and possibly more to scale the default gulper

function imageresize() {

    let settings = { width: '360px' };

    return gulp.src('_imgstage/*.{png,jpg,jpeg,webp}')
        .pipe(responsive({
            '**/*.*': settings,
            '*.*': settings,
        }))
        .pipe(gulp.dest('_imgstage'));
}

function imagecompress() {

    return gulp.src('_imgstage/*.{png,svg,jpg,webp,jpeg,gif}')
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('../assets/img'));
}

function imageclear(cb) {

    return del(['_imgstage/**', '!_imgstage']);

}

function sassed4md(cb) {

    gulp.src('../_sass/main.scss')
    .pipe(sass())
    .pipe(rename('sassed4md.css'))
    .pipe(gulp.dest('./'));

    cb();
}

function tags(cb) {
    
    const tagGen = spawn('python3', [ 'tag_generator.py' ]);

    const tagGenLogger = (buffer) => {
        buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Python: ' + message));
    };

    tagGen.stdout.on('data', tagGenLogger);
    tagGen.stderr.on('data', tagGenLogger);

    cb();
}

function build(cb) {
    
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
}

exports.default = gulp.series(imageresize, imagecompress, imageclear, sassed4md, tags, build);