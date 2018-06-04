var gulp =  require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');

//file paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';

//Styles
gulp.task('styles', function() {
    console.log('starting styles task');
    return gulp.src(['public/css/reset.css', CSS_PATH])
        .pipe(plumber(function(){
           console.log('Styles Task Error');
           console.log(err);
           this.emit('end');
        }))    
        .pipe(autoprefixer({
               browsers: ['last 2 versions', 'ie 8']
             }))
            .pipe(concat('styles.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest(DIST_PATH))
            .pipe(livereload());
});

//scripts
gulp.task('scripts', function(){
    console.log('Starting scripts task');
    
    return gulp.src(SCRIPTS_PATH)
         .pipe(uglify())
         .pipe(gulp.dest(DIST_PATH))
         .pipe(livereload());
})

//images
gulp.task('images', function(){
    console.log('Starting images tasks');
})

gulp.task('default', function(){
    console.log('starting default task');
});

gulp.task('watch', function(){
    console.log('starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(CSS_PATH, ['styles']);
});


