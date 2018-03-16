/**
 * @file 模版变量管理模块
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'templateVariableManager',
    namespace: 'rs.business',
    deps: {
        config: 'rs.common.config.global'

    },
    templateVariableManager: function () {
        this.vars.baseCssUrl = this.config.resource.baseCssUrl;
        this.vars.baseJsUrl = this.config.resource.baseJsUrl;
        this.vars.feedbackPC = this.config.resource.feedbackPC;
        this.vars.feedbackMobile = this.config.resource.feedbackMobile;
    },
    vars: {
        'baseCssUrl': '',
        'baseJsUrl': '',
        'style': '',
        'html': '',
        'preload': '',
        'config': '{}',
        'antiArray': '[]',
        'ads': '',
        'page.js': '',
        'dupDomain': '',
        'timeStatistic': '{{timeStatistic}}',
        'feedbackPC': '',
        'feedbackMobile': ''

    },
    set: function (key, value) {
        this.vars[key] = value;
        return true;
    },
    setTimeStatistic: function (styleId, renderTime, fileSize, dupDomainUrl, expId) {
        var timeStatisticObj = JSON.stringify({
            renderTime: renderTime,
            styleId: styleId,
            expId: expId,
            size: fileSize,
            startTime: 0
        });
        this.set('timeStatistic', '<script>var timeStatisticObj=' + timeStatisticObj + ';timeStatisticObj.startTime=new Date().getTime();</script><script src=\'' + dupDomainUrl + '/cpro/expire/time4.min.js\'></script>');

    },
    get: function (key) {
        return this.vars.key;
    },
    getData: function () {
        return this.vars;
    }

});
