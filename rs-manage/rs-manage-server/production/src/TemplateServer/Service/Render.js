/**
 * @file 渲染服务
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Render',
    namespace: 'TemplateServer.Service',
    deps: {
        TemplateRender: 'TemplateServer.Business.TemplateRender'
    },

    // 需要发送的日志字段
    log: {
        requestInfo: {
            client: {
                requestId: 1,
                account: 1
            },
            // styleId: 1,
            size: {
                width: 1,
                height: 1
            }
        }
    },

    /**
     * 静态构造函数
     */
    $Render: function () {

    },

    /**
     * 模板渲染
     *
     * @param {Object} requestInfo 请求对象
     * @return {oojs.promise} 返回promise对象
     */
    renderByStyleId: function (requestInfo) {
        var finalHtml = '';
        var client = {};
        var isSendWin = false;
        try {
            client = requestInfo.client;
            var renderResult = this.TemplateRender.render(requestInfo);
            finalHtml = renderResult.finalHtml;
            isSendWin = renderResult.isSendWin;
        }catch (ex) {
            oojs.log.error('[Render]', ex);
        }

        var result = {
            client: client,
            status: {
                statusCode: 1,
                detail: 'finished'
            },
            /* eslint-disable max-len */
            result: finalHtml,
            /* eslint-enable max-len */
            isSendWin: isSendWin
        };

        return result;
    }
});
