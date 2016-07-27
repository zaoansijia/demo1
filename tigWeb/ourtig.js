/**
 * Created by yangliu2 on 2016/7/26.
 */
/*===================================
 * copyRight: meilele
 * fileName: tigger_prize.js
 * createTime: 2016/07/18
 * author: leihao@meilele
 * version: 1.0
 * modify: {}
 * description: 老虎机抽奖UI组件
 ===================================*/


/*--------------------
 * @ 滚动插件压缩代码
 ----------------------------------------------------------*/
(function (a) {
    a(document).ready(function () {
        if (a("filter#slotMachineBlurSVG").length <= 0) {
            a("body").append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display:none;"><filter id="slotMachineBlurFilterFast"><feGaussianBlur stdDeviation="5" /></filter></svg>');
        }
        if (a("filter#slotMachineBlurSVG").length <= 0) {
            a("body").append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display:none;"><filter id="slotMachineBlurFilterMedium"><feGaussianBlur stdDeviation="3" /></filter></svg>');
        }
        if (a("filter#slotMachineBlurSVG").length <= 0) {
            a("body").append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display:none;"><filter id="slotMachineBlurFilterSlow"><feGaussianBlur stdDeviation="1" /></filter></svg>');
        }
        if (a("mask#slotMachineFadeSVG").length <= 0) {
            a("body").append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display:none;"><mask id="slotMachineFadeMask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox"><linearGradient id="slotMachineFadeGradient" gradientUnits="objectBoundingBox" x="0" y="0"><stop stop-color="white" stop-opacity="0" offset="0"></stop><stop stop-color="white" stop-opacity="1" offset="0.25"></stop><stop stop-color="white" stop-opacity="1" offset="0.75"></stop><stop stop-color="white" stop-opacity="0" offset="1"></stop></linearGradient><rect x="0" y="-1" width="1" height="1" transform="rotate(90)" fill="url(#slotMachineFadeGradient)"></rect></mask></svg>');
        }
        a("body").append("<style>.slotMachineBlurFast{-webkit-filter: blur(5px);-moz-filter: blur(5px);-o-filter: blur(5px);-ms-filter: blur(5px);filter: blur(5px);filter: url(#slotMachineBlurFilterFast);}.slotMachineBlurMedium{-webkit-filter: blur(3px);-moz-filter: blur(3px);-o-filter: blur(3px);-ms-filter: blur(3px);filter: blur(3px);filter: url(#slotMachineBlurFilterMedium);}.slotMachineBlurSlow{-webkit-filter: blur(1px);-moz-filter: blur(1px);-o-filter: blur(1px);-ms-filter: blur(1px);filter: blur(1px);filter: url(#slotMachineBlurFilterSlow);}.slotMachineGradient{-webkit-mask-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0,0,0,0)), color-stop(25%, rgba(0,0,0,1)), color-stop(75%, rgba(0,0,0,1)), color-stop(100%, rgba(0,0,0,0)) );mask: url(#slotMachineFadeMask);}</style>");
    });
    if (typeof a.easing.easeOutBounce !== "function") {
        a.extend(a.easing, {
            easeOutBounce: function (f, g, e, i, h) {
                if ((g /= h) < (1 / 2.75)) {
                    return i * (7.5625 * g * g) + e;
                } else {
                    if (g < (2 / 2.75)) {
                        return i * (7.5625 * (g -= (1.5 / 2.75)) * g + 0.75) + e;
                    } else {
                        if (g < (2.5 / 2.75)) {
                            return i * (7.5625 * (g -= (2.25 / 2.75)) * g + 0.9375) + e;
                        } else {
                            return i * (7.5625 * (g -= (2.625 / 2.75)) * g + 0.984375) + e;
                        }
                    }
                }
            }
        });
    }
    a.fn.slotMachine = function (w) {
        var n = {active: 0, delay: 200, repeat: false};
        w = a.extend(n, w);
        var m = a(this), g = m.children(), v, k, c = null, t = null, i = false, s = null, o = false, u = {
            index: w.active,
            el: g.get(w.active)
        };

        function q(A) {
            var C = 0;
            for (var B = 0; B < A; B++) {
                C += a(g.get(B)).outerHeight();
            }
            return -C;
        }

        function j() {
            var A;
            do {
                A = Math.floor(Math.random() * g.length);
            } while (A === u.index && A >= 0);
            var B = {index: A, el: g.get(A)};
            return B;
        }

        function r() {
            return u;
        }

        function l(A) {
            u = A;
        }

        function b() {
            var A = u.index - 1 < 0 ? g.length - 1 : u.index - 1;
            var B = {index: A, el: g.get(A)};
            return B;
        }

        function d() {
            var A = u.index + 1 < g.length ? u.index + 1 : 0;
            var B = {index: A, el: g.get(A)};
            return B;
        }

        function z(A, B) {
            m.add(g).removeClass("slotMachineBlurFast slotMachineBlurMedium slotMachineBlurSlow");
            switch (A) {
                case"fast":
                    g.addClass("slotMachineBlurFast");
                    break;
                case"medium":
                    g.addClass("slotMachineBlurMedium");
                    break;
                case"slow":
                    g.addClass("slotMachineBlurSlow");
                    break;
            }
            if (B !== true || A === "stop") {
                m.add(g).removeClass("slotMachineGradient");
            } else {
                m.add(g).addClass("slotMachineGradient");
            }
        }

        function y() {
            v.css("margin-top", q(u.index));
        }

        function f(B) {
            o = true;
            var A = w.delay;
            if (B === undefined) {
                z("fast", true);
                A /= 2;
                if (p()) {
                    t = v.animate({marginTop: k}, A, function () {
                        t = null;
                        v.css("margin-top", 0);
                    });
                } else {
                    z("stop");
                    y();
                }
                setTimeout(function () {
                    if (i === false) {
                        f();
                    }
                }, A + 25);
            } else {
                if (B >= 1) {
                    if (B > 1) {
                        z("fast", true);
                        A /= 2;
                    } else {
                        z("medium", true);
                    }
                    if (p()) {
                        t = v.animate({marginTop: k}, A, function () {
                            t = null;
                            v.css("margin-top", 0);
                        });
                    } else {
                        z("stop");
                        y();
                    }
                    setTimeout(function () {
                        f(B - 1);
                    }, A + 25);
                } else {
                    h(true);
                }
            }
        }

        function e() {
            if (typeof s === "function") {
                s(m, u);
                s = null;
            }
        }

        function h(A, D) {
            if (t !== null) {
                t.stop();
            }
            var C;
            if (typeof D === "function") {
                C = D();
            } else {
                if (w.repeat) {
                    C = d();
                } else {
                    C = j();
                }
            }
            C.index = (C.index > 7) ? 7 : C.index;
            if (A === true || A <= 1) {
                z("slow", true);
                var E = q(C.index);
                if (C.index === 0) {
                    v.css("margin-top", -a(C.el).height() / 2);
                }
                var B = 75 * g.length - C.index;
                if (p()) {
                    l(C);
                    v.animate({marginTop: E}, B, "easeOutBounce", e);
                } else {
                    z("stop");
                    y();
                }
                setTimeout(function () {
                    z("stop");
                    o = false;
                }, B + 25);
            } else {
                f(A || 3);
            }
        }

        function p() {
            var A = m.offset().top > a(window).scrollTop() + a(window).height(), B = a(window).scrollTop() > m.height() + m.offset().top;
            return !A && !B;
        }

        function x(A) {
            if (i === false) {
                A = A === undefined ? 1 : w.repeat + 1000;
                c = setTimeout(function () {
                    if (i === false) {
                        f(3);
                    }
                    c = x(A);
                }, A);
            }
        }

        m.css("overflow", "hidden");
        g.wrapAll("<div class='slotMachineContainer' />");
        v = m.find(".slotMachineContainer");
        k = -(v.height() - 370);
        v.css("margin-top", q(w.active));
        if (w.repeat !== false) {
            x();
        }
        m.shuffle = function (B, A) {
            i = false;
            s = A;
            f(B);
        };
        m.stop = function (A) {
            i = true;
            if (w.repeat !== false && c !== null) {
                clearTimeout(c);
            }
            h(A);
        };
        m.prev = function () {
            h(true, b);
        };
        m.next = function () {
            h(true, d);
        };
        m.active = function () {
            return r();
        };
        m.isRunning = function () {
            return o;
        };
        m.auto = x;
        return m;
    };
})(jQuery);
/*marquee*/
(function (a) {
    a.fn.myScroll = function (d) {
        var h = {speed: 40, rowHeight: 145};
        var g = a.extend({}, h, d), b = [];

        function c(j, i) {
            j.find(".marqueeCol").animate({marginTop: "-=1"}, 0, function () {
                var k = Math.abs(parseInt(a(this).css("margin-top")));
                if (k >= i) {
                    a(this).find(".p-item").slice(0, 1).appendTo(a(this));
                    a(this).css("margin-top", 0);
                }
            });
        }

        var f = this;

        function e() {
            this.each(function (j) {
                clearInterval(b[j]);
            });
        }

        this.each(function (k) {
            var j = g.rowHeight, l = g.speed, m = a(this);
            b[k] = setInterval(function () {
                if (m.find(".marqueeCol").height() <= m.height()) {
                    clearInterval(b[k]);
                    m.stop(true);
                } else {
                    c(m, j);
                }
            }, l);
        });
        this.stop = e;
        return this;
    };
})(jQuery);


// 初始化ga
window._gaq = window._gaq || [];


/*--------------------
 * @ 定义tiggerPrize对象
 ----------------------------------------------------------*/
$.tiggerPrize = {
    init: function(actID, config) {
        this.actID = actID;
        this.setting = $.extend({
            style: 'left:100px;top:100px;z-index:100;background:#841b00',
            cellImg: 'http://image.meilele.com/images/zhuanti/cell_1468812035.jpg',
            mask: 'http://image.meilele.com/images/zhuanti/mask_1468813469.png',
            cover: 'http://image.meilele.com/images/zhuanti/init_1468813821.jpg',
            delay: 200,
            prizeJson: {},
            loader: $('body')
        }, config);

        this.isDisabledStart = true;

        this.createHtml();
        this.getDataByAjax();
    },

    getDataByAjax: function() {
        if ( !this.actID ) {
            return;
        }

        $.ajax({
            url: '/mll_api/api/luckydraw?prize_id='+ this.actID,
            type: 'GET',
            cache: false,
            success: function(json) {
                if ( json ) {
                    $.tiggerPrize.prizeJson = json;
                    $.tiggerPrize.buildPrizeList();
                    $.tiggerPrize.isDisabledStart = false;
                } else {
                    $.tiggerPrize.isDisabledStart = true;
                }
            },
            error: function() {
                $.tiggerPrize.isDisabledStart = true;
            }
        });
    },

    createHtml: function() {
        var
            that = this,
            html = [],
            marqueeStyle = 'width:163px;height:306px;overflow:hidden;float:left;',
            marqueeColStyle = 'width:163px;',
            cellStyle = 'width:6px;height:306px;overflow:hidden;float:left;',
            virtImg = '<div class="p-item" style="height:145px;"><img src="'+ this.setting.cover +'" width="163" height="306" /></div>',
            division = '<img src="'+ this.setting.cellImg +'" width="6" height="306" />';

        html.push('<div id="_jsTigger_" class="_tigger-ui_" style="width:501px;height:306px;overflow:hidden;position:absolute;'+ this.setting.style +'">');
        html.push('<div style="width:501px;height:306px;background:url('+ this.setting.mask +') center center no-repeat;position:absolute;"></div>');
        html.push('<div class="marquee" style="'+ marqueeStyle +'"><div id="_jsTigger_marquee_1_" class="marqueeCol" style="'+ marqueeColStyle +'">'+ virtImg +'</div></div>');
        html.push('<div style="'+ cellStyle +'">'+ division +'</div>');
        html.push('<div class="marquee" style="'+ marqueeStyle +'"><div id="_jsTigger_marquee_2_" class="marqueeCol" style="'+ marqueeColStyle +'">'+ virtImg +'</div></div>');
        html.push('<div style="'+ cellStyle +'">'+ division +'</div>');
        html.push('<div class="marquee" style="'+ marqueeStyle +'"><div id="_jsTigger_marquee_3_" class="marqueeCol" style="'+ marqueeColStyle +'">'+ virtImg +'</div></div>');
        html.push('</div>');

        this.setting.loader.append(html.join(''));
    },

    // 随机打乱接口返回的抽奖数据
    randomPrizeJson: function(json) {
        // object to string
        var data1 = [], data2 = [], data3 = [];
        for ( k in json ) {
            data1.push($.tiggerPrize.prizeJson[k]);
            data2.push($.tiggerPrize.prizeJson[k]);
            data3.push($.tiggerPrize.prizeJson[k]);
        }

        // random
        data1.sort(function(){ return 0.1 - Math.random() });
        data2.sort(function(){ return 0.5 - Math.random() });
        data3.sort(function(){ return 0.9 - Math.random() });

        // array to object
        function arrayToObject(data) {
            var result = {};
            for ( var i = 0, ii = data.length; i < ii; i++ ) {
                result[i] = data[i];
            }
            return result;
        }

        return [
            arrayToObject(data1),
            arrayToObject(data2),
            arrayToObject(data3)
        ];
    },

    dynamicUpdatePrizeList: function() {
        var
            json = $.tiggerPrize.randomPrizeJson($.tiggerPrize.prizeJson),
            prize = {};

        for ( var i = 0; i < 3; i++ ) {
            var item = json[i];
            prize[i] = [];
            for ( k in item ) {
                prize[i].push('<div class="p-item" style="height:145px;"><img src="'+ $.__IMG + item[k].img_url +'" width="163" height="145" alt="'+ item[k].prize_name +'" /></div>');
            }

            $('#_jsTigger_ .marqueeCol').eq(i).html(prize[i].join('')).css({'margin-top': '-64px'});
        }
    },

    buildPrizeList: function() {
        this.dynamicUpdatePrizeList();
        this.startMarquee(false);
    },

    resetPrizeList: function(data, callback) {
        this.dynamicUpdatePrizeList(data);
        if ( callback && typeof callback === 'function' ) {
            callback();
        }
    },

    startMarquee: function() {
        $.tiggerPrize.resetPrizeList();
        $.tiggerPrize.animateHander = $('.marquee').myScroll({speed: 20, rowHeight: 145});
    },

    stopMarquee: function() {
        $.tiggerPrize.animateHander.stop();
    },

    start: function(isGetPrize, prizeInfo, callback) {
        if ( $.tiggerPrize.isDisabledStart ) {
            return;
        }

        this.stopMarquee();
        $.tiggerPrize.resetPrizeList(false, function(){
            // 初始化滚动组件
            $.tiggerPrize.tiggerUI_1 = $('#_jsTigger_marquee_1_').slotMachine({
                active	: 0,
                delay	: 500
            });
            $.tiggerPrize.tiggerUI_2 = $('#_jsTigger_marquee_2_').slotMachine({
                active	: 1,
                delay	: 500
            });
            $.tiggerPrize.tiggerUI_3 = $('#_jsTigger_marquee_3_').slotMachine({
                active	: 2,
                delay	: 500
            });

            function onComplete($el, active){
                switch($el[0].id){
                    case '_jsTigger_marquee_1_':
                        getPrize(1, active.index + 1);
                        break;
                    case '_jsTigger_marquee_2_':
                        getPrize(2, active.index + 1);
                        break;
                    case '_jsTigger_marquee_3_':
                        getPrize(3, active.index + 1);
                        if ( callback && typeof callback === 'function' ) {
                            callback(prizeInfo);
                        }
                        break;
                }
            }

            $.tiggerPrize.tiggerUI_1.shuffle(3, onComplete);

            setTimeout(function(){
                $.tiggerPrize.tiggerUI_2.shuffle(3, onComplete);
            }, 500);

            setTimeout(function(){
                $.tiggerPrize.tiggerUI_3.shuffle(3, onComplete);
            }, 1000);


            function getPrize(domID, index) {
                var
                    currentImg = $('#_jsTigger_marquee_'+ domID +'_').find('img').eq(index),
                    src = '';

                if ( isGetPrize ) {
                    src = $.tiggerPrize.prizeJson[prizeInfo.level].img_url;
                } else {
                    // 如果未中奖，则在一二等奖中随机显示，最后固定显示三等奖
                    var
                        prizeTmp = [$.tiggerPrize.prizeJson['level1'], $.tiggerPrize.prizeJson['level2']],
                        random = parseInt(Math.random() * 2),
                        level = prizeTmp[random],
                        level3 = $.tiggerPrize.prizeJson['level3'];

                    if ( domID === 1 || domID === 2 ) {
                        src = level.img_url;
                    } else {
                        src = level3.img_url;
                    }
                }
                currentImg.attr('src', $.__IMG + src);
            }
        });
    },

    listen: function() {
        $.tiggerPrize.cookieTimer = setInterval(function(){
            var isClose = $.cookie('_close_');
            if ( isClose == 1 ) {
                clearInterval($.tiggerPrize.cookieTimer);
                $.cookie('_close_', 0);
                $.tiggerPrize.startMarquee(true);
            }
        }, 100);
    }
};


