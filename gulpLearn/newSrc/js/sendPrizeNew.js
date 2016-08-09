/*===================================
 * copyRight: meilele
 * fileName: sendPrizeNew.js
 * createTime: 2016/07/12
 * author: yangliu2@meilele
 * version: 1.0
 * modify: {}
 * description: 老虎机弹框组件
 ===================================*/

// 初始化ga
window._gaq = window._gaq || [];
$.ajaxSetup({'cache':false});

/*--------------------
 * @ 定义sendPrizeNew对象
 ----------------------------------------------------------*/
$.sendPrizeNew = function(exprId,setting){
	new $.sendPrizeNew.prototype.init(exprId,setting);
};
$.sendPrizeNew.prototype={
	constructor : $.sendPrizeNew,
	startTime:new Date() - 0,

	init: function(exprId,setting) {
		if( $.prizeBox ) return;
		$.prizeBox= this;

		this.setting = $.extend({
			type:'_default',
			prizeKind:'get_prize_all',
			defaultCityId:parseInt($.cookie('region_id')),
			city_bg:'http://image.meilele.com/images/201406/140314561580.png',
			bgs:{
				prize_title:'http://image.meilele.com/images/zhuanti//a_title_1469065367.jpg',
				b_color:'#addf00',
				color:'#ff4f01'
			},
			button: {
				width: 159, 
				height: 61,
				bg: ['http://image.meilele.com/images/zhuanti/m_download/btn1_1469584505.png', 'http://image.meilele.com/images/zhuanti/btn2_1469444448.png', 'http://image.meilele.com/images/zhuanti/btn3_1469445395.png']
			},
			prize_time:'指定时间是我吧是我吧',
			onPrizeStart: function() {},
			onSuccess:function(){}
		}, setting);

		this.exprId = exprId;
		this.setStyleRule();

		//短信重发时间限制;删除体验馆列表信息
		this.phone_time_limit = window._mobile_captcha_times_limit || 120;
		if(this.setting.exprInfo && this.setting.exprInfo.exprList ) delete this.setting.exprInfo.exprList;

		//获取初始化接口数据
		if( this.setting.prizeType=='success'&&this.setting.prizeInfo ) {
			this.showBox(2);
			this.sendSuccess();
		} else if ( this.setting.prizeType=='error' ) {
			this.showBox('sorry')
		} else {
			this.initData();
		}

		$.prizeBox.getCheckImg();
	},

	//初始化数据
	initData: function( callback,contentType ) {
		var that=this,
		 	code = this.setting.type+"_success_notice",
			initeUrl= '/mll_api/api/send_message&type='+this.setting.prizeKind+(this.setting.unique?'&activity='+this.setting.unique:"")+'&ad_code='+code+(contentType?contentType:"");

		$.ajax({
			url:initeUrl,
			dataType:'json',
			success: function( resp ) {
				if( contentType ) {
					that.prize_num = resp.prize_num;
				} else {
					that.prize_num = resp.prize_num;
					that.analysisExprList(resp);
					that.showBox(1)
				}
				if( callback ) callback.call( that , resp );
			},
			error:function(){
				that.removeBox();
				$.alert('发生网络错误，请稍候再试！');
			}
		});

	},

	//弹出框布局
	showBox: function( type ) {
		var out = '',
			outhtml = '',
			txt_time = this.setting.prize_time,
			title = '',
			isNeedSetCookieOnClose = false;

		switch ( type ) {
			case 1:
				title = this.setting.title.substr(0,15);
				outhtml += '<p style="line-height:18px;color: #898989;font-size: 13px;padding:22px 22px 15px 22px;">'
				outhtml += '<span style="font-weight: bold">温馨提示:</span>请于' + txt_time + '期间参与；红包序列号以短信形式发送手机,请注意查收;实物奖品在活动结束后统一发放,请耐心等待';
				outhtml += '</p>'
				outhtml +='<form>'

				//城市设置
				outhtml += '<div class="item" style="margin-bottom:0;">'
				outhtml += '<div id="city_select"></div>';
				outhtml += '<div id="expr_select"></div>';
				outhtml += '</div>';

				//手机号码
				outhtml += '<div class="item"><label for="phone_input">手机号：</label><input class="sms_input _sms_shadow" placeholder="请输入您的手机号码" onfocus="$.prizeBox.errorShow(\'\')"  onblur="" id="phone_input" name="phone_input" /><span class="check_icon" id="phone_icon"></span></div>';
				outhtml += '<div id="phone_msg" style="display: none;"></div>'

				// 图形校验码
				outhtml += '<div class="item"><label for="check_img">验证码：</label><input class="sms_captcha _sms_shadow" id="check_img" name="check_img" onfocus="$.prizeBox.errorShow(\'\')" ><img src="/solr_api/captcha/getCaptcha.do?&_=0.23046009114496724" title="换一张" onclick="$.prizeBox.getCheckImg()" id="cha_img" />';
				outhtml += '<span class="check_icon"></span>';
				outhtml += '</div>';

				// 手机校验码
				outhtml += '<div class="item"><label for="check_phone">手机验证码：</label><input class="sms_captcha _sms_shadow" id="check_phone" name="check_phone" onfocus="$.prizeBox.errorShow(\'\')" >'
				outhtml +='<button class="msg_acq" onclick="$.prizeBox.getCheckNum()" type="button">免费获取</button>'
				outhtml += '<span class="check_icon" id="msg_send"></span>';
				outhtml += '</div>'; 

				//提交按钮
				//outhtml += '<div class="alert_submit"><span class="bird"></span><button id="btn_submit" type="button" class="pointer alert_button" onclick="$.prizeBox.getPrize();">点击抽奖</button></div>';
				outhtml += '<div class="button"><a href="javascript:;" class="submit" onclick="$.prizeBox.getPrize();"></a></div>';
				outhtml +='</form>'
				outhtml +='<div class="prize_num_box" style="display: none;">已有<span id="prize_num"></span>人成功摇奖</div>'
				outhtml +='<div id="error_info"></div>'
				outhtml += '</div>';
				isNeedSetCookieOnClose = false;
				break;

			case 2:
				title = '中奖啦!';
				outhtml += '<p class="yes_title1">'+this.setting.prizeInfo.msg+'!</p>'
				outhtml += '<p style="padding:0 40px;line-height:18px;color: #898989;font-size: 14px;margin-bottom: 15px">红包序列号以短信形式发送手机,请注意查收;实物奖品在活动结束后统一发放,请耐心等待</p>'
				//outhtml += '<div class="alert_submit"><span class="bird"></span><button type="button" class="pointer alert_button isNeedSuccess" onclick="$.prizeBox.removeBox(true);">朕知道了</button></div>';
				outhtml += '<div class="button"><a href="javascript:;" class="success" onclick="$.prizeBox.removeBox(true);"></a></div>';
				isNeedSetCookieOnClose = true;
				break;

			default:
				title = '遗憾!';
				outhtml += '<p class="yes_title1">您未获得奖项,请下次抽取 !</p>'
				//outhtml += '<div class="alert_submit"><span class="bird"></span><button type="button" class="pointer alert_button" onclick="$.prizeBox.removeBox(true);">撤退吧</button></div>';
				outhtml += '<div class="button"><a href="javascript:;" class="error" onclick="$.prizeBox.removeBox(true);"></a></div>';
				isNeedSetCookieOnClose = true;
				break;
		};

		out += '<div class="alert_box">';
			out += '<div style="position: relative">'
				out += '<h2 class="alert_title">' + title + '</h2>';
				out += '<div style="position:absolute;z-index:11;top: 10px;right: 5px;" ><a class="sms_close_btn" href="javascript:;" onclick="$.prizeBox.removeBox('+ isNeedSetCookieOnClose +');">&times;</a></div>'
			out += '</div>'
			out += '<div class="alert_content sms_content">';
			out += '</div>';
		out += '</div>'

		$('.lightBox.sms_lightbox').remove();$.lightBox(out, {}, true, false, false, false, 'sms_lightbox');$('.alert_content.sms_content').html('').html(outhtml);this.showMask();

		if( type==1 ) {
			if( !this.selectedProvinceId && !this.selectedCityId ) {
				this.insertCitySelect();
			} else {
				this.insertExprSelect();
			}

			this.initData( '' , '&contentType=1' ); //发送人数走接口取
			this.getPrizeNum();
		}
	},

	//显示遮罩层
	showMask: function() {
		$('#mask').remove();
		$('body').prepend('<div id="mask"></div>');
		$('#mask').css({
			"height":$(document).height(),
			"width":$(document).width()
		}).show();
	},

	//获取图形验证码
	getCheckImg: function( src ) {
		$('#check_img').val('');
		if( src ) {
			$('#cha_img').attr('src',src);
		} else {
			$.getCaptcha( $('#cha_img' ));
		}
	},

	//获取手机验证码
	getCheckNum: function() {
		this.checkValue('msg',function(){
			var
				url = '/dubbo_api/mll/mobileCaptcha/create_send_check_captcha',
				myData = '?phoneNumber='+$.prizeBox.phoneNum+'&exprId='+$.prizeBox.exprId+'&durationTime=120&source_from=0&captchaType='+$.prizeBox.setting.prizeKind+'&captcha='+$.prizeBox.checkVal+'&sendSource=1&sendType=1',
				string = $('#phone_input').val(),
				btn=$('.msg_acq'),
				time_remain = $.prizeBox.phone_time_limit;

			url+=myData;
			$.getJSON(url,function( resp ) {
				if( resp.error == 0 ) {
					$('#phone_msg').show().html("校验码已发送至手机"+string+"请查收");
					btn.html("("+$.prizeBox.phone_time_limit+"秒后) 重新获取");
					var timeLoop2 = setInterval(function(){
						btn.html("("+time_remain+"秒后) 重新获取").attr("disabled",true);
						time_remain--;
						if( time_remain <=0 ){
							clearInterval(timeLoop2);
							time_remain = $.prizeBox.phone_time_limit;
							btn.html("重新获取").removeAttr('disabled');
							$.prizeBox.getCheckImg();
							$('#phone_msg').hide();
						}
					},1000,btn);

				} else {
					var msg = resp.msg || '手机校验码发送失败！';
					$.prizeBox.errorShow(msg);
				}
			});
		});
	},

	//获取参与人数
	getPrizeNum: function( resp ) {
		if( this.prize_num > 0 ){
			$('.prize_num_box').show();
			$('#prize_num').html( this.prize_num);
		}
	},

	//抽奖
	getPrize: function() {
		this.checkValue('prize',function() {
			$('#phone_msg').hide();
			var url = "/prize_normal.html?act=go&json=1&phone="+$.prizeBox.phoneNum+"&captcha="+$.prizeBox.checkVal+"&expr_id="+$.prizeBox.exprId+'&mobile='+$.prizeBox.phoneNum+'&send_from='+( $.cookie('MLLSEO') || '')+'&need_level=1&active_type=11&source_from=0&url='+encodeURIComponent(location.href),
				mydata={
				type:'get_prize_all',
				autoSend:false,
				checkPhone:$.prizeBox.checkPhone,
				defaultCityId:$.prizeBox.defaultCityId,
				prize_id:$.prizeBox.setting.prize_id,
				activityType:22,
				flag:1
			}

			$.getJSON(url,mydata,function( resp ) {
				$.prizeBox.getCheckImg();

				if( resp.code == "success" ) {
					$.prizeBox.setting.onPrizeStart(true, {level: resp.level, msg: resp.msg, pid:resp.pid,prize_id: $.prizeBox.setting.prize_id,expr_id:$.prizeBox.exprId,expr_name:$.prizeBox.exprName,phone:$.prizeBox.phoneNum});
					$.prizeBox.removeBox();
				} else if ( resp.code === 'no_prize' ) {
					$.prizeBox.setting.onPrizeStart(false);
					$.prizeBox.removeBox();
				} else {
					var msg = resp.msg || '抽奖失败！';
					$.prizeBox.errorShow(msg);
				}
			});
		});
	},

	sendSuccess: function() {
		$.ajax({
			url:"/prize_normal.html?act=finish&pid="+this.setting.prizeInfo.pid+"&prize_id="+this.setting.prizeInfo.prize_id+"&expr_id="+this.setting.prizeInfo.expr_id,
			csche:false,
			success:function(){}
		})
	},

	//表单验证
	checkValue: function(type,callback) {
		var expr_id=parseInt($('#expr_sel option:selected').val()),
			expr_name=$('#expr_sel option:selected').html(),
			phone=$('#phone_input').val(),
			check_img=$('#check_img').val(),
			phone_msg=$('#check_phone').val();

		$.prizeBox.exprId=expr_id;
		$.prizeBox.exprName=expr_name;
		$.prizeBox.phoneNum=phone;
		$.prizeBox.checkVal=check_img;
		$.prizeBox.checkPhone=phone_msg;

		if( expr_id==0||isNaN(expr_id) ) {
			$.prizeBox.errorShow('请选择离您最近的体验馆 !');
			return;
		}
		if( !(phone && /^1\d{10}$/.test(phone)) ) {
			$.prizeBox.errorShow('请输入正确的手机号码 !');
			return;
		}
		if( check_img==''||check_img.length!==4 ) {
			$.prizeBox.errorShow('请输入正确的验证号码 !');
			return;
		}
		if( type=='prize' ) {
			if( phone_msg==''||phone_msg.length!==6 ) {
				$.prizeBox.errorShow('手机校验码错误 !');
				return;
			}
		}
		if( callback ){ callback() };
	},

	//错误提示
	errorShow: function (msg) {
		$('#error_info').html(msg);
    },

	//移出弹出框
	removeBox: function(isNeedsetCookie) {
		if ( isNeedsetCookie ) {
			$.cookie('_close_', 1);
			if($('.alert_button').hasClass('isNeedSuccess')){
				$.prizeBox.setting.onSuccess($.prizeBox.setting.prizeInfo);
			}
		}

		$('.alert_box,#mask').remove();delete($.prizeBox);
	},

	//设置css样式
	setStyleRule: function() {

		if(!this.styleInserted) {
			var css=[],
				style;

			//prize start
			css.push('.alert_title{background: url('+this.setting.bgs.prize_title+');background-color:'+this.setting.bgs.b_color+';height: 67px;font-size: 22px;text-align: center;line-height: 67px;font-weight: bold;color: #fff;}');
			css.push('.alert_box{position:absolute;left:50%;margin-left:-250px;overflow:hidden;z-index:9;width:421px;top:50%;}')
			css.push('.alert_box form{color:#666;}')
			css.push('.alert_content{border:5px solid '+this.setting.bgs.b_color+';background-color:#fff;border-top:0;padding-bottom:15px;}')

			css.push('.alert_box .button{padding:10px 0;text-align:center;}');
			css.push('.alert_box .button a{display:inline-block;width:'+ this.setting.button.width +'px;height:'+ this.setting.button.height +'px;background-position:center center;background-repeat:no-repeat;}');
			css.push('.alert_box .button a.submit{background-image:url('+ this.setting.button.bg[0] +')}');
			css.push('.alert_box .button a.success{background-image:url('+ this.setting.button.bg[1] +')}');
			css.push('.alert_box .button a.error{background-image:url('+ this.setting.button.bg[2] +')}');

			css.push('.yes_title1{padding-top: 17px;padding-bottom: 15px;;word-wrap:break-word;color: '+this.setting.bgs.color+';font-weight: bolder;font-size: 22px;font-family: 微软雅黑;text-align: center;}')
			css.push('.msg_acq,#cha_img{height: 30px;margin-left: 8px;cursor: pointer;}')
			css.push('.msg_acq{padding:0 5px;height: 30px;margin-left: 8px;cursor: pointer;background:#fafafa;border:1px solid #ddd;line-height:30px;color:#555;text-align:center;display:inline-block;}')
			css.push('#phone_msg{color:#999;margin:-10px 0 10px 72px;}')
			css.push('.prize_num_box{text-align:center;font-size:14px;}')
			css.push('#prize_num{color:'+this.setting.bgs.color+';font-weight:bold;}')
			css.push('.item{margin-bottom:15px;}')
			css.push('#mask {position: absolute; top: 0px; filter: alpha(opacity=60); background-color: #000;z-index: 299; left: 0px;opacity:0.6; -moz-opacity:0.6;}  ')

			css.push('.sms_input {width:145px;background: #fafafa;border:1px solid #ddd;border-radius: 2px;padding:7px 0 7px 5px;margin:0;color:#555;}');
			css.push('._sms_shadow:focus{transition:border linear .2s,box-shadow linear .2s;-moz-transition:border linear .2s,-moz-box-shadow linear .2s;-webkit-transition:border linear .2s,-webkit-box-shadow linear .2s;outline:none;border-color:#6db9e0;box-shadow:0 0 4px #7fcaf1;-moz-box-shadow:0 0 4px #7fcaf1;-webkit-box-shadow:0 0 4px #7fcaf1;}');
			css.push('.sms_captcha {width:68px;background: #fafafa;border-radius: 2px;border:1px solid #ddd;padding:7px 0 7px 5px;margin:0;vertical-align:top;color:#555;}');
			css.push('.sms_content label {height:28px; line-height: 28px;width:120px;text-align:right;display:inline-block;vertical-align:top;}');
			css.push('._sndsms_select{background: #fafafa;border:0px;margin:0;padding:0px;width:95px;}');
			css.push('#error_info{ font-size: 14px;font-family: 微软雅黑;text-align: center;margin-top: 10px;color: '+this.setting.bgs.color+';}')

			css.push('.sms_close_btn{font-size:26px;color:#b3b3b3;font-family: "宋体";}');
			css.push('.sms_close_btn:hover{text-decoration:none}');
			//prize end

			$.insertStyle( css.join('') );
			this.styleInserted = true;
		}
	},

	//体验馆，地址获取
	selectedExpr: function(exprId) {
		$.prizeBox.exprId = exprId;
		$('#exprSelectBox').css('border-color','#ddd');
	},

	insertExprSelect: function() {
		str = '';
		str += '<div class="clearfix" style="height:43px;"><label class="Left">体验馆：</label><div class="selectbox Left" id="exprSelectBox" style="height:25px;padding-top:5px;border:1px solid #ddd;"><select id="expr_sel" style="border:0px;width:150px;" onchange="$.prizeBox.selectedExpr(this.value);">';
		str += '<option value="0">请选择体验馆('+this.setting.exprInfo.exprList.length+'家)</option>';

		for( var k = 0 ; k < this.setting.exprInfo.exprList.length ; k++ ) {
			var selectString = '';
			if( this.setting.exprInfo.exprList.length == 1 || this.exprId == this.setting.exprInfo.exprList[k].exprId  ){
				selectString = ' selected="selected"';
				this.exprId = this.setting.exprInfo.exprList[k].exprId;
			}
			str += '<option'+selectString+' value="'+this.setting.exprInfo.exprList[k].exprId+'" data-need_appointment="'+this.setting.exprInfo.exprList[k].need_appointment+'">'+this.setting.exprInfo.exprList[k].exprName+'</option>';
		}

		str += '</select></div>';

		if( this.setting.exprInfo && this.setting.exprInfo.cityName && !$('#city_select').html() ) {
			str += '<span id="change_city" class="Left" style="padding-top:9px;"><span style="color:#666;display:inline-block;padding:0 5px 0 15px;background:transparent url('+this.setting.city_bg+') no-repeat scroll 3px -50px;} 3px -50px no-repeat">'+this.setting.exprInfo.cityName+'</span><span><a href="javascript:;" style="color:#ea4800;" onclick="$.prizeBox.insertCitySelect();return false;">更换城市</a></span></span>';
		}

		str += '</div>';

		$('#expr_select').html(str);
	},

	insertCitySelect: function() {
		$('#change_city').hide();
		var that = this,
			json = this.cityInfo;

		if( json ){
			var h = '',
				tmpSelectedProvinceId,
				k;

			h+= '<div class="clearfix" style="height:43px;">';
			h+=	'<label class="Left">所在地：</label>';
			h+=	'<div class="selectbox Left" style="height:25px;padding-top:5px;margin-right:5px;border:1px solid #ddd;" id="pro_sel_box"><select class="_sndsms_select" id="province_list" style="background: #fafafa;border:0px;margin:0;padding:0px;" onchange="$.prizeBox.provinceSelected(this.value);">';
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
			h+=	'<div class="selectbox Left" style="height:25px;padding-top:5px;border:1px solid #ddd;" id="city_sel_box" style="margin-left:12px;"><select class="_sndsms_select" id="city_list" onchange="$.prizeBox.citySelected(this.value,this.options[this.selectedIndex].innerHTML);"><option value="0">请选择市</option></select></div>';
			h+=	'</div>';

			$('#city_select').html(h);
			if( tmpSelectedProvinceId ) this.provinceSelected(tmpSelectedProvinceId);
		} else {
			this.initData( this.insertCitySelect );
		}
	},

	provinceSelected: function(provinceId) {
		if( !parseInt(provinceId) )return;
		var h = '<option value="0">请选择市</option>',
			tmpSelectedCity;

		for(var k in this.cityInfo[provinceId].cityList){
			var selectString = '';
			if( this.setting.defaultCityId && k == this.setting.defaultCityId ){
				selectString = ' selected="selected"';
				tmpSelectedCity = [ k , this.cityInfo[provinceId].cityList[k].cityName ];
			}
			h += '<option value="'+k+'"'+selectString+'>'+this.cityInfo[provinceId].cityList[k].cityName+'</option>';
		}

		this.selectedProvinceId = provinceId;
		this.exprId = false;
		$('#city_list').html(h);
		$('#pro_sel_box').css('border-color','#ddd');
		$('#expr_sel').html('<option value="0">请选择体验馆</option>');
		if( tmpSelectedCity ) this.citySelected.apply( this , tmpSelectedCity );
	},

	citySelected: function(cityId ,cityName) {
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
		$('#city_sel_box').css('border-color','#ddd');
		this.insertExprSelect();
	},
	analysisExprList: function(json,callback) {
		this.exprInitData = {};
		this.callback = callback
		var tmpD = {};

		if( this.exprId ){//设置默认城市
			for( var k = 0 ; k < json.expr_list.length ; k++ ) {
				if( json.expr_list[k] && json.expr_list[k].expr_id == this.exprId ) {
					this.setting.defaultCityId = json.expr_list[k].city_id;
					break;
				}
			}
		}
		for( var k = 0 ; k < json.expr_list.length ; k++ ) {
			var
				d = json.expr_list[k],
				pid = d.province_id,
				cid = d.city_id,
				eid = d.expr_id;
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

		if( !this.selectedProvinceId && !this.selectedCityId ) {
			this.insertCitySelect();
		} else {
			this.insertExprSelect();
		}
		if( this.callback ) this.callback.call( this , json );
	}
}
$.sendPrizeNew.prototype.init.prototype = $.sendPrizeNew.prototype;