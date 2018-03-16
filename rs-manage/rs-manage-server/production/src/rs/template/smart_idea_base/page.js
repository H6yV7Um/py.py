var styleSheetBuilder = {
     addCss: function (cssString) {
         var doc = document;
         var style = doc.createElement("style");
         style.setAttribute("type", "text/css");

         if (style.styleSheet) { // IE
             style.styleSheet.cssText = cssString;
         }
         else { // w3c
             var cssText = doc.createTextNode(cssString);
             style.appendChild(cssText);
         }

         var heads = doc.getElementsByTagName("head");
         if (heads.length) heads[0].appendChild(style);
         else doc.documentElement.appendChild(style);
     },
     cssObjToStr: function (cssObj) {
         var cssStr = "";
         for (var i in cssObj) {
             cssStr = cssStr + i + cssObj[i];
         }
         return cssStr;
     }

 };
var utility = {
     getDom: function (id) {
         if ('string' === typeof id || id instanceof String) {
             return document.getElementById(id);
         }
         else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
             return id;
         }
         return id;
     },
	 strToJson:function(str){
		var json = eval('(' + str + ')');
		return json;
	} ,
     hasClass: function (element, className) {
         var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
         return element.className.match(reg);
     },

     addClass: function (element, className) {
         if (!this.hasClass(element, className)) {
             element.className += " " + className;
         }
     },

     removeClass: function (element, className) {
         if (this.hasClass(element, className)) {
             var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
             element.className = element.className.replace(reg, ' ');
         }
     },
     getDocument: function (element) {
         if (!element) return document;
         element = this.g(element);
         return element.nodeType == 9 ? element : element.ownerDocument || element.document;
     },
     getStyle: function (element, styleName) {
         var result;
         element = this.getDom(element);
         var doc = this.getDocument(element);
         // ie9下获取到的样式名称为: backgroundColor
         // 其他标准浏览器下样式为: background-color
         // 分别使用这两个名字尝试获取样式信息
         var styleNameOther = "";
         if (styleName.indexOf("-") > -1) {
             styleNameOther = styleName.replace(/[-_][^-_]{1}/g, function (
             match) {
                 return match.charAt(1).toUpperCase();
             });
         }
         else {
             styleNameOther = styleName.replace(/[A-Z]{1}/g,

             function (match) {
                 return "-" + match.charAt(0).toLowerCase();
             });
         }

         // 优先使用w3c标准的getComputedStyle方法, 在ie6,7,8下使用currentStyle
         var elementStyle;
         if (doc && doc.defaultView && doc.defaultView.getComputedStyle) {
             elementStyle = doc.defaultView.getComputedStyle(element, null);
             if (elementStyle) {
                 result = elementStyle.getPropertyValue(styleName);
             }
             if (typeof result !== "boolean" && !result) {
                 result = elementStyle.getPropertyValue(styleNameOther);
             }
         }
         else if (element.currentStyle) { // ie6,7,8使用currentStyle
             elementStyle = element.currentStyle;
             if (elementStyle) {
                 result = elementStyle[styleName];
             }
             if (typeof result !== "boolean" && !result) {
                 result = elementStyle[styleNameOther];
             }
         }

         return result;
     }
 }
 /**
  * 智能创意广告组件
  */
 var defaultValueManager = {
     textlink: {
         "color": "#fff",
         "font-family": "微软雅黑",
         "font-size": "18px",
         "width": "100px",
         "height": "100px",
         "display": "inline"
     },
     imagelink: {
         "width": "100px",
         "height": "20px"
     },
     iconlink: {
         "width": "100px",
         "height": "20px",
         "display": "block"
     }
 }

 var adComponent = {
     layout: function (option) {
         this.createDom(option);
         return true;

     },
     text: function (option) {
         var prefix = option.prefix || "";
         var suffix = option.suffix || "";
         var domLinkSpan = document.createElement("span");
         domLinkSpan.innerHTML = prefix + option.content + suffix;
         option.styleObj = this.getStyleObj(option);
         //alert(option.enableClick);
         if (typeof option.enableClick == "undefined" || option.enableClick) {
             var domLink = this.createDomLink(option);
             if (option.content) {
                 domLink.innerHTML = prefix + option.content + suffix;
             }
             option.child = domLink;

         }
         else {
             option.child = domLinkSpan;
         }
         this.createDom(option);
         this.calculateText(option);


     },
     image: function (option) {
         option.styleObj = this.getStyleObj(option);
         var domLinkImg = document.createElement("img");
         domLinkImg.src = option.content;
         domLinkImg.style.width = option.styleObj['width'];
         domLinkImg.style.height = option.styleObj['height'];
         if (typeof option.enableClick == "undefined" || option.enableClick) {
             var domLink = this.createDomLink(option);
             domLink.appendChild(domLinkImg);
             option.child = domLink;
         }
         else {
             option.child = domLinkImg;
         }
         this.createDom(option);
     },
     icon: function (option) {
         option.styleObj = this.getStyleObj(option);
         if (typeof option.enableClick == "undefined" || option.enableClick) {
             var domLink = this.createDomLink(option);
             if (option.content) {
                 domLink.innerHTML = option.content;
             }
             option.child = domLink;
         }

         this.createDom(option);

     },
     createDom: function (option) {
         var domName = option.domName || "div";
         var dom = document.createElement(domName);
         dom.id = option.id;
         if (option.className) {
             dom.className = option.className;
         }
         smGlobleCss["#" + dom.id] = "{" + option.style + "}";
         if (option.child) {
             dom.appendChild(option.child);
         }
         if (option.isBDPreview && option.bdPreview) {
             var previewIcon = this.createBDPreviewIcon(option);
             dom.appendChild(previewIcon);
         }
         var parentNode = document.getElementById(option.parent);
         parentNode.appendChild(dom);
     },

     //for private
     createDomLink: function (option) {
         var domLink = document.createElement("a");
         domLink.id = "link_" + option.id;
         domLink.target = "_blank";
         smGlobleCss["#" + domLink.id] = "{" + this.createDomLinkStyle(option) + "}";
         domLink.href = option.curl;
         if (option.linkDisplay) {
             domLink.style.display = option.linkDisplay;
         }
         return domLink;
     },
     createDomLinkStyle: function (option) {
         var styleObj = option.styleObj;
         var currentLinkStyleObj = {};
         //如果存在class，则合并class的样式到styleObj中

         //先处理style
         for (var i in defaultValueManager[option.type + "link"]) {
             if (styleObj[i]) {
                 currentLinkStyleObj[i] = styleObj[i]
             }
             else {
                 currentLinkStyleObj[i] = styleObj[i] = defaultValueManager[option.type + "link"][i];
             }
         }
         option.styleObj = styleObj;
         var linkStyleStr = this.styleObjToStr(currentLinkStyleObj);
         return linkStyleStr;

     },
     createBDPreviewIcon: function (option) {
         var dom = document.createElement("div");
         dom.className = "bdPreview";

         dom.style.cssText = option.bdPreviewStyle || "";
         dom.innerHTML = option.bdPreview;
         return dom;
     },
     getStyleObj: function (option) {
         var styleObj = this.styleStrToObj(option.style);
         if (option.className) {
             var currentobjClassStr = smGlobleCss["." + option.className];
             if (currentobjClassStr) {
                 var currentClassStr = currentobjClassStr.replace(/\{|\}/g, "");
                 var classOjb = this.styleStrToObj(currentClassStr);
                 styleObj = this.extend(styleObj, classOjb)
             }

         }
         return styleObj;
     },
     clone: function (obj) {
         var objClone;
         if (obj.constructor == Object) {
             objClone = new obj.constructor();
         }
         else {
             objClone = new obj.constructor(obj.valueOf());
         }
         for (var key in obj) {
             if (typeof (obj[key]) == 'object') {
                 objClone[key] = this.clone(obj[key]);
             }
             else {
                 objClone[key] = obj[key];

             }
         }
         return objClone;
     },
     styleStrToObj: function (styleStr) {
         var styleObj = {};
         var styleArray = styleStr.split(";");
         for (var i = 0, l = styleArray.length; i < l; i++) {
             if (styleArray[i]) {
                 var temp = styleArray[i].split(":");
                 styleObj[temp[0]] = temp[1]
             }
         }
         return styleObj;
     },
     styleObjToStr: function (styleObj) {
         var styleStr = "";
         for (var i in styleObj) {
             styleStr = styleStr + i + ":" + styleObj[i] + ";"
         }
         return styleStr;
     },
     //处理文字的垂直居中
     calculateText: function (option) {
         if (!option.content) return;
         var prefix = option.prefix || "";
         var suffix = option.suffix || "";
         var dom = document.getElementById(option.id);
         var styleObj = option.styleObj
         var fontSize = styleObj['font-size'].replace("px", "");
         var domWidth = styleObj["width"].replace("px", "");
         var domOffsetWidth = (this.getByteLength(prefix + option.content + suffix) * fontSize) / 2
         if (domOffsetWidth < domWidth) {
             dom.style.lineHeight = styleObj["height"];
         }
     },
     getByteLength: function (source) {
         if (!source) {
             return "";
         }
         source = String(source);
         source = source.replace(/([^\x00-\xff])/g, "\x241 ");
         return source.length;
     },
     extend: function (target, source) {
         for (var p in source) {
             if (source.hasOwnProperty(p)) {
                 target[p] = target[p] || source[p];
             }
         }
         return target;
     }

 };

 /**
  * 渲染引擎
  */
 var renderEngine = {
     containerId: "container",
     renderContainer: function (option) {
         var isGongyi = option.isGongyi || false;
         var config = option.config;

         var containerWrap = document.createElement("div");
         containerWrap.id = "containerWrap";
         containerWrap.className = "containerWrap";
         containerWrap.style.position = "relative";
         var containerStyleObj = adComponent.styleStrToObj(smLayoutconfig['container'].style);

         if (config.templateWidth && config.templateHeight) {
             var containerBorder = 1;
             var tempArray = smGlobleCss['.container'].split(";");
             for (var i = 0, l = tempArray.length; i < l; i++) {
                 if (tempArray[i].indexOf("border") > -1) {
                     containerBorder = parseInt(tempArray[i].split(":")[1].match(/\dpx/)[0].replace("px", ""));
                 }
             }
             containerWrap.style.paddingLeft = containerWrap.style.paddingRight = (parseInt(config.templateWidth) - parseInt(containerStyleObj["width"]) - 2 * containerBorder) / 2 + "px";
             containerWrap.style.paddingTop = containerWrap.style.paddingBottom = (parseInt(config.templateHeight) - parseInt(containerStyleObj["height"]) - 2 * containerBorder) / 2 + "px";
             containerWrap.style.width = parseInt(config.templateWidth) - 2 * containerBorder - 2 * parseInt(containerWrap.style.paddingLeft.replace("px", "")) + "px" || containerStyleObj["width"];
             containerWrap.style.height = parseInt(config.templateHeight) - 2 * containerBorder - 2 * parseInt(containerWrap.style.paddingTop.replace("px", "")) + "px" || containerStyleObj["height"];
         }
       
        for(var i=0,l=tempArray.length;i<l;i++){
						if(tempArray[i].indexOf("border")>-1){
							containerWrap.style.border = tempArray[i].split(":")[1];
						}
					}
          

         window.loader = document.getElementById("loader");
         window.loader.parentNode.insertBefore(containerWrap, window.loader);
         //logo逻辑
         if (config.containerShowLogo != 0) {
             var logoStyle = config.logoType || "bd-logo";
             if (config.templateWidth && config.templateWidth == 310) {
                 logoStyle = logoStyle + " bd-logo-310-260";
             }
             var logoOption = {
                 "className": logoStyle,
                 "isGongyi": isGongyi
             };
             containerWrap.appendChild(this.drawLogo(logoOption));
         }

         var container = document.createElement("div");
         container.id = this.containerId;
         var containerStyleObj = adComponent.styleStrToObj(smLayoutconfig['container'].style);
         container.style.width = containerStyleObj["width"];
         container.style.height = containerStyleObj["height"];
         container.style.border = 0;
         container.className = "container";
         containerWrap.appendChild(container);

         return containerWrap;
     },
    renderItem: function(option) {
		var layoutConfig = option.smLayoutconfig;
		var ads = option.ads;
		var adComponent = option.adComponent;
		
		var brandBlockObj = {}; //  品牌Logo layout对象
		var adBlockObj = {}; //广告部分layout对象
		var styleStr = ""; //样式
		
		//把brand和adblock分开, 因为如果是轮播，adblock需要layout多次
		delete layoutConfig['container'];
		for(var item in layoutConfig){
			if(item.indexOf("brand")>-1){
				brandBlockObj[item] = layoutConfig[item];
			}else{
				adBlockObj[item] = layoutConfig[item];
			}
		}
		
		//layout brandBlock;
		var adInfoArr = ads.smartIdeaProduct;
		for(var brandItem in brandBlockObj){
			var currentItem = adComponent.clone(brandBlockObj[brandItem]);
			if(ads.isBDPreview){
				currentItem.isBDPreview = true;
			}
			currentItem.content = currentItem.content || adInfoArr[0].brandLogo;
			//这里需要确定一下	
			var jsonData =  utility.strToJson(adInfoArr[0].jsonData);
			if(currentItem.k && jsonData[currentItem.k]){
				currentItem.content = jsonData[currentItem.k];
			}
			currentItem.curl = adInfoArr[0].clickUrl || ads.clickUrl
			this.renderItemByType(currentItem);
		}
		
		
		//每个广告块都设置为一个单独的广告对象，存放在adBlockArray数组中
		var adBlockArray = [];
		var adItemNum = adBlockObj.adBlock.adItemNum || 1;
		var adBlockNum = Math.ceil(adInfoArr.length/adItemNum); //多轮播的时候，计算需要几个adBlock，因为每个adBlock里面，有可能有多个adItem
		for(var i=0;i<adBlockNum;i++){
			var currentAdBlockObj = adComponent.clone(adBlockObj);
			for (var item in currentAdBlockObj){
				//针对多广告轮播, 对adBlock块的位置做偏移
				var currentItem = currentAdBlockObj[item];
				if(currentItem.id == "adBlock"){
					var styleObj = adComponent.styleStrToObj(currentItem.style);
					if(i!=0){
						styleObj.left = parseInt(styleObj.left.replace("px",""))+parseInt(styleObj.width.replace("px",""))+"px";
			
					}
					currentItem.style =  adComponent.styleObjToStr(styleObj);
					currentItem.id = currentItem.id + "_" + i;	
				}
				//修改parent属性,为了在多广告轮播的时候，让元素找到自己的父容器
				if(currentAdBlockObj[item].parent === "adBlock") {
					currentAdBlockObj[item].parent = currentAdBlockObj[item].parent+"_" + i;}
			}
			adBlockArray.push(currentAdBlockObj);
		}
		

		// 遍历adBlockArray,生成广告内容
		var adItemIndex = -1;
		var adInfoArrLength = adInfoArr.length;
		//如果是多商品，为了方便轮播，需要给adBlock添加一个父元素
		if(adBlockNum > 0 && layoutConfig.adBlockWrap) {
			adComponent.layout(layoutConfig.adBlockWrap);
		}
		for( var i=0,l=adBlockArray.length;i<l;i++){
			var currentAdBlockObj = adBlockArray[i];
			adComponent.layout(currentAdBlockObj.adBlock);
			delete currentAdBlockObj.adBlock;
			delete currentAdBlockObj.adBlockWrap;
			//多商品
			if(adItemNum != 1){
				for(var k=0;k<adItemNum&& (adItemIndex+1)!=adInfoArrLength;k++){
					if(k == adItemNum -1 || (adItemIndex+2) == adInfoArrLength ){
						delete currentAdBlockObj.adItemSpace;
					}
					for (var item in currentAdBlockObj ){
						if(item == "adItem"){
							adItemIndex++;
						}
						var currentItem = adComponent.clone(currentAdBlockObj[item]);
						if(currentItem.id != "adItem" && currentItem.id != 'adItemSpace'){
							currentItem.parent =currentItem.parent + "_" + adItemIndex;
						}
						currentItem.id = currentItem.id + "_" + adItemIndex;
						var jsonData =  utility.strToJson(adInfoArr[adItemIndex].jsonData);
						if(currentItem.k && jsonData[currentItem.k]){
							currentItem.content = jsonData[currentItem.k];
						}
						if(ads.isBDPreview){
							currentItem.isBDPreview = true;
						}
						currentItem.curl = adInfoArr[adItemIndex].clickUrl || ads.clickUrl;
						this.renderItemByType(currentItem);									
					}
				}
			
			}else{ //单商品
				adItemIndex++;
				for (var item in currentAdBlockObj ){
					var currentItem = currentAdBlockObj[item];
					currentItem.id = currentItem.id + "_" + adItemIndex;
					if(currentItem.parent.indexOf('adBlock') == -1){ //修改父亲
							currentItem.parent =currentItem.parent + "_" + adItemIndex;
					}
					var jsonData =  utility.strToJson(adInfoArr[adItemIndex].jsonData);
					if(currentItem.k && jsonData[currentItem.k]){
						currentItem.content = jsonData[currentItem.k];
					}
					if(ads.isBDPreview){
						currentItem.isBDPreview = true;
					}
					currentItem.curl = adInfoArr[adItemIndex].clickUrl || ads.clickUrl
					this.renderItemByType(currentItem);
				}
			}
			
		}        	 	
	},
     renderItemByType: function (currentItem) {
         if (!currentItem.isShow) {
             return;
         }
         switch (currentItem.type) {
         case "layout":
             adComponent.layout(currentItem);
             break;
         case "image":
             adComponent.image(currentItem);
             break;
         case "text":
             adComponent.text(currentItem);
             break;
         case "icon":
             adComponent.icon(currentItem);
             break;
         }
     },

     drawLogo: function (option) {
         option = option || {};
         var logoId = option.logoId || "logo";
         var logoDom = document.getElementById(logoId);
         if (!logoDom) {
             logoDom = document.createElement("a");
         }

         var isGongyi = false;
         if (typeof option.isGongyi === "undefined" && typeof window.isGongyi !== "undefined") {
             isGongyi = window.isGongyi;
         }
         else {
             isGongyi = option.isGongyi ? true : false;
         }
        if(config.account && config.account !== "super-nova"){
            logoDom.innerHTML = "&nbsp;";
            logoDom.className = option.className || "bd-logo";
            logoDom.target = '_blank';
            if (isGongyi) {
                logoDom.href = 'http://gongyi.baidu.com/';
                logoDom.title = '\u767e\u5ea6\u516c\u76ca';
            }
            else {
                logoDom.href = 'http://wangmeng.baidu.com/';
                logoDom.title = '\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f';
            }
        }else{
            logoDom.href = "";
            logoDom.title = "";
            logoDom.className = "bd-logo5";
            logoDom.onclick = function (e) {
                if (e && e.preventDefault){
                    e.preventDefault();
                }else{
                    window.event.returnValue = false;
                }
                return false;
            }
            logoDom.innerHTML = "";
        }
        var tempFunc = function () {
            logoDom.style.zoom = '1';
        };
        setTimeout(tempFunc, 100);
        return logoDom;
     }

 };

var lunboComponent = {
	init:function(option){
		this.initConfig(option);
		this.layoutIcon(option);
		this.layoutLunboPageNum(option);
		this.lunbo(option);

	},
	initConfig:function(option){
		this.option = option;
		this.lunboLeftIcon = option.lunboLeftIcon;
		this.lunboRightIcon = option.lunboRightIcon;
		this.lunboPageNum = option.lunboPageNum;
		var adItemNum = smLayoutconfig.adBlock.adItemNum || 1;
		this.pageCountNum = Math.ceil(ads[0].smartIdeaProduct.length/adItemNum);
		this.currentAdNum = 0;
		this.currentAdNumDom = null;
		this.lunboTimer = null;
		this.leftInterval = null;
		this.rightInterval = null;
		this.lunboRun = true;
		this.lunboEachStep = option.lunboStep/10;
		
	},
	layoutIcon:function(option){
		var parentDom = document.getElementById(option.lunboLeftIconBlock.parent);
		var iconStyleStr = ".leftIconBlock{cursor:pointer;"+option.lunboLeftIconBlock.style+"}.leftIcon{"+option.lunboLeftIcon.style+"background:url('"+option.lunboLeftIcon.src+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboLeftIcon.src+"');_background:none;cursor:pointer;}.leftIconMouseOver{background:url('"+option.lunboLeftIcon.mouseover+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboLeftIcon.mouseover+"');_background:none;cursor:pointer;}"+".leftIconHover{background:url('"+option.lunboLeftIcon.hover+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboLeftIcon.hover+"');_background:none;cursor:pointer;}"+".rightIconBlock{cursor:pointer;"+option.lunboRightIconBlock.style+"}.rightIcon{"+option.lunboLeftIcon.style+"background:url('"+option.lunboRightIcon.src+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboRightIcon.src+"');_background:none;cursor:pointer;}.rightIconMouseOver{background:url('"+option.lunboRightIcon.mouseover+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboRightIcon.mouseover+"');_background:none;cursor:pointer;}"+".rightIconHover{background:url('"+option.lunboRightIcon.hover+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboRightIcon.hover+"');_background:none;cursor:pointer;}"
		if(option.lunboLeftIconBlock && option.lunboLeftIconBlock.isShow){
			var leftIconBlockDom = document.createElement('div');
			leftIconBlockDom.className = "leftIconBlock";
			
			var leftIconDom = document.createElement('div');
			leftIconDom.className = "leftIcon";
			
			leftIconBlockDom.appendChild(leftIconDom);
			parentDom.appendChild(leftIconBlockDom);
			leftIconBlockDom.onmouseover = function(){
				utility.addClass(leftIconDom,"leftIconHover");
				lunboComponent.lunboRun = false;
			}
			leftIconBlockDom.onmouseout = function(){
				utility.removeClass(leftIconDom,"leftIconHover");
				lunboComponent.lunboRun = true;
			}
			leftIconBlockDom.onclick = this.previouAd;
		}
		
		if(option.lunboRightIconBlock && option.lunboRightIconBlock.isShow){
			var rightIconBlockDom = document.createElement('div');
			rightIconBlockDom.className = "rightIconBlock"
			var rightIconDom = document.createElement('div');
			rightIconDom.className = "rightIcon";
			
			rightIconBlockDom.appendChild(rightIconDom);
			
			parentDom.appendChild(rightIconBlockDom);
			
			rightIconBlockDom.onmouseover = function(){
				utility.addClass(rightIconDom,"rightIconHover");
				lunboComponent.lunboRun = false;
			}
			rightIconBlockDom.onmouseout = function(){
				utility.removeClass(rightIconDom,"rightIconHover");
				lunboComponent.lunboRun = true;
			}
			rightIconBlockDom.onclick = this.nextAd;
			parentDom.onmouseover = function(){
				utility.addClass(rightIconDom,"rightIconMouseOver");
				utility.addClass(leftIconDom,"leftIconMouseOver");
			}
			parentDom.onmouseout = function(){
				utility.removeClass(rightIconDom,"rightIconMouseOver");
				utility.removeClass(leftIconDom,"leftIconMouseOver");
			}
		
		}
		
		
		
		styleSheetBuilder.addCss(iconStyleStr)
	},
	layoutLunboPageNum:function(option){
		if(!option.lunboPageNumBlock.isShow) return;
		var parentDom = document.getElementById(option.lunboPageNumBlock.parent);
		var pageNumStyleStr = ".pageNum{"+option.lunboPageNumBlock.style+"background:url('"+option.lunboPageNumBlock.src+"') no-repeat 0 0; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=none, src='"+option.lunboPageNumBlock.src+"');_background:none;}.currentpageNum{color:#999999;line-height:36px;text-align:center;width:36px;padding-left:5px;font-family:verdana;font-size:11px;}";
		
		var pageNum = document.createElement('div');
		pageNum.className = "pageNum";
		parentDom.appendChild(pageNum);
		
		var currentpageNum = document.createElement('div');
		currentpageNum.className = "currentpageNum";
	
		currentpageNum.innerHTML = "<span id='currentPageNum' style='"+option.lunboCurrentPageNum.style+"'>1</span>/"+this.pageCountNum;
		pageNum.appendChild(currentpageNum);
		this.currentAdNumDom = utility.getDom("currentPageNum");
		styleSheetBuilder.addCss(pageNumStyleStr)
	},
	changeAd:function(index){
		this.currentAdNum = index;
		lunboComponent.currentDom = utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.currentDom.style.left = 0;
	},
	previouAd:function(){
		clearTimeout(this.lunboTimer); //暂停轮播
		lunboComponent.lunboRun = false;
		clearInterval(lunboComponent.rightInterval);
		lunboComponent.getCurrentAdNum("left");
		lunboComponent.previouDom = utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.previouDom.style.left = smLunboConfig.lunboStep+"px";
		lunboComponent.getCurrentAdNum("right");
		lunboComponent.currentDom = utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.getCurrentAdNum("right");
		lunboComponent.nextDom =  utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.currentDom.style.left = 0;
		lunboComponent.nextDom.style.left = "-"+smLunboConfig.lunboStep+"px";
		if(smLunboConfig.isAnimation){
			lunboComponent.rightInterval = setInterval(function(){	
				lunboComponent.currentDom.style.left = parseFloat(lunboComponent.currentDom.style.left.replace('px','')) + lunboComponent.lunboEachStep + "px";
				lunboComponent.nextDom.style.left = parseFloat(lunboComponent.nextDom.style.left.replace('px','')) + lunboComponent.lunboEachStep + "px"
				if(Math.abs(lunboComponent.nextDom.style.left.replace('px','')) < lunboComponent.lunboEachStep){
					clearInterval(lunboComponent.rightInterval);
					lunboComponent.nextDom.style.left = 0;
					lunboComponent.currentDom.style.left = smLunboConfig.lunboStep+"px";
				}
			},100);
		}else{
			lunboComponent.currentDom.style.left = smLunboConfig.lunboStep+"px";
			lunboComponent.nextDom.style.left = 0;
		}
		
		
		if(smLunboConfig.lunboPageNumBlock.isShow){
			lunboComponent.currentAdNumDom.innerHTML = lunboComponent.currentAdNum+1;
		}
		//点击按钮后，过一秒钟再开始轮播
		setTimeout(function(){
			lunboComponent.lunboRun = true;
			lunboComponent.lunbo(smLunboConfig);
		},1000);
	
	},
	nextAd:function(){
		clearTimeout(this.lunboTimer);
		lunboComponent.lunboRun = false;
		clearInterval(lunboComponent.leftInterval);
		lunboComponent.getCurrentAdNum("right");
		lunboComponent.previouDom = utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.previouDom.style.left = "-"+smLunboConfig.lunboStep+"px";

		lunboComponent.getCurrentAdNum("left");
		lunboComponent.currentDom = utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		lunboComponent.getCurrentAdNum("left");
		lunboComponent.nextDom =  utility.getDom(smLunboConfig.lunboBlock+"_"+lunboComponent.currentAdNum);
		
		lunboComponent.currentDom.style.left = 0;
		lunboComponent.nextDom.style.left = smLunboConfig.lunboStep+"px";
		if(smLunboConfig.isAnimation){
			lunboComponent.leftInterval = setInterval(function(){	
				lunboComponent.currentDom.style.left = parseFloat(lunboComponent.currentDom.style.left.replace('px','')) -lunboComponent.lunboEachStep + "px";
				lunboComponent.nextDom.style.left = parseFloat(lunboComponent.nextDom.style.left.replace('px','')) - lunboComponent.lunboEachStep + "px"
				if(Math.abs(lunboComponent.nextDom.style.left.replace('px','')) <lunboComponent.lunboEachStep){
					clearInterval(lunboComponent.leftInterval);
					lunboComponent.nextDom.style.left = 0;
					lunboComponent.currentDom.style.left = smLunboConfig.lunboStep+"px";
				}
			},50);					
		}else{
			lunboComponent.currentDom.style.left = "-"+smLunboConfig.lunboStep+"px";
			lunboComponent.nextDom.style.left = 0;
		}
		if(smLunboConfig.lunboPageNumBlock.isShow){					
			lunboComponent.currentAdNumDom.innerHTML = lunboComponent.currentAdNum + 1;
		}
		setTimeout(function(){
			lunboComponent.lunboRun = true;
			lunboComponent.lunbo(smLunboConfig);
		},1000);
	},
	getCurrentAdNum:function(option){
		if(option == "left"){
			lunboComponent.currentAdNum ++;	
			if(lunboComponent.currentAdNum ==  lunboComponent.pageCountNum){
				lunboComponent.currentAdNum = 0;
			}
		}else{
			lunboComponent.currentAdNum --;
			if(lunboComponent.currentAdNum ==  -1){
				lunboComponent.currentAdNum = lunboComponent.pageCountNum -1;
			}
		}
	},
	lunbo:function(option){
		if(!this.lunboRun) return;
		var timer = option.lunboTimeArray[this.currentAdNum] || 5000;
		clearTimeout(this.lunboTimer);
		this.lunboTimer = setTimeout(function(){
			lunboComponent.lunboAd();
		},timer)
	
		
	},
	lunboAd:function(){
		if(!this.lunboRun) return;
		this.nextAd();
		this.lunbo(smLunboConfig);
	}
}
var ThisPage = {
	init: function() {
		this.initConfig();
	},
	initConfig: function() {
		this.config = window.config;
		this.isGongyi = this.config.isGongyi || false;
		this.smGlobleCss = window.smGlobleCss;
		this.smLayoutconfig = window.smLayoutconfig;
		this.renderEngine = window.renderEngine;
		this.adComponent = window.adComponent;
		this.styleSheetBuilder = window.styleSheetBuilder;
		this.ads = window.ads;
		this.layout();
	},
	layout: function() {
		this.containerDom = renderEngine.renderContainer({
			"config":this.config,
			"isGongyi": this.isGongyi
		});
		renderEngine.renderItem({
			"smLayoutconfig":this.smLayoutconfig,
			"adComponent":this.adComponent,
			"ads":this.ads[0]
		});
		
		//添加css样式
		var smGlobleCssStr = styleSheetBuilder.cssObjToStr(smGlobleCss);
		styleSheetBuilder.addCss(smGlobleCssStr)
		
		 
		//添加轮播组件
		if(smLunboConfig && smLunboConfig.isLunbo){
			var adBlockNum =  Math.ceil(ads[0].smartIdeaProduct.length/smLayoutconfig.adBlock.adItemNum);
			if(adBlockNum == 1) return;
			lunboComponent.init(smLunboConfig)
		}
		
	}            
}
	   

            
 ThisPage.init();