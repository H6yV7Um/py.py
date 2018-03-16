/**
 * @file HTML渲染引擎
 * @author zhangziqiu@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'HtmlRenderEngine',
    namespace: 'TemplateServer.Business',
    deps: {
        string: 'TemplateServer.Common.Utility.String'
    },

    /**
     *  需要添加px单位的样式属性
     *  @property pxStyle
     *  @type Object
     */
    pxStyle: {
        'width': 1,
        'height': 1,
        'line-height': 1,
        'padding-left': 1,
        'padding-right': 1,
        'padding-top': 1,
        'padding-bottom': 1,
        'border-width': 1,
        'font-size': 1,
        'margin-left': 1,
        'margin-right': 1,
        'margin-top': 1,
        'margin-bottom': 1,
        'border-left-width': 1,
        'border-right-width': 1,
        'border-top-width': 1,
        'border-bottom-width': 1

    },

    /**
        layoutObj中哪些属性是不需要paint的.
        @property excludeStyle
        @type Object
        */
    excludeStyle: {
        'outer-height': 1,
        'outer-width': 1
    },

    /**
     * Self-enclosing tags (stolen from node-htmlparser)
     */
    singleTag: {
        area: 1,
        base: 1,
        basefont: 1,
        br: 1,
        col: 1,
        frame: 1,
        hr: 1,
        img: 1,
        input: 1,
        isindex: 1,
        link: 1,
        meta: 1,
        param: 1,
        embed: 1,
        include: 1,
        yield: 1
    },

    renderStyle: function (style) {
        var result = [];
        var keys = Object.keys(style);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && typeof style[key] !== 'undefined' && !this.excludeStyle[key]) {
                var val = style[key].toString();
                result.push(key + ':');
                result.push(val);
                if (this.pxStyle[key]) {
                    if (val.indexOf('px') < 0 && val.indexOf('%') < 0
                    && val.indexOf('rem') < 0
                    && val.indexOf('em') < 0) {
                        result.push('px');
                    }
                }
                result.push(';');
            }
        }

        return result.join('');
    },

    renderAttribute: function (layoutObj) {
        var result = [];
        var key;
        for (key in layoutObj) {
            if (key && typeof layoutObj[key] !== 'undefined' && layoutObj.hasOwnProperty(key)) {
                var val = layoutObj[key];

                switch (key) {
                    case 'tagName':
                        break;
                    case 'style':
                        if (!layoutObj.class) {
                            result.push(' style="');
                            result.push(this.renderStyle(val));
                            result.push('" ');
                        }
                        break;
                    case 'innerHTML':
                        break;
                    case 'childNodes':
                        break;
                    default:
                        result.push(' ' + key + '=' + '"' + layoutObj[key] + '" ');
                        break;
                }
            }
        }

        return result.join('');
    },

    renderHtml: function (layoutObj) {
        var result = '';
        var templateMatchTag = '<{{tagName}} {{attribute}}>{{innerHTML}}</{{tagName}}>';
        var templateSingleTag = '<{{tagName}} {{attribute}}/>';

        var template = '';
        if (this.singleTag[layoutObj.tagName]) {
            template = templateSingleTag;
        }
        else {
            template = templateMatchTag;
        }

        var tagName = layoutObj.tagName || 'div';
        var attribute = this.renderAttribute(layoutObj) || '';
        var innerHTML = layoutObj.innerHTML || '';

        if (layoutObj.childNodes) {
            for (var i = 0, count = layoutObj.childNodes.length; i < count; i++) {
                innerHTML += this.renderHtml(layoutObj.childNodes[i]);
            }
        }

        result = this.string.template(template, {
            tagName: tagName,
            attribute: attribute,
            innerHTML: innerHTML || ''
        });

        return result;
    },

    renderCss: function (style) {
        var result = [];
        var keys = Object.keys(style);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && typeof style[key] !== 'undefined') {
                result.push(key + '{');
                result.push(this.renderStyle(style[key]));
                result.push('}');
            }
        }
        return result.join('');
    }

});
