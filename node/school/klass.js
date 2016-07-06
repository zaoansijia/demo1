/**
 * Created by q on 2016/3/2.
 */
var student=require('./student');
var teacher=require('./teacher');
function  add(teacherName,students){
    teacher.add(teacherName)
    students.forEach((item,index)=>{
        student.add(item);
    });
}
exports.add=add
//module.exports=add  //module.exports是真实存在的；推荐使用exports。使用了module.exports就会忽略exports。