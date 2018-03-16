/**
 * @file 渲染服务层
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'renderService',
    namespace: 'rs.api.service',
    deps: {
        render: 'rs.business.render',
        styleRender: 'rs.business.styleRender'

    },

    // 需要发送的日志字段，methodId 为 0 时 log 字段
    log: {
        requestInfo: {
            account: 1,
            searchId: 1,
            width: 1,
            height: 1,
            // styleType: 1,
            smIdeaTemplateId: 1,
            smartIdeaTemplateId: 1
        }
    },

    // methodId 为 1 时 log 字段
    styleLog: {
        requestInfo: {
            account: 1,
            searchId: 1,
            width: 1,
            // styleType: 1,
            height: 1

        }
    },

    /**
     * 静态构造函数
     *
     */
    $renderService: function () {
    },

    /**
     * 获取模板字符串
     *
     * @param {Object} option pb类型TemplateRequestInfo
     * @param {Function} callback 回调函数
     * @return {string} 模板字符串
     */
    getTemplate: function (option, callback) {
        this.render.getTemplate(option, callback);
        return true;
    },

    /**
     * 获取样式结果
     *
     * @param {Object} option 渲染上下文对象
     * @param {Function} callback 回调函数
     * @return {boolean} 是否操作成功
     */
    getStyle: function (option, callback) {
        this.styleRender.getTemplate(option, this.searchCallback.proxy(this, option, callback));
        return true;
    },

    /**
     * 样式结果封装处理逻辑
     *
     * @param {Object} err 操作异常
     * @param {string} result 样式结果字符串
     * @param {Object} context 渲染上下文对象
     * @param {Function} callback 回调函数
     */
    searchCallback: function (err, result, context, callback) {
        // check error
        var returnCode = 1;
        var errorString = '';
        if (err) {
            errorString = err.message;
            if (errorString === 'content_missing') {
                returnCode = 3;
            }
            else {
                returnCode = 2;
            }
            var templateId = '';
            if (context && context.requestInfo && context.requestInfo.styleType) {
                templateId = context.requestInfo.styleType;
            }
            oojs.log.error('[searchCallback]-templateId:' + templateId, err);
        }

        // 构造responseInfo
        var templateResponseInfo = {
            searchId: context.requestInfo && context.requestInfo.searchId,
            returnCode: returnCode,
            error: errorString,
            htmlSnippet: new Buffer(result)
        };
        context.responseInfo = templateResponseInfo;
        callback(null, templateResponseInfo);
    }

});
