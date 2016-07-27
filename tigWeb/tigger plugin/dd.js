window._gaq = window._gaq || [];
$.ajaxSetup({'cache':false});
$.sendPrizeNew = function(exprId,setting){
    new $.sendPrizeNew.prototype.init(exprId,setting);
};
$.sendPrizeNew.prototype={
    constructor : $.sendPrizeNew,
    startTime:new Date() - 0,
    bg:'http://image.meilele.com/images/201406/140314561580.png',
    styleInserted:false,

    init:function(exprId,setting){
        if( $._currentSendPrizeBox )return;
        $._currentSendPrizeBox = this;
        this.setting = $.extend({
            type:'_default',
            phoneNumber: $.cookie("sendSmsPhone") || false,
            autoSend:false,
            checkPhone:false,
            defaultCityId:parseInt($.cookie('region_id')),
            onSuccess: function(){}
        },setting);
        this.init2();

        this.cfg = this.defaultCfg[ this.setting.type ] || this.defaultCfg._default;
        if(  this.setting.exprInfo && this.setting.exprInfo.exprList )delete this.setting.exprInfo.exprList;//删除体验馆列表信息
        this.exprId = exprId;
        this.isNeedImgChap = true;
        this.setStyleRule();
        this.getIsNeedImgChap();
        this.showPrize();
        this.msgBox = $("#error_info");

        //this.dom = this.show();
        //获取localStorage属性
        $._currentSendPrizeBox.storage = window.JSON && window.JSON.parse && window.localStorage && window.localStorage.setItem && window.localStorage;
        if ( $._currentSendPrizeBox.storage && $._currentSendPrizeBox.storage.sendSmsStorage ) {
            var oldJson = JSON.parse($._currentSendPrizeBox.storage.sendSmsStorage);
            $._currentSendPrizeBox.day =  (new Date().getTime() - oldJson.expire)/(1000*3600*24);
            if ( $._currentSendPrizeBox.day < 1 ) {
                // this.initData( this.init2 );	//临时需要，始终全部从接口取数据
                this.analysisExprList( oldJson , this.init2);//体验馆走本地取
                this.initData( this.init2 , '&contentType=1' ); //发送人数走接口取
            }
        }
        if ( !$._currentSendPrizeBox.storage || !$._currentSendPrizeBox.storage.sendSmsStorage || ( $._currentSendPrizeBox.storage && $._currentSendPrizeBox.storage.sendSmsStorage && $._currentSendPrizeBox.day >= 1 ) ) {
            this.initData( this.init2 );

        };
        // 判断是否是IE6
        if ( !!window.ActiveXObject && !window.XMLHttpRequest ) {
            $._currentSendPrizeBox.getScrollTop();
            $(window).scroll(function(){
                $._currentSendPrizeBox.getScrollTop(); //让IE6下的弹框始终固定在屏幕的某个位置
            });
        }
    },
    showPrize:function(){
        var contents=[
            {'image':''+$.__IMG+'/images/prizeNew/img1.png','name':'大型微波炉1','price':'￥390'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉2','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉3','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉4','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉5','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉6','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉7','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉8','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉9','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img1.png','name':'大型微波炉1','price':'￥390'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉2','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉3','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉4','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉5','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉6','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉7','price':'￥290'},
            {'image':''+$.__IMG+'/images/prizeNew/img2.png','name':'大型微波炉8','price':'￥290'}
        ]
        var out='';
        var prize_html=function(){
            if(contents!=null){
                for (var i = 0; i < contents.length; i++) {
                    out += "<li>";
                    out += "<div>";
                    out += "<img src='"+contents[i].image+"'/>";
                    out += "</div>";
                    out += "<div class='txt'>";
                    out +="<span>";
                    out +=contents[i].name;
                    out += "</span>";
                    out +="<span class='price'>";
                    out +=contents[i].price;
                    out += "</span>";
                    out +="</div>"
                    out += '</li>'
                }
            }
        }
        out+='<div class="prize_content">'
        out+='<div class="prize_head" style=""></div>';
        out+='<div class="prize_title" style=""></div>';
        out+='<div class="prize_box">';
        out+='<div class="prize_left" style=""></div><div class="prize_middle">';
        out+='<div class="num" id="num1">';
        out+='<ul class="p_num">';prize_html();
        out+='</ul>';
        out+='<ul class="p_clone"></ul></div>';
        out+='<div class="num" id="num2">';
        out+='<ul class="p_num">';prize_html();
        out+='</ul>';
        out+='<ul class="p_clone"></ul></div>';
        out+='<div class="num" id="num3">';
        out+='<ul class="p_num">';prize_html();
        out+='</ul>';
        out+='<ul class="p_clone"></ul></div>';
        out+='</div>';
        out+='<div class="prize_right" style=""></div></div>';
        out+='<div class="prize_bottom"><a src="" href="#">点击我</a></div></div>'
        $('.main-info').append(out);
        this.setscroll();

    },
    setscroll:function(){
        var that=this;
        var timeout=false;
        var mytimer = [];
        var machine1=$('#num1');
        var machine2=$('#num2');
        var machine3=$('#num3');
        //setStart(machine1,0,100);setStart(machine2,1,100);setStart(machine3,2,100);
        //setTimeout(function(){
        //	setStart(machine2,1,100);
        //}, 1000);
        //setTimeout(function(){
        //	setStart(machine3,2,100)
        //}, 2000);
        function setStart(item,index,speed){

            mytimer[index]=setInterval(function(){
                scroll(item,speed)
            },100)
        }
        function scroll(item,speed){
            if(timeout) return;
            item.animate({"marginTop":'-='+speed+'px'},'0','linear',function(){
                var s = Math.abs(parseInt(item.css("margin-top")));
                var container=item.find('.p_num')
                if(s >=1500 ){
                    container.find(".p_num li").slice(0, 1).appendTo(container);
                    item.css("margin-top",0)
                }
            })}
        //$('.num').each(function(index){
        //	var _num=$(this);
        //	var speed=58;
        //	var container=_num.find('.p_num')
        //	function scroll(){_num.animate({"marginTop":'-=100'},'5000','linear',function(){
        //		var s = Math.abs(parseInt(_num.css("margin-top")));
        //		if(s >=1500 ){
        //			container.find("li").slice(0, 1).appendTo(container);
        //			_num.css("margin-top",0)
        //		}
        //	})}
        //	if(index==0){
        //		mytimer[index]=setInterval(scroll,100);
        //	}
        //
        //	//clearInterval(mytimer[1]);
        //	//clearInterval(mytimer[2]);
        //	//clearInterval(mytimer);
        //	if(index==1){
        //		setTimeout(setInterval(scroll,100),5000)
        //
        //	}
        //	});
        $('.prize_bottom').click(function(){
            timeout=true;

            //setStart(machine1,0,450);
            clearInterval(mytimer[0]);
            clearInterval(mytimer[1]);
            clearInterval(mytimer[2]);
            that.showBox(1);
        })
    },
    insertCity:function(){
        $('#JS_sms_change_city').hide();
        var that = this;
        var json = this.cityInfo;
        if( json ){
            var h = '';
            var tmpSelectedProvinceId;
            var k;
            h+= '<div class="clearfix" style="height:43px;">';
            h+=	'<label class="Left">所在地：</label>';
            h+=	'<div class="_selectbox Left" style="height:25px;padding-top:5px;margin-right:5px;border:1px solid #ddd;" id="JS_sms_pro_sel_box"><select class="_sndsms_select" id="_JS_sndSms_province_list_" style="background: #fafafa;border:0px;margin:0;padding:0px;" onchange="$._currentSendPrizeBox.provinceSelected(this.value);">';
            h+=	'<option value="0">请选择省</option>';
            for(k in json){
                var selectString = '';
                if( this.setting.defaultCityId && json[k] && json[k].cityList && json[k].cityList[ this.setting.defaultCityId ] ){
                    selectString = ' selected="selected"';
                    tmpSelectedProvinceId = k;
                }
                h += '<option value="'+k+'"'+selectString+'>'+json[k].provinceName+'</option>';
            }
            h+=	'</select></div>';
            h+=	'<div class="_selectbox Left" style="height:25px;padding-top:5px;border:1px solid #ddd;" id="JS_sms_city_sel_box" style="margin-left:12px;"><select class="_sndsms_select" id="_JS_sndSms_city_list_" onchange="$._currentSendPrizeBox.citySelected(this.value,this.options[this.selectedIndex].innerHTML);"><option value="0">请选择市</option></select></div>';
            h+=	'</div>';
            if ( this.setting.type != 'quick_search') {
                $('#_JS_sndSms_city_select_').html(h);
            }
            if( tmpSelectedProvinceId )this.provinceSelected(tmpSelectedProvinceId);
        }else{
            this.initData( this.insertCitySelect );
        }
    },

    showTimer:function(){
        var that=this;
        var mytimer = []
        $('.num').each(function(index){
            var _num=$(this);
            setTimeout(function(){
                _num.animate({
                    marginTop: -1720
                },{
                    duration:1000+index*1000,
                    easing:'swing',
                    //complete:function(){
                    //	if(nidex==2) isBegin=false;
                    //}
                })
            },index*600);
        });
    },
    showBox:function(type) {
        var outhtml = '';
        var st = this.setting.mobile_default_text || '请输入您的手机号';
        var txt_time = this.setting.alert_default_text;
        var title = '';
        switch (type) {
            case 1:
                title = this.setting.title;
                outhtml += '<p style="line-height:18px;color: #898989;font-size: 13px;margin-bottom: 15px">'
                outhtml += '<span style="font-weight: bold">温馨提示:</span>请于' + txt_time + '期间参与；红包序列号以短信形式发送手机,请注意查收;实物奖品在活动结束后统一发放,请耐心等待';
                outhtml += '</p>'
                outhtml += '<div id="_JS_sndSms_city_select_">'
                outhtml += '</div>';
                outhtml += '<div id="_JS_sndSms_expr_select_"></div>';
                outhtml += '<div id="JS_phone_boxdiv"><label for="_JS_sndSms_input_">手机号：</label><input class="sms_input _sms_shadow" style="margin-right:5px;vertical-align:top;" value="' + (this.setting.phoneNumber || st) + '" onfocus="if(this.value==\'' + st + '\')this.value=\'\';$(\'#_JS_sendSms_phone_icon\').hide();" onkeypress="$._currentSendPrizeBox.keyPress(event);" onblur="$._currentSendPrizeBox.phoneOnBlur(this);" id="_JS_sndSms_input_" name="_JS_sndSms_input_" /><span class="_check_icon" id="_JS_sendSms_phone_icon"></span></div>';
                outhtml += '<div><span id="_JS_sndSms_prz_tishiA" style="margin-left:90px;display:none;"></span></div>';
                // 是否需要图形校验码
                if ($._currentSendPrizeBox.isNeedImgChap) {
                    outhtml += '<div style="margin-top:12px;" id="JS_img_check_box"><label for="_JS_sndSms_captcha_">验证码：</label><input class="sms_captcha _sms_shadow" value="' + ( this.setting.captcha || '') + '" onfocus="$._currentSendPrizeBox.msgBox.html(\'\');if(this.value==\'验证码\')this.value=\'\'" id="_JS_sndSms_captcha_" name="_JS_sndSms_captcha_" onkeypress="$._currentSendPrizeBox.keyPress(event);" ><img src="/solr_api/captcha/getCaptcha.do?&_=0.23046009114496724" style="width:75px;margin-right:5px;height:30px;vertical-align:top;margin-left:8px;cursor:pointer" title="换一张" onclick="$._currentSendPrizeBox.getCaptcha();$._currentSendPrizeBox._reset_captcha();return false;" id="_JS_sndSms_captchaImg_" />';
                    outhtml += '<span class="_check_icon" id="_JS_sendSms_captcha_icon"></span>';
                    outhtml += '</div>';
                }
                //添加手机校验码
                outhtml += '<div id="_JS_sndSms_cellcaptcha_"></div>';
                outhtml += '<div class="alert_submit"><span class="bird"></span><input id="_JS_sndSms_btn_" type="button" class="pointer alert_button" onclick="$._currentSendPrizeBox.send();" value="' + ( this.setting.type == 'quick_search' ? '查  询' : '免费发送' ) + '" />&emsp;</div>';
                // 当类型为快速查询时，不显示已发送人数
                if (this.setting.type != 'quick_search') {
                    outhtml += '<div style="text-align:center;font-size:14px;font-family:微软雅黑;">已有<span style="color:#ff4f01;font-weight: bold;" id="JS_sms_prize_num_box">' + this.prize_num + '</span>人发送成功</div>';
                };
                outhtml +='<div id="error_info"></div>'
                outhtml += '</div>';
                break;
            case 2:
                title = '中奖啦!';
                outhtml += '<p class="yes_title1">恭喜您获得</p>'
                outhtml += '<p class="yes_title2">国美电器微波炉一件 !</p>'
                outhtml += '<p style="padding:0 40px;line-height:18px;color: #898989;font-size: 14px;margin-bottom: 15px">红包序列号以短信形式发送手机,请注意查收;实物奖品在活动结束后统一发放,请耐心等待</p>'
                outhtml += '<div class="alert_submit"><span class="bird"></span><input id="_JS_sndSms_btn_" type="button" class="pointer alert_button" onclick="$._currentSendPrizeBox.remove();" value="朕知道了" />&emsp;</div>';
                break;
            default:
                titile = '出错啦!'
        }
        ;
        var out = '';
        out += '<div class="w" style="position:relative;">';
        out += '<div class="alert_box">';
        out += '<div style="position: relative">'
        out += '<h2 class="alert_title">' + title + '</h2>';
        out += '<div style="position:absolute;z-index:11;top: 5px;right: 5px;" ><a class="sms_close_btn" href="javascript:;" onclick="$._currentSendPrizeBox.remove();">&times;</a></div>'
        out += '</div>'
        out += '<div class="alert_content sms_content">';
        out += '</div>';
        out += '</div>'
        out += '</div>';
        var tmpBox = $.lightBox(out, {}, true, false, false, false, 'sms_lightbox');
        $('.alert_content.sms_content').html(outhtml);
        //this.insertCitySelect();
        this.insertCellCaptcha();
        this.insertExprSelect();
    },

    setStyleRule: function(){
        if(!this.styleInserted) {
            var css=[];
            var style;
            //prize start
            css.push('.prize_content{width:682px;}');
            css.push('.prize_head{width:682px;height:171px;background: url('+this.setting.bgs.prize_head+')}');
            css.push('.prize_title{width:682px;height:90px;background: url('+this.setting.bgs.prize_title+')}');
            css.push('.prize_box{overflow:hidden;}')
            css.push('.prize_left{width:66px;height:308px;background: url('+this.setting.bgs.prize_left+')}');
            css.push('.prize_right{width:104px;height:308px;background: url('+this.setting.bgs.prize_right+')}')
            css.push('.prize_left,.prize_middle{float:left;}');
            css.push('.prize_right{float:right}');
            css.push('.prize_middle{height:308px;}')
            css.push('.prize_bottom{width:682px;height:130px;background: url('+this.setting.bgs.prize_bottom+')}')
            css.push('.p_clone{display:block;}')
            css.push('.num{float:left;border-right:6px solid #7e1a00;}')
            css.push('.num:first-child{border-left:5px solid #7e1a00;}')
            css.push('.p_num{background-color:#ffa800;float:left;}')
            css.push('.p_num li{border-bottom:3px solid #db7303}');
            css.push('.p_num li img{background-color:#ffa800;}')
            css.push('.p_num li .txt{border-bottom: 2px solid #f17d00;height: 32px;line-height: 27px;font-size: 14px;text-align: center;}')
            css.push('.p_num li .txt .price{font-weight:bold;margin-left:10px;color:#ff0700;}');
            css.push('.alert_box{position:absolute;left:50%;overflow:hidden;z-index:9;width:421px;top:50%;}')
            css.push('.alert_title{background: url('+this.setting.bgs.a_title+');height: 67px;font-size: 22px;text-align: center;line-height: 67px;font-weight: bold;color: #fff;}');
            css.push('.alert_content{border:5px solid #addf00;min-height:225px;background-color:#fff;border-top:0;padding:22px;}')
            css.push('.alert_button{border:none;font-family:微软雅黑;font-weight:bold;border-radius:20px;width:160px;height:42px;line-height:42px;background-color:#ff4f01;font-size:20px;color:#fff;}')
            css.push('.alert_button:hover:{background:red}')
            css.push('.alert_submit{margin-top:20px;margin-bottom:10px;position:relative;text-align:center;}')
            css.push('.bird{width:37px;height:61px;position: absolute;top: -12px;left: 105px;backround-color:none;background:url('+this.setting.bgs.bird+')}')
            css.push('.yes_title1,.yes_title2{color: #ff4f01;font-weight: bolder;font-size: 22px;font-family: 微软雅黑;text-align: center;}')
            css.push('.yes_title1{margin-top: 17px;}')
            css.push('.yes_title2{margin-top: 7px;margin-bottom: 14px;}')
            //prize end
            css.push('.sms_lightbox{top:' + (($(window).height() - 440 ) / 2) + 'px;}');
            css.push('.sms_box{width:420px;background:#fff;overflow:hidden;position:absolute;margin-left:295px;z-index:9;}');
            css.push('.root_body .sms_box{margin-left:421px}');
            css.push('.sms_title_box{height:38px;width:342px;cursor:move;position: absolute;left: 20px;line-height:40px;border-bottom:1px solid #dedede;padding-left:35px;color:#333;background:url('+this.bg+') 0px 0px no-repeat;overflow:hidden;padding-bottom:10px;}');
            css.push('.sms_content {padding-top:19px;}');
            css.push('.sms_content .red {color: #c9033b;line-height:22px;}');
            css.push('.sms_input {width:145px;background: #fafafa;border:1px solid #ddd;border-radius: 2px;padding:7px 0 7px 5px;margin:0;color:#555;}');
            css.push('._sms_shadow:focus{transition:border linear .2s,box-shadow linear .2s;-moz-transition:border linear .2s,-moz-box-shadow linear .2s;-webkit-transition:border linear .2s,-webkit-box-shadow linear .2s;outline:none;border-color:#6db9e0;box-shadow:0 0 4px #7fcaf1;-moz-box-shadow:0 0 4px #7fcaf1;-webkit-box-shadow:0 0 4px #7fcaf1;}');
            css.push('.sms_captcha {width:68px;background: #fafafa;border-radius: 2px;border:1px solid #ddd;padding:7px 0 7px 5px;margin:0;vertical-align:top;color:#555;}');
            css.push('.sms_content label {height:28px; line-height: 28px;width:128px;text-align:right;display:inline-block;vertical-align:top;}');
            if( this.exprId )css.push('.sms_content label{width:120px;}');
            css.push('.sms_submit{height:32px;width:110px;color:#fff;text-align:center;border:1px solid #c9033b;border-radius:2px;margin:0;padding:0;font-weight:bold;line-height:32px;background:#d1033d;font-size:16px;font-weight:微软雅黑}');
            css.push('.sms_submit:hover {background:#ec0042}');
            css.push('._sndsms_select{background: #fafafa;border:0px;margin:0;padding:0px;width:150px;}');
            css.push('#_JS_sndSms_city_list_,#_JS_sndSms_province_list_{width:95px;}');
            css.push('._check_icon{display:inline-block;height:16px;width:15px;margin-top:9px;}');
            css.push('.sms_captcha_success{background:url('+$.__IMG+'/images/check_icon8.png) 0 -8px no-repeat}' );
            css.push('.sms_captcha_error{background:url('+$.__IMG+'/images/check_icon8.png) 0 -30px no-repeat}');
            css.push('#error_info{ font-size: 14px;font-family: 微软雅黑;text-align: center;margin-top: 10px;color: #ff4f01;}')
            //手机校验码样式
            css.push('.prz_captcha {width:60px;}');
            css.push('.prz_yuanjiao {background:#FAFAFA;text-align:center;font-family:Arial;border:1px solid #ccc;border-radius:3px;padding:6px 6px;display:inline-block;margin-left:8px;height:16px;width:62px;color:#333;}');
            css.push('.prz_cellcaptcha {width:68px;}');
            css.push('.prz_sure_inline{display:inline-block;}');
            css.push('.prz_sure {margin-left:10px;width:100px;height:20px;padding-top:8px;color:#0099CC;display:none;}');
            css.push('.prz_yuanjiao3 {width:100px;color:#999999;display:none;}');
            css.push('.prz_yuanjiao5 {width:136px;color:#999999;display:none;margin-left:5px;}');
            //二维码 --start
            css.push('.sms_content .twoDimensionCodeStage{width:367px;border-top: dotted 1px #e1e1e1;margin:10px auto 0 auto;padding-top:15px;text-align:center;}');
            css.push('.sms_content .twoDimensionCodeStage .twoDimensionCode {height:82px;padding:0 11px;margin:0 auto;overflow:hidden;}');
            css.push('.sms_content .twoDimensionCodeStage .twoDimensionCode a{display:inline-block;padding-left:10px;height:82px;}');
            css.push('.sms_msg_box{color:#c9033b;padding:8px 20px 7px 110px;text-align:left;}');
            css.push('.sms_content label,.sms_content option,.sms_content select{color:#333;}');
            css.push('.sms_content label{font-size:14px;font-family:微软雅黑}');
            css.push('.sms_content .twoDimensionCodeStage {width:auto;background:#fff8ee url(http://image.meilele.com/images/zhuanti/upload/h4_1398411049.jpg) 0 0 repeat-x;border-top:none}');
            css.push('.sms_content .twoDimensionCodeStage .twoDimensionCode{height:auto;padding-bottom:10px;}');
            css.push('.sms_close_btn{font-size:26px;color:#b3b3b3;font-family: "宋体";}');
            css.push('.sms_close_btn:hover{text-decoration:none}');
            css.push('.sms_content .twoDimensionCodeStage .twoDimensionCode a{height:74px;}');
            css.push('.sms_content label{width:90px;}');
            css.push('.sms_content .twoDimensionCodeStage .twoDimensionCode a{height:auto;padding-bottom:5px;}');
            css.push('.sms_main_box .sndSms_notice{width:325px;height:auto;background:#f7f3cd;color:#e18f00;margin:0 auto; margin-bottom:12px;text-align: center;padding: 5px 10px;font-family: "Microsoft Yahei";display:none;}')
            if( this.setting.type == "quick_search" )css.push('.quicksearchDiv{margin:11px 0px 25px 35px;}');
            $.insertStyle( css.join('') );
            this.styleInserted = true;
        }
    },

    getScrollTop:function(){
        var ie6Top = $(window).scrollTop() + 150;
        $('.sms_lightbox').css({'top':ie6Top+'px'});
    },
    analysisExprList:function(json,callback){
        this.exprInitData = {};
        this.callback = callback
        var tmpD = {};
        if( this.exprId ){//设置默认城市
            for(var k = 0 ; k < json.expr_list.length ; k++){
                if( json.expr_list[k] && json.expr_list[k].expr_id == this.exprId ){
                    this.setting.defaultCityId = json.expr_list[k].city_id;
                    break;
                }
            }
        }
        for(var k = 0 ; k < json.expr_list.length ; k++){
            var d = json.expr_list[k];
            var pid = d.province_id;
            var cid = d.city_id;
            var eid = d.expr_id;
            this.exprInitData[eid] = d;
            if( !tmpD[ pid ] ){
                tmpD[ pid ] = {
                    provinceName:d.province__name,
                    cityList : {}
                };
            }
            if( !tmpD[ pid ].cityList[ cid ] ){
                tmpD[ pid ].cityList[cid] = {
                    cityName:d.city__name,
                    exprList:{},
                    exprInfo:{}
                };
            }
            tmpD[ pid ].cityList[cid].exprList[eid] = d.expr_alias;
            tmpD[ pid ].cityList[cid].exprInfo[eid] = d;
            if( cid == this.setting.defaultCityId || ( this.setting.exprInfo && this.setting.exprInfo.cityName == d.city__name ) ){
                this.selectedProvinceId = pid;
                this.selectedCityId = cid;
                this.setting.exprInfo = this.setting.exprInfo || {};
                this.setting.exprInfo.cityName = d.city__name;
                this.setting.exprInfo.exprList = this.setting.exprInfo.exprList || [];
                this.setting.exprInfo.exprList.push({
                    exprName:d.expr_alias,
                    exprId:d.expr_id,
                    position:d.position,
                    need_appointment:d.need_appointment
                });
            }
        }
        this.successAdInfo = json.ad_info;
        this.real_expr_num = json.real_expr_num;
        this.cityInfo = tmpD;
        if( !this.selectedProvinceId && !this.selectedCityId ){
            this.insertCitySelect();
        }else{
            this.insertExprSelect();
        }
        if( this.callback ) this.callback.call( this , json );
    },
    getPrizeNum:function(json){
        this.prize_num = json.prize_num;
        if( json.prize_num > 0 ){
            if ( $._currentSendPrizeBox.setting.type == "get_limited_prize") return;//领取有限红包功能不显示领取人数
            $('#JS_sms_prize_num_box').html( json.prize_num ).parent().show();
        }
    },
    initData:function( callback,contentType ){
        var code = this.setting.type+"_success_notice";
        var that = this;
        //type为get_limited_prize时需根据唯一标识unique获取其记录条数;传入contentType时，不获取体验馆的列表。传入contentType时，不获取体验馆的列表信息
        var initeUrl = '/mll_api/api/send_message&type='+this.setting.type+(this.setting.unique?'&activity='+this.setting.unique:"")+'&ad_code='+code+(contentType?contentType:"");
        $.ajax({
            url:initeUrl,
            dataType:'json',
            success:function( json ){
                if ( contentType ) {
                    that.getPrizeNum(json);
                }else{
                    that.analysisExprList(json);
                    that.getPrizeNum(json);
                    if ( $._currentSendPrizeBox.storage || ( $._currentSendPrizeBox.storage && $._currentSendPrizeBox.day > 1 ) ) {
                        json.expire = new Date().getTime();//增加一个字段保存存入时的时间戳
                        $._currentSendPrizeBox.storage.setItem('sendSmsStorage',JSON.stringify(json));//存入localStorage
                    };
                }
                if( callback )callback.call( that , json );
            },
            error:function(){
                this.remove();
                $.alert('发生网络错误，请稍候再试！');
            }
        });
    },
    init2:function(){
        if( this.init2IsReady )return;
        this.init2IsReady = true;
        var exprId = this.exprId;
        this.exprId = exprId;
        if( !this.selectedProvinceId && !this.selectedCityId ){
            this.insertCitySelect();
        }else{
            this.insertExprSelect();
        }
        this.msgBox = $("#error_info");
        this.inpt   = $("#_JS_sndSms_input_");
        this.btn   = $("#_JS_sndSms_btn_");
        this.captcha = $('#_JS_sndSms_captcha_');
        this.captchaImg = $('#_JS_sndSms_captchaImg_');
        //添加 手机验证码 节点对象
        this.cellcaptcha = $('#_JS_sndSms_prz_cellcaptcha_');
        //获取移动box对象
        this.mBox = $('#_JS_sms_title_box');
        this.sBox = $('#_JS_sms_box');
        if( !this.initMouseDownEvent ){
            this.mBox.on('mousedown',function(e){
                if(e && e.preventDefault) {
                    e.preventDefault();
                }else{
                    event.returnValue = false;
                }
                $._currentSendPrizeBox.x = e.pageX
                $._currentSendPrizeBox.y = e.pageY;
                $._currentSendPrizeBox.marginLeft = parseInt($._currentSendPrizeBox.sBox.css('margin-left'));
                $._currentSendPrizeBox.marginTop  = parseInt($._currentSendPrizeBox.sBox.css('margin-top'));
                $._currentSendPrizeBox.isMousedown = true;
            });
            $(document).on( 'mousemove' , function(ev){
                if( $._currentSendPrizeBox && $._currentSendPrizeBox.isMousedown ){
                    var _x = ev.pageX - $._currentSendPrizeBox.x + $._currentSendPrizeBox.marginLeft;
                    var _y = ev.pageY - $._currentSendPrizeBox.y + $._currentSendPrizeBox.marginTop;
                    $._currentSendPrizeBox.sBox.css({'margin-left':_x+"px",'margin-top':_y+"px"});
                }
            } ).on('mouseup',function(){
                if($._currentSendPrizeBox)$._currentSendPrizeBox.isMousedown = false;
            });
            this.initMouseDownEvent = true
        }
        //抽奖时间限制设置：
        this._mobile_captcha_times_limit_g = window._mobile_captcha_times_limit || 120;
        this.inpt.on('blur',$._currentSendPrizeBox.hiddenPhone);
        $('#_JS_sndSms_input_').on('blur',function(){
            alert('ssssssss')
        })
        if( this.setting.checkPhone ){
            //添加参数
            this.setting.flag = 0;//控制获取手机校验码a
            this.setting.pNumber = 0;//用户输入的手机号
            //显示
            this.insertCellCaptcha();
            //手机号输入框 onblur事件绑定
            this.inpt.on('focus',$._currentSendPrizeBox.value_null);
            //手机校验码 onblur事件绑定
            $('#_JS_sndSms_prz_cellcaptcha_').on('change',$._currentSendPrizeBox.checkCellCaptcha);
            //添加 手机校验码 标志
            this.cellcaptcha_flag = false;
        }
        // 添加温馨提示
        if( this.setting.notice ){
            $('#_JS_sndSms_notice').html(this.setting.notice).show();
        }
        //if(this.setting.phoneNumber) $._currentSendPrizeBox.hiddenPhone();
        if( this.setting.phoneNumber && this.setting.autoSend )this.send();
        this.getCaptcha(this.setting.captchaSrc);
        //添加captcha_flag 验证码标志
        if (this.isNeedImgChap) {
            this.captcha_flag = false;
        }else{
            this.captcha_flag = true;
        }

        this.captcha_icon = $('#_JS_sendSms_captcha_icon');

        this.captcha.on('blur',function(){
            var len = $(this).val().length;
            if(len == 4){
                $._currentSendPrizeBox.captcha_flag = true;
            }else{
                $._currentSendPrizeBox.captcha_flag = false;
            }
        })
        // $.checkCaptcha( this.captcha , {
        // 	success:function(){
        // 		var check_icon = $._currentSendPrizeBox.captcha_icon;
        // 		check_icon.addClass('sms_captcha_success');
        // 		check_icon.removeClass('sms_captcha_error');
        // 		$._currentSendPrizeBox.captcha_flag = true;
        // 	},
        // 	error:function(){
        // 		var check_icon = $._currentSendPrizeBox.captcha_icon;
        // 		check_icon.removeClass('sms_captcha_success');
        // 		check_icon.addClass('sms_captcha_error');
        // 		$._currentSendPrizeBox.captcha_flag = false;
        // 	}
        // });
    },
    //show:function(){
    //	var st = this.setting.mobile_default_text || '请输入您的手机号';
    //	var str = '';
    //	var d = '';
    //	str += '<div class="w" style="position:relative;">';
    //		str += '<div class="sms_box" style="" id="_JS_sms_box">';
    //			str += '<div style="height:50px;padding-top:10px;"><div style="position:absolute;z-index:11;margin: 5px 0 0 375px;" ><a class="sms_close_btn" href="javascript:;" onclick="$._currentSendPrizeBox.remove();">&times;</a></div><div class="sms_title_box" id ="_JS_sms_title_box"><div id="_JS_sndSms_title_" style="font-size:18px;font-family:微软雅黑;">'+( this.setting.title || this.cfg.title || '免费发送到手机' ).replace('{number}',this.real_expr_num || '--')+'</div></div></div>';
    //			str += '<div class="sms_content" id="_JS_sndSms_content_box" style="">';
    //				str += '<div class="sms_main_box" style="padding-left:20px;">';
    //					str += '<div id="_JS_sndSms_notice" class="sndSms_notice"></div>'
    //					str += '<div id="_JS_sndSms_city_select_"></div>';
    //					str += '<div id="_JS_sndSms_expr_select_"></div>';
    //					if ( this.setting.type == "quick_search") {
    //						str += '<div class="quicksearchDiv">';
    //					};
    //					str += '<div id="JS_phone_boxdiv"><label for="_JS_sndSms_input_">手机号：</label><input class="sms_input _sms_shadow" style="margin-right:5px;vertical-align:top;" value="'+(this.setting.phoneNumber || st)+'" onfocus="if(this.value==\''+st+'\')this.value=\'\';$(\'#_JS_sendSms_phone_icon\').hide();" onkeypress="$._currentSendPrizeBox.keyPress(event);" onblur="$._currentSendPrizeBox.phoneOnBlur(this);" id="_JS_sndSms_input_" name="_JS_sndSms_input_" /><span class="_check_icon" id="_JS_sendSms_phone_icon"></span></div>';
    //					str += '<div><span id="_JS_sndSms_prz_tishiA" style="margin-left:90px;display:none;"></span></div>';
    //					// 是否需要图形校验码
    //					if ( $._currentSendPrizeBox.isNeedImgChap ) {
    //						str += '<div style="margin-top:12px;" id="JS_img_check_box"><label for="_JS_sndSms_captcha_">验证码：</label><input class="sms_captcha _sms_shadow" value="'+( this.setting.captcha||'')+'" onfocus="$._currentSendPrizeBox.msgBox.html(\'\');if(this.value==\'验证码\')this.value=\'\'" id="_JS_sndSms_captcha_" name="_JS_sndSms_captcha_" onkeypress="$._currentSendPrizeBox.keyPress(event);" ><img src="http://image.meilele.com/themes/paipai/images/blank.gif" style="width:75px;margin-right:5px;height:30px;vertical-align:top;margin-left:8px;cursor:pointer" title="换一张" onclick="$._currentSendPrizeBox.getCaptcha();$._currentSendPrizeBox._reset_captcha();return false;" id="_JS_sndSms_captchaImg_" />';
    //							str += '<span class="_check_icon" id="_JS_sendSms_captcha_icon"></span>';
    //						str += '</div>';
    //					}
    //					//添加手机校验码
    //					str += '<div id="_JS_sndSms_cellcaptcha_"></div>';
    //	this.insertCellCaptcha();
    //					if ( this.setting.type == "quick_search") {
    //						str += '</div>';
    //					};
    //				str += '</div>';
    //				if ( this.setting.type == "quick_search") {
    //				str += '<div style="margin-top:10px;padding-top:15px;border-top:1px solid #ddd;background:#fafafa;padding-left:37px;">';
    //				}else{
    //				str += '<div style="margin-top:10px;padding-top:15px;border-top:1px solid #ddd;background:#fafafa;">';
    //				}
    //					str += '<div><label style="width:110px;"></label><input id="_JS_sndSms_btn_" type="button" style="font-family:微软雅黑;font-weight:bold;font-size:18px;height:35px;" class="pointer sms_submit" onclick="$._currentSendPrizeBox.send();" value="'+( this.setting.type == 'quick_search'?'查  询' : '免费发送' )+'" />&emsp;';
    //						// 当类型为快速查询时，不显示已发送人数
    //						if ( this.setting.type != 'quick_search') {
    //						str += '<span style="color:#666;font-size:14px;font-family:微软雅黑;display:none;">已有<span style="color:#c9033b" id="JS_sms_prize_num_box">'+this.prize_num+'</span>人发送成功</span>';
    //						};
    //					str += '</div>';
    //					str += '<div class="sms_msg_box" id="_JS_sndSms_msg_box_"></div>';
    //				str += '</div>';
    //			str += '</div>';
    //		str += '</div>';
    //	str += '</div>'
    //	str += '';
    //	if(window._ana){
    //		window._ana.push(['trackEvent','sendSms_'+this.setting.type,'click',this.setting.phoneNumber||'unset',this.exprId,this.setting.click ]);
    //	}
    //	if( window._gaq ) {
    //		window._gaq.push(['_trackEvent', 'sendSms_'+this.setting.type, 'click' , this.setting.click ]);
    //	}
    //	$.showMask();
    //	var tmpBox = $.lightBox( str , {} , true , false , false , false , 'sms_lightbox');
    //	$('#_JS_sndSms_map_').click(function(){
    //		$('#_JS_sndSms_content_box select:visible').each(function(){
    //			var me = $(this);
    //			if( me && !parseInt(me.val()) ){
    //				me.parent().css('border-color','#c9033b');
    //				return false;
    //			}
    //		});
    //	});
    //	return tmpBox;
    //},
    //添加手机校验码 标签
    insertCellCaptcha:function(){
        str = '';
        str += '<div style="margin-top:10px;"><label>手机校验码：</label>';
        str += '<input id="_JS_sndSms_prz_cellcaptcha_" class="prz_input prz_cellcaptcha sms_captcha _sms_shadow" value="" onfocus="if(this.value==\'手机验证码\')this.value=\'\'" ><span id="_JS_sndSms_prz_btn2_" onclick="$._currentSendPrizeBox.getCellCaptcha();" class="pointer prz_yuanjiao prz_yuanjiao2">免费获取</span>';
        // str += '<span id="_JS_sndSms_prz_btn3_" onclick="$._currentSendPrizeBox.getNewCaptcha();" class="pointer prz_sure_inline prz_sure">没有收到校验码？</span>';
        str += '<span id="_JS_sndSms_prz_btn5_" class="prz_yuanjiao prz_yuanjiao5">(0秒后) 重新获取短信</span>';
        str += '<span id="_JS_sndSms_prz_btn6_" style="color:#333" onclick="$._currentSendPrizeBox.getCaptchaAgin();" class="pointer prz_yuanjiao prz_yuanjiao3">重发短信校验码</span>';
        str += '</div>';
        $('#_JS_sndSms_cellcaptcha_').html(str);
    },
    selectedExpr:function(exprId){
        $._currentSendPrizeBox.exprId = exprId;
        $('#_JS_expr_select_box').css('border-color','#ddd');
    },
    insertExprSelect:function(){
        str = '';
        str += '<div class="clearfix" style="height:43px;"><label class="Left">体验馆：</label><div class="_selectbox Left" id="_JS_expr_select_box" style="height:25px;padding-top:5px;border:1px solid #ddd;"><select id="JS_sms_epr_select_se" style="background: #fafafa;border:0px;margin:0;padding:0px;width:150px;" onchange="$._currentSendPrizeBox.selectedExpr(this.value);">';
        str += '<option value="0">请选择体验馆('+this.setting.exprInfo.exprList.length+'家)</option>';
        for(var k = 0 ; k < this.setting.exprInfo.exprList.length ; k++){
            var selectString = '';
            if( this.setting.exprInfo.exprList.length == 1 || this.exprId == this.setting.exprInfo.exprList[k].exprId  ){
                selectString = ' selected="selected"';
                this.exprId = this.setting.exprInfo.exprList[k].exprId;
            }
            str += '<option'+selectString+' value="'+this.setting.exprInfo.exprList[k].exprId+'" data-need_appointment="'+this.setting.exprInfo.exprList[k].need_appointment+'">'+this.setting.exprInfo.exprList[k].exprName+'</option>';
        }
        str += '</select></div>';
        if( this.setting.exprInfo && this.setting.exprInfo.cityName && !$('#_JS_sndSms_city_select_').html() ){
            str += '<span id="JS_sms_change_city" class="Left" style="padding-top:9px;"><span style="color:#666;display:inline-block;padding:0 5px 0 15px;background:url('+this.bg+') 3px -50px no-repeat">'+this.setting.exprInfo.cityName+'</span><span><a href="javascript:;" style="color:#c9033b;" onclick="$._currentSendPrizeBox.insertCitySelect();return false;">更换城市</a></span></span>';
        }
        str += '</div>';
        if ( this.setting.type != 'quick_search') {
            $('#_JS_sndSms_expr_select_').html(str);
        }
    },
    insertCitySelect:function(){
        $('#JS_sms_change_city').hide();
        var that = this;
        var json = this.cityInfo;
        if( json ){
            var h = '';
            var tmpSelectedProvinceId;
            var k;
            h+= '<div class="clearfix" style="height:43px;">';
            h+=	'<label class="Left">所在地：</label>';
            h+=	'<div class="_selectbox Left" style="height:25px;padding-top:5px;margin-right:5px;border:1px solid #ddd;" id="JS_sms_pro_sel_box"><select class="_sndsms_select" id="_JS_sndSms_province_list_" style="background: #fafafa;border:0px;margin:0;padding:0px;" onchange="$._currentSendPrizeBox.provinceSelected(this.value);">';
            h+=	'<option value="0">请选择省</option>';
            for(k in json){
                var selectString = '';
                if( this.setting.defaultCityId && json[k] && json[k].cityList && json[k].cityList[ this.setting.defaultCityId ] ){
                    selectString = ' selected="selected"';
                    tmpSelectedProvinceId = k;
                }
                h += '<option value="'+k+'"'+selectString+'>'+json[k].provinceName+'</option>';
            }
            h+=	'</select></div>';
            h+=	'<div class="_selectbox Left" style="height:25px;padding-top:5px;border:1px solid #ddd;" id="JS_sms_city_sel_box" style="margin-left:12px;"><select class="_sndsms_select" id="_JS_sndSms_city_list_" onchange="$._currentSendPrizeBox.citySelected(this.value,this.options[this.selectedIndex].innerHTML);"><option value="0">请选择市</option></select></div>';
            h+=	'</div>';
            if ( this.setting.type != 'quick_search') {
                $('#_JS_sndSms_city_select_').html(h);
            }
            if( tmpSelectedProvinceId )this.provinceSelected(tmpSelectedProvinceId);
        }else{
            this.initData( this.insertCitySelect );
        }
    },
    provinceSelected:function(provinceId){
        if( !parseInt(provinceId) )return;
        var h = '<option value="0">请选择市</option>';
        var tmpSelectedCity;
        for(var k in this.cityInfo[provinceId].cityList){
            var selectString = '';
            if( this.setting.defaultCityId && k == this.setting.defaultCityId ){
                selectString = ' selected="selected"';
                tmpSelectedCity = [ k , this.cityInfo[provinceId].cityList[k].cityName ];
            }
            h += '<option value="'+k+'"'+selectString+'>'+this.cityInfo[provinceId].cityList[k].cityName+'</option>';
        }
        $('#_JS_sndSms_city_list_').html(h);
        this.selectedProvinceId = provinceId;
        this.exprId = false;
        $('#JS_sms_pro_sel_box').css('border-color','#ddd');
        $('#JS_sms_epr_select_se').html('<option value="0">请选择体验馆</option>');
        if( tmpSelectedCity ) this.citySelected.apply( this , tmpSelectedCity );
    },
    citySelected:function(cityId , cityName){
        if( !parseInt(cityId) )return;
        var tmp = [];
        for(var k in this.cityInfo[this.selectedProvinceId].cityList[cityId].exprList){
            tmp.push({
                exprName:this.cityInfo[this.selectedProvinceId].cityList[cityId].exprList[k],
                exprId:k,
                position:this.cityInfo[this.selectedProvinceId].cityList[cityId].exprInfo[k].position,
                need_appointment:this.cityInfo[this.selectedProvinceId].cityList[cityId].exprInfo[k].need_appointment
            });
        }
        this.setting.exprInfo ={
            cityName : cityName,
            exprList : tmp
        };
        this.selectedCityId = cityId;
        this.exprId = false;
        $('#JS_sms_city_sel_box').css('border-color','#ddd');
        this.insertExprSelect();
    },
    getCaptcha:function(src){
        if(src){
            $('#_JS_sndSms_captchaImg_').attr('src',src);
        }else{
            $.getCaptcha( $('#_JS_sndSms_captchaImg_') );
        }
    },
    remove:function(){
        $('.alert_box').hide();
    },
    getIsNeedImgChap:function(){
        $.ajax({
            url:'/solr_api/captcha/mobileCaptcha/check_open_image_checkcode.do?',
            dataType:'json',
            async:false,

            type:'GET',
            success:function(json){
                if (parseInt(json.image_check_flag) == 1) {
                    $._currentSendPrizeBox.isNeedImgChap = true;
                }else{
                    $._currentSendPrizeBox.isNeedImgChap = false;
                }
            }
        })
    },
    send:function(){
        if(this.lock)return;
        var phoneNumber = parseInt( $('#_JS_sndSms_input_').val().replace( /\D/g , '' ) , 10 );
        $._currentSendPrizeBox.inpt.val(phoneNumber || '');
        var captcha = $('#_JS_sndSms_captcha_').val();
        if( !parseInt(this.exprId) && this.setting.type != 'quick_search'){
            $._currentSendPrizeBox.msg('请选择离您最近的体验馆。');
            return;
        }
        if(!(/^0?1[0-9]{10}$/.test(phoneNumber))){
            $._currentSendPrizeBox.msg('请输入正确手机号码。');
            return;
        }

        //若存在图形校验，若图形校验码失败，阻止提交
        //if ($._currentSendPrizeBox.isNeedImgChap) {
        //	if(!captcha || captcha == '验证码' || !$._currentSendPrizeBox.captcha_flag ){
        //		// $._currentSendPrizeBox.captcha_icon.removeClass('sms_captcha_success');
        //		// $._currentSendPrizeBox.captcha_icon.addClass('sms_captcha_error');
        //		$._currentSendPrizeBox.msgBox.html('');
        //		$._currentSendPrizeBox.msg('请输入正确的验证码。');
        //		return;
        //	}
        //};
        //若存在手机校验，若手机校验码失败，阻止提交
        console.log()
        //if($._currentSendPrizeBox.setting.checkPhone && !$._currentSendPrizeBox.cellcaptcha_flag)
        //{
        //	$._currentSendPrizeBox.msg('手机校验码有误。');
        //	return;
        //}
        // 若为快速查询，根据传入参数listType判断跳转到红包列表页还是抽奖列表页
        if ( this.setting.type == "quick_search" ) {
            $._currentSendPrizeBox.msg("查询中...");
            $.ajax({
                url:'/qsearch/' + phoneNumber + '/' + cellcaptcha + '/',
                dataType:'json',
                success:function(json){
                    if ( json.error == 0 ) {
                        if(window._ana){
                            window._ana.push(['trackEvent','sendSms_'+$._currentSendPrizeBox.setting.type,'success',phoneNumber,$._currentSendPrizeBox.exprId,$._currentSendPrizeBox.setting.click ]);
                        }
                        if( window._gaq ) {
                            window._gaq.push(['_trackEvent', 'sendSms_'+$._currentSendPrizeBox.setting.type, 'success' , $._currentSendPrizeBox.setting.click ]);
                        }
                        window.location.href = '/quicksearch/'+phoneNumber+'/'+$._currentSendPrizeBox.setting.listType+'/';
                        $.cookie("sendSmsPhone",phoneNumber,{expires:365});
                        $._currentSendPrizeBox.trackEvent();
                    }else{
                        $._currentSendPrizeBox.msg(json.msg);
                        return false;
                    }
                },
                error:function(){
                    $._currentSendPrizeBox.msg('网络错误，请稍后重试');
                }
            })
            return false;
        };
        $._currentSendPrizeBox.msg("发送中...");
        $._currentSendPrizeBox.btn.disabled = true;
        var tmpData = {};
        for(var k in $._currentSendPrizeBox.setting){
            if( k!= 'captcha' && k!=='captchaSrc' && typeof $._currentSendPrizeBox.setting[k] != 'object' && typeof $._currentSendPrizeBox.setting[k] != 'function'){
                tmpData[k] = $._currentSendPrizeBox.setting[k];
            }
        }

        // 发送体验馆特卖信息，体验馆抽奖URL
        var url = "/ajax_ajax.html?act=send_expr_message&expr_id="+$._currentSendPrizeBox.exprId+"&mobile="+phoneNumber+'&captcha='+captcha+'&url='+encodeURIComponent(location.href);

        // 全国体验馆抽奖
        if( $._currentSendPrizeBox.setting.type == 'get_prize_all' ){
            console.log('sss')
            url = "/prize_normal.html?act=go&json=1&phone="+phoneNumber+"&captcha="+captcha+"&expr_id="+this.exprId+'&mobile='+phoneNumber+'&send_from='+( $.cookie('MLLSEO') || '')+'&active_type=11&source_from=0&url='+encodeURIComponent(location.href);
        }
        // 领取有限红包URL
        if ( $._currentSendPrizeBox.setting.type == 'get_limited_prize' ){
            url = '/solr_api/jmll/activity/getAdvanceCode.do?giftId='+$._currentSendPrizeBox.setting.prize_id+'&exprId='+this.exprId+'&mobile='+phoneNumber+'&checkCode='+cellcaptcha+"&checkType=get_limited_prize";
        }
        $.ajax({
            url:url,
            data:tmpData,
            type:"get",
            dataType:"json",
            success:function(json){
                $._currentSendPrizeBox.getCaptcha();
                if(json.error == "0" || json.code == "success"){
                    if(window._ana){
                        _ana.push(['trackEvent','sendSms_'+$._currentSendPrizeBox.setting.type,'success',phoneNumber, $._currentSendPrizeBox.exprId , $._currentSendPrizeBox.setting.click ]);
                    }
                    if(window._gaq){
                        _gaq.push(["_trackEvent","sms",$._currentSendPrizeBox.setting.type,($.cookie('MLLSEO')+'_undefined').split('_')[0] + ( $._currentSendPrizeBox.setting.click?('_'+$._currentSendPrizeBox.setting.click):'' ) ]);
                        _gaq.push(['_trackEvent', 'sendSms_'+$._currentSendPrizeBox.setting.type, 'success',$._currentSendPrizeBox.setting.click]);
                    }

                    if( $._currentSendPrizeBox.setting.type == "get_limited_prize" && window._ana ) window._ana.push(['trackEvent','special_gather_phone','success',phoneNumber,$._currentSendPrizeBox.exprId,$._currentSendPrizeBox.setting.description,$._currentSendPrizeBox.setting.prize_id.split('_')[1]]);
                    $.cookie("sendSmsPhone",phoneNumber,{path:"/",expires:365,domain:'.meilele.com'});
                    $._currentSendPrizeBox.trackEvent();
                    $._currentSendPrizeBox.json = json;
                    $._currentSendPrizeBox.showSuccessBox();
                }
                else{
                    $._currentSendPrizeBox.msg(json.msg);
                    $._currentSendPrizeBox.btn.disabled = false;
                }
            },
            error:function(getPrizAll){
                $._currentSendPrizeBox.getCaptcha();
                //重置验证码：
                $._currentSendPrizeBox._reset_captcha();
                $._currentSendPrizeBox.msg("发送失败");
                $._currentSendPrizeBox.btn.disabled = false;
            }
        })
    },
    showSuccessBox:function(){
        $('#_JS_sndSms_map_').hide();
        $('#_JS_sndSms_title_').hide().parent().css({'background':'none','border-bottom':'none'});

        $this = this;
        if ($._currentSendPrizeBox.setting.type == 'get_prize_all') {
            $.ajax({
                url:"/prize_normal.html?act=finish&pid="+$._currentSendPrizeBox.json.pid+"&prize_id="+$._currentSendPrizeBox.setting.prize_id+"&expr_id="+$._currentSendPrizeBox.exprId,
                csche:false,
                success:function(){
                    if(window.prizeSuccessCallbackFlag) {
                        window.prizeSuccessCallback($._currentSendPrizeBox.json);
                    }else{
                        $('#_JS_sndSms_content_box').html('<div style="color:#333;font-weight:bold;font-family:微软雅黑;font-size:14px;line-height:1.6;padding:0 0 70px 50px"><div style="padding-left:50px;background:url('+$this.bg+') 0 -70px no-repeat;height:45px;line-height:45px;"><div>'+$._currentSendPrizeBox.json.msg+'</div></div></div>');
                    }

                }
            })
        }else if($._currentSendPrizeBox.setting.type == 'get_limited_prize'){
            $('#_JS_sndSms_content_box').html('<div style="color:#333;font-weight:bold;font-family:微软雅黑;font-size:14px;padding:0 0 70px 50px;width:345px;"><div style="padding-left:50px;background:url('+$this.bg+') 0 -70px no-repeat;height:45px;padding-top: 5px;"><div>'+$._currentSendPrizeBox.json.msg+'</div></div></div>');
            if ( typeof $._currentSendPrizeBox.setting.onSuccess == 'function' ) {
                $._currentSendPrizeBox.setting.onSuccess();
            }
        }
        else{
            $('#_JS_sndSms_content_box').html('<div style="color:#333;font-weight:bold;font-family:微软雅黑;font-size:14px;line-height:1.6;padding:0 0 70px 50px"><div style="padding-left:50px;background:url('+$this.bg+') 0 -70px no-repeat;"><div style="font-size:18px;">发送成功！</div><div>短信会在3分钟之内发送到您的手机。</div></div></div>');
        }
        if( this.successAdInfo ){
            var d = this.successAdInfo;
            var h = '<div><a href="'+d.url+'" title="'+d.desc+'"><img src="'+$.__IMG+'/'+d.src+'"></a></div>';
            $('#_JS_sndSms_content_box').append(h);
        }
    },
    //msg:function(string , success){
    //	var po = success ? "-42" : "-27" ;
    //	string = string;
    //	$('#error_info').html(string);
    //},
    keyPress:function(e){
        e = e || window.event;
        if( e.keyCode == 13 ){
            $._currentSendPrizeBox.send();
        }
    },
    phoneOnBlur:function(obj){
        var number = $('#_JS_sndSms_input_').val();
        var check_icon = $('#_JS_sendSms_phone_icon');
        //$._currentSendPrizeBox.hiddenPhone();
        if( this.setting.type == "get_limited_prize" && /^1(\d){10}$/.test( number ) && window._ana ) window._ana.push(['trackEvent','special_gather_phone','blur',number,$._currentSendPrizeBox.exprId||'unset',this.setting.description,this.setting.prize_id.split('_')[1]]);
        if(!(/^0?1[0-9]{10}$/.test(number))){
            check_icon.removeClass('sms_captcha_success').show();
            check_icon.addClass('sms_captcha_error').show();
            $('#error_info').html('請輸入正確手機號碼');
            $._currentSendPrizeBox.setting.flag = 0;
        }
        else{
            //$._currentSendPrizeBox.setting.pNumber = phoneNumber;
            $('#error_info').html('');
            check_icon.addClass('sms_captcha_success').show();
            check_icon.removeClass('sms_captcha_error').show();
            $._currentSendPrizeBox.setting.flag = 1;
        }
    },
    //重置验证码
    _reset_captcha:function(){+
        $._currentSendPrizeBox.captcha.val('');
        $._currentSendPrizeBox.captcha_flag = false;
        //$._currentSendPrizeBox.captcha_icon[0].className = '_check_icon';
    },
    //获取手机校验码
    getCellCaptcha:function(){
        var that = this;
        var phoneNumber = parseInt( $('#_JS_sndSms_input_').val().replace( /\D/g , '' ) , 10 );
        $._currentSendPrizeBox.inpt.val(phoneNumber || '');
        var captcha = $('#_JS_sndSms_captcha_').val();
        if( !parseInt(this.exprId) && this.setting.type != 'quick_search'){
            //alert('请选择离您最近的体验馆')
            $._currentSendPrizeBox.msgBox.html('');
            $._currentSendPrizeBox.msg('请选择离您最近的体验馆。');
            return;
        }
        if(!(/^0?1[0-9]{10}$/.test(phoneNumber))){
            alert('请输入正确手机号码')
            $._currentSendPrizeBox.msgBox.html('');
            $._currentSendPrizeBox.msg('请输入正确手机号码。');
            return;
        }
        //若存在图形校验，若图形校验码失败，阻止提交
        if ($._currentSendPrizeBox.isNeedImgChap) {
            if(!captcha || captcha == '验证码' || !$._currentSendPrizeBox.captcha_flag ){
                // $._currentSendPrizeBox.captcha_icon.removeClass('sms_captcha_success');
                // $._currentSendPrizeBox.captcha_icon.addClass('sms_captcha_error');
                alert('请输入正确的验证码')
                $._currentSendPrizeBox.msgBox.html('');
                $._currentSendPrizeBox.msg('请输入正确的验证码。');
                return;
            }
        };
        if(this.setting.flag == 1)
        {
            if ($._currentSendPrizeBox.isNeedImgChap) {
                var captcha = $("#_JS_sndSms_captcha_").get(0).value;
            }else{
                var captcha = '';
            }
            if($._currentSendPrizeBox.isNeedImgChap && captcha.length != 4)
            {
                $._currentSendPrizeBox.msg('您输入的验证码不正确。');
                $._currentSendPrizeBox.getCaptcha();
                return;
            }
            else{
                if($._currentSendPrizeBox.captcha_flag)
                {
                    $._currentSendPrizeBox.msgBox.html('');

                    var getCellCaptchaUrl = '/solr_api/captcha/mobileCaptcha/create_send_check_captcha.do';
                    var getCellCaptchaData = '?phoneNumber='+phoneNumber+'&exprId='+this.exprId+'&durationTime=120&source_from=0&captchaType='+$._currentSendPrizeBox.setting.type+'&captcha='+captcha;
                    if ( $._currentSendPrizeBox.setting.activityType ) {
                        getCellCaptchaData = getCellCaptchaData + '&activeType='+$._currentSendPrizeBox.setting.activityType;
                    }

                    //获取手机验证码新接口
                    if ( this.cfg.createCaptchaUrl ) {
                        getCellCaptchaUrl = this.cfg.createCaptchaUrl;
                        getCellCaptchaData += '&sendSource='+($._currentSendPrizeBox.setting.sendSource || this.cfg.sendSource)+'&sendType='+($._currentSendPrizeBox.setting.sendType || this.cfg.sendType);
                    }
                    getCellCaptchaUrl += getCellCaptchaData;
                    $.ajax({
                        url: getCellCaptchaUrl,
                        type: "GET",
                        dataType: "json",
                        success:function( json ){
                            if(json.error == 0){
                                $('#_JS_sndSms_prz_btn2_').get(0).style.display = "none";
                                $('#_JS_sndSms_prz_tishiA').get(0).style.color = "#999999";
                                var string = $('#_JS_sndSms_input_').get(0).value;
                                $('#_JS_sndSms_prz_tishiA').get(0).innerHTML="校验码已发送至手机"+string+"请查收";
                                $('#_JS_sndSms_prz_btn6_').get(0).style.display = 'none';
                                $('#_JS_sndSms_prz_tishiA').get(0).style.display = "inline-block";
                                $._currentSendPrizeBox.getNewCaptcha();
                            }
                            else{
                                var _msg = json.msg || '手机校验码发送失败！';
                                $._currentSendPrizeBox.msg(_msg);
                                $._currentSendPrizeBox.getCaptcha();
                                if ($._currentSendPrizeBox.isNeedImgChap) {
                                    $._currentSendPrizeBox._reset_captcha();
                                }

                            }
                        }
                    });
                }
            }

        }
    },
    msg:function(string , success){
        var po = success ? "-42" : "-27" ;
        string = string;
        $('#error_info').html(string);
    },
    //重新发送 校验码等待1分钟
    getNewCaptcha:function(){
        var _btn5 = $('#_JS_sndSms_prz_btn5_').get(0),
            _btn6 = $('#_JS_sndSms_prz_btn6_').get(0);

        _btn5.style.display = "inline-block";
        $._currentSendPrizeBox._mobile_captcha_times_left = $._currentSendPrizeBox._mobile_captcha_times_limit_g;
        _btn5.innerHTML = "("+$._currentSendPrizeBox._mobile_captcha_times_limit_g+"秒后) 重新获取短信";
        $._currentSendPrizeBox.timeLoop2 = setInterval(function(){
            _btn5.innerHTML = "("+$._currentSendPrizeBox._mobile_captcha_times_left+"秒后) 重新获取短信";
            $._currentSendPrizeBox._mobile_captcha_times_left--;
            if( $._currentSendPrizeBox._mobile_captcha_times_left <=0 ){
                clearInterval($._currentSendPrizeBox.timeLoop2);
                $._currentSendPrizeBox._mobile_captcha_times_left = $._currentSendPrizeBox._mobile_captcha_times_limit_g;
                _btn5.style.display = "none";
                _btn6 = $('#_JS_sndSms_prz_btn6_').get(0);

                _btn6.style.display = "inline-block";

                $._currentSendPrizeBox.getCaptcha();
                $._currentSendPrizeBox._reset_captcha();
                $('#_JS_sndSms_prz_tishiA').get(0).style.display = 'none';
            }
        },1000,_btn5);
    },
    //获得新的手机校验码
    getCaptchaAgin:function(){
        //var _btn6 = $('#_JS_sndSms_prz_btn6_').get(0);
        //_btn6.style.display = "none";
        //$('#_JS_sndSms_prz_btn2_').get(0).style.display = "inline-block";
        $._currentSendPrizeBox.getCellCaptcha();
    },

    value_null:function(string){
        //在多少秒后重新查询 此时不可以重新输入手机号 -1的原因是因为有时setInterval会减到-1
        var btn2 = $('#_JS_sndSms_prz_btn2_').get(0),
        //btn3 = $('#_JS_sndSms_prz_btn3_').get(0),
            btn4 = $('#_JS_sndSms_prz_btn4_').get(0),
            btn5 = $('#_JS_sndSms_prz_btn5_').get(0),
            tishiA = $('#_JS_sndSms_prz_tishiA').get(0);
        if(btn5.innerHTML == "(0秒后) 重新获取短信" || btn5.innerHTML == "(-1秒后) 重新获取短信")
        {
            //$("#_JS_sndSms_input_").get(0).value = "";
            $._currentSendPrizeBox.setting.pNumber = 0;
            $._currentSendPrizeBox.setting.flag = 0;
            btn2.style.display = "inline-block";
            //btn3.style.display = "none";
            btn5.style.display = "none";
            //	btn6.style.display = "none";
            tishiA.style.display = "none";
            $._currentSendPrizeBox.msgBox.html('');
        }
        //再次查询
        if(btn5.style.display == "inline-block")
        {
            $('#_JS_sndSms_prz_cellcaptcha_').get(0).value = "";
        }
    },
    //校验手机验证码
    checkCellCaptcha:function(){
        cellcaptcha = $("#_JS_sndSms_prz_cellcaptcha_").get(0).value;
        if(cellcaptcha.length != 6){
            $._currentSendPrizeBox.msg('校验码有误。');
            $._currentSendPrizeBox.cellcaptcha_flag = false;
            return ;
        }else{
            $._currentSendPrizeBox.msgBox.html('');
            $._currentSendPrizeBox.cellcaptcha_flag = true;
            $._currentSendPrizeBox.setting.checkPhone=cellcaptcha;
            //$._currentSendPrizeBox.send();
        }
        //var _pNumber = $._currentSendPrizeBox.setting.pNumber;
    },
    trackEvent : function(phone){
        //百度推广
        phone = phone || "13800138000";
        if(window.goSpread){
            var rtTag = {};
            var data = {send_sms : {phone :  phone,email : 'mllcustomer@meilele.com'}};
            rtTag.data = data;
            window.goSpread(['_trackRTEvent',rtTag]);
        }
        //腾讯动态创意，放在ga.lbi之后
        window.goGdt && window.goGdt([
            ["add_action","SHOP_VIEW",phone,'mllcustomer@meilele.com']
        ]);
        window.criteo_q = [
            {
                event: "trackTransaction" ,
                id: (phone - 0).toString(36) + "_" + (new Date - 0).toString( 36 ).replace(".",""),
                item: [
                    { id: "sms", price: 0, quantity: 1 }
                ]
            }
        ];
        window.goCriteo && window.goCriteo(true);
    }
}
$.sendPrizeNew.prototype.init.prototype = $.sendPrizeNew.prototype;