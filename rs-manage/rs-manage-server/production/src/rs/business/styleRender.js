/**
 * @file 样式渲染模块
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'styleRender',
    namespace: 'rs.business',
    deps: {
        configManager: 'rs.business.configManager',
        templateVars: 'rs.business.templateVariableManager',
        templateFileManager: 'rs.business.templateFileManager',
        templateCache: 'rs.business.templateCache',
        string: 'rs.common.utility.string',
        browser: 'rs.common.utility.browser',
        config: 'rs.common.config.global'
    },

    /**
     * 预处理广告数据, 保证每个element都有curl和mid
     *
     * @param {Object} ads 广告对象
     * @return {Object} 处理后的广告对象
     */
    processClickUrl: function (ads) {
        if (ads.length) {
            var parentClickUrl = '';
            var parentMid = '';
            for (var adsKey in ads) {
                // container的名字可以使container+任意数字, 所以判断以container开头的object类型的属性.
                if (ads.hasOwnProperty(adsKey)
                    && ads[adsKey]
                    && typeof ads[adsKey] === 'object'
                    && adsKey
                    && adsKey.indexOf('container') === 0
                ) {
                    var tempContainer = ads[adsKey];
                    parentClickUrl = tempContainer.curl ? tempContainer.curl : parentClickUrl;
                    parentMid = tempContainer.mid ? tempContainer.mid : parentMid;
                    if (tempContainer.length) {
                        for (var j = 0, jcount = tempContainer.length; j < jcount; j++) {
                            var tempBlock = tempContainer['block' + j];
                            parentClickUrl = tempBlock.curl ? tempBlock.curl : parentClickUrl;
                            parentMid = tempBlock.mid ? tempBlock.mid : parentMid;
                            for (var key in tempBlock) {
                                if (key !== 'curl'
                                    && key !== 'mid'
                                    && tempBlock.hasOwnProperty(key)
                                    && typeof tempBlock[key] === 'object'
                                    && !tempBlock[key].curl) {
                                    tempBlock[key].curl = parentClickUrl;
                                    tempBlock[key].mid = parentMid;
                                }
                            }
                        }
                    }
                }

            }
        }
        return ads;
    },

    getTemplate: function (context, callback) {
        // 处理样式类型参数
        try {
            context.styleType = context.requestInfo.styleType;
            context.width = context.requestInfo.width;
            context.height = context.requestInfo.height;
            context.sizeType = context.requestInfo.sizeType || 1;
            context.sizeType = context.sizeType + 1;

            // 处理浏览器类型
            context.browser = this.browser.getBrowser(context.requestInfo.userAgent);

            // 创建模版变量管理类
            var vars = oojs.create(this.templateVars);

            // 智能创意渲染逻辑
            if (context.requestInfo.smartIdeaAdData) {
                var smAds = JSON.parse(context.requestInfo.smartIdeaAdData);
                smAds = this.processClickUrl(smAds);
                vars.set('ads', smAds);
            }

            // 获取模板变量 common.js文件
            vars.set('common.js', this.templateFileManager.get('common.js'));

            // 用于广告反屏蔽，该域名会替换模板中的静态资源域名
            var dupDomain = context.requestInfo.dupDomain || null;
            var logo1Url = this.config.resource.logo1;
            var logo2Url = this.config.resource.logo2;
            var adIconUrl = this.config.resource.adIcon;
            var baseJsUrl = this.config.resource.baseJsUrl;
            var protocolType = context.requestInfo.protocolType;
            var protocol = 'https';
            if (!protocolType) {
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
            var dupDomainUrl = protocol + '://' + dupDomain;
            if (dupDomain) {
                vars.set('dupDomain', dupDomainUrl);
            }
            else {
                dupDomainUrl = protocol + '://' + 'cpro.baidustatic.com';
                vars.set('dupDomain', protocol +  '://' + 'cpro.baidustatic.com');
            }

            logo1Url = logo1Url.replace('https://cpro.baidustatic.com', dupDomainUrl);
            logo2Url = logo2Url.replace('https://cpro.baidustatic.com', dupDomainUrl);
            adIconUrl = adIconUrl.replace('https://cpro.baidustatic.com', dupDomainUrl);
            baseJsUrl = baseJsUrl.replace('https://cpro.baidustatic.com', dupDomainUrl);
            // 在样式类型中选择合适的模板
            var templateItem = this.templateCache.getFromCache(context.styleType,
                context.sizeType,
                context.width,
                context.height);
            // 模板渲染
            var finalHtml = '';
            if (templateItem && templateItem.templateFunction) {
                // 已预编译模板有限使用预编译函数渲染
                var dataObj = vars.getData();
                // 加入反作弊、otpl等内容
                var appendScripts = [
                    '<script type="text/javascript" src="',
                    baseJsUrl,
                    '"></',
                    'script>',
                    '<script>',
                    dataObj['common.js'],
                    '</',
                    'script>'
                ];
                // 只有通过logoIsShow字段强调了不出logo, 才不出Logo
                // 否则默认都出logo
                // 我知道这么写代码很傻，但是可读性好(●ˇ∀ˇ●)
                var styleConfig = context.requestInfo.styleConfig;
                if (styleConfig
                    && JSON.parse(styleConfig).logoIsShow !== undefined
                    && parseInt(JSON.parse(styleConfig).logoIsShow, 10) === 0) {
                    // 不出logo
                } else {
                    // 处理logo
                    if (context.requestInfo.account === 'nova') {
                        appendScripts.push(
                            '<script type="text/javascript" src="',
                            logo1Url,
                            '"></',
                            'script>'
                        );
                    }
                    else {
                        appendScripts.push(
                            '<script type="text/javascript" src="',
                            logo2Url,
                            '"></',
                            'script>'
                        );
                    }
                }
                if (styleConfig
                    && JSON.parse(styleConfig).adIconIsShow !== undefined
                    && parseInt(JSON.parse(styleConfig).adIconIsShow, 10) === 0) {
                } else {
                    appendScripts.push(
                        '<script type="text/javascript" src="',
                        adIconUrl,
                        '"></',
                        'script>'
                    );
                }
                if (context.requestInfo.account === '0dsp') {
                    appendScripts.push('<script>var winUrlArr = %%winnoticeArr%%;</script><script src="' + (dupDomain ? dupDomainUrl : protocol + '://cpro.baidustatic.com') + '/cpro/ui/noexpire/js/rs/template/winnotice.min.js"></script>');
                }
                /****************添加广告标识的点击事件******************/
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
                /****************添加广告标识的点击事件********end**********/
                finalHtml = templateItem.templateFunction(dataObj.ads, appendScripts.join(''));
                // 模板变量被替换后的数据中如果还有未替换的模板变量，需要进行二次替换
                if (finalHtml.indexOf('{{dupDomain}}') > -1) {
                    finalHtml = this.string.template(finalHtml, vars.getData());
                }
            }
            else {
                callback(new Error('content_missing'), '');
            }
            callback(null, finalHtml);
        }
        catch (ex) {
            callback(ex, '');
        }
        return true;
    },

    insertBody: function (htmlText, content) {
        return htmlText.replace(/<body[^<>]*>/i, '$&' + content);
    },
    appendBody: function (htmlText, content) {
        return htmlText.replace(/<\/body>/i, content + '$&');
    }

});
