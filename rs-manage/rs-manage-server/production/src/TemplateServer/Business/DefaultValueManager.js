/**
 * @file TemplateServer.defaultValueManager
 * @author fanwenjuan@baidu.com
 */

/* globals oojs */

oojs.define({
    name: 'DefaultValueManager',
    namespace: 'TemplateServer.Business',

    /**
     *  获取默认值
     *  @function getDefaultValue
     *  @param {Object} option 本次请求的参数
     *  @param {Number} [option.width]  广告宽度
     *  @param {Number} [option.height]  广告高度
     *  @param {String} [option.stuffType]  广告物料类型
     *  @return {Object} 模板样式变量的默认值对象, key是fullName.
     */
    getDefaultValue: function () {
        var result = this.fastClone(this.globalDefaultValue);
        return result;
    },

    // 快速克隆
    fastClone: function (source) {
        var temp = function () {};
        temp.prototype = source;
        return new temp();
    },
    /**
        全局样式变量默认值
        @param {Object} imageInlayDefaultValue
        */
    globalDefaultValue: {
        templateWidth: 728,
        templateHeight: 90,
        adRowCount: 1,
        adColumnCount: 1,
        adIconIsShow: 1,
        browser: 'chrome',
        containerBorderColor: 'ffffff',
        containerBorderWidth: 1,
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerBorderStyle: 'solid',
        containerBackgroundColor: 'ffffff',
        containerPaddingLeft: 4,
        containerPaddingRight: 4,
        containerPaddingTop: 4,
        containerPaddingBottom: 4,
        containerMarginLeft: 0,
        containerMarginRight: 0,
        containerMarginTop: 0,
        containerMarginBottom: 0,
        containerOpacity: 0,
        containerShowLogo: 1,
        containerWidth: 0,
        containerHeight: 0,
        containerHideHeaderFooter: 0,
        containerFloat: 'none',
        containerLogoStyle: '-1',

        itemPaddingLeft: 0,
        itemPaddingRight: 0,
        itemPaddingTop: 0,
        itemPaddingBottom: 0,
        itemVerticalAlign: '-1',
        itemColumnSpace: 20,
        itemColumnBackgroundColor: '-1',
        itemColumnBorderWidth: 0,
        itemColumnBorderStyle: 'solid',
        itemColumnBorderColor: '-1',
        itemColumnPaddingTop: 0,
        itemColumnPaddingLeft: 0,
        itemColumnPaddingRight: 0,
        itemColumnPaddingBottom: 0,
        itemColumnMarginTop: 0,
        itemColumnMarginLeft: 0,
        itemColumnMarginRight: 0,
        itemColumnMarginBottom: 0,
        itemRowSpace: 10,
        itemRowBorderWidth: 0,
        itemRowBorderStyle: 'solid',
        itemRowBorderColor: '-1',
        itemRowPaddingTop: 0,
        itemRowPaddingLeft: 0,
        itemRowPaddingRight: 0,
        itemRowPaddingBottom: 0,


        logoIsShow: 1,
        logoPaddingLeft: 0,
        logoPaddingRight: 4,
        logoPaddingTop: 0,
        logoPaddingBottom: 0,

        titleFontColor: '0000ff',
        titleFontFamily: 'arial,simsun,sans-serif',
        titleFontSize: 14,
        titleLength: -1,
        titleIsShowEllipsis: 0,
        titleIsShow: 1,
        titleRowCount: 1,
        titlePaddingLeft: 0,
        titlePaddingRight: 0,
        titlePaddingTop: 0,
        titlePaddingBottom: 2,
        titleShowUnderline: 1,
        titleLineHeight: -1,
        titleWidth: -1,
        titleFontWeight: 'normal',
        titleBackgroundColor: '-1',
        titleHoverFontColor: 'EE0000',
        titleHoverShowUnderline: -1,
        titleHoverBackgroundColor: '-1',
        titleVisitedFontColor: '-1',
        titleVisitedShowUnderline: -1,
        titleVisitedBackgroundColor: '-1',
        titleActiveFontColor: '-1',
        titleActiveShowUnderline: -1,
        titleActiveBackgroundColor: '-1',
        titleTextAlign: 'left',

        descFontColor: '444444',
        descFontFamily: 'arial,simsun,sans-serif',
        descFontSize: 14,
        descLength: -1,
        descIsShowEllipsis: 1,
        descIsShow: 1,
        descRowCount: -1,
        descPaddingLeft: 0,
        descPaddingRight: 0,
        descPaddingTop: 0,
        descPaddingBottom: 0,
        descShowUnderline: 0,
        descLineHeight: -1,
        descWidth: -1,
        descFontWeight: 'normal',
        descBackgroundColor: '-1',
        descHoverFontColor: 'EE0000',
        descHoverShowUnderline: 1,
        descHoverBackgroundColor: '-1',
        descVisitedFontColor: '-1',
        descVisitedShowUnderline: -1,
        descVisitedBackgroundColor: '-1',
        descActiveFontColor: '-1',
        descActiveShowUnderline: -1,
        descActiveBackgroundColor: '-1',
        descTextAlign: 'left',

        urlFontColor: '008000',
        urlFontFamily: 'arial,simsun,sans-serif',
        urlFontSize: 11,

        showBaiduLogo: 1,
        // fillstyle 平铺样式参数
        marginDescriptionPciture: 0, // 描述距离图片距离
        pdp: 1, // 图片靠左，左：1；右：3
        marginTitlePicture: 0, // 标题距离图片距离
        marginTitleDescription: 0, // 标题距离描述距离
        marginTitleTop: 0 // 标题距离顶部距离（例：单行标题）
    }
});