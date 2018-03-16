/**
 * @file Style业务逻辑对象
 * @author zhangziqiu@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'Style',
    namespace: 'TemplateServer.Business',
    deps: {
        StyleCache: 'TemplateServer.Data.StyleCache',
        TemplateCache: 'TemplateServer.Data.TemplateCache'
    },

    /**
     * 静态构造函数
     */
    $Style: function () {
    },

    /**
     * 获取所有Style对象
     *
     * @return {Array} style对象数组
     */
    getAllStyle: function () {
        var result;
        result = this.StyleCache.getByKey();
        return result;
    },

    /**
     * 根据最后一次更新时间, 获取Style对象集合
     *
     * @param {string|number} timeStamp 更新时间戳,返回此时间之后有更新的Style对象
     * @return {Array} Style对象集合
     */
    getStyleByLastUpdateTime: function (timeStamp) {
        var result = [];
        timeStamp = parseInt(timeStamp, 10);
        var allStyles = this.getAllStyle();
        for (var i = 0, count = allStyles.length; i < count; i++) {
            var styleInfo = allStyles[i];
            if (styleInfo) {
                var updateTime = styleInfo.updateTime;
                if (updateTime) {
                    // 只返回在timeStamp后有更新的style对象
                    if (updateTime > timeStamp) {
                        result.push(styleInfo);
                    }
                }
                else {
                    // 不包括updateTime的style对象每次都返回
                    result.push(styleInfo);
                }
            }
        }
        return result;
    },

    /**
     * 获取Style最后一次的更新时间
     *
     * @return {number} style最后一次更新的时间戳
     */
    getStyleLastUpdateTime: function () {
        var result;
        result = this.StyleCache.getLastUpdateTime();
        return result;
    },

    /**
     * 根据size获取适合本次流量的template
     *
     * @param {number} styleid 样式id
     * @param {Object} size 尺寸
     * @return {Object} result template对象
     */
    getTemplateById: function (styleid, size) {
        var result = {};
        var style = this.StyleCache.getByKey(styleid);
        if (style && size) {
            var templateArray = style.template;
            var width = size.width;
            var height = size.height;
            var sizeType = size.sizeType;
            for (var i = 0, len = templateArray.length; i < len; i++) {
                var currentTemplate = this.TemplateCache.getByKey(templateArray[i]);
                var templateSizeArray = currentTemplate.size;
                for (var j = 0, sizeLen = templateSizeArray.length; j < sizeLen; j++) {
                    var currentSize = templateSizeArray[j];
                    var templateSupportWidth = currentSize.width;
                    var templateSupportWidthEnd = currentSize.widthEnd;
                    var templateSupportHeight = currentSize.height;
                    var templateSupportHeightEnd = currentSize.heightEnd;
                    try {
                        // 正常情况下，检索端请求creative的时候，即使是移动模板，也不应该传递scale和scaleEnd, 因为计算creative的时候，需要用到width,height
                        var ratioSupport = currentSize.scale;
                        var ratioSupportEnd = currentSize.scaleEnd;
                        var ratio = parseFloat(width / height, 10) || size.scale;
                        if (width >= templateSupportWidth
                            && width <= templateSupportWidthEnd
                            && height >= templateSupportHeight
                            && height <= templateSupportHeightEnd
                            || (ratio >= ratioSupport && ratio <= ratioSupportEnd)) {
                            result = currentTemplate;
                            break;
                        }
                    }
                    catch (e) {}

                    if (result) {
                        break;
                    }

                }
            }
        }
        return result;
    },

    /**
     * 获取creative对象
     *
     * @param {number} styleid 用于获取具体的template对象
     * @param {Object} size 根据尺寸计算creative对象
     * @return {Object} result creative对象
     */
    getCreative: function (styleid, size) {
        var result = [];
        try {
            var templateObj = this.getTemplateById(styleid, size);
            result = templateObj['creative.js'].searchCreative(size);

        } catch (ex) {
            oojs.log.error('styleid:' + styleid + ';size' + JSON.stringify(size));
            oojs.log.error('getCreative', ex);
        }
        return result;
    }

});
