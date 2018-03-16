/**
 * @file 工具类String
 * @author fanwenjuan(fanwenjuan@baidu.com)
 */

/* global oojs */

oojs.define({
    name: 'String',
    namespace: 'TemplateServer.Common.Utility',
    templateRegex: null,
    $String: function () {
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