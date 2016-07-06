/**
 * Created by q on 2015/12/18.
 */
var Mycanvas = function () {
    function changePage(element, effect, callback) {
        element.addClass(effect).one("animationend webkitAnimationEnd", function () {
            callback && callback();
        })
    }

    var Christmas = function () {
        A = $(".page-a");
        B = $(".page-b");
        C = $(".page-c");
        //new pageA(A);
        new pageA(A,function() {
            changePage(A,'effect-out',function(){
                new pageB(function() {
                    //changePage(C,'effect-in',function(){
                    //    new pageC(function(){});
                    //});
                })
            })
        })
    };
    var Christmas1 = function () {
        A = $(".page-a");
        B = $(".page-b");
        C = $(".page-c");
        //new pageA(A);
            changePage(A,'effect-out',function(){
                new pageB(B)
            })
    };

    function pageA(e,callback) {
        //根元素
        root = e;
        //圣诞老人
        boy = e.find('.boy');
        win = e.find('.window');
        leftWin = win.find('.window-left');
        rightWin = win.find('.window-right');
        //运行动画
        this.run(callback);
    }
    function pageB(e,pageComplete){
        //男孩
        var boy= e.find('.christmas-boy');
        var girl= e.find('.girl')
        var animationEnd='animationend webkitAnimationEnd';
        var girlAction={
            standUp: function(){
                var dfd= $.Deferred();
                //起立
                setTimeout(function(){
                    girl.addClass('girl-standUp');
                },200)
                //抛书
                setTimeout(function(){
                    girl.addClass('girl-throwBook');
                    dfd.resolve();
                },500)
                return dfd;
            },
            //走路
            walk:function(callback){
                var dfd = $.Deferred();
                girl.addClass("girl-walk");
                girl.transition({
                    "left": "4.5rem"
                }, 4000, "linear", function() {
                    dfd.resolve()
                })
                return dfd;
            },
            //停止走路
            stopWalk: function() {
                girl.addClass("walk-stop")
                    .removeClass("girl-standUp")
                    .removeClass("girl-walk")
                    .removeClass("girl-throwBook")
                    .addClass("girl-stand")
            },

            //选择3d
            choose: function(callback) {
                girl.addClass("girl-choose")
                    .removeClass("walk-stop");
                girl.one(animationEnd, function() {
                    callback();
                })
            },
            //泪奔
            weepWalk: function(callback) {
                girl.addClass("girl-weep");
                girl.transition({
                    "left": "7rem"
                }, 1000, "linear", function() {
                    girl.addClass("walk-stop").removeClass("girl-weep")
                    callback();
                })
            },
            //拥抱
            hug: function() {
                girl.addClass("girl-hug").addClass("walk-run")
            }
        }
        //小男孩动作
        var boyAction={
            //走路
            walk:function(){
                var dfd= $.Deferred();
               // boy.addClass("boy-walk");
                boy.transition({
                    'right': '4.5rem'
                },4000,'linear',function(){
                    dfd.resolve();
                });
                return dfd;
            },
            //停止走路
            stopWalk: function(){
                boy.removeClass('boy-walk').addClass('boy-stand');
            },
            //继续走路
            runWalk: function(){
                boy.addClass('walk-run');
            },
            //解开包裹
            unwrapp: function(){
                var dfd= $.Deferred();
                boy.addClass('boy-unwrapp').removeClass('boy-stand');
                boy.one(animationEnd,function(){
                    dfd.resolve();
                });
                return dfd;
            },
            //脱衣动作
            strip: function(count){
                boy.addClass('boy-strip-'+count).removeClass('boy-unwrapp');
            },
            //人物拥抱以及重叠问题处理
            hug: function(){
                boy.addClass('boy-hug').one(animationEnd,function(){
                    $('.christmas-boy-head').show();
                });
            }



        }
        //开始走路
        //开始走路
        boyAction.walk()
            .then(function() {
                //停止走路
                boyAction.stopWalk();
            })
            .then(function() {
                //解开包裹
                return boyAction.unwrapp();
            })
            .then(function() {
                //脱衣动作
                setTimeout(function(){
                    boyAction.strip(1)
                },1000)
                setTimeout(function(){
                    boyAction.strip(2)
                },2000)
                setTimeout(function(){
                    boyAction.strip(3)
                },3000)
                //任务重叠问题
                setTimeout(function(){
                    boyAction.hug();
                },4000)
            })

        girlAction
            .standUp()
            .then(function() {
                //女孩停止走路
                return girlAction.stopWalk();
            })
            .then(function() {
                //女孩走路
                return girlAction.walk();
            })
            .then(function(){
                //选择
                girlAction.choose(function() {
                    //继续走路
                    girlAction.weepWalk(function() {
                        //拥抱
                        girlAction.hug();
                    })
                })

            })
    }
    //开窗
    pageA.prototype.openWindow = function (callback) {
        //这里是为了等到两个动画都结束后才能执行后续动作，是需要监听另个开门动作的动画完成了
        var count = 1;
        var complete = function () {
            ++count;//注意++i和i++的区别
            if (count == 2) {
                callback && callback();
            }
        }
        var bind = function (data) {
            data.one('tansitionend webkitTransitionEnd', function (event) {
                data.removeClass('window-transition');
                complete();
            })
        }
        bind(leftWin.addClass('window-transition').addClass("hover"))
        bind(rightWin.addClass('window-transition').addClass('hover'))
    }

    //运行下一个动画
    pageA.prototype.next = function (options) {
        var dfd = $.Deferred();
        boy.transition(options.style, options.time, "linear", function () {
            dfd.resolve();
        });
        return dfd;
    }
    //停止走路
    pageA.prototype.stopWalk = function () {
        boy.removeClass('boy-deer');
    }
    //路径
    pageA.prototype.run = function (callback) {
        var that = this;
        var next = function () {
            return this.next.apply(this, arguments)
        }.bind(this);
        next({
            'time': 10000,
            "style": {
                "top": "4rem",
                "right": "16rem",
                "scale": "1.2"
            }
        })
            .then(function () {
                return next({
                    "time": 500,
                    "style": {
                        "rotateY": "-180",
                        "scale": "1.5"
                    }
                })
            })
            .then(function () {
                return next({
                    "time": 7000,
                    "style": {
                        "top": "7.8rem",
                        "right": "1.2rem"
                    }
                })
            })
            .then(function () {
                that.stopWalk();
                setTimeout(function(){
                    that.openWindow();
                },1000);
                setTimeout(function(){
                    callback&&callback();
                },4000)
            })

    }
////场景a
//    function pageA(callback){    //callback回掉函数
//        setTimeout(function(){
//            callback()
//        },2000);
//    }
//场景b

////场景c
//    function pageC(callback){
//        setTimeout(function(){callback()},1000);
//    }
    function html5audio(url, loop) {
        var audio = new Audio(url);
        audio.autoplay = true;
        audio.loop = loop || false;//判断是否循环
        audio.play();
        return {
            end: function (callback) {
                audio.addEventListener('ended', function () {
                    callback()
                }, false);
            }
        }
    }

    $(function () {
        $(".bt1").click(function () {
            //开始活动
            Christmas()
        });
        $(".bt2").click(function () {
            var audio1 = html5audio('http://www.imooc.com/upload/media/one.mp3');
            audio1.end(function () {
                alert('音乐已经结束');
            })
        })
        $(".bt3").click(function () {
            html5audio('http://www.imooc.com/upload/media/one.mp3', true);
        })
        $('.bt4').click(function () {
            Christmas();
        });
        $('.bt5').click(function () {
            Christmas1();
        })
    })

}();
