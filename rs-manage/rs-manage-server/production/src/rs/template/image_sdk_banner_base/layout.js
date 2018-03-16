/* global oojs */
/**
* @file tuwen_sdk
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_banner_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        bannerImgUrl: 'rs.common.model.bannerImgUrl',
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
    // 秋实Sdk所需信息
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
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
        if (ad.mcurl) {
            a['data-mcurl'] = 'mcurl';
            a['mcurl-val'] = ad.mcurl;
        };

        if (ad.isPause) {
            // a['mcurl-val'] = ad.mcurl;
            a['data-ispause'] = ad.isPause;
        };
        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.id = 'res';
        res.class = 'res';
        a.childNodes.push(res);
        // 如果是给手百拉新，则在左边明确提示是用手百打开的,临时实验使用
        var extention = JSON.parse(ad.extention);
        if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
            var shoubaiTip = engine.getLayout(fullConfig);
            shoubaiTip.tagName = 'img';
            shoubaiTip.class = 'shoubaitip';
            shoubaiTip.src = '{{dupDomain}}/cpro/ui/noexpire/img/shoubaitip.png';
            a.childNodes.push(shoubaiTip);
        }
        // icon
        if (act === 2) {
            var icon = engine.getLayout(fullConfig);
            icon.class = 'icon';

             // 广告点击区域——item可点
            var aIcon = engine.getLayout(fullConfig);
            aIcon.tagName = 'a';
            aIcon.id = 'item_btn_0';
            // 广告索引，必须加
            aIcon['data-adindex'] = '0';
            // 广告推广类型
            aIcon['data-adtype'] = act;
            aIcon.title = ad.showUrl || '';
            if (ad.mcurl) {
                a.href = ad.mcurl;
            }
            else {
                a.href = ad.clickUrl;
            }
            aIcon.href = ad.clickUrl;
            aIcon.childNodes.push(icon);
            item.childNodes.push(aIcon);

        }
        else {
            a.href = ad.clickUrl;
        }
        // 填充广告数据
        res.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        /*if (act === 2) {
            // 支持下载暂停,点左边跳LP
            if (ad.isPause && ad.mcurl) {
                a.href = ad.mcurl;
            };
            // 支持Lp分区
            if (ad.mcurl && typeof ad.isPause === 'object') {
                a.href = ad.mcurl;
            };
            // 支持下载暂停，左右两边行为一致
            if (ad.isPause) {
                a.href = ad.clickUrl;
            };
            // 基线
            if (!ad.isPause && !ad.mcurl) {
                a.href = ad.clickUrl;
            };
        }*/
        item.childNodes.push(a);
        items.push(item);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        // logo.id = 'bd-logo40';
        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }

        // 添加样式部分
        var style = {};
        // 动态创意适配实验开始，一期只做320*48,320*50这两个尺寸，适配728*90和468*60，固定宽，高度垂直居中
        var adContainerWidth = context.requestInfo.width;
        var adContainerHeight = context.requestInfo.height;
        var adWidth = ad.width;
        var adHeight = ad.height;
        if (adContainerWidth === 320 && (adContainerHeight === 48 || adContainerHeight === 50) && ((adWidth === 728 && adHeight === 90) || (adWidth === 468 && adHeight === 60))) {
            fullConfig.containerBackgroundColor = '#4A3D5C';
            fullConfig.containerPaddingTop = fullConfig.containerPaddingBottom = (adContainerHeight - adHeight * (adContainerWidth / adWidth)) / 2;
        }
        // 动态创意适配实验结束
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
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
            display: 'block',
            width: '100%',
            height: '100%'
        };
        // icon
        var btnbackground = fullConfig.cbtnbackground || '2e83f7';
        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            'opacity': 0.9
        };
        style['#item_btn_0'] = {
            'position': 'absolute',
            'right': 0,
            'top': fullConfig.containerPaddingTop + 'px',
            'z-index': '2147483647',
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            // 'background': '#2e83f7',
            'opacity': 0.9,
            'text-align': 'center',
            'color': '#fff',
            'font-size': '15px',
            'font-family': '微软雅黑',
            'font-weight': 'bold',
            'line-height': containerHeight + 'px'
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
        style['.shoubaitip'] = {
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'z-index': '2147483647',
            'height': '14px',
            'width': '112px'
        };
        // add adIcon
        // 添加广告标识
        var bdIcon = this.adIcon.getAdIcon({logoType: 'mob-bd-adIcon'});
        bdIcon.id = 'mob-bd-adIcon0';
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(bdIcon);
        };
        var aspectRatio = containerWidth / containerHeight;
        var closeScale = 20 / 3;
        if (aspectRatio && aspectRatio === closeScale) {
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
