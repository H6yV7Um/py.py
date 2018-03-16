oojs.define({
    name: 'layoutEngineFactory',
    namespace: 'rs.business',
    /**
     * ���� context ��ȡlayoutEngine. Ŀǰ�Ĺ�����layoutEngine����ʽ����styleTypeͬ��.
     *
     * @param {Object} context ����������
     * @return {Object} layoutEngine����
     */
    getLayoutEngine: function (context) {		
        var styleType = context.styleType;
        var layoutEngine = oojs.using('rs.template.' + styleType + '.layout');
        return layoutEngine;
    }
});