/**
 * @file layoutEngineProcess
 * @author fanwenjuan@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'LayoutEngineProcess',
    namespace: 'TemplateServer.Business',
    deps: {
        logo: 'TemplateServer.Business.Logo',
        adIcon: 'TemplateServer.Business.adIcon',
        winMonitor: 'TemplateServer.Business.WinMonitor',
        htmlRenderEngine: 'TemplateServer.Business.HtmlRenderEngine',
        feedback: 'TemplateServer.Business.Feedback',
        logoIsShow: 'TemplateServer.Business.LogoIsShow'
    },

    process: function (requestInfo, layoutEngine) {
        // 处理布局
        var layoutHtml = '';
        var styleString = '';
        var layoutResult = layoutEngine.render(requestInfo);
        var layoutObj = layoutResult.layoutObj;
        var styleObj = layoutResult.style;

        // 添加logo
        var showBaiduLogo = true;
        var ext = {};

        if (!requestInfo.styleConfig.fullConfig['showBaiduLogo']) {
            showBaiduLogo = false;
        }
        if (showBaiduLogo) {
            var logo = this.logo.getLogo(requestInfo);
            layoutObj.childNodes.push(logo);
        }

        // 广告标识
        var adIconIsShow = 1;
        if (!requestInfo.styleConfig.fullConfig['adIconIsShow']) {
            // var ext = JSON.parse(requestInfo.styleConfig.ext);
            adIconIsShow = 0;
        }
        if (adIconIsShow) {
            var adIcon = this.adIcon.getAdIcon(requestInfo.styleConfig.fullConfig);
            layoutObj.childNodes.push(adIcon);
            /****************添加广告标识的点击区域******************/
            try {
                var result = this.logoIsShow.addLogoClkArea(layoutObj, styleObj);
                layoutObj = result.layoutObj;
                styleObj = result.styleObj;
            }
            catch (e) {
            }
        }
        /****************添加广告标识的点击区域********end**********/
        /*var winMonitor = this.winMonitor.addMonitor(requestInfo);
        if (winMonitor && winMonitor.childNodes && winMonitor.childNodes.length) {
            layoutObj.childNodes.push(winMonitor);
        }*/

        try {
            var isShowCloseFeedBack = requestInfo.styleConfig
            && requestInfo.styleConfig.fullConfig['isShowCloseFeedBack'];
            if (isShowCloseFeedBack !== false) {
                var result = this.feedback.addFeedback(layoutObj, styleObj, requestInfo);
                layoutObj = result.layoutObj;
                styleObj = result.styleObj;
            }
        }
        catch (e) {

        }

        layoutHtml = this.htmlRenderEngine.renderHtml(layoutObj);
        styleString = this.htmlRenderEngine.renderCss(styleObj);

        return {
            layoutHtml: layoutHtml,
            styleString: styleString
        };

    }

});