/**
 * @file 模板查询接口请求对象模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchRequest',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchRequest',
    property: {
        account: {
            type: 'string'
        },
        user_platform: {
            type: 'string'
        },
        user_id: {
            type: 'string'
        },
        template_id: {
            type: 'number'
        },
        /**
         * 1:返回全部属性
         * 2:列表模式, 只带有最简单的用于列表展示的数据, 不携带 sdl, size, content 和 update信息
         * 3:SDL模式, 只返回SDL, 不带有模版内容
         * 4:CONTENT模式, 只返回模板内容, 不带有SDL信息
         */
        template_model_type: {
            type: 'number'
        },
        /**
         * 是否返回公共模版, 默认为 false
         */
        with_public: {
            type: 'boolean'
        },
        /**
         * 是否返回子模版, 默认为 false, 即默认只返回主模板
         */
        with_sub_template: {
            type: 'boolean'
        }
    }
});
