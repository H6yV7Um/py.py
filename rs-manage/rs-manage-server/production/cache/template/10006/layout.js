/**
 * @file 移动文字排行榜模板(template_inlay_all_mobile_title_direct_v2)
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'text_10006',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        logoType: 'bd-logo4',
        containerBorderTop: 1,
        containerBorderRight: 1,
        containerBorderBottom: 1,
        containerBorderLeft: 1,
        containerPaddingTop: 1,
        containerPaddingRight: 1,
        containerPaddingBottom: 1,
        containerPaddingLeft: 1
    },

    isArray: function (object) {
        return object && typeof object === 'object'
            && Array == object.constructor;
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
        var adsLen = ads.length;
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerOuterW = containerStyle['outer-width'];
        var containerOuterH = containerStyle['outer-height'];
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        // var defaultSkin = fullConfig.txt.txtSkin;
        var fowardType = 0;
        var hasAttach = false;
        // var hasAttach = false;// PhoneAction MessageAction ForwardAction NoneAction 商桥？;

        var zoom = containerWidth / 640;
        var ratio = containerOuterW / containerOuterH;
        // items
        var items = container.childNodes;

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
            try {
                fowardType = this.isArray(ad.action) ? (ad.action[aIndex].actionType
                    ? ad.action[aIndex].actionType : 0) : (ad.action.actionType ? ad.actionType : 0);
            }
            catch (e) {
            }
            var item = engine.getLayout(fullConfig);
            item.tagName = 'a';
            item.class = 'item';
            item.id = 'item' + i;
            item['data-adtype'] = act;
            if (act === 4) {
                item.target = '_blank';
            }

            // 广告title
            var titleNum = engine.getLayout(fullConfig);
            titleNum.tagName = 'i';
            titleNum.id = 'titleNum' + i;
            // title内容
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            item.childNodes.push(titleNum);
            item.childNodes.push(titleText);
            if (i === 0) {
                titleNum.class = 'titleNum titleNum_top';
                titleText.class = 'text titleNum_top';
            }
            else {
                titleNum.class = 'titleNum';
                titleText.class = 'text';
            }
            if (hasAttach) {
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
                        if (ad.action[aIndex] && ad.action[aIndex].phone && ad.action[aIndex].phone.traceUrl) {
                            titleIconA.curl = ad.action[aIndex].phone.traceUrl;

                        }
                        if (ad.action[aIndex] && ad.action[aIndex].phone && ad.action[aIndex].phone.phoneNumber) {
                            titleIconA.href = 'tel:' + (ad.action[aIndex].phone.phoneNumber
                        ? ad.action[aIndex].phone.phoneNumber : '');
                        }
                        break;
                    case 13:
                        titleIconA.type = 'qiao';
                        titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/qiao_icon.png';
                        titleIcon.title = '';
                        if (ad.action[aIndex] && ad.action[aIndex].bizBridge && ad.action[aIndex].bizBridge.traceUrl) {
                            titleIconA.href = ad.action[aIndex].bizBridge.traceUrl;
                        }
                        break;
                    case 1:
                        titleIconA.type = 'message';
                        titleIcon.src = '{{dupDomain}}/cpro/exp/mob_exp/img/mess_logo.png';
                        if (ad.action[aIndex] && ad.action[aIndex].message && ad.action[aIndex].message.messageContent) {
                            var msgCon = ad.action[aIndex].message.messageContent;
                            titleIconA.msgCon  = msgCon;
                        }
                        if (ad.action[aIndex] && ad.action[aIndex].message && ad.action[aIndex].message.messageNumber) {
                            var msgNum = ad.action[aIndex].message.messageNumber;
                            titleIconA.msgNum = msgNum;
                        }
                        if (ad.action[aIndex] && ad.action[aIndex].message && ad.action[aIndex].message.traceUrl) {
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
            // 填充广告数据
            titleText.innerHTML = ad.textTitle[0];
            titleNum.innerHTML = i + 1;
            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink) {
                item.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            }
            items.push(item);
        }
        // 添加样式部分
        var style = {};
        var col = 1;
        var row = adsLen;

        var defaultConfig = {titFF: 'Microsoft YaHei', titTA: 'left', conBW: 0, titFS: 32, rss2: '#374565'};

        // item居中
        var itemPadding = 0;
        var itemW = containerWidth - itemPadding;
        var itemH = Math.floor(containerHeight / adsLen);
        var titleStyle = engine.getTitleStyle(fullConfig);
        var titleColor = titleStyle['color'] !== '#0000ff' ? titleStyle['color'] : defaultConfig.rss2;
        var titleFS = (titleStyle['font-size'] !== 14 ? titleStyle['font-size'] : defaultConfig.titFS) * zoom;
        var titleFF = titleStyle['font-family'] !== 'arial,simsun,sans-serif'
        ? titleStyle['font-family'] : defaultConfig.titFF;
        style['.container'] = containerStyle;
        style['.item'] = {
            'width': itemW,
            'height': itemH,
            'padding-left': itemPadding + 'px',
            'line-height': itemH,
            'display': 'block',
            'font-family': titleFF,
            'text-align': 'left',
            'font-size': titleFS,
            'color': titleColor,
            'overflow': 'hidden',
            'text-decoration': 'none',
            'position': 'relative',
            '-webkit-text-size-adjust': 'none',
            '-moz-transition': 'background-color .25s ease-out, color .25s ease-out',
            '-o-transition': 'background-color .25s ease-out, color .25s ease-out',
            '-webkit-transition': 'background-color .25s ease-out, color .25s ease-out',
            'transition': 'background-color .25s ease-out, color .25s ease-out'
        };
        style['.titleNum'] = {
            'font-family': 'Microsoft YaHei',
            'font-style': 'normal',
            'text-align': 'center',
            'cursor': 'pointer',
            'background-color': 'transparent',
            'float': 'left',
            'overflow': 'hidden',
            'vertical-align': 'middle',
            'display': 'block',
            // 'text-decoration': 'underline',
            'width': titleFS + 4
        };
        style['.titleNum_top'] = {
            color: '#ec0f1e'
        };
        style['.text'] = {
            'padding-left': '3px',
            'overflow': 'hidden',
            'font-weight': 800,
            'height': itemH,
            'width': itemW - titleFS - 10 + 'px',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'display': 'block'
        };
        if (hasAttach) {
            style['.text'] = {
                'padding-left': '3px',
                'overflow': 'hidden',
                'font-weight': 800,
                'height': itemH,
                'width': itemW - titleFS - 12 - itemH + 'px',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
                'display': 'block'
            };
            for (var i = 0; i < adsLen; i++) {
                style['.titleIconA' + i] = {
                    'position': 'absolute',
                    'top': (itemH + 1) * i + 'px',
                    'right': '2px',
                    'height': itemH - 2,
                    'width': itemH - 2,
                    'background-color': 'blue',
                    'text-decoration': 'none'
                };
            }
        }
        style['.titleIcon'] = {
            'height': itemH - 2,
            'width': itemH - 2,
            'text-decoration': 'none',
            'border': 'none'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});