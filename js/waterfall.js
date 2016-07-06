/**
 * Created by q on 2015/12/16.
 */
$(window).on('load',function(){
   waterfall();
    //���
    var data_img=[{'src':'image/img1.jpg'},{'src':'image/2.jpg'},{'src':'image/3.jpg'},{'src':'image/4.jpg'},{'src':'image/5.jpg'}
        ,{'src':'image/6.jpg'},{'src':'image/7.jpg'},{'src':'image/8.jpg'},{'src':'image/9.jpg'},{'src':'image/10.jpg'}];

    $(window).on('scroll',function(){
        if(check_h()){
            $.each(data_img,function(index,value){
                var boxs=$('<div>').addClass('box').appendTo($('#menu'));
                var pics=$('<div>').addClass('pic').appendTo(boxs);
                $('<img>').attr('src',$(value).attr('src')).appendTo(pics);
            })
        }
        waterfall();
    });
});
//��������
function waterfall(){
    var boxs=$('.box');
    var win_wid=$(window).width();
    var box_wid=boxs.outerWidth();
    var cols=Math.floor(win_wid/box_wid);
    var h_arr=[];
    boxs.each(function(index,value){
        var pic_h=$(this).height()+15;
        if(index<cols){
            h_arr[index]=pic_h;
        }
        else{
            var min_h=Math.min.apply(null,h_arr);
            min_index= $.inArray(min_h,h_arr);
            var pic_w=boxs.eq(min_index).position().left;
            $(value).css({
                'position' : 'absolute',
                'top' : min_h,
                'left': pic_w
            });
            h_arr[min_index]+=pic_h;
        }
    })
}
function check_h(){
    //console.log(boxs.last());
    //console.log(boxs.last().get(0));
    //console.log(boxs.last().get(0))
    //so the get(0) will let an arrays of objects to a single object;equal the eq(0);
    var boxs=$('.box');
    var last_offseth=boxs.last().get(0).offsetTop+ Math.floor(boxs.last().height()/2);
    var ws_h=$(window).height()+$(document).scrollTop();
    return (last_offseth<ws_h) ? true : false;

}