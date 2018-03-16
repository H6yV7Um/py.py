/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'string',
    namespace: 'TemplateServer.Template',
    templateRegex: null,
    $string: function () {
        this.templateRegex = new RegExp('{{([^}]*)}}', 'g');
    },
    template: function (source, data) {
        var result = source.replace(this.templateRegex, function (match, subMatch, index, s) {
            return data[subMatch] || '';
        });
        this.templateRegex.lastIndex = 0;
        return result;
    }
});
