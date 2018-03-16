/**
 * @file TemplateSize meta
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'templateSize',
    namespace: 'rs.common.model',
    pbType: 'rs.TemplateSize',
    property: {
        id: {
            dbType: 'INTEGER'

        },
        template_id: {
            dbType: 'INTEGER'

        },
        type: {
            dbType: 'INTEGER'

        },
        width: {
            dbType: 'STRING'

        },
        height: {
            dbType: 'STRING'

        }

    },

    /**
     * 模板尺寸类型枚举映射
     *
     */
    sizeTypeEnum: {
        int1: 'AUTO',
        int2: 'PX',
        int3: 'SCALE',
        int100: 'RANGE_PX',
        int101: 'RANGE_SCALE'

    },

    /**
     * 获取模板尺寸类型
     *
     * @param {number} intValue 模板尺寸类型枚举值
     * @return {string} 模板尺寸类型
     */
    getSizeType: function (intValue) {
        intValue = intValue || 2;
        var result = this.sizeTypeEnum['int' + intValue] || 'PX';
        result = result.toLowerCase();
        return result;
    },

    /**
     * 获取请求尺寸类型
     *
     * @param {number} intValue 请求尺寸类型枚举值
     * @return {string} 请求尺寸类型
     */
    getReqSizeType: function (intValue) {
        switch (intValue) {
            case 1:
                return 'px';
            case 2:
                return 'scale';
        }

        return null;
    }

});
