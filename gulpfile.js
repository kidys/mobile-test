const path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    responsive = require('gulp-responsive'),
    del = require('del'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    //jp2 = require('gulp-jpeg-2000'),
    fileinclude = require('gulp-file-include'),
    cleancss = require('gulp-clean-css');

gulp.task('scss', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [path.dirname('node_modules')]
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ['last 10 versions']
        }))
        .pipe(gcmq())
        .pipe(cleancss({level: {1: {specialComments: 0}}}))
        .pipe(gulp.dest('css'))
});

gulp.task('img-responsive-2x', async function () {
    return gulp.src('src/i/**/*.{png,jpg,jpeg,webp,raw}')
        .pipe(responsive({
            '**/*': {width: '100%', quality: 100}
        })).on('error', function (e) {
            console.log(e)
        })
        .pipe(rename(function (path) {
            path.extname = path.extname.replace('jpeg', 'jpg')
        }))
        //.pipe(jp2())
        .pipe(gulp.dest('images'))
});

gulp.task('moving_svg_files', function () {
    return gulp.src('src/i/**/*.svg')
        .pipe(gulp.dest('images'))
});

gulp.task('cleanimg', function () {
    return del(['images'], {force: true})
});

gulp.task('js_scripts', function () {
    return gulp.src([
        //'src/js/_libs.js',
        'node_modules/selectric/public/jquery.selectric.min.js',
        'src/js/main.js',
        'src/js/_points.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify()) // Minify js (opt.)
        .pipe(gulp.dest('js'))
});

gulp.task('html_build', function () {
    return gulp.src([
        'src/html/*.html'
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./'));
});