/**
 * @file tuwen_sdk_banner_base_image template layout
 * @author yuxinxiao
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: '50033',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // �Ƿ񻺴�Layout�Ľ��
    isNeedRenderData: false,  // �Ƿ���Ҫ����������Ⱦ����
    defaultValue: {
        logoType: 'feed-logo',
        adIconType: 'feed-adIcon',
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        isShowCloseFeedBack: 0
    },
    //  ��ʵSdk������Ϣ
    adsExtention: function (requestInfo) {
        var adsExtention = [];
        if (requestInfo.adElements && requestInfo.adElements.length) {
            for (var i = 0, count = requestInfo.adElements.length; i < count; i++) {
                var ad = requestInfo.adElements[i];
                var extention = ad.sdkInteractionInfo && JSON.parse(ad.sdkInteractionInfo);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // ����, ���ɲ��ֶ���
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        // �ƶ�ֻ��һ�����
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 1;
        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';
        // ��������򡪡�item�ɵ�
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // ��������������
        a['data-adindex'] = '0';
        // ����ƹ�����
        a['data-adtype'] = act;

        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.class = 'title';
        title.id = 'title';

        var divRes = engine.getLayout(fullConfig);
        divRes.tagName = 'div';
        divRes.class = 'divRes';
        divRes.id = 'divRes';

        item.childNodes.push(divRes);
        item.childNodes.push(title);
        item.childNodes.push(a);
        items.push(item);

        // ��ʵSdk��������
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);
        // ����������
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '';
        /**var ext = {};
        if (ad.extention) {
            ext = JSON.parse(ad.extention);
        }
        ext.appinfo = ext.appinfo || {};**/
        var apptitle = ad && ad.appIntroduction || '';
        if (act === 2) {
            title.innerHTML = apptitle || '';
        } else {
            title.innerHTML = '\u66f4\u591a\u7cbe\u5f69\u5185\u5bb9\uff0c\u5c3d\u5728\u4e00\u6307\u4e4b\u95f4';
        };

        // �����ʽ����
        var style = {};

        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        var pt = containerHeight / 375;
        var itemPT = 21 * pt;
        var itemPL = 15 * pt;
        var itemPR = 30 * pt;
        var itemPB = 12 + 20 * pt + 6 * pt;// ���logo�ĳߴ� + ���logo�Ķ�λ�߶� + �������
        var titleFS = 30 * pt;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;
        var length = (ad.textTitle[0] && ad.textTitle[0].length) ? ad.textTitle[0].length : 1;
        titleH = (titleFS * length > itemWidth - itemPL * 2) ? titleH * 2 : titleH;
        var divResH = itemHeight;
        var per = 100 - (titleH + itemPB + itemPT / 2) / itemHeight * 100;
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative'
        };
        style['.item'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'padding-bottom': itemPB + 'px',
            'box-sizing': 'border-box',
            'position': 'relative'
        };
        style['#item0'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'background-image': 'linear-gradient(rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0) ' + (per - 5) + '%, rgba(0, 0, 0, 0.2) ' + per + '%, rgba(0, 0, 0, 0.8) 100%)',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };
        style['.title'] = {
            'width': itemWidth - itemPL - itemPR + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'font-size': titleFS + 'px',
            'color': '#ffffff',
            'position': 'absolute',
            'left': itemPL + 'px',
            'bottom': itemPB + 'px',
            'overflow': 'hidden',
            'z-index': 11111
        };
        style['.divRes'] = {
            'width': itemWidth + 'px',
            'height': divResH + 'px',
            'position': 'absolute',
            'overflow': 'hidden',
            'background': 'url(' + ad.imgFileSrc[0] + ')',
            'background-size': '100% 100%'
        };

        style['.container .feed-logo'] = {
            'left': itemPL + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        // ���عرշ�������
        style['.feedbackCon'] = {
            'display': 'none'
        };
        style['#fbIcon'] = {
            'display': 'none'
        };
        style['.fbTipDiv'] = {
            'display': 'none'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
