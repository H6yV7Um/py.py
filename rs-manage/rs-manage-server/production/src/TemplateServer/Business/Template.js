/**
 * @file Template业务逻辑对象
 * @author fanwenjuan@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'Template',
    namespace: 'TemplateServer.Business',
    deps: {
        TemplateCache: 'TemplateServer.Data.TemplateCache'
    },

    /**
     * 静态构造函数
     */
    $Template: function () {
    },

    /**
     * 获取所有Template对象
     *
     * @return {Array} Template对象数组
     */
    getAllTemplate: function () {
        var result;
        result = this.TemplateCache.getByKey();
        return result;
    },

    /**
     * 根据id返回Template对象
     *
     * @param {number} templateId 模板Id
     * @return {Object} Template对象
     */
    getTemplateById: function (templateId) {
        return this.TemplateCache.getByKey(templateId);
    }

});
