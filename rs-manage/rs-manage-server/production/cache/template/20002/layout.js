/**
 * @file 图片基础移动模板
 * @author qianixaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'image_base_layout',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

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

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;

        var ads = requestInfo.adElements;

        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        container['adsLen'] =  ads.length;

        // items
        var items = container.childNodes;
        /****************添加附加信息************************************/
        var adsLen = ads.length;
        var noAction = ',';
        var fowardType = 0;
        var hasAttach = false;
        var aIndex = 0;
        for (var i = 0; i < adsLen; i++) {
            var ad = ads[i];
            // 判断是否有附加信息
            if (ad.action.length > 1) {
                hasAttach = true;
                aIndex = 1;
            }
        }

        for (var i = 0; i < adsLen; i++) {
            // item 移动只出一条广告
            var ad = ads[i];
            var act = parseInt(ad.action[0].actionType, 10) || 4;
            var item = engine.getLayout(fullConfig);
            item.class = 'item';
            item.id = 'item' + i;

            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            if (act === 4) {
                a.target = '_blank';
            }
            a['data-adtype'] = act;
            a.id = 'itemA' + i;
            a.class = 'itemA';

            // 广告logo
            var logo = engine.getLayout(fullConfig);
            logo.tagName = 'div';
            logo.id = 'logo' + i;
            logo.class = 'logo';
            // logo图片
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'img';
            logo.childNodes.push(logoImg);
            item.childNodes.push(logo);

            try {
                if (hasAttach) {
                    fowardType = ad.action[aIndex].actionType ? ad.action[aIndex].actionType : 0;
                    var titleIconA = engine.getLayout(fullConfig);
                    titleIconA.tagName = 'a';
                    titleIconA.id = 'titleIconA' + i;
                    titleIconA.class = 'titleIconA' + i;
                    titleIconA.target = '_blank';

                    var titleIcon = engine.getLayout(fullConfig);
                    titleIcon.tagName = 'img';
                    titleIcon.id = 'titleIcon' + i;
                    titleIcon.class = 'titleIcon';

                    titleIconA.childNodes.push(titleIcon);
                    item.childNodes.push(titleIconA);
                    switch (fowardType) {
                        case 6:
                            titleIconA.type = 'phone';
                            titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/phone_logo.png';
                            titleIconA.target = '_self';
                            if (ad.action[aIndex].phone && ad.action[aIndex].phone.traceUrl) {
                                titleIconA.curl = ad.action[aIndex].phone.traceUrl;
                            }
                            if (ad.action[aIndex].phone && ad.action[aIndex].phone.phoneNumber) {
                                titleIconA.href = 'tel:' + (ad.action[aIndex].phone.phoneNumber
                                ? ad.action[aIndex].phone.phoneNumber : '');
                            }
                            break;
                        case 0:
                            noAction += i + ',';
                            break;
                        case 13:
                            titleIconA.type = 'qiao';
                            titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/qiao_icon.png';
                            titleIcon.title = '';
                            if (ad.action[aIndex].bizBridge && ad.action[aIndex].bizBridge.traceUrl) {
                                titleIconA.href = ad.action[aIndex].bizBridge.traceUrl;
                            }
                            break;
                        case 1:
                            titleIconA.type = 'message';
                            titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/mess_logo.png';
                            if (ad.action[aIndex].message && ad.action[aIndex].message.messageContent) {
                                var msgCon = ad.action[aIndex].message.messageContent;
                                titleIconA.msgCon  = msgCon;
                            }
                            if (ad.action[aIndex].message && ad.action[aIndex].message.messageNumber) {
                                var msgNum = ad.action[aIndex].message.messageNumber;
                                titleIconA.msgNum = msgNum;
                            }
                            if (ad.action[aIndex].message && ad.action[aIndex].message.traceUrl) {
                                titleIconA.curl = ad.action[aIndex].message.traceUrl;
                            }
                            break;
                        default:
                            titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/arrow_icon.png';
                            titleIcon.title = '';
                            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink) {
                                titleIconA.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
                            }; break;
                    }
                }
            } catch (e) {}

            // 填充广告数据
            logoImg.src = ad.imgFileSrc[0];
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink) {
                a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            }
            item.childNodes.push(a);
            items.push(item);
        }

        // 添加关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var mobileSkin = [{}, {rss0: '#ebebeb', rss1: '#ffffff', rss2: '#780000', rss3: '#999999'},
        {rss0: '#e70012', rss1: '#f5f5f5', rss2: '#1e1e1e', rss3: '#7d7d7d'},
        {rss0: '#ebebeb', rss1: '#ffffff', rss2: '#003399', rss3: '#999999'},
        {rss0: '#e70012', rss1: '#333333', rss2: '#ffffff', rss3: '#b4b4b4'},
        {rss0: '#ebebeb', rss1: '#ffe320', rss2: '#007c9b', rss3: '#7fb59b'},
        {rss0: '#ffdc0a', rss1: '#72a429', rss2: '#ffffff', rss3: '#b8d294'},
        {rss0: '#ffdc0a', rss1: '#0956ae', rss2: '#ffffff', rss3: '#84abd6'},
        {rss0: '#b80506', rss1: '#f5f5f5', rss2: '#1e1e1e', rss3: '#7d7d7d'}];

        var ext = {};
        if (requestInfo.styleConfig && requestInfo.styleConfig.ext) {
            ext = (requestInfo.styleConfig.ext).replace(/(^\s*)|(\s*$)/g, '')
            ? JSON.parse(requestInfo.styleConfig.ext) : {};
        }
        var CurMobileSkin = (ext.txt && ext.txt.txtSkin) ? mobileSkin[ext.txt.txtSkin] : {};
        style['.container'] = containerStyle;
        if (CurMobileSkin) {
            style['#container'] = {
                'border-color': CurMobileSkin.rss0,
                'background-color': CurMobileSkin.rss1
            };
        }
        style['.item'] = {
            width: containerWidth,
            height: containerHeight,
            padding: 0
        };
        for (var i = 0; i < ads.length; i++) {
            style['#item' + i] = {
                width: containerWidth,
                height: containerHeight,
                padding: 0,
                position: 'absolute',
                top: containerHeight * i + 'px',
                left: '0'
            };
        }

        // 移动广告全区域可点击
        style['.item .itemA'] = {
            width: containerWidth,
            height: containerHeight,
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };
        style['.item .logo'] = {
            width: containerWidth,
            height: containerHeight
        };
        style['.item .logo img'] = {
            width: containerWidth,
            height: containerHeight
        };

        if (hasAttach) {
            for (var i = 0; i < adsLen; i++) {
                if (noAction.indexOf(',' + i + ',') < 0) {
                    style['.titleIconA' + i] = {
                        'position': 'absolute',
                        'top': '0px',
                        'right': '0px',
                        'height': containerHeight - 2,
                        'width': '25px',
                        'background-color': 'blue',
                        'text-decoration': 'none',
                        'z-index': '999'
                    };
                }
                else {
                    style['.titleIconA' + i] = {
                        display: 'none'
                    };
                }
            }
        }
        style['.titleIcon'] = {
            'height': '25px',
            'width': '25px',
            'margin-top': (containerHeight - 25) / 2 + 'px',
            'text-decoration': 'none',
            'border': 'none'
        };
        // 关闭按钮样式
        var closeBtnRadius = 20;
        var closeBtnDivRadius = 50;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center',
            'color': '#fff',
            'top': '0px',
            'right': '0px',
            'display': 'none'
        };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '15px',
            'right': '15px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});