oojs.define({
    name: 'layout',
    namespace: 'rs.template.smart_idea_multiurl',
    $layout: function () {},
    isNeedLayoutCache: false, //是否缓存Layout的结果
    isNeedRenderData: false, //是否需要数据引擎渲染数据

    /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
    render: function (context) {
        var result = {
            layoutObj: {},
            style: {}
        };
        return result;
    }
});