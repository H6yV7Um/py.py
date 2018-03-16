/**
 * @file TemplateServer.defaultValueManager
 * @author fanwenjuan@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'Logo',
    namespace: 'TemplateServer.Business',
    deps: {
        StyleCache: 'TemplateServer.Data.StyleCache'
    },
    getLogo: function (requestInfo) {
        requestInfo = requestInfo || {};
        var logoType = 'bd-logo';

        // 公益暂时不处理
        var isGongyi = false;
        var url = isGongyi ? '//gongyi.baidu.com/' : '//wangmeng.baidu.com/';
        var title = isGongyi ? '\u767e\u5ea6\u516c\u76ca' : '\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f';

        var style = this.StyleCache.getByKey(requestInfo.styleId);
        if (requestInfo) {
            var deviceTypeAdE = (requestInfo.device && requestInfo.device.deviceType)
            ? parseInt(requestInfo.device.deviceType, 10) : 'undefined'; // adElements新数据接口中的deviceType
            // ads旧数据接口中的deviceType
            var deviceTypeAds = requestInfo.ads && JSON.parse(requestInfo.ads).mainCreatives
            && JSON.parse(requestInfo.ads).mainCreatives[0].deviceType;
            var flowTypeStr = style && style.flowType.join(',');
            if (requestInfo.styleConfig.fullConfig.logoType === 'feed-logo') {
                logoType = 'feed-logo';
            } else if (((flowTypeStr.indexOf('2') > -1
            && (deviceTypeAdE === 2 || deviceTypeAdE === 3))
            || (flowTypeStr.indexOf('2') > -1
            && deviceTypeAds === 2))
            || (flowTypeStr.indexOf('3') > -1
            && (deviceTypeAdE === 2 || deviceTypeAdE === 3))
            && requestInfo.client.dspId !== 8) {
                logoType = 'bd-logo4';
            }
        }
        var logo = {
            'tagName': 'a',
            'class': logoType,
            'href': url,
            'title': title,
            'target': '_blank',
            'innerHTML': '&nbsp;',
            'id': 'bd-logo'
        };

        return logo;
    }
});