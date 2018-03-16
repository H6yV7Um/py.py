oojs.define({
    name: 'layoutEngineFactory',
    namespace: 'rs.business',
    /**
     * 根据 context 获取layoutEngine. 目前的规则是layoutEngine与样式类型styleType同名.
     *
     * @param {Object} context 请求上下文
     * @return {Object} layoutEngine对象
     */
    getLayoutEngine: function (context) {		
        var styleType = context.styleType;
        var layoutEngine = oojs.using('rs.template.' + styleType + '.layout');
        return layoutEngine;
    }
});