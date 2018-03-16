/* global oojs */
/**
 * @file 移动端反作弊ck-fc
 * @author fanwenjuan
 **/
oojs.define({
    name: 'anticheatMobileFc',
    namespace: 'rs.business',
    $anticheatMobileFc: function () {
        if (window.antiArray && document.getElementById('container')) {
            this.check('container', window.antiArray);
        }
    },

    /**
     * touchStart 时间戳
     */
    touchStartTime: 0,

    /**
     * touchEnd 时间戳
     */
    touchEndTime: 0,

    /**
     * touchStartTime 和 touchEndTime 的差
     */
    pressTime: 0,

    /**
     * touchStart X 坐标 相对屏幕
     */
    touchX: 0,

    /**
     * touchStart Y 坐标相对屏幕
     */
    touchY: 0,

    /**
     * 是否开始滚动,fc没有默认值
     */
    isStartScroll: false,

    /**
     * 最近一次滚动的Y坐标
     */
    scrollLastY: 0,

    /**
     * 开始滚动的Y坐标
     */
    scrollStartY: 0,

    /**
     * 开始滚动的时间
     */
    scrollStartTime: 0,

    /**
     * 最近一次滚动的时间
     */
    scrollLastTime: 0,

    /**
     * 滚动整体时间
     */
    scrollTotalTime: 0,

    /**
     * 滚动方向
     */
    scrollDirection: 'none',

    /**
     * 滚动次数
     */
    scrollNum: 0,

    /**
     * 滚动方向改变量
     */
    scrollTotalChange: 0,

    /**
     * 滚动阈值
     * @type {Number}
     */
    scrollBoundary: 10,

    /**
     * 有效滚动距离, 为啥不是一个整数？
     */
    validDirection: 'none',

    /**
     * 点击时间
     */
    clickTime: 0,

    /**
     * 点击坐标X
     */
    clickX: 0,

    /**
     * 点击坐标Y
     */
    clickY: 0,

    /**
     * 点击时间和touchEnd时间差
     */
    diffclickTimeAndTouchEndTime: 0,

    /**
     * touchStart 事件处理
     * @param  {event} event touchStart 事件处理
     */
    onTouchStart: function (event) {
        var touch = event.touches.item(0);
        this.touchX = parseInt(touch.pageX, 10);
        this.touchY = parseInt(touch.pageY, 10);
        this.countScrollOnTouchStart();
        this.touchStartTime = this.getEventTime(event);
    },

    /**
     * 在滚动开始时，计数
     */
    countScrollOnTouchStart: function () {
        if (this.isStartScroll && this.validDirection !== 'none') {
            this.scrollCount();
            this.scrollTotalChange = 0;
            this.isStartScroll = false;
            this.scrollDirection = 'none';
        }
    },

    /**
     * 滚动次数计数
     */
    scrollCount: function () {
        this.scrollNum++;
        this.scrollTotalTime += this.scrollLastTime - this.scrollStartTime;
        this.validDirection = 'none';
    },

    /**
     * 获取事件时间
     *
     * @param  {Object} event 触发事件
     * @return {number}       时间戳
     */
    getEventTime: function (e) {
        return e.timeStamp !== 0 ? parseInt(e.timeStamp, 10) : (new Date).getTime();
    },

    /**
     * touchEnd 事件处理
     * @param  {event} event touchStart 事件处理
     */
    onTouchEnd: function (event) {
        this.touchEndTime = this.getEventTime(event);
        this.pressTime = this.touchEndTime - this.touchStartTime;
    },

    /**
     * 通过touchMove 来模拟触发 scroll 事件
     * @param  {Object} event 事件
     */
    onTouchMove: function (event) {
        this.onScrollEvent(event);
    },

    /**
     * 滚动事件处理
     * @param  {event} event scroll 事件
     */
    onScrollEvent: function (event) {
        if (!this.isStartScroll) {
            this.isStartScroll = true;
            this.scrollStartY = window.scrollY;
        }
        var nowScrollY = window.scrollY;
        var scrollValue = Math.abs(nowScrollY - this.scrollLastY);
        var nowDirection = this.getScrollDirection(this.scrollLastY, nowScrollY) || this.scrollDirection;
        var eventTime = this.getEventTime(event);
        if (this.isValidScroll(scrollValue, nowDirection)) {
            if (eventTime > this.scrollLastTime) {
                this.scrollLastTime = eventTime;
            }
            if (this.validDirection === 'none') {
                this.validDirection = this.scrollDirection;
                this.scrollStartTime = eventTime;
            }
            if (this.validDirection !== this.scrollDirection) {
                this.scrollCount();
                this.scrollStartTime = eventTime;
                this.validDirection = this.scrollDirection;
            }
        }

        this.scrollLastY = this.nowScrollY;
    },

    /**
     * 获取滚动方向
     * @param  {number} startY 开始滚动Y坐标
     * @param  {number} nowY   当前坐标
     * @return {string}        滚动方向 up 上  down 下
     */
    getScrollDirection: function (startY, nowY) {
        if (nowY > startY) {
            return 'up';
        }
        else {
            if (nowY < startY) {
                return 'down';
            }
            else {
                return false;
            }
        }
    },

    /**
     * 是否是有小滚动
     * @param  {number}  scrollValue  滚动距离
     * @param  {string}  nowDirection 滚动方向
     * @return {boolean}              是否是有效滚动
     */
    isValidScroll: function (scrollValue, nowDirection) {
        if (this.scrollDirection === 'none') {
            this.scrollDirection = nowDirection;
        }

        if (nowDirection !== this.scrollDirection) {
            this.scrollDirection = nowDirection;
            this.scrollTotalChange = 0;
        }
        else {
            this.scrollTotalChange += scrollValue;
        }
        return this.scrollTotalChange > this.scrollBoundary;
    },

    /**
     * 获取校验码
     * @param  {string} url       计费url
     * @return {number}            检验码
     */
    getCheckCode: function (url) {
        var urlSearch;
        var checkCode = 0;
        urlSearch = /\.php\?(url=)?([0-9a-zA-Z_-]*)\./.exec(url);
        if (urlSearch) {
            var num = (((this.pressTime * this.imTimeSign) % 99) + 9);
            var iDomainLen = urlSearch[2].length;
            for (var x = 0; x < num; ++x) {
                checkCode += urlSearch[2].charCodeAt((this.touchX * x) % iDomainLen);
            }
            return checkCode;
        }
        return false;
    },

    /**
     * 获取ck值
     * @param  {string}  url        计费url
     * @return {string}             ck值 x.x.x.x.x.x
     */
    getCkValue: function (url) {
        if (typeof url !== 'string') {
            return false;
        }
        this.templateWidth = this.containerDom.offsetWidth;
        this.templateHeight = this.containerDom.offsetHeight;
        this.diffclickTimeAndTouchEndTime = 0;
        if (this.clickTime > 0 && this.clickTime > this.touchEndTime) {
            this.diffclickTimeAndTouchEndTime = this.clickTime - this.touchEndTime;
        }
        var checkCode = this.getCheckCode(url);
        if (checkCode !== false) {
            var ckValue = [
                checkCode,
                this.pressTime,
                this.touchX,
                this.touchY,
                this.templateWidth,
                this.templateHeight,
                this.scrollNum,
                this.scrollTotalTime,
                this.diffclickTimeAndTouchEndTime,
                this.clickX,
                this.clickY
            ].join('.');
            return ckValue;
        }
        else {
            return false;
        }
    },

    /**
     * 添加ck到url后面
     * @param {string}  url        被添加ck的url
     * @return {string} 添加好ck的url
     */
    addCkOnUrl: function (url) {
        var ckValue = this.getCkValue(url);
        var ckReg = /&ck=[\w.]*/;
        if (ckValue === false) {
            return url;
        }
        if (url.indexOf('&ck=') === -1) {
            url += '&ck=' + ckValue;
        }
        else {
            url = url.replace(ckReg, '&ck=' + ckValue);
        }
        return url;
    },

    /**
     * click 事件处理
     *
     * @param  {Object} event click
     */
    touchClickHandler: function (event) {
        this.clickTime = this.getEventTime(event);
        this.clickX = event.pageX;
        this.clickY = event.pageY;
        var sourceElement = event.target;
        if (sourceElement.tagName.toLowerCase() !== 'a') {
            sourceElement = this.resTag(sourceElement);
        }
        if (sourceElement === null) {
            return false;
        }
        var sourceEleHref = this.getAttr(sourceElement, 'date-href');
        var domIdMatch = /.*(\d+)/.exec(sourceElement.id);
        var domNum = domIdMatch[1];
        this.imTimeSign = this.antiCheatArray[domNum];
        sourceElement.href = this.addCkOnUrl(sourceEleHref);
        this.clearCount();
    },

    /**
     * 向上遍历，找到a标签
     *
     * @param  {Object} element 获取标签
     */
    resTag: function (element) {
        var element = element.parentNode;
        if (element.tagName.toLowerCase() !== 'a'
            && element.tagName.toLowerCase() !== 'body') {
            return this.resTag(element);
        }
        return element;
    },
    // 绑定函数
    bind: function (element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false);
        }
        else {
            element.attachEvent('on' + eventType, handler);
        }
    },

    /**
     * 不确定是否有必要添加该函数
     * @param  {event} event touchEnd
     */
    touchEndHandler: function (event) {
        this.clickTime = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.touchClickHandler(event)
    },

    /**
     * 清空滚动计数
     */
    clearCount: function () {
        this.scrollNum = 0;
        this.scrollTotalTime = 0;
    },

    /**
     * 绑定事件
     * @param  {string}  containerId  广告容器id
     * @param  {number}  antiCheatArray 反作弊数组
     */
    check: function (containerId, antiCheatArray) {
        this.antiCheatArray = antiCheatArray || window.antiCheatArray;
        var container = this.containerDom = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        this.bind(container, 'touchstart', this.onTouchStart.proxy(this));
        this.bind(container, 'touchend', this.onTouchEnd.proxy(this));
        this.bind(container, 'touchmove', this.onTouchMove.proxy(this));
        window.addEventListener('scroll', this.onScrollEvent, true);
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
            if (tempClassName) {
                tempClassName = tempClassName.toLowerCase();
                if (tempClassName === 'gylogo'
                || tempClassName === 'bdlogo'
                || tempClassName.substring(0, 7) === 'bd-logo') {
                    continue;
                }
            }
            // 凤巢的ck脚本里面添加了该函数，不确定是否真的需要添加
            // this.bind(linkArray[i], 'touchend', this.touchEndHandler.proxy(this));
            this.bind(linkArray[i], 'click', this.touchClickHandler.proxy(this));
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        }
        else {
            return element[key];
        }
    }
});

/* eslint-enable fecs-max-statements */
