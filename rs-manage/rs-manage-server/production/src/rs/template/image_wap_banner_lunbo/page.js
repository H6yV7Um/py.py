/* global oojs */
/* global actionTypeInfo */
/**
 * @file image_wap_banner_lunbo
 * @author yuxinxiao
 */
oojs.define({
    name: 'page',
    namespace: 'rs.template',
    // deps: {tween:'rs.template.tween'},
    $page: function() {
        this.paint();
    },
    paint: function() {

        if (ads[0].stuffType == 100) {
            if (ads.length >= 2) {
                this.init('image-list', 'btns-list', {
                    autoPlay: true,
                    speed: 3000
                });
            } else {
                document.getElementById('btns-list').style.display = 'none';
            }

            this.send_postmsg();

        } else {
            return;
        }
    },
    init: function(container, controls, params) {

        this.oTimer = null;
        this.iNow = 0;
        this.iScroll = 0;
        this.iStartX = 0;
        this.iStartPageX = 0;
        this.windowWidth = document.documentElement.clientWidth;
        this.obj = document.getElementById(container);
        this.aBtns = document.getElementById(controls).children;
        this.obj.innerHTML += this.obj.innerHTML;
        this.aLi = this.obj.querySelectorAll('li');
        var len = this.aLi.length
        this.obj.style.width = this.windowWidth * len + "px";
        for (var i = 0; i < len; i++) {
            this.aLi[i].style.width = this.windowWidth + 'px';
        }
        this.
    default = {
            autoPlay: false,
            speed: 1000,
            effect: 'slide',
        }
        this.extend(true, this.
    default, params)

        if (this.
    default.autoPlay) {
            this.autoPlay()
        }
        this.obj.addEventListener("touchstart", function(ev) {
            me.fnStart(ev)
        }, false);
        this.obj.addEventListener("touchmove", function(ev) {
            me.fnMove(ev)
        }, false);
        this.obj.addEventListener("touchend", function(ev) {
            me.fnEnd(ev)
        }, false);

    },
    extend: function(deep, target, options) {
        for (name in options) {
            copy = options[name];
            if (deep && copy instanceof Array) {
                target[name] = Swiper.extend(deep, [], copy);
            } else if (deep && copy instanceof Object) {
                target[name] = Swiper.extend(deep, {}, copy);
            } else {
                target[name] = options[name];
            }
        }
        return target;
    },
    autoPlay: function() {
        var me = this;
        this.oTimer = setInterval(function() {
            me.iNow++;
            me.next();
        }, this.
    default.speed)
    },
    fnStart: function(ev) {
        clearInterval(this.oTimer);
        clearInterval(this.obj.timer);
        if (this.iNow <= 0) {
            this.iNow += this.aBtns.length;
            this.iScroll = -this.iNow * window.screen.width;
            this.tweens.css(this.obj, "translateX", this.iScroll);
        }
        this.iStartPageX = ev.changedTouches[0].pageX;
        this.iStartX = this.iScroll;
    },
    fnMove: function(ev) {
        ev.preventDefault();
        var iDis = ev.changedTouches[0].pageX - this.iStartPageX;
        this.iScroll = this.iStartX + iDis;
        this.tweens.css(this.obj, "translateX", this.iScroll);
    },
    fnEnd: function(ev) {
        var iDis = ev.changedTouches[0].pageX - this.iStartPageX;
        var iNub = Math.round(iDis / window.screen.width);
        this.iNow -= iNub;
        this.next();
        if (this.
    default.autoPlay) {
            this.autoPlay();
        }
    },
    next: function() {
        var me = this
        this.iScroll = -this.iNow * window.screen.width;

        for (var i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].className = "";
        }
        this.aBtns[this.iNow % this.aBtns.length].className = "active";
        if (this.iNow >= this.aBtns.length) {
            this.tweens.tweenMove(this.obj, {
                translateX: this.iScroll
            }, 300, "easeOut", function() {
                me.iNow = me.iNow % me.aBtns.length;
                me.iScroll = -me.iNow * window.screen.width;
                me.tweens.css(me.obj, "translateX", me.iScroll);
            });
        } else {
            this.tweens.tweenMove(this.obj, {
                translateX: this.iScroll
            }, 300, "easeOut");
        }
    },
    send_postmsg: function() {


        for (var i = 0; i < ads.length; i++) {
            var ad = ads[i];
            var ext = {};
            if (ad.extention) {
                ext = JSON.parse(ad.extention);
            }
            if (!ads[0].title && typeof(ads[0].title) != "undefined" && ads[0].title != 0) {
                var jason_title = ads[0].title = ext["appinfo"]["name"];
            } else {
                var jason_title = ads[0].title;
            }
        };
        var jason_scale = ads[0].width / ads[0].height;
        var msgData = {
            dspid: 6,
            title: jason_title,
            curl: ads[0].clickUrl,
            scale: jason_scale
        };

        var sjson_data = JSON.stringify(msgData);

        window.parent.postMessage(sjson_data, '*');

    }

});
