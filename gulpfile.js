/* eslint-disable */

//var gulp = require('gulp');
//var plumber = require('gulp-plumber');
//var sourcemap = require('gulp-sourcemaps');
//var sass = require('gulp-sass');
//var postcss = require('gulp-postcss');
//var autoprefixer = require('autoprefixer');
//var server = require('browser-sync').create();
//var csso = require('gulp-csso');
//var rename = require('gulp-rename');
//var imagemin = require('gulp-imagemin');
//var webp = require('gulp-webp');
//var svgstore = require('gulp-svgstore');
//var posthtml = require('gulp-posthtml');
//var include = require('posthtml-include');
//var del = require('del');

//gulp.task('css', function () {
//  return gulp.src('source/sass/style.scss')
//      .pipe(plumber())
//      .pipe(sourcemap.init())
//      .pipe(sass())
//      .pipe(postcss([autoprefixer()]))
//      .pipe(csso())
//      .pipe(rename('style.min.css'))
//      .pipe(sourcemap.write('.'))
//      .pipe(gulp.dest('build/css'))
//      .pipe(server.stream());
//});

//gulp.task('server', function () {
//  server.init({
//    server: 'build/',
//    notify: false,
//    open: true,
//    cors: true,
//    ui: false
//  });

//  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
//  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
//  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
//});

//gulp.task('refresh', function (done) {
//  server.reload();
//  done();
//});

//gulp.task('images', function () {
//  return gulp.src('source/img/**/*.{png,jpg,svg}')
//      .pipe(imagemin([
//        imagemin.optipng({optimizationLevel: 3}),
//        imagemin.jpegtran({progressive: true}),
//        imagemin.svgo()
//      ]))

//      .pipe(gulp.dest('source/img'));

//});

//gulp.task('webp', function () {
//  return gulp.src('source/img/**/*.{png,jpg}')
//      .pipe(webp({quality: 90}))
//      .pipe(gulp.dest('source/img'));
//});

//gulp.task('sprite', function () {
//  return gulp.src('source/img/sprite/{icon-*,htmlacademy*}.svg')
//      .pipe(svgstore({inlineSvg: true}))
//      .pipe(rename('sprite_auto.svg'))
//      .pipe(gulp.dest('build/img'));
//});

//gulp.task('html', function () {
//  return gulp.src('source/*.html')
//      .pipe(posthtml([
//        include()
//      ]))
//      .pipe(gulp.dest('build'));
//});

//gulp.task('copy', function () {
//  return gulp.src([
//    'source/fonts/**/*.{woff,woff2}',
//    'source/img/**',
//    'source/js/**',
//    'source//*.ico'
//  ], {
//    base: 'source'
//  })
//      .pipe(gulp.dest('build'));
//});

//gulp.task('clean', function () {
//  return del('build');
//});

//gulp.task('build', gulp.series('clean', 'copy', 'css', 'sprite', 'html', 'webp'));
//gulp.task('start', gulp.series('build', 'server'));


const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const sync = require('browser-sync').create();

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(rename((path) => {
    path.basename +='.min';
  }))
  .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.images = copyImages;

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite_auto.svg"))
  .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/js/**',
    'source/*.ico',
    'source/img/**/*.svg',
    'source/img/favicons/*.{svg,png}',
    'source/img/sprite/*.svg',
    'source/img/**/*.{png,jpg}',
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch('source/img/icon-*.svg', gulp.series(sprite, html, reload));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
