/**
 * @file Style服务
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Style',
    namespace: 'TemplateServer.Service',
    deps: {
        StyleBL: 'TemplateServer.Business.Style'
    },

    /**
     * 静态构造函数
     */
    $Style: function () {
    },

    // 需要发送的日志字段,methodId 为 6 时的日志字段
    log: {
        requestInfo: {
            client: {
                requestId: 1,
                account: 1
            }
        }
    },

    // methodId 为 7 时的日志字段
    creativeLog: {
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
     * 查询StyleInfo
     *
     * @param {Object} requestInfo 请求对象
     * @return {oojs.promise} 返回promise对象
     */
    searchStyle: function (requestInfo) {
        var status = {};
        var styles = [];
        var lastUpdateTime = 0;
        try {
            lastUpdateTime = this.StyleBL.getStyleLastUpdateTime();
            if (requestInfo.timeStamp) {
                // 传递了时间戳, 则返回此时间戳之后有更新的Style对象
                styles = this.StyleBL.getStyleByLastUpdateTime(requestInfo.timeStamp);
            }
            else {
                // 未传递时间戳, 返回所有Style对象
                styles = this.StyleBL.getAllStyle();
            }
            status.statusCode = 1;
            status.detail = 'finished';
        }
        catch (ex) {
            status.statusCode = 2;
            status.detail = ex.message;
            oojs.log.error('[searchStyle]', ex);
        }

        var result = {
            status: status,
            style: styles,
            timeStamp: lastUpdateTime
        };
        return result;
    },

    /**
     * 查询CreativeInfo
     *
     * @param {Object} requestInfo 请求对象
     * @return {Object} 返回CreativeInfo对象
     */
    searchCreative: function (requestInfo) {
        var status = {};
        var creativeRequired = [];
        try {
            creativeRequired = this.StyleBL.getCreative(requestInfo.styleId, requestInfo.size);
            status.statusCode = 1;
            status.detail = 'finished';
        }
        catch (ex) {
            status.statusCode = 2;
            status.detail = ex.message;
            oojs.log.error('[searchCreative]', ex);
        }
        var result = {
            status: status,
            creativeRequired: creativeRequired
        };
        return result;
    }
});
