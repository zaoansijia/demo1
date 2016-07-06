/**
 * Created by q on 2016/3/10.
 *///全局作用域。
var globalVariable='this is global variable'//globalVariable全局变量
function  globalFunction(){
    var localVariable='this is local variable'//局部变量
    console.log('visit global/local variable')
    console.log(globalVariable)
    console.log(localVariable)
    console.log('this is changed variabld')
    function  localFuntion(){
        var innerLocalVariable='this is inner local variable'
        console.log('visit global/local/inner variable')
        console.log(globalVariable)
        console.log(localVariable)
        console.log(innerLocalVariable)
    }
    localFuntion()
}//这个函数里面就是局部作用域
globalFunction();