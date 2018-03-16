/**
 * @file 模版变量管理模块
 * @author fanwenjuan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'templateVariableManager',
    namespace: 'TemplateServer.Business',
    deps: {
        config: 'TemplateServer.Common.Config.Global'

    },
    templateVariableManager: function () {
        this.vars.baseCssUrl = this.config.resource.baseCssUrl;
        this.vars.baseJsUrl = this.config.resource.baseJsUrl;
        this.vars.anticheatJsUrl = this.config.resource.anticheatJsUrl;
        this.vars.anticheatMobJsUrl = this.config.resource.anticheatMobJsUrl;
        this.vars.commonJsUrl = this.config.resource.commonJsUrl;
        this.vars.feedbackPC = this.config.resource.feedbackPC;
        this.vars.feedbackMobile = this.config.resource.feedbackMobile;
    },
    vars: {
        'baseCssUrl': '',
        'baseJsUrl': '',
        'style': '',
        'html': '',
        'config': '{}',
        'antiArray': '[]',
        'page.js': '',
        'anticheatMobJsUrl': '',
        'anticheatJsUrl': '',
        'dupDomain': '',
        'winnotice': '',
        'feedbackPC': '',
        'feedbackMobile': ''
    },
    set: function (key, value) {
        this.vars[key] = value;
        return true;
    },
    get: function (key) {
        return this.vars.key;
    },
    getData: function () {
        return this.vars;
    }

});
