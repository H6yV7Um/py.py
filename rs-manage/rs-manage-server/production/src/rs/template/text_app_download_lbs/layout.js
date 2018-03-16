/* global oojs */
/**
* @file text_app_download_lbs
* @author fanwenjuan
*/
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_app_download_lbs',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        base64ImgUrl: 'rs.common.model.base64ImgUrl',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
    },
    $layout: function () {},
    isNeedLayoutCache: false,
    isNeedRenderData: false,
    templateRegex: new RegExp('{([^}]*)}', 'g'),

    defaultValue: {
        logoType: 'bd-logo4',
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },
    getByteLength: function (source) {
        if (!source) {
            return '';
        }
        source = String(source);
        source = source.replace(/([^\x00-\xff])/g, '\x241 ');
        return source.length;
    },

    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        var ad = ads[0];
        // 扩展字段
        var ext = {};
        try {
            if (ad.extention) {
                ext = JSON.parse(ad.extention);
            }
        } catch (e) {}
        // 下载类扩展字段
        ext.appinfo = ext.appinfo || {};
        // app探测相关
        var deteConf = ext.appinfo.deteConf || {};
        var appData = ext.appinfo.appData || {};
        var lbsData = ext.lbsInfo || {};
        var engine = this.basic;
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var pt = containerHeight / 48;
        style['a:-webkit-any-link'] = {// chrome浏览器的reset css
            'text-decoration': 'none'
        };
        style['a'] = {
            'text-decoration': 'none'
        };

        style['.container'] = containerStyle;
        style['#container'] = {
            'background-color': '#ffffff',
            'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#ffffff), to(#f3f3f3));background:-webkit-linear-gradient(top, #ffffff, #f3f3f3);background:-moz-linear-gradient(top, #ffffff, #f3f3f3);background:-o-linear-gradient(top, #ffffff, #f3f3f3);background:-ms-linear-gradient(top, #ffffff, #f3f3f3);FILTER:progid:DXImageTransform.Microsoft.Gradient(startColorStr=#ffffff, endColorStr=#f3f3f3)'
        };
        style['.container img'] = {
            border: 'none'
        };
        style['.item, .itemlink'] = {
            width: '100%',
            height: '100%',
            display: 'block'
        };
        var brandWidth = containerHeight;
        style['.brandlogo'] = {
            'width': brandWidth + 'px',
            'height': brandWidth + 'px',
            'float': 'left'
        };

        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            'background': '#ff3d7c',
            'width': containerHeight + 'px',
            'height': containerHeight + 'px'
        };
        var iconSrc = this.base64ImgUrl.get(1);
        style['.icon::after'] = {
            'content': '\'\'',
            'background': '#fff',
            '-moz-mask-size': '100% 100%',
            '-webkit-mask-size': '100% 100%',
            '-o-mask-size': '100% 100%',
            '-ms-mask-size': '100% 100%',
            'mask-size': '100% 100%',
            '-moz-mask-image': 'url(' + iconSrc + ')',
            '-webkit-mask-image': 'url(' + iconSrc + ')',
            '-o-mask-image': 'url(' + iconSrc + ')',
            '-ms-mask-image': 'url(' + iconSrc + ')',
            'mask-image': 'url(' + iconSrc + ')'
        };
        var contentPaddingLeft = 5;
        var contentWidth = containerWidth - brandWidth - contentPaddingLeft - containerHeight;
        style['.content'] = {
            'width': contentWidth + 'px',
            'height': containerHeight + 'px',
            'float': 'left',
            'padding-left': contentPaddingLeft + 'px',
            'font-family': '微软雅黑'
        };
        var titleHeight = 24 * pt;
        style['.title, .address, .splitline, .timer'] = {
            'height': titleHeight + 'px',
            'line-height': titleHeight + 'px'
        };
        style['.title'] = {
            width: contentWidth + 'px'
        };
        var addressDisplay = lbsData.distance ? 'block' : 'none';
        var addressFontSize = 14 * pt;
        var addressWidth = 0;
        if (addressDisplay === 'block' && containerWidth > 300) {
            addressWidth = addressFontSize + (this.getByteLength(lbsData.distance + '米') + 1) * addressFontSize / 2;
        }
        style['.address'] = {
            'float': 'left',
            'display': addressDisplay,
            'width': addressWidth + 'px',
            'height': titleHeight + 'px',
            'font-size': addressFontSize + 'px',
            'color': '#ff8a42',
            'vertical-align': 'middle'
        };
        style['.address img'] = {
            'width': addressFontSize + 'px',
            'height': addressFontSize * 1.25 + 'px',
            'vertical-align': 'text-bottom'
        };
        var splitlineMarginTop = (titleHeight - addressFontSize) / 2;
        style['.splitline'] = {
            'float': 'left',
            'margin': splitlineMarginTop + 'px 5px ' + splitlineMarginTop + 'px 0',
            'border-right': '1px solid #858585',
            'height': addressFontSize + 'px',
            'vertical-align': 'middle'
        };
        var timerDisplay = lbsData.minutes === 5 ? 'block' : 'none';
        var timerFontSize = 14 * pt;
        var timerWidth = 70 * pt + 2;
        style['.timer'] = {
            'float': 'left',
            'display': timerDisplay,
            'width': timerWidth + 'px',
            'font-size': timerFontSize + 'px',
            'color': '#ff3d7c',
            'vertical-align': 'middle'
        };
        style['.timer img'] = {
            'width': timerFontSize + 'px',
            'height': timerFontSize * 1.25 + 'px',
            'padding-right': '1px',
            'vertical-align': 'text-bottom'
        };

        var textBrandWidth = contentWidth;
        if (timerDisplay === 'block') {
            textBrandWidth = textBrandWidth - timerWidth;
        }
        if (addressDisplay === 'block') {
            textBrandWidth = textBrandWidth - addressWidth;
        }
        textBrandWidth = textBrandWidth - 6;
        var textBrandFontSize = 16 * pt;
        style['.textbrand'] = {
            'float': 'left',
            'font-size': textBrandFontSize + 'px',
            'font-weight': 'bold',
            'color': '#3a3a3a',
            'vertical-align': 'middle',
            'display': 'inline-block',
            'width': textBrandWidth + 'px',
            'height': '100%',
            'overflow': 'hidden'
        };
        var descHeight = 20 * pt;
        var descFontSize = 14 * pt;
        style['.desctxt'] = {
            'color': '#ccc',
            'font-size': descFontSize + 'px',
            'white-space': 'nowrap',
            'width': contentWidth + 'px',
            'height': descHeight + 'px',
            'line-height': descHeight + 'px',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden'
        };
        var descCountNumFontSize = 18 * pt;
        style['.descdescountnum'] = {
            'font-size': descCountNumFontSize + 'px',
            'color': '#ff3d7c'
        };

        style['.descdescounttxt'] = {
            color: '#ff3d7c'
        };
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': Math.round(12 * pt),
        //     'height': Math.round(12 * pt),
        //     'background-size': 'contain'
        // };

        // layout
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;
        // item
        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        var createDomLink = function () {
            return {
                style: {},
                childNodes: [],
                title: ad.showUrl || '',
                href: ad.clickUrl,
                target: '_blank',
                tagName: 'a',
                // 解决下载链接打开appstore问题 target : '_blank',
                // 为了性能逐条属性写入
                timeInterval: deteConf.timeInterval || '',
                checkCount: deteConf.checkCount || '',
                expiredTime: deteConf.expiredTime || '',
                maxDetectTimes: deteConf.maxDetectTimes || '',
                appkey: appData.appkey || '',
                sk: appData.sk || ''
            };
        };

        var itemlink = createDomLink();
        itemlink.href = ad.clickUrl;
        itemlink.class = 'itemlink';
        itemlink.id = 'itemlink';

        // tuwen_logo
        var brandImg = engine.getLayout(fullConfig);
        brandImg.tagName = 'img';
        brandImg.class = 'brandlogo';
        brandImg.src = ad.stuffSrc;

        // tuwen_content
        var content = engine.getLayout(fullConfig);
        content.class = 'content';

        // title
        var title = engine.getLayout(fullConfig);
        title.class = 'title';

        // titleBrand
        var textBrand = engine.getLayout(fullConfig);
        textBrand.tagName = 'span';
        textBrand.class = 'textbrand';
        textBrand.innerHTML = ad.title;
        title.childNodes.push(textBrand);
        // titleAddress
        if (lbsData.distance && containerWidth > 300) {
            var address = engine.getLayout(fullConfig);
            address.class = 'address';
            var addressImg = engine.getLayout(fullConfig);
            addressImg.tagName = 'img';
            addressImg.src = '{{dupDomain}}/cpro/ui/noexpire/img/address.png';
            var addressText = engine.getLayout(fullConfig);
            addressText.tagName = 'span';
            addressText.innerHTML = lbsData.distance + '米';
            address.childNodes.push(addressImg, addressText);
            title.childNodes.push(address);
        }
        var splitLine = engine.getLayout(fullConfig);
        splitLine.tagName = 'span';
        splitLine.class = 'splitline';
        if (lbsData.distance && lbsData.minutes === 5) {
            title.childNodes.push(splitLine);
        }
        // 倒计时
        if (lbsData.minutes === 5) {
            var timer = engine.getLayout(fullConfig);
            timer.class = 'timer';
            var timerImg = engine.getLayout(fullConfig);
            timerImg.tagName = 'img';
            timerImg.src = '{{dupDomain}}/cpro/ui/noexpire/img/timer.png';
            var timerText = engine.getLayout(fullConfig);
            timerText.tagName = 'span';
            timerText.innerHTML = '<span id="spanMin">4</span>分<span id="spanSec">59</span>秒';
            timer.childNodes.push(timerImg, timerText);
            title.childNodes.push(timer);
        }

        // desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'span';
        desc.class = 'desctxt';
        if (lbsData.discount) {
            if (contentWidth > descFontSize * 18) {
                desc.innerHTML = '请于倒计时结束前抢购，立享<span class="descdescountnum">' + lbsData.discount + '</span><span class="descdescounttxt">折</span>优惠!';
            } else {
                desc.innerHTML = '现在抢购，立享<span class="descdescountnum">' + lbsData.discount + '</span><span class="descdescounttxt">折</span>优惠!';
            }
        } else {
            desc.innerHTML = '现在抢购，更多折扣优惠等着您';
        }
        var icon = engine.getLayout(fullConfig);
        icon.class = 'icon';

        // 组装layoutObj
        content.childNodes.push(title, desc);
        itemlink.childNodes.push(brandImg, content, icon);
        item.childNodes.push(itemlink);
        items.push(item);
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }

        try {
            if (fullConfig.isShowCloseFeedBack) {
                var logInfoDiv = engine.getLayout(fullConfig);
                logInfoDiv.class = 'logInfoDiv';
                logInfoDiv.id = 'logInfoDiv';
                style['.logInfoDiv'] = {
                    'display': 'none'
                };
                var dspDiv = engine.getLayout(fullConfig);
                dspDiv.class = 'dspDiv';
                dspDiv.id = 'dspDiv';
                style['.dspDiv'] = {
                    'display': 'none'
                };
                /* eslint-disable max-len */
                dspDiv.innerHTML = context.requestInfo.account;// dspId:发送日志参数
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');// s:发送日志参数-反馈日志md5加密字符串
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加反馈内容
            }
        }
        catch (e) {

        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});