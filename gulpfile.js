var gulp =  require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var del = require('del');
var zip = require('gulp-zip');

//file paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Handlebars plugins
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

//Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

//Styles
gulp.task('styles', function() {
    console.log('starting styles task');
    return gulp.src(['public/css/reset.css', CSS_PATH])
          .pipe(plumber(function(){
             console.log('Styles Task Error');
             console.log(err);
             this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
               browsers: ['last 2 versions', 'ie 8']
             }))
            .pipe(concat('styles.css'))
            .pipe(minifyCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(DIST_PATH))
            .pipe(livereload());
});

//scripts
gulp.task('scripts', function(){
    console.log('Starting scripts task');
    
    return gulp.src(SCRIPTS_PATH)
         .pipe(plumber(function(err){
             console.log('scripts Task error');
             console.log(err);
             this.emit('end');
            
         }))
         .pipe(sourcemaps.init())
         .pipe(babel({
             presets: ['es2015']
         }))
         .pipe(uglify())
         .pipe(concat('scripts.js'))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest(DIST_PATH))
         .pipe(livereload());
})

//images
gulp.task('images', function(){
    return gulp.src(IMAGES_PATH)
           .pipe(imagemin(
              [
                  imagemin.gifsicle(),
                  imagemin.jpegtran(),
                  imagemin.optipng(),
                  imagemin.svgo(),
                  imageminPngquant(),
                  imageminJpegRecompress()
              ]
            ))
           .pipe(gulp.dest(DIST_PATH + '/images'))
});

//templates
gulp.task('templates', function () {
	return gulp.src(TEMPLATES_PATH)
		.pipe(handlebars({
			handlebars: handlebarsLib
		}))
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'templates',
			noRedeclare: true
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

gulp.task('clean', function(){
    return del.sync([
        DIST_PATH
    ])
})

gulp.task('default',['clean','images','templates','styles','scripts'] , function(){
    console.log('starting default task');
});

gulp.task('export', function(){
    return gulp.src('public/**/*')
               .pipe(zip('website.zip'))
               .pipe(gulp.dest('./'))
})

gulp.task('watch',['default'], function(){
    console.log('starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(CSS_PATH, ['styles']);
    gulp.watch(TEMPLATES_PATH, ['templates']);
});


