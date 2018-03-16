/**
 * @file otpl渲染引擎
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'otplRenderEngine',
    namespace: 'rs.business',
    deps: {},

    /**
     *  提取模板内容字符串对应正则表达式
     *
     *  @property templateRegexp
     *  @type Regexp
     */
    templateRegexp: new RegExp(
        '\\<script\\s+[^>]*id="?myTemplate"?[^>]*\\>(.*(?!\\<\\/script\\>).*)\\<\\/script\\>',
        'im'
    ),

    /**
     *  样式内容容器定位对应正则表达式
     *
     *  @property containerRegexp
     *  @type Regexp
     */
    containerRegexp: new RegExp(
        '\\<div\\s+[^>]*id="?container"?[^>]*\\>\\<\\/div\\>',
        'gim'
    ),

    /**
     *  样式内容位置正则表达式
     *
     *  @property contentRegexp
     *  @type Regexp
     */
    contentRegexp: new RegExp('\\<body[^>]*\\>', 'im'),

    /**
     *  样式附加内容模板变量占位符正则表达式
     *
     *  @property commonRegexp
     *  @type Regexp
     */
    commonRegexp: new RegExp('\\<\\/body\\>', 'im'),

    $otplRenderEngine: function () {
    },

    /**
     *  从模板文件中获取otpl模板源内容
     *
     * @param {string} content 模板文件内容
     * @return {string} otpl模板源内容
     **/
    getTemplate: function (content) {
        var result = '';
        var matches = content.match(this.templateRegexp);
        if (matches && matches[1]) {
            result = matches[1];
        }
        else {
            result = content;
        }
        return result;
    },

    /**
     *   编译otpl模板
     *
     * @param {string} templateSource otpl模板源内容
     * @return {Function} otpl模板编译后函数
     **/
    compile: function (templateSource) {
        var funcString = 'common=common||"";var $="";';
        var templateSourceArray = templateSource.replace(/[\r\t\n]/g, ' ').replace(/\<\%\=/g, '\<\=\%').split('<%');
        var i = 0;
        while (i < templateSourceArray.length) {
            var p = templateSourceArray[i];
            if (i) {
                var x = p.indexOf('%>');
                funcString += p.substr(0, x);
                p = p.substr(x + 2);
            }
            funcString += '$+=\'' + p.replace(/\<\=\%(.*?)\%\>/g, '\'+$1+\'') + '\';';
            i++;
        }
        funcString += 'return $';
        // ads为广告数据，common为附加内容
        return new Function('ads', 'common', funcString);
    },

    /**
     *  转化为服务器端编译模板
     *
     * @param {string} content 模板文件内容
     * @param {Object=} option 模板配置
     * @param {boolean=} option.commonModule 是否附加模板功能模块占位符
     * @return {string} 转化后模板
     **/
    toServerRenderTemplate: function (content, option) {
        option = option || {};
        // 提取模板源内容
        var source = this.getTemplate(content);

        // 去除多余内容
        content = content.replace(this.templateRegexp, '');
        content = content.replace(this.containerRegexp, '');

        // 加入广告容器
        content = content.replace(this.contentRegexp, '$&<div id=\"container\">' + source + '</div>');
        // 加入模板附加内容展位符
        if (option.commonModule) {
            content = content.replace(this.commonRegexp, '<%=common%>$&');
        }
        return content;
    },

    /**
     *  转化为client端渲染模板
     *
     * @param {string} content 模板文件内容
     * @param {Object} option 模板配置
     * @return {string} 转化后模板
     **/
    toBrowserRenderTemplate: function (content, option) {
        option = option || {};
        // 提取模板源内容
        var source = this.getTemplate(content);

        // 去除多余内容
        content = content.replace(this.templateRegexp, '');
        content = content.replace(this.containerRegexp, '');

        // 加入模板内容与容器
        content = content.replace(this.contentRegexp,
            '$&<div id=\"container\"></div><script id=\"myTemplate\">' + source + '</script>'
        );

        return content;
    }

});
