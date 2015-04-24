module.exports = function(config){
  var gulp = require('gulp'),
      gulpif = require('gulp-if'),
      watch = require('gulp-watch'),
      autoprefixer = require('gulp-autoprefixer'),
      coffee = require('gulp-coffee'),
      stylus = require('gulp-stylus'),
      less = require('gulp-less'),
      cssmin = require('gulp-cssmin'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      requi = require('gulp-requi'),
      jade = require('gulp-jade'),
      spritesmith = require('gulp.spritesmith');

  var errors = require('./utils/errors'),
      debug = false;


// =================== CSS ===================
  gulp.task('css', function() {
    gulp.src(config.css.source)
      .pipe(stylus())
      .on('error', errors)
      .pipe(autoprefixer({ browsers: config.css.autoprefixer }))
      .pipe(
        gulpif(
          !debug,
          cssmin()
        )
      )
      .pipe(concat(config.css.name))
      .pipe(gulp.dest(config.css.dest))
  });


// =================== Scripts ===================
  gulp.task('js', function() {
    gulp.src(config.js.source)
      .pipe(requi())
      .pipe(
        gulpif(
          /[.]coffee$/,
          coffee()
        )
      )
      .on('error', errors)
      .pipe(
        gulpif(
          !debug,
          uglify()
        )
      )
      .pipe(concat(config.js.name))
      .pipe(gulp.dest(config.js.dest))
  });


// =================== Sprites ===================
  gulp.task('sprites', function() {

    var spriteData = gulp.src(config.sprites.source)

    spriteData = spriteData.pipe(spritesmith({
      imgName: config.sprites.nameSprite,
      cssName: config.sprites.nameMixins,
      padding: 0,
      cssFormat: 'stylus',
      cssTemplate: config.sprites.tmpl,
      cssVarMap: function(sprite) {
        sprite.retina = config.sprites.retina
      }
    }));

    spriteData.css.pipe(gulp.dest(config.sprites.mixins));
    spriteData.img.pipe(gulp.dest(config.sprites.dest));
  });


// ===================  Jade  ===================
  gulp.task('jade', function() {
    gulp.src(config.jade.source)
        .pipe(jade({
          pretty: true
        }))
        .on('error', errors)
        .pipe(gulp.dest(config.jade.dest))
  });


// ============================================================================
  gulp.task('watch', function(){
    watch(config.js.watch, function() {
        gulp.start('js');
    });
    watch(config.sprites.watch, function() {
        gulp.start('sprites');
    });
    watch(config.css.watch, function() {
        gulp.start('css');
    });

    if (config.jade.enable) {
      watch(config.jade.watch, function() {
          gulp.start('jade');
      });
    }
  });


  var tasks = ['js', 'sprites', 'css']

  if(config.jade.enable) {
    tasks.push('jade')
  }


  gulp.task('default', function(){
    tasks.push('watch')
    gulp.start(tasks);
  });

  gulp.task('build', function(){
    gulp.start(tasks);
  });

  gulp.task('debug', function(){
    console.log('!!! RUNNING IN DEBUG MODE !!!');
    debug = true;
    gulp.start('default');
  });

}