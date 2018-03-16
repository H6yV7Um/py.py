/* global oojs */
/**
* @file image_sdk_banner_lbs
* @author nieyuxin
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_banner_lbs',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        base64ImgUrl: 'rs.common.model.base64ImgUrl',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000'
    },
    getByteLength: function (source) {
        if (!source) {
            return '';
        }
        source = String(source);
        source = source.replace(/([^\x00-\xff])/g, '\x241 ');
        return source.length;
    },
    // 秋实Sdk所需信息
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                extention.curl = extention.curl || ad.clickUrl;
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        var act = ad.actionType || 1;
        var engine = this.basic;
         // 扩展字段
        var ext = {};
        try {
            if (ad.extention) {
                ext = JSON.parse(ad.extention);
            }
        } catch (e) {}
        var lpText = '\u67e5\u770b\u8be6\u60c5';// 查看详情
        var orderText = '\u9884\u7ea6\u5230\u5e97';// 预约到店
        var DiscountText = '\u9886\u53d6\u4f18\u60e0';// 领取优惠

        var textType = ext.text_type || 0;
        var actText = lpText;
        switch (textType) {
            case 0: actText = lpText;
                break;
            case 1: actText = orderText;
                break;
            case 2: actText = DiscountText;
                break;
            default: actText = lpText;
                break;
        }
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;
        // item 移动只出一条广告

        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.id = 'res';
        res.class = 'res';
        a.childNodes.push(res);

        // text
        var divText = engine.getLayout(fullConfig);
        divText.tagName = 'div';
        divText.id = 'divText';
        divText.class = 'divText';
        a.childNodes.push(divText);

        // lbs相关的信息
        var address = engine.getLayout(fullConfig);
        address.tagName = 'div';
        address.class = 'address';

        var addressImg = engine.getLayout(fullConfig);
        addressImg.tagName = 'img';
        addressImg.src = '{{dupDomain}}/cpro/ui/noexpire/img/newLocation.png';

        var addressText = engine.getLayout(fullConfig);
        addressText.tagName = 'span';
        addressText.class = 'addressText';

        var destination = engine.getLayout(fullConfig);
        destination.tagName = 'span';
        destination.class = 'destination';

        var splitLine = engine.getLayout(fullConfig);
        splitLine.tagName = 'span';
        splitLine.class = 'splitline';

        var addressDisplay = ext.distance ? 'block' : 'none';
        if (ext.distance && ext.shop_name) {
            addressText.innerHTML = ext.distance + 'km';
            destination.innerHTML = ext.shop_name;
        } else if (ext.shop_name) {
            destination.innerHTML = ext.shop_name;
        } else {
            destination.innerHTML = '查看门店信息';
        }

        address.childNodes.push(addressImg, addressText);
        if (ext.distance && ext.shop_name) {
            address.childNodes.push(splitLine);
        }
        address.childNodes.push(destination);
        divText.childNodes.push(address);

        var order = engine.getLayout(fullConfig);
        order.tagName = 'div';
        order.class = 'order';
        var orderText = engine.getLayout(fullConfig);
        orderText.tagName = 'span';
        orderText.class = 'orderText';
        orderText.innerHTML = actText;
        var orderTextImg = engine.getLayout(fullConfig);
        orderTextImg.tagName = 'img';
        orderTextImg.src = '{{dupDomain}}/cpro/ui/noexpire/img/right_arrow.png';
        order.childNodes.push(orderText);
        order.childNodes.push(orderTextImg);
        divText.childNodes.push(order);
        // icon
        // if (act === 2) {
        //     var icon = engine.getLayout(fullConfig);
        //     icon.tagName = 'img';
        //     var iconSrc = this.bannerImgUrl.get(act);
        //     icon.src = iconSrc;
        //     icon.class = 'icon';
        //     a.childNodes.push(icon);
        // }

        // 填充广告数据
        res.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);

        // 关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);


        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var rem = containerWidth / 16;
        var vrem = containerHeight / 16;
        var pt = containerHeight / 48;

        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        };
        style['.container'] = containerStyle;

        style['.item, .item a'] = {
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none'
        };
        style['.item a'] = {
            display: 'block'
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        style['.res'] = {
            'display': 'block',
            width: '100%',
            height: '100%'
        };
        var divTextHeight = 4 * vrem;
        style['.divText'] = {
            'width': '100%',
            'height': divTextHeight + 'px',
            'position': 'absolute',
            'left': 0,
            'bottom': 0,
            'background-color': '#000000',
            'background-color': 'rgba(0,0,0,0.5)',
            'color': '#ffffff'
        };
        var addressWidth = 13 * rem - 40;
        style['.address'] = {
            'width': addressWidth + 'px',
            'height': divTextHeight  + 'px',
            'line-height': divTextHeight  + 'px',
            'float': 'left',
            'box-sizing': 'border-box',
            'padding-left': '18px'
        };
        var addressImageWidth = 3 * vrem;
        var addressImagePadding = 0.5 * vrem;
        style['.address img'] = {
            'width': addressImageWidth + 'px',
            'height': addressImageWidth  + 'px',
            'padding': addressImagePadding + 'px',
            'float': 'left'
        };
        var addressFontSize =  10 * pt;
        style['.address span'] = {
            'height': divTextHeight  + 'px',
            'line-height': divTextHeight  + 'px',
            'display': 'block',
            'float': 'left',
            'font-size': addressFontSize + 'px'
        };
        var addressTextWidth = 0;
        if (addressDisplay === 'block') {
            addressTextWidth = addressFontSize / 3 + (this.getByteLength(ext.distance + 'km')) * addressFontSize / 2;
        }
        style['.address span.addressText'] = {
            'width': addressTextWidth + 'px',
            'display': addressDisplay,
            'text-align': 'center'
        };
        var destinationWidth = addressWidth - addressImageWidth - addressImagePadding * 2 - addressTextWidth - 30;
        style['.address span.destination'] = {
            'width': destinationWidth,
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
        };
        var splitlineMarginTop = (4 * vrem - 10 * pt) / 2;
        style['.address span.splitline'] = {
            'float': 'left',
            'margin': splitlineMarginTop + 'px 5px',
            'border-right': '1px solid #ffffff',
            'height': 10 * pt + 'px',
            'vertical-align': 'middle'
        };
        var spanWidth = 10 * pt * 4;
        var imageWidth = 2.5 * vrem;
        var imagePadding = 0.75 * vrem;
        var orderWidth = spanWidth + imageWidth + imagePadding * 2;
        style['.order'] = {
            'width': orderWidth + 'px',
            'height': divTextHeight + 'px',
            'line-height': divTextHeight + 'px',
            'position': 'absolute',
            'bottom': 0,
            'right': '40px',
            'box-sizing': 'border-box'
        };
        style['.order span'] = {
            'width': spanWidth + 'px',
            'height': divTextHeight  + 'px',
            'line-height': divTextHeight  + 'px',
            'display': 'block',
            'float': 'left',
            'font-size': 10 * pt + 'px',
            'text-align': 'center'
        };
        style['.order img'] = {
            'width': imageWidth + 'px',
            'height': imageWidth  + 'px',
            'padding': imagePadding + 'px'
        };
        // icon
        var btnbackground = fullConfig.cbtnbackground || '2e83f7';
        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            'background': '#' + btnbackground,
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            'opacity': 0.9
        };

        // 关闭按钮样式
        var closeBtnRadius = 18;
        var closeBtnDivRadius = 25;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center',
            'color': '#fff'
        };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };
        // add logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        };
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
