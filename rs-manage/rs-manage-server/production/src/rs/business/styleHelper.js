oojs.define({
    name: 'styleHelper',
    namespace: 'rs.business',
    deps: {
        string: 'rs.common.utility.string'
    },
    /**
     *  需要添加px单位的样式属性
     *  @property pxStyle
     *  @type Object
     */
    pxStyle: {
        width: 1,
        height: 1,
        "line-height": 1,
        "padding-left": 1,
        "padding-right": 1,
        "padding-top": 1,
        "padding-bottom": 1,
        "border-width": 1,
        "font-size": 1,
        "margin-left": 1,
        "margin-right": 1,
        "margin-top": 1,
        "margin-bottom": 1,
        "border-left-width": 1,
        "border-right-width": 1,
        "border-top-width": 1,
        "border-bottom-width": 1
    },

    /**
        layoutObj中哪些属性是不需要paint的.
        @property excludeStyle
        @type Object
        */
    excludeStyle: {
        "outer-height": 1,
        "outer-width": 1
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
        'yield': 1
    },

    renderStyle: function (style) {
        var result = [];
        for (var key in style) {
            if (key && typeof style[key] !== 'undefined' && style.hasOwnProperty(key) && !this.excludeStyle[key]) {
                result.push(key + ":");
                result.push(style[key]);
                if (this.pxStyle[key]) {
                    result.push("px");
                }
                result.push(";");
            }
        }
        return result.join('');
    },

    renderAttribute: function (layoutObj) {
        var special = {
            tagName: 'div',
            'innerHTML': 'hello world'
        };

        var result = [];
        var key;
        for (key in layoutObj) {
            if (key && typeof layoutObj[key] !== 'undefined' && layoutObj.hasOwnProperty(key)) {
                var val = layoutObj[key];

                switch (key) {
                case 'tagName':
                    break;
                case 'style':
                    if (!layoutObj['class']) {
                        result.push(' style="');
                        result.push(this.renderStyle(val));
                        result.push('" ');
                    }
                    break;
                case 'innerHTML':
                    break;
				case 'childNodes':
					break;
				case 'tagName':
					break;
                default:
                    result.push(" " + key + '=' + '"' + layoutObj[key] + '" ');
                    break;
                }
            }
        }
		
		return result.join('');
    },

    renderHtml: function (layoutObj) {		
        var result = "";
        var templateMatchTag = '<{{tagName}} {{attribute}}>{{innerHTML}}</{{tagName}}>';
        var templateSingleTag = '<{{tagName}} {{attribute}}/>';

        var template = '';
        if (this.singleTag[layoutObj.domName]) {
            template = templateSingleTag;
        }
        else {
            template = templateMatchTag;
        }

        var tagName = layoutObj.tagName || "div";
        var attribute = this.renderAttribute(layoutObj) || "";	
        var innerHTML = layoutObj.innerHTML || "";
		
        if (layoutObj.childNodes) {
            for (var i = 0, count = layoutObj.childNodes.length; i < count; i++) {
                innerHTML += this.render(layoutObj.childNodes[i]);				
            }
        }
		
        result = this.string.template(template, {
            tagName: layoutObj.tagName || "div",
            attribute: attribute,
            innerHTML: innerHTML || ""
        });
		
        return result;
    }

});