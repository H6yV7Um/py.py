oojs.define({
    name: 'page',
    deps: {},
	iframeId: 'appDetecBridge',
    iframeUrl: '{{dupDomain}}/cpro/ui/html/appDetect.html',
	prefix: 'baiduAppDetec',
	confKeys: ['timeInterval','checkCount','expiredTime','maxDetectTimes','detectPosition'],
	appdataKeys: ['appkey','sk'],
    $page: function () {
		var detecIframeTemplate = [
			'<iframe id="',
			this.iframeId,
			'" src="',
			this.iframeUrl,
			'" align="center,center" marginwidth="0"  marginheight="0" frameborder="0" height="0"></iframe>'
		];
		document.write(detecIframeTemplate.join(''));
		
		// 广告点击触发写入探测逻辑
		this.setData('container');
    },
	
	bind: function (element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false)
        }
        else {
            element.attachEvent('on' + eventType, handler)
        }
    },

    formatEventObj: function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return e;
    },

    mouseClickHandler: function (e) {
        e = this.formatEventObj(e);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a') {
            sourceElement = sourceElement.parentNode;
        }
        // 从linkDom上获取应用信息
		var conf = {};
		for(var i = 0; i < this.confKeys.length; i++){
			var value = sourceElement.getAttribute(this.confKeys[i]);
			if(value !== null && value !== ''){
				conf[this.confKeys[i]] = parseInt(value);
			}
		}
		var appData = {};
		for(var i = 0; i < this.appdataKeys.length; i++){
			var value = sourceElement.getAttribute(this.appdataKeys[i]);
			if(value === null || value === ''){// app信息不全不写入错误信息
				return;
			}
			appData[this.appdataKeys[i]] = String(value);
		}
		
		// 获取iframe
		var iframe = document.getElementById(this.iframeId);
		if(iframe && iframe.contentWindow.postMessage){
			// 前缀——每次相同，actionName——接口名，后接::数据（序列化）
			if(conf){
				iframe.contentWindow.postMessage(this.prefix + 'setConfig' + '::' + JSON.stringify(conf), '*');
			}
			iframe.contentWindow.postMessage(this.prefix + 'pushApp' + '::' + JSON.stringify(appData), '*');
		}
    },

    setData: function (containerId) {
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
            if (tempClassName) {
                tempClassName = tempClassName.toLowerCase();
                if (tempClassName === 'gylogo' || tempClassName === 'bdlogo' || tempClassName.substring(0, 7) === 'bd-logo') {
                    continue;
                }
            }
            this.bind(linkArray[i], 'click', this.mouseClickHandler.proxy(this));
        }
    }
});