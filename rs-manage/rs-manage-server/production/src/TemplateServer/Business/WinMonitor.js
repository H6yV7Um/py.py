/**
 * @file TemplateServer.Business.WinMonitor
 * @author fanwenjuan@baidu.com
 */
/* eslint-disable max-len */
/* globals oojs */
oojs.define({
    name: 'WinMonitor',
    namespace: 'TemplateServer.Business',
    deps: {
        CreativeTypeMapping: 'TemplateServer.Business.CreativeTypeMapping'
    },
    addMonitor: function (requestInfo) {
        var ads = JSON.parse(requestInfo.ads);
        var monitorUrl;
        var monitorBlock = {
            style: {display: 'none'},
            childNodes: [],
            tagName: 'div'
        };

        if (ads && ads.mainCreatives && ads.mainCreatives.length > 0) {
            for (var i = 0, adsLength = ads.mainCreatives.length; i < adsLength; i++) {
                var creativeType = ads.mainCreatives[i].creativeTypeMessageName || this.CreativeTypeMapping.getCreativeTypeMessageName(ads.mainCreatives[i].creativeType);
                if (creativeType) {
                    if (ads.mainCreatives[i][creativeType].action && ads.mainCreatives[i][creativeType].action.forward) {
                        var monitorLinkArray = ads.mainCreatives[i][creativeType].action.forward.monitorLinks;
                    } else {
                        var monitorLinkArray = [];
                    }
                    for (var j = 0, monLength = monitorLinkArray.length; j < monLength; j++) {
                        monitorUrl = ads.mainCreatives[i][creativeType].action.forward.monitorLinks[j];
                        monitorBlock.childNodes.push({
                            src: monitorUrl,
                            style: {width: '1px', height: '1px'},
                            width: '1px',
                            height: '1px',
                            childNodes: [],
                            tagName: 'img'
                        });
                    }
                }

            }
        }
        return monitorBlock;
    }
});