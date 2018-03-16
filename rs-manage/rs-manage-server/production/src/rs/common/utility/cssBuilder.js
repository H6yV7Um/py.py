oojs.define({
    name: 'cssBuilder',
    namespace: 'rs.common.utility',
    /**
     * 根据传入的CSS字符串, 在页面上动态添加CSS的style元素. 
     * @method addCssByStyle 
     * @param {string} cssString 要加入到页面上的css内容. 
     * @return {boolean}
     */
    addCss: function (cssString) {
        var doc = document;
        var style = doc.createElement("style");
        style.setAttribute("type", "text/css");

        if (style.styleSheet) { // IE
            style.styleSheet.cssText = cssString;
        }
        else { // w3c
            var cssText = doc.createTextNode(cssString);
            style.appendChild(cssText);
        }

        var heads = doc.getElementsByTagName("head");
        if (heads.length) heads[0].appendChild(style);
        else doc.documentElement.appendChild(style);
    }
});