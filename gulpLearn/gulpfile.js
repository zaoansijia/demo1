/**
 * Created by yangliu2 on 2016/7/5.
 */

// 导入工具包 require('node_modules里对应模块')
var gulp      = require('gulp'), // 本地安装gulp所用到的地方
    less      = require('gulp-less'),
    cssMin    = require('gulp-clean-css'),
    jsMin     = require('gulp-uglify'),
    htmlMin   = require('gulp-htmlmin'),
    imageMin  = require('gulp-imagemin'),
    pngquant  = require('imagemin-pngquant'), // 深度压缩
    cache     = require('gulp-cache'),
    rev       = require('gulp-rev-append'),
    gutil     = require('gulp-util');

var SRC_PATH  = 'newSrc',
    DEST_PATH = 'dist';

function getSrc ( base,suffix ) {
    var url='';
    url=base + '/' + controllers[idx] + '/*' + ext
}
//  css 压缩
// 在命令行使用 gulp css 启动此任务
gulp.task('cssMin', function () {
    // 1. 找到文件
    return gulp.src('newSrc/css/*css')
        // 2. 压缩文件
        .pipe(cssMin())
        // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
})

// html 压缩
gulp.task( 'htmlMin' ,function() {
    var options={
        removeComments:true,//清除html注释
        collapseWhitespace:true,//压缩html
        collapseBooleanAttributes:true,//省略布尔属性的值，eg<input checked="true"/> ==> <input checked/>
        removeEmptyAttributes:true,//删除所有空格做属性值，eg：<input id="" /> ==> <input />
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src( 'newSrc/html/*html' )
        .pipe(htmlMin(options))
        .pipe(gulp.dest( 'dist/html' ));
})

// js 压缩
gulp.task( 'jsMin' ,function() {
    return gulp.src( 'newSrc/js/*js' )
        .pipe(jsMin())
        .pipe(gulp.dest( 'dist/js' ));
});


// 给页面引用url添加版本号，以消除页面缓存(未更新version，error)
gulp.task( 'testRev' ,function() {
    return gulp.src('src/htmlmin/*html')
        .pipe(rev())
        .pipe(gulp.dest('dist'))
})


// 定义一个less任务（自定义任务名称）
gulp.task( 'less' ,function() {
    return gulp.src('newSrc/less/index.less')
        .pipe(less())
        .pipe(gulp.dest('dist/less'));
});

// 压缩 image
gulp.task( 'imageMin' ,function() {
 return gulp.src('newSrc/img/*.{png,jpg,gif,ico}')
    .pipe(imageMin({
        progressive:true, // 类型：Bollean 默认：false 无损压缩jpg图片
        svgoPlugins:[{removeViewBox:false}],//不要移除svg的viewbox属性
        use:[pngquant()]//使用pngquant深度压缩png图片的imagemin插件
    }))
     .pipe(gulp.dest('dist/img'));
 })

// 只压缩 修改的图片
gulp.task( 'imageChangeMin' ,function() {
    return gulp.src('newSrc/img/*.{png,jpg,gif,ico')
        .pipe(cache(imageMin({
            proogressive:true,
            svgoPlugins:[{removeViewBox:false}],
            use:[pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

// change the color of gulp
gulp.task( 'gulpColor' ,function(done) {
    gutil.log('message');
    gutil.log(gutil.colors.red('error'));
    gutil.log(gutil.colors.green('message:') + "some");
    done();
})
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 如下 任务
    gulp.watch('newSrc/js/*js', gulp.series('jsMin'));
    gulp.watch('newSrc/html/*html', gulp.series('htmlMin'));
    gulp.watch('newSrc/css/*css', gulp.series('cssMin'));
    gulp.watch('newSrc/less/*less', gulp.series('less'));
});
gulp.task('default', gulp.series('auto'));
