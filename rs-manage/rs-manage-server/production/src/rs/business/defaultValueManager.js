/**
 * @file rs.business.defaultValueManager
 */

/* globals oojs */

oojs.define({
    name: 'defaultValueManager',
    namespace: 'rs.business',

    /**
     *  获取默认值
     *  @function getDefaultValue
     *  @param {Object} option 本次请求的参数
     *  @param {Number} [option.width]  广告宽度
     *  @param {Number} [option.height]  广告高度
     *  @param {String} [option.stuffType]  广告物料类型
     *  @return {Object} 模板样式变量的默认值对象, key是fullName.
     */
    getDefaultValue: function (option) {
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
     *  Flash物料样式变量默认值
     *  @property {Object}
     */
    flash: {
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        adRowCount: 1,
        adColumnCount: 1
    },
    /**
     *  wiget物料样式变量默认值
     *  @property {Object}
     */
    widget: {
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBorderTop: 1,
        containerBorderRight: 1,
        containerBorderBottom: 1,
        containerBorderLeft: 1,
        adRowCount: 1,
        adColumnCount: 1
    },
    /**
     *  image物料样式变量默认值
     *  @property {Object}
     */
    image: {
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        adRowCount: 1,
        adColumnCount: 1
    },

    /**
        全局样式变量默认值
        @param {Object} imageInlayDefaultValue
        */
    globalDefaultValue: {
        userChargingId: '',
        templateWidth: 728,
        templateHeight: 90,
        adDataType: 'text_tuwen',
        adRowCount: 1,
        adColumnCount: 1,
        KeywordIsFlush: 4,
        KeywordFlushColor: 'e10900',
        isShowUnrelated: 1,
        isShowPublicAd: 1,
        isGongyi: 0,
        backupColor: 'ffffff',
        backupUrl: '',
        displayType: 'inlay',
        stuffType: 'image',
        layou: '-1',
        scale: '',
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
        itemRightImage: 0,
        itemRightImageSrc: '',
        itemRightImageWidth: 0,
        itemRightImageHeight: 0,
        itemRightImagePaddingTop: 0,
        itemRightImagePaddingLeft: 0,
        itemRightImagePaddingRight: 0,
        itemRightImagePaddingBottom: 0,

        brandLogoPaddingLeft: 0,
        brandLogoPaddingRight: 0,
        brandLogoPaddingTop: 0,
        brandLogoPaddingBottom: 0,

        logoIsShow: 1,
        logoPaddingLeft: 0,
        logoPaddingRight: 4,
        logoPaddingTop: 0,
        logoPaddingBottom: 0,
        /*********MDSP信息流模板定制logo样式**********/
        isShowTuiGuang: 0, // 是否显示推广样式
        tuiGuangFontSize: 10, // 推广样式-字体大小
        tuiGuangFontColor: 'FFFFFF', // 推广样式-字体颜色
        tuiGuangBackgroundColor: 'DBDBDB', // 推广样式-字体背景色
        /*********MDSP信息流模板定制logo样式****end******/
        titleFontColor: '0F0CBF',
        titleFontFamily: 'arial,simsun,sans-serif',
        titleFontSize: 14,
        titleLength: -1,
        titleIsShowEllipsis: 0,
        titleIsShow: 1,
        titleRowCount: 1,
        titlePaddingLeft: 0,
        titlePaddingRight: 0,
        titlePaddingTop: 0,
        titlePaddingBottom: 5,
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
        titleTextAlign: '-1',
        titleFrontIconSrc: '',
        titleFrontIconWidth: 0,
        titleFrontIconHeight: 0,
        titleFrontIconPaddingRight: 0,
        titleFrontIconPaddingLeft: 0,
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
        descTextAlign: '-1',
        urlFontColor: '008000',
        urlFontFamily: 'arial,simsun,sans-serif',
        urlFontSize: 11,
        urlLength: -1,
        urlIsShowEllipsis: 0,
        urlIsShow: -1,
        urlPaddingLeft: 0,
        urlPaddingRight: 0,
        urlPaddingTop: 3,
        urlPaddingBottom: 0,
        urlShowUnderline: 0,
        urlRowCount: 0,
        urlLineHeight: -1,
        urlWidth: -1,
        urlFontWeight: 'normal',
        urlBackgroundColor: '-1',
        urlReplace: ' ',
        urlHoverFontColor: 'EE0000',
        urlHoverShowUnderline: 1,
        urlHoverBackgroundColor: '-1',
        urlVisitedFontColor: '-1',
        urlVisitedShowUnderline: -1,
        urlVisitedBackgroundColor: '-1',
        urlActiveFontColor: '-1',
        urlActiveShowUnderline: -1,
        urlActiveBackgroundColor: '-1',
        urlTextAlign: '-1',
        promotionIsShow: 0,
        adIconIsShow: 1,
        resBorderWidth: 0,
        resBorderColor: 'ffffff'
    }
});