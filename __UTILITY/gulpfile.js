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
const fs = require('fs')

//const jekyll = process.platform ==="win32" ? "jekyll.bat" : "jekyll";
//const bundle = process.platform ==="win32" ? "bundle.bat" : "bundle";

gulp.task('imageresize', function(cb) {

    let settings = { width: '360px' };
    const imagefiles = '_imgstage/*.{png,jpg,jpeg,webp}';
    
    if (fs.existsSync(imagefiles)) {
        return gulp.src(imagefiles)
            .pipe(responsive({
                '**/*.*': settings,
                '*.*': settings,
            }))
            .pipe(gulp.dest('_imgstage'));
    } 
    else {
        console.log('No images in staging folder to resize.')
    }
    cb();

});

gulp.task('imagecompressclear', function(cb) {

    const imagefiles = '_imgstage/*.{png,svg,jpg,webp,jpeg,gif}';

    if (fs.existsSync(imagefiles)) {
        return gulp.src(imagefiles)
            .pipe(imagemin({verbose: true}))
            .pipe(gulp.dest('../assets/img'))
            .del(['_imgstage/**', '!_imgstage']);
    }
    else {
        console.log('No images in staging folder to compress.')
    }
    cb();
    
});

gulp.task('sassed4md', function(cb) {

    gulp.src('../_sass/main.scss')
    .pipe(sass())
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