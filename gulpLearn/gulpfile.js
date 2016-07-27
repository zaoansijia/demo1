/**
 * Created by yangliu2 on 2016/7/5.
 */
//导入工具包 require('node_modules里对应模块')
var gulp=require('gulp');//本地安装gulp所用到的地方
var less=require('gulp-less');
var htmlmin=require('gulp-htmlmin');
var imagemin=require('gulp-imagemin');
var pngquant=require('imagemin-pngquant')//深度压缩
var cache=require('gulp-cache');
var cssmin=require('gulp-clean-css');
var rev=require('gulp-rev-append');
//给页面引用url添加版本号，以消除页面缓存(未更新version，error)
gulp.task('testRev',function(){
    gulp.src('src/htmlmin/*html')
        .pipe(rev())
        .pipe(gulp.dest(src/htmlmin/rev))
})
//这个还有点问题，空格没有清除。
gulp.task('testCssmin',function(){
    gulp.src('src/cssmin/*css')
        .pipe(cssmin({
            advanced:false,
            compatibility:'ie7',//类型：Boolean,默认：true[是否开启高级优化（合并选择器）]
            keepBreaks:true,//保留ie7及以下兼容写法 类型：String默认：‘’or'*'[启用兼容模式；'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepSpecialComments: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀。
        }))
        .pipe(gulp.dest('src/cssmin/mincss'))
})
//定义一个testLess任务（自定义任务名称）
gulp.task('testLess',function(){
    gulp.src('newSrc/less/index.less')//该任务针对的文件
        .pipe(less())//该任务调用的模块
        .pipe(gulp.dest('dist/less'));
});
//定义testHtmlmin，用于压缩文件
gulp.task('testHtmlmin',function(){
    var options={
        removeComments:true,//清除html注释
        collapseWhitespace:true,//压缩html
        collapseBooleanAttributes:true,//省略布尔属性的值，eg<input checked="true"/> ==> <input />
        removeEmptyAttributes:true,//删除所有空格做属性值，eg：<input id="" /> ==> <input />
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/htmlmin/index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('src/htmlmin/html'))
});

//定义testImagemin,用于压缩图片
/*--gulp.task('testImagemin',function(){
 var options={
 optimizationLevel:5,//类型：Number 默认：3，取值范围：0-7（优先等级）
 progressive:true,//类型：Bollean 默认：false 无损压缩jpg图片
 interlaced:true,//类型：Bollean 默认：false 隔行扫描gif进行渲染
 multipass: true//类型：Bollean 默认：false 多次优化svg直到完全优化
 };
 gulp.src('src/images/*.{png,jpg,gif,ico}')
 .pipe(imagemin(options))
 .pipe(gulp.dest('src/images/images'))

 })--*/
/*---gulp.task('testImagemin',function(){
 gulp.src('src/img/*.{png,jpg,gif,ico}')
 .pipe(imagemin({
 progressive:true,
 svgoPlugins:[{removeViewBox:false}],//不要移除svg的viewbox属性
 use:[pngquant()]//使用pngquant深度压缩png图片的imagemin插件
 }))
 .pipe(gulp.dest('src/img/img'));
 })---*/
//只压缩修改的图片
gulp.task('testImagemin',function(){
    gulp.src('src/img/*.{png,jpg,gif,ico')
        .pipe(cache(imagemin({
            proogressive:true,
            svgoPlugins:[{removeViewBox:false}],
            use:[pngquant()]
        })))
        .pipe(gulp.dest('src/img/img'));
});

//gulp.task('default', gulp.series('testLess'));
//gulp.task('default',['testLess']);//定义默认任务
//gulp.task(name[,deps],fn)定义任务 name：任务名；deps：依赖任务名称，fn：回调函数；
//gulp.src(globs[,options])执行任务处理文件，globs:处理的文件路径（字符串或字符窜数组）
// gulp.dest(path[,options])处理完文件生成路径