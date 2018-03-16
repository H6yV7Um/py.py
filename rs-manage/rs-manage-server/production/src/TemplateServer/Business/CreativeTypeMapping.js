/**
 * @file CreativeTypeMapping
 * @author fanwenjuan@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'CreativeTypeMapping',
    namespace: 'TemplateServer.Business',
    creativeTypeEnum: {
        0: 'text',
        1: 'image',
        2: 'flash',
        3: 'widget',
        4: 'textWithIcon'
    },

    /**
     * 返回creativeType对应的CreativeTypeMessageName
     *
     * @param {number} creativeType creativeType值
     * @return {string} creativeTypeMessageName
     */
    getCreativeTypeMessageName: function (creativeType) {
        return this.creativeTypeEnum[creativeType] || '';
    }



});
