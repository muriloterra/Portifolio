"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const header = require("gulp-header");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const pkg = require("./package.json");

// Set the banner content
const banner = [
  "/*!\n",
  " * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
  " * Copyright 2013-" + new Date().getFullYear(),
  " <%= pkg.author %>\n",
  " * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n",
  " */\n",
  "",
].join("");

// Compiles SCSS files from /scss into /css
function css() {
  return gulp
    .src("scss/resume.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      header(banner, {
        pkg: pkg,
      }),
    )
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// Minify compiled CSS
function minifyCss() {
  return gulp
    .src("css/resume.css")
    .pipe(
      cleanCSS({
        compatibility: "ie8",
      }),
    )
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// Minify custom JS
function minifyJs() {
  return gulp
    .src("js/resume.js")
    .pipe(uglify())
    .pipe(
      header(banner, {
        pkg: pkg,
      }),
    )
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(gulp.dest("js"))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// Copy task removed (CDN used)

// Configure the browserSync task
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("scss/*.scss", css);
  gulp.watch("css/*.css", minifyCss);
  gulp.watch("js/*.js", minifyJs);
  gulp.watch("*.html", browserSync.reload);
  gulp.watch("js/**/*.js", browserSync.reload);
}

// Define complex tasks
// Define complex tasks
const build = gulp.series(css, minifyCss, minifyJs);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSyncInit));

// Export tasks
exports.css = css;
exports.minifyCss = minifyCss;
exports.minifyJs = minifyJs;

exports.build = build;
exports.watch = watch;
exports.dev = watch;
exports.default = build;
