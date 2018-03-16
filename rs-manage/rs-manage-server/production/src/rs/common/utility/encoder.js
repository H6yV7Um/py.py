oojs.define({
    name: 'encoder',
    namespace: 'rs.common.utility',
    /**
     * HTML转义
     * @param {string} source 待处理的字符串 
     * @return {string} 处理后的字符串
     */
    encodeHTML: function (source) {
        return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '&#92;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    /**
     * 转义影响正则的字符
     * @param {string} source 待处理的字符串 
     * @return {string} 处理后的字符串
     */
	encodeRegRegexp: new RegExp('[.*+?^=!:${}()|[\]/\\]', 'g'),
    encodeReg: function (source) {
        return String(source).replace( this.encodeRegRegexp, '\\$1');
    },

    /**
     * 转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
     * @param {string} source 待处理的字符串 
     * @return {string} 处理后的字符串
     */
    encodeEventHTML: function (source) {
        return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\\\\/g, '\\').replace(/\\\//g, '\/').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
    }
});