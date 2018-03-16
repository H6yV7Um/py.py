/**
 * @file HTML渲染引擎
 * @author fanwenjuan@baidu.com
 */
/* eslint-disable max-len */
/* global oojs */
oojs.define({
    name: 'TemplateRender',
    namespace: 'TemplateServer.Business',
    deps: {
        ConfigManager: 'TemplateServer.Business.ConfigManager',
        TemplateVars: 'TemplateServer.Business.TemplateVariableManager',
        LayoutEngineProcess: 'TemplateServer.Business.LayoutEngineProcess',
        fs: require('fs'),
        path: require('path'),
        String: 'TemplateServer.Common.Utility.String',
        Browser: 'TemplateServer.Common.Utility.Browser',
        Style: 'TemplateServer.Business.Style',
        CreativeTypeMapping: 'TemplateServer.Business.CreativeTypeMapping',
        Config: 'TemplateServer.Common.Config.Global',
        RequestConvert: 'TemplateServer.Business.RequestConvert',
        StyleCache: 'TemplateServer.Data.StyleCache'
    },
    $TemplateRender: function () {
    },

    render: function (requestInfo) {
        var result = {};
        // 处理浏览器类型
        if (requestInfo && requestInfo.device && requestInfo.device.userAgent) {
            requestInfo.device.browser = this.Browser.getBrowser(requestInfo.device.userAgent);
        }

        // 进行参数设置
        requestInfo.styleConfig = requestInfo.styleConfig || {};
        requestInfo.styleConfig.config = this.ConfigManager.getConfigFromRequestInfo(requestInfo);
        requestInfo.styleConfig.userConfig = this.ConfigManager.getFullNameConfig(requestInfo.styleConfig.config);
        requestInfo.styleConfig.fullConfig = this.ConfigManager.getVariables(requestInfo.styleConfig.userConfig);
        // 创建模版变量管理类
        var vars = oojs.create(this.TemplateVars);
        // 获取模板文件对象
        var templateObj = this.Style.getTemplateById(requestInfo.styleId, requestInfo.size);
        var layoutEngine = templateObj['layout.js'];
        // 使用模板自己的默认值替代全局默认值
        if (layoutEngine.defaultValue) {
            requestInfo.styleConfig.fullConfig = this.ConfigManager.merge(layoutEngine.defaultValue,
                requestInfo.styleConfig.fullConfig,
                requestInfo.styleConfig.userConfig);
        }

        // 处理布局,中间层转换数据
        /************************中间层转换数据************************/

        try {
            requestInfo.adElements = this.RequestConvert.middleConvert(requestInfo);
        }
        catch (e) {
            oojs.log.error(e);
        }

        /************************中间层转换数据*************end***********/




        var layoutResult = this.LayoutEngineProcess.process(requestInfo, layoutEngine);
        var layoutHtml = layoutResult.layoutHtml;
        var styleString = layoutResult.styleString;
         // 用于广告反屏蔽，该域名会替换模板中的静态资源域名
        var dupDomain = requestInfo.dupDomain || null;
        /* global context */
        var protocolType = requestInfo.protocolType;
        var protocol = 'https';// 协议头，默认'https'
        if (!protocolType) {
            // 如果没有传协议名称，但是传了dupDomain，那么默认'http'
            protocol = dupDomain ? 'http' : 'https';
        }
        else {
            if (protocolType === 1) {
                protocol = 'http';
            }
            else if (protocolType === 2) {
                protocol = 'https';
            }
        }
        var antiMobileJs = this.Config.resource.anticheatMobJsUrl;
        // dspId === 9 为凤巢DSP的请求，需要使用凤巢的反作弊
        if (requestInfo.client && requestInfo.client.dspId && parseInt(requestInfo.client.dspId, 10) === 9) {
            antiMobileJs = this.Config.resource.anticheatMobFCJsUrl;
        }
        var dupDomainUrl = protocol + '://' + 'cpro.baidustatic.com';
        if (dupDomain) {
            dupDomainUrl = protocol + '://' + dupDomain;
            vars.set('dupDomain', dupDomainUrl);
        }
        else {
            vars.set('dupDomain', protocol + '://cpro.baidustatic.com');
        }
        vars.set('baseJsUrl', this.Config.resource.baseJsUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('baseCssUrl', this.Config.resource.baseCssUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('anticheatJsUrl', this.Config.resource.anticheatJsUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('commonJsUrl', this.Config.resource.commonJsUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('feedbackMobile', this.Config.resource.feedbackMobile.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('feedbackPC', this.Config.resource.feedbackPC.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('anticheatMobJsUrl', antiMobileJs.replace('https://cpro.baidustatic.com',
            dupDomainUrl));
        if (requestInfo.styleConfig.fullConfig['adIconIsShow']) {
            /****************添加广告标识的点击事件******************/
            var appendScripts = [];
            try {
                appendScripts.push(
                    '<script type="text/javascript" src="',
                    dupDomainUrl + '/cpro/ui/noexpire/js/rs/template/logoIsShowEvents_1.min.js',
                    '"></',
                    'script>'
                );
            }
            catch (e) {
            }
        }
        try {
            vars.set('html', layoutHtml + appendScripts.join(''));
        }
        catch (e) {
            vars.set('html', layoutHtml);
        }
        vars.set('style', styleString);
        vars.set('config', JSON.stringify(requestInfo.styleConfig.userConfig));
        // 获取模板变量 page.js文件
        var pageJs = templateObj['page.js'];
        vars.set('page.js', pageJs);
        // 模版变量:{antiArray}
        var antiArray = antiArray || [];
        var ads = requestInfo.adElements;
        if (!antiArray.length) {
            if (ads && ads.length) {
                for (var i = 0, count = ads.length; i < count; i++) {
                    antiArray.push(ads[i].action[0].clickLink.antiCheating);
                }
            }
        }
        vars.set('antiArray', JSON.stringify(antiArray));

        try {
            // 在SDK流量且单广告的情况下，由SDK发送winnotice,  其它情况下由模板发送
            result.isSendWin = false;
            var style = this.StyleCache.getByKey(requestInfo.styleId);
            if (requestInfo.client.dspId === 8 && !(ads.length === 1 && requestInfo.appTrafficSource === 1)) {
                if (style.isSendWinNow === false) {
                    vars.set('winnotice', '<script>var winUrlArr = %%winnoticeArr%%;</script>');
                }
                else {
                    vars.set('winnotice', '<script>var winUrlArr = %%winnoticeArr%%;</script><script src="'
                    + (dupDomain ? protocol + '://' + dupDomain : protocol + '://cpro.baidustatic.com')
                    + '/cpro/ui/noexpire/js/rs/template/winnotice.min.js"></script>');
                    result.isSendWin = true;
                }
            }
        } catch (e) {}
        // 获取模板page.html文件
        var finalHtml = '';
        var pageHtml = templateObj['page.html'];
        if (pageHtml) {
            finalHtml = this.String.template(pageHtml, vars.getData());
            // 模板变量被替换后的数据中如果还有未替换的模板变量，需要进行二次替换
            if (finalHtml.indexOf('{{dupDomain}}') > -1) {
                finalHtml = this.String.template(finalHtml, vars.getData());
            }
        }
        result.finalHtml = finalHtml;
        return result;
    }

});