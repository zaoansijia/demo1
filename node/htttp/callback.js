/**
 * Created by q on 2016/3/10.
 */
//hui'diao
function learn(someting){
    console.log(someting)
}
function we(callback,someting){
    someting +=' is cool';
    callback(someting);
}
we(learn,'Nodejs');
we(function(someting){
    console.log(someting)
},'Jade');