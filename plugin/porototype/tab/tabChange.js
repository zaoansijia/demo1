/**
 * Created by Anan on 2016/7/27.
 * tabChange Plugin
 */
(function($){
    $.tabChange = function(setting) {
        new $.tabChange.prototype.init(setting);
    }
    $.tabChange.defaults = {
        trigger_event_type:'click'
    }

    $.tabChange.prototype = {
        init: function(setting) {
            this.setting = $.extend( {}, $.tabChange.defaults, setting );
            this.show();
        },

        show: function() {
            var box = $(this.setting.container);
            box.find('.tab-header ul li').on(this.setting.trigger_event_type,function() {
                $(this).addClass('active').siblings().removeClass('active');
                box.find('.tab-content .tab-item').eq($(this).index()).addClass('item-active').siblings().removeClass('item-active');
            })
        }
    }

    $.tabChange.prototype.init.prototype = $.tabChange.prototype;
})(jQuery)