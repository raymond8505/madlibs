var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer')({grid:true});
var clipPathPF = require('postcss-clip-path-polyfill');


gulp.task('default', function () {
    
    // gulp.watch(['public_html/js/src/*.js','../common/js/MultiFieldPortlet.js','../common/js/WorkspaceCalendar.js','../common/js/presenceFramework.js'],
    // {interval : 200},
    // gulp.series('compileJS'));
    
    gulp.watch([
        'src/*.scss',
        'src/css/*.scss'],
        {interval : 200},
        gulp.series('compileSASS'));
    //gulp.watch('public_html/css/dist/*.css',['compileCSS']);
    
});


function compileSASS(inPath = 'src/*.scss',outPath = 'src/css/'){

    return gulp.src(inPath)
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
        //.pipe(sourcemaps.write('.'))//  the sourcemap to the dist directory)
        .pipe(gulp.dest(outPath)).on('end',function(){
            gulp.series('compileCSS');
        });
    }

gulp.task('compileSASS',function(){
    return compileSASS();
});

gulp.task('compileCSS',function(){

    return gulp.src('*.css')
    .pipe(postcss([
        autoprefixer,
        clipPathPF
        ],{map:false}))
    .pipe(gulp.dest('src'));

        //fs.appendFileSync('public_html/css/dist/global.css','/*# sourceMappingURL=dist/global.css.map */');

    });

gulp.task('minifyAssets',function(){

    var vfs = require('vinyl-fs');

    vfs.src(['public_html/js/dist/dependencies.js'])
    .pipe(minify({
        ext:{
           min:'.min.js'
       }
   }))
    .pipe(vfs.dest('public_html/js/dist'));

    console.log('minify');

    return del('public_html/css/dist/min/global.css').then(function(){

        var cssnano = require('cssnano');

        return gulp.src('public_html/css/global.css')
        .pipe(postcss([
           cssnano({zindex: false})
           ]))
        .pipe(vfs.dest('public_html/css/dist/'));

    });

});

gulp.task('compileJS',function(){

    return del('public_html/js/dist/dependencies.js').then(function(){

//enter paths to javascript files you want to include in your dependencies.js file
//paths should be relative to your project's root directory
//ex: vendor/slick/js/slick.js
//do not include your global.js file here, it should remain separate so other people in the
//future can edit it
return gulp.src([
    '../common/js/platform.js',
    '../common/js/presenceFramework.js',
    '../common/js/lazysizes.min.js',
    '../common/js/headroom.min.js',
    '../common/js/ajax-emergency-alerts.js',
    '../common/js/multifield-portlet.js',
    '../common/js/slidedown.js',
    '../common/js/west-slick.min.js',
    '../common/js/selectfield.js',
    '../common/js/jquery-accessible-tabs.js',
    '../common/js/youtube-channel.js',
    '../common/js/iconfield.js',
    '../common/js/Settings.js',
    '../common/js/StorageCache.js',
    '../common/js/SiteMap.js',
    '../common/js/MultiFieldPortlet.js',
    '../common/js/WorkspaceCalendar.js',
    '../common/js/jssocials/jssocials.js',
    '../common/js/sharebtn.js',
    '../common/js/jquery-accessibleMegaMenu-hoverintent.js',
    '../common/js/widest.js',
    '../common/js/magic-line.js',
    //'../common/js/jQuery.succinct.js',
    '../common/js/multi-boolean-select.js',
    'public_html/vendor/fontfaceobserver.standalone.js'
    ])
.pipe(concat('dependencies.js')).pipe(gulp.dest('public_html/js/dist'));


});
});
