/**
 * @file 主渲染流程
 * @author fanwenjuan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'render',
    namespace: 'rs.business',
    deps: {
        layoutEngineFactory: 'rs.business.layoutEngineFactory',
        layoutEngineCache: 'rs.business.layoutEngineCache',
        layoutEngineProcess: 'rs.business.layoutEngineProcess',
        configManager: 'rs.business.configManager',
        logo: 'rs.business.logo',
        htmlRenderEngine: 'rs.business.htmlRenderEngine',
        templateVars: 'rs.business.templateVariableManager',
        dataEngine: 'rs.business.dataEngine',
        templateFileManager: 'rs.business.templateFileManager',
        string: 'rs.common.utility.string',
        browser: 'rs.common.utility.browser',
        styleType: 'rs.common.model.styleType',
        smartIdea: 'rs.business.smartIdea',
        fileWatch: 'oojs.utility.fileWatch',
        expManager: 'rs.business.expManager',
        config: 'rs.common.config.global'
    },
    $render: function () {
        // 预加载文件
        this.preload();
        // 开启模板文件夹监控
        /*
        var templateFilePath = oojs.getPath() + "rs/template/";
        var fileWatchOption = {};
        fileWatchOption.callback = this.templateFileOnChange.proxy(this);
        this.fileWatch.watch(templateFilePath, fileWatchOption);
        */
        // 判断是否是debug模式
        this.debug = false;
        for (var i = 0, count = process.execArgv.length; i < count; i++) {
            var tempArgv = process.execArgv[i];
            /debug(=)?(\d+)/gi
            if (tempArgv && tempArgv.indexOf('--debug') > -1) {
                this.debug = true;
            }
        }
    },
    preload: function (fileArray) {
        // 预加载所有模板文件
        this.templateFileManager.loadAllFiles();
        // 预加载智能创意配置文件
        this.smartIdea.loadConfig();
        // load all template layout engines
        var styleTypes = this.styleType.getAll();
        for (var i = 0, count = styleTypes.length; i < count; i++) {
            try {
                oojs.reload('rs.template.' + styleTypes[i].toLowerCase() + '.layout');
            }
            catch (ex) {}
        }
    },

    templateFileOnChange: function (fileArray) {
        if (this.debug) {
            this.preload(fileArray);
        }
        else {
            var randomTime = Math.random() * 20000;
            setTimeout(this.preload.proxy(this, fileArray), randomTime);
        }
    },


    getTemplate: function (context, callback) {
        // render开始运行的时间
        var startTime = new Date().getTime();
        // 处理样式类型参数
        context.styleType = this.styleType.get(context.requestInfo.styleType);
        // 分流处理
        context = this.expManager.expManager(context);
        // 处理浏览器类型
        context.browser = this.browser.getBrowser(context.requestInfo.userAgent);

        // 进行参数设置
        context.config = this.configManager.getConfigFromContext(context);
        context.userConfig = this.configManager.getFullNameConfig(context.config);
        context.fullConfig = this.configManager.getVariables(context.userConfig);

        // 创建模版变量管理类
        var vars = oojs.create(this.templateVars);
        // 获取layoutEngine
        var layoutEngine = this.layoutEngineFactory.getLayoutEngine(context);


        // 使用模板自己的默认值替代全局默认值d:
        if (layoutEngine.defaultValue) {
            context.fullConfig = this.configManager.merge(layoutEngine.defaultValue,
                context.fullConfig,
                context.userConfig);
        }

         // 用于广告反屏蔽，该域名会替换模板中的静态资源域名
        var dupDomain = context.requestInfo.dupDomain || null;
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
        var dupDomainUrl = protocol + '://cpro.baidustatic.com';
        if (dupDomain) {
            dupDomainUrl = protocol + '://' + dupDomain;
            vars.set('dupDomain', dupDomainUrl);
        }
        else {
            vars.set('dupDomain', protocol + '://cpro.baidustatic.com');
        }
        vars.set('baseJsUrl', this.config.resource.baseJsUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('baseCssUrl', this.config.resource.baseCssUrl.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('feedbackMobile', this.config.resource.feedbackMobile.replace('https://cpro.baidustatic.com', dupDomainUrl));
        vars.set('feedbackPC', this.config.resource.feedbackPC.replace('https://cpro.baidustatic.com', dupDomainUrl));

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
        /****************添加广告标识的点击事件********end**********/
        // 处理布局
        var layoutResult = this.layoutEngineProcess.process(context, layoutEngine);
        var layoutHtml = layoutResult.layoutHtml;
        var styleString = layoutResult.styleString;
        try {
            vars.set('html', layoutHtml + appendScripts.join(''));
        }
        catch (e) {
            vars.set('html', layoutHtml);
        }
        vars.set('style', styleString);


        // CleanCSS太消耗性能, 不使用
        // var CleanCSS = require('clean-css');
        // styleString = new CleanCSS().minify(styleString);

        // 智能创意样式特有模板变量
        if ((context.styleType.toLowerCase() === 'smart_idea_base' || context.styleType.toLowerCase() === 'smart_idea_multiurl') && context.requestInfo.smartIdeaTemplateId) {

            var templateId = context.requestInfo.smartIdeaTemplateId;
            var smVars = this.smartIdea.getVars(templateId, context.requestInfo.width, context.requestInfo.height);
            vars.set('smGlobleCss', smVars.smGlobleCss);
            vars.set('smLayoutConfig', smVars.smLayoutConfig);
            vars.set('smLunboConfig', smVars.smLunboConfig);
            vars.set('smCssConfig', smVars.smCssConfig);
            vars.set('ads', JSON.stringify(context.requestInfo.adElements));
            // 模版变量:{antiArray}
            var antiArray = [];
            if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
                for (var i = 0, count = context.requestInfo.adElements[0].smartIdeaProduct.length; i < count; i++) {
                    antiArray.push(context.requestInfo.adElements[0].smartIdeaProduct[i].midTime);
                }
            }
        }

        // 模版变量:{config}
        vars.set('config', JSON.stringify(context.userConfig));

        // 模版变量:{antiArray}
        var antiArray = antiArray || [];
        if (!antiArray.length) {
            if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
                for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                    antiArray.push(context.requestInfo.adElements[i].midTime);
                }
            }
        }

        vars.set('antiArray', JSON.stringify(antiArray));

        // 获取模板变量 common.js文件
        vars.set('common.js', this.templateFileManager.get('common.js'));

        // 获取模板变量 page.js文件
        vars.set('page.js', this.templateFileManager.get(context.styleType + '.js'));

        // 获取模板page.html文件
        var pageHtml = this.templateFileManager.get(context.styleType);

        // 模板渲染
        var finalHtml = '';
        if (pageHtml) {
            finalHtml = this.string.template(pageHtml, vars.getData());
            // 需要在finalHtml生成后，才能计算出html文件的大小，然后再赋值timeStatistic这个模板变量，故需要再替换一次finalHtml的模板变量&&有时候dupDomain也需要二次替换赋值的，比如模板变量的value中仍然有dupDomain
            var fileSize = finalHtml.length;
            var renderTime = new Date().getTime() - startTime;
            // 默认取第一个实验号，因为如果有全局实验，那么实验数组会是[170003,170001], 170003才是该模板的实验号
            var expId = 170001;
            vars.setTimeStatistic(context.styleType, renderTime, fileSize, dupDomainUrl, expId);
            finalHtml = this.string.template(finalHtml, vars.getData());
        }

        callback(null, finalHtml);
        return true;
    }

});
