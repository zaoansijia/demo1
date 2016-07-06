/**
 * Created by yangliu2 on 2016/7/5.
 */
//导入工具包 require('node_modules里对应模块')
var gulp=require('gulp')//本地安装gulp所用到的地方
    less=require('gulp-less');
    htmlmin=require('gulp-htmlmin');
    imagemin=require('gulp-imagemin');
    pngquant=require('imagemin-pngquant')//深度压缩
//定义一个testLess任务（自定义任务名称）
gulp.task('testLess',function(){
    gulp.src('src/less/index.less')//该任务针对的文件
        .pipe(less())//该任务调用的模块
        .pipe(gulp.dest('src/css'));将会在src/CSS下生成css
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
        .pipe(gulp.dest('src/html'))
})
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
gulp.task('testImagemin',function(){
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive:true,
            svgoPlugins:[{removeViewBox:false}],//不要移除svg的viewbox属性
            use:[pngquant()]//使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('src/img/img'));
})
gulp.task('default',['testLess','elseTask']);//定义默认任务为elseTask，该实例而没有elsetask。
//gulp.task(name[,deps],fn)定义任务 name：任务名；deps：依赖任务名称，fn：回调函数；
//gulp.src(globs[,options])执行任务处理文件，globs:处理的文件路径（字符串或字符窜数组）
// gulp.dest(path[,options])处理完文件生成路径