oojs.define({
    name: 'anticheat',
    namespace: 'rs.business',
	$anticheat:function(){
		if(document.getElementById('container')){
			this.check('container', window.antiArray);
		}
	},
    antiCheatArray: [],
    mouseInClientX: -1,
    mouseInClientY: -1,
    mouseInTime: -1,
    mouseInTimeSpan: -1,
    mousePressTime: -1,
    mouseClickClientX: -1,
    mouseClickClientY: -1,
    mouseClickCheckNum: -1,
    mouseOverTimes: -1,
    bind: function (element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false)
        }
        else {
            element.attachEvent("on" + eventType, handler)
        }
    },

    formatEventObj: function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return e;
    },

    isAdLink: function (element) {
        var className = element.className;
        if (className) {
            className = className.toLowerCase();
            if (className === "gylogo" || className === "bdlogo" || className.substring(0, 7) === "bd-logo") {
                return false;
            }
        }

        if (!this.antiCheatArray && element['data-anti']) {
            return true;
        }
        
        return false;
    },

    mouseInHandler: function (e) {
        if (this.mouseInClientX === -1) {
            this.mouseInClientX = e.clientX;
        }
        if (this.mouseInClientY === -1) {
            this.mouseInClientY = e.clientY;
        }
    },

    mouseInTimeHandler: function (e) {
        if (this.mouseInTime === -1) {
            this.mouseInTime = (new Date()).getTime();
        }
        this.mouseInTimeSpan = (new Date()).getTime() - this.mouseInTime;
    },

    mousePressTimeHandler: function (e) {
        if (e.type === "mousedown") {
            this.mousePressTime = (new Date()).getTime();
        }
        else {
            this.mousePressTime = (new Date()).getTime() - this.mousePressTime;
        }
    },

    mouseClickHandler: function (e) {
        e = this.formatEventObj(e);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== "a" && sourceElement.tagName.toLowerCase() !== "body" ) {
            sourceElement = sourceElement.parentNode;
        }
        this.mouseClickClientX = e.clientX;
        this.mouseClickClientY = e.clientY;

        this.mouseInTimeHandler();

        //make the mouseClickCheckNum
        this.mouseClickCheckNum = 0;
        //针对google adx流量特殊处理
        var isGAdx = false;
        var originHref = sourceElement.href;
        var p = /(?:\?|&)q=(.*?)(?=\&|$)/i;
        if (sourceElement.href.indexOf('google.com') > 0) {
            isGAdx = true;
            var href = originHref.match(p)[1];
            sourceElement.href = decodeURIComponent(href);
        }
        var urlParamMatch = /\.php\?(url=)?([0-9a-zA-Z_-]*)\./.exec(sourceElement.href);
        var urlParam = urlParamMatch[2];
        var linkId = sourceElement.id || '';
        var domIdMatch = /.*(\d+)/.exec(linkId);
        var domNum;
        if (domIdMatch) {
            domNum = domIdMatch[1];
        }
        var midNum = this.antiCheatArray ? this.antiCheatArray[domNum] : sourceElement['data-anti'];
        for (var i = 0; i < (((this.mouseOverTimes * midNum) % 99) + 9); i++) {
            var idx = (this.mousePressTime * i) % urlParam.length;
            this.mouseClickCheckNum += urlParam.charCodeAt(idx);
        }

        //make click url
        var elementHtml = sourceElement.innerHTML;
        if (sourceElement.href.indexOf("&ck") == -1) {
            sourceElement.href += "&ck=" + this.mouseClickCheckNum + "." + this.mouseOverTimes + "." + this.mousePressTime + "." + this.mouseClickClientX + "." + this.mouseClickClientY + "." + this.mouseInClientX + "." + this.mouseInClientY + "." + this.mouseInTimeSpan;
        }
        if ((elementHtml.match(/(www\.)|(.*@.*)/i) != null) && document.all) {
            elementHtml.match(/\<.*\>/i) == null ? sourceElement.innerHTML = elementHtml : sourceElement.innerTEXT = elementHtml;
        }
        //针对google adx流量还原处理
        if (isGAdx) {
            sourceElement.href = originHref.replace(p, "&q=" + encodeURIComponent(sourceElement.href));
        }
    },

    mouseOverHandler: function (e) {
        if (this.mouseOverTimes === -1) {
            this.mouseOverTimes = 0;
        }
        this.mouseOverTimes++;
    },

    check: function (containerId, antiCheatArray) {
        this.antiCheatArray = antiCheatArray || window.antiCheatArray;
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName("a");
        this.bind(container, "mouseover", this.mouseInHandler.proxy(this));
        this.bind(container, "mouseover", this.mouseInTimeHandler.proxy(this));
        for (var i = 0; i < linkArray.length; i++) {
            if (!this.isAdLink(linkArray[i])) {
                continue;
            }
            this.bind(linkArray[i], "mousedown", this.mousePressTimeHandler.proxy(this));
            this.bind(linkArray[i], "mouseup", this.mousePressTimeHandler.proxy(this));
            this.bind(linkArray[i], "click", this.mouseClickHandler.proxy(this));
            this.bind(linkArray[i], "mouseover", this.mouseOverHandler.proxy(this));
        }
    }
});