/**
 * @file config
 * @author fanwenjuan@baidu.com
 */
/* global oojs */
oojs.define({

    /**
     * 参数管理类.
     * @class
     */
    name: 'ConfigManager',
    namespace: 'TemplateServer.Business',
    deps: {
        defaultValueManager: 'TemplateServer.Business.DefaultValueManager'

    },


    /**
     * 将pb中传递的 styleConfig 转换成Object
     * 转换成: {A:'A1', B:'B1'} 的形式
     * @param {Object} requestInfo 请求对象
     * @return {Object} 根据数组转换成的mapping object
     */
    getConfigFromRequestInfo: function (requestInfo) {
        var result = {};
        if (requestInfo && requestInfo.styleConfig && requestInfo.styleConfig.ext) {
            try {
                var ext = JSON.parse(requestInfo.styleConfig.ext);
                result = this.getConfigFromObj(ext, result);
            }
            catch (ex) {
                result = {};
            }
        }
        if (requestInfo && requestInfo.styleConfig && requestInfo.styleConfig.adslot_type) {
            try {
                result['adslot_type'] = requestInfo.styleConfig.adslot_type;
            }
            catch (ex) {

            }
        }
        result.templateWidth = requestInfo.size.width;
        result.templateHeight = requestInfo.size.height;
        return result;
    },

    /**
     * 判断传入的参数是否为对象，平铺对象
     * @method getConfigFromObj
     * @param {Object}  obj styleConfig 中的obj对象
     * @param {Object}  result  根据数组转换成的mapping object
     * @return {Object} 根据数组转换成的mapping object
     */
    getConfigFromObj: function (obj, result) {
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                if (typeof obj[item] === 'object') {
                    this.getConfigFromObj(obj[item], result);
                } else {
                    result[item] = obj[item];
                }
            }
        }
        return result;
    },

    /**
     * 获取参数的全名. 比如参数缩写: conPL对应的参数全名为 containerPaddingLeft, 表示容器左边距
     * @method getFullName
     * @param {string} shortName 参数的缩写
     * @return {string} 参数的全名
     */
    getFullName: function (shortName) {
        return this.nameMapping[shortName];
    },

    /**
     * 获取转换为全名参数的配置文件
     * 返回一个用作mapping的object. 这个object有两个作用. 一个是编程时使用fullName获取到用户的设置值,
     * 还以判断用户是否传递了参数,以便在需要的时候决定是否使用默认值.
     * @method getFullNameConfig
     * @param {Object} userConfig 包含了所有参数的mapping object
     * @param {Object} 将参数缩写转换为参数全名的对象. 不在缩写映射表中的属性不改变.
     * @return {Object} config对象
     */
    getFullNameConfig: function (userConfig) {
        var result = {};
        var paramFullName;
        var paramValue;
        var lowerCaseConfig = {};
        var keys = Object.keys(userConfig);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!key || (typeof userConfig[key] === 'undefined')) {
                continue;
            }

            paramFullName = this.getFullName(key.toLowerCase());
            paramValue = userConfig[key];

            // 对于string类型, 一般是颜色参数要特殊处理, 去掉"#"号
            if (typeof paramValue === 'string') {
                paramValue = decodeURIComponent(paramValue).replace('#', '');
            }

            if (paramFullName) {
                result[paramFullName] = paramValue;
            }
            else {
                // 未定义参数, 不进行名字转换
                result[key] = paramValue;
            }

            lowerCaseConfig[key.toLowerCase()] = paramValue;
        }

        userConfig = lowerCaseConfig;

        // 特殊处理容器边框
        if (typeof result.containerBorderWidth !== 'undefined') {
            result.containerBorderTop = parseInt(result.containerBorderWidth, 10);
            result.containerBorderRight = parseInt(result.containerBorderWidth, 10);
            result.containerBorderBottom = parseInt(result.containerBorderWidth, 10);
            result.containerBorderLeft = parseInt(result.containerBorderWidth, 10);
        }

        return result;
    },

    /**
     * 获取所有参数的值
     *
     * @param {Object} userConfig 包含了用户设置了的参数全名的mapping object
     * @return {Object} 包含了所有参数及其取值的mapping object
     */
    getVariables: function (userConfig) {
        // 从defaultValueManager类中, 根据当前用户的请求配置, 获取本次请求的默认值.
        var defaultValue = this.defaultValueManager.getDefaultValue(userConfig);


        // 使用用户设置的值替换默认值
        var paramValue;
        var keys = Object.keys(userConfig);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && (typeof userConfig[key] !== 'undefined')) {
                paramValue = userConfig[key];
                if (typeof paramValue === 'string') {
                    paramValue = decodeURIComponent(paramValue).replace('#', '');
                }
                if (paramValue !== '') {
                    defaultValue[key] = userConfig[key];
                }
            }
        }

        return defaultValue;
    },

    /**
     * 合并两个config对象
     * @param {Object} source 源对象, 会覆盖目标对象的同名属性
     * @param {Object} to 目标对象, 会被源对象覆盖同名属性
     * @param {Object} exceptConfig 排除的参数对象, 在exceptConfig中的参数不进行覆盖
     * @return {Object} 合并后的对象, 如果两个对象存在同名属性, 则会用source的属性覆盖to的属性.
     */
    merge: function (source, to, exceptConfig) {
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && typeof source[key] !== 'undefined' && typeof exceptConfig[key] === 'undefined') {
                to[key] = source[key];
            }
        }
        return to;
    },

    /**
     * 保存参数"缩写"->"全名"的映射关系
     * 2017.7 0号上线后检索端透传fillStyle,RS直接解析fillStyle可以满足样式参数需求
     */
    nameMapping: {
        backgroundColor: 'containerBackgroundColor', // 广告背景色
        cbackground: 'containerBackgroundColor',  // 广告背景色
        cborder: 'containerBorderColor', // 广告边框颜色
        bborder: 'containerBorderWidth', // 广告边框宽度
        top: 'containerPaddingTop', // 容器上内边距
        bottom: 'containerPaddingBottom', // 容器下内边距
        left: 'containerPaddingLeft', // 容器左内边距
        right: 'containerPaddingRight', // 容器右内边距
        ctitle: 'titleFontColor', // title标题字体颜色
        cdesc: 'descFontColor', // desc描述字体颜色
        fontname: 'titleFontFamily', // title标题字体
        fontsize: 'descFontSize', // desc描述字体大小
        titleFontSize: 'titleFontSize', // title标题字体大小
        logis: 'showBaiduLogo ', // 是否显示百度LOGO
        btitle: 'titleFontWeight', // title标题是否加粗
        descFontName: 'descFontFamily', // desc描述字体
        descFontSize: 'descFontSize' // desc描述字体大小
    }
});
