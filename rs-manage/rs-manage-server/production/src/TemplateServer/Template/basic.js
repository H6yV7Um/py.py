/**
 * @file 模板渲染基础模块
 * @author fanwenjuan@baidu.com
 */
/* global oojs */
/* eslint-disable max-len */
oojs.define({
    name: 'basic',
    namespace: 'TemplateServer.Template',
    getLayout: function (option) {
        var result =  {
            style: {},
            childNodes: [],
            tagName: 'div'
        };

        return result;
    },

    getContainerStyle: function (option) {
        var style = {};
        style['outer-width'] = option.templateWidth;
        style['outer-height'] = option.templateHeight;
        style['padding-left'] = parseInt(option.containerPaddingLeft, 10);
        style['padding-right'] = parseInt(option.containerPaddingRight, 10);
        style['padding-top'] = parseInt(option.containerPaddingTop, 10);
        style['padding-bottom'] = parseInt(option.containerPaddingBottom, 10);
        style['margin-top'] = parseInt(option.containerMarginTop, 10);
        style['border-style'] = option.containerBorderStyle;
        style['border-top-width'] = option.containerBorderTop;
        style['border-right-width'] = option.containerBorderRight;
        style['border-bottom-width'] = option.containerBorderBottom;
        style['border-left-width'] = option.containerBorderLeft;
        style['border-color'] = '#' + option.containerBorderColor.replace('#', '');
        style['width'] = option.templateWidth - style['padding-left'] - style['padding-right'] - style['border-right-width'] - style['border-left-width'];
        style['height'] = option.templateHeight - style['padding-top'] - style['padding-bottom'] - style['border-top-width'] - style['border-bottom-width'];
        style['background-color'] = '#' + option.containerBackgroundColor.replace('#', '');
        if (parseInt(option.containerOpacity, 10) === 1) {
            style['background-color'] = 'transparent';
        }
        style['position'] = 'relative';
        style['overflow'] = 'hidden';
        style['float'] = option.containerFloat;
        return style;
    },

    getItemStyle: function (option) {
        var style = {};
        style['outer-width'] = parseInt(option.itemWidth, 10);
        style['outer-height'] = parseInt(option.itemHeight, 10);
        style['padding-left'] = parseInt(option.itemPaddingLeft, 10);
        style['padding-right'] = parseInt(option.itemPaddingRight, 10);
        style['padding-top'] = parseInt(option.itemPaddingTop, 10);
        style['padding-bottom'] = parseInt(option.itemPaddingBottom, 10);
        style['width'] = Math.floor(style['outer-width'] - style['padding-left'] - style['padding-right']);
        style['height'] = Math.floor(style['outer-height'] - style['padding-top'] - style['padding-bottom']);
        style['float'] = 'left';
        style['overflow'] = 'hidden';
        style['text-align'] = option.itemTextAlign || 'left';
        // =========公益广告的特殊处理==========
        var isGongyi;
        if (typeof isGongyi !== 'undefined' && isGongyi && (option.stuffType === 'text' || option.stuffType === 'tuwen')) {
            // 对item做特殊处理, 限制最大高度和宽度
            style['width'] = style['width'] > 250 ? 250 : style['width'];
            style['height'] = style['height'] > 90 ? 90 : style['height'];
            style['padding-left'] = style['padding-left'] + ((option.itemWidth - style['width']) / 2);
            style['padding-top'] = style['padding-top'] + ((option.itemHeight - style['height']) / 2);
        }
        return style;
    },
    calculateTitle: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.width = option.titleWidth !== -1 ? option.titleWidth : parentWidth;
        var titleLineHeight = this.calculateTitleLineHeight(option);
        var defaultTitleRowCount = 1;
        if ((parentHeight > 60 && parentWidth <= 120) || (parentHeight > 110 && parentWidth <= 180)) {
            defaultTitleRowCount = 2;
        }
        var titleRowCount = defaultTitleRowCount;
        option.titleRowCount = titleRowCount;
        result.height = titleLineHeight * titleRowCount + option.titlePaddingTop + option.titlePaddingBottom;
        return result;
    },
    getTitleStyle: function (option) {
        var style = {};
        style['outer-width'] = parseInt(option.titleWidth, 10);
        style['outer-height'] = parseInt(option.titleHeight, 10);
        style['padding-left'] = parseInt(option.titlePaddingLeft, 10);
        style['padding-right'] = parseInt(option.titlePaddingRight, 10);
        style['padding-top'] = parseInt(option.titlePaddingTop, 10);
        style['padding-bottom'] = parseInt(option.titlePaddingBottom, 10);
        style['line-height'] = this.calculateTitleLineHeight(option);
        style['width'] = style['outer-width'] - style['padding-left'] - style['padding-right'];
        style['height'] = style['outer-height'] - style['padding-top'] - style['padding-bottom'];
        style['overflow'] = 'hidden';
        style['font-size'] = option.titleFontSize;
        style['font-family'] = option.titleFontFamily;
        style['text-align'] = option.titleTextAlign;
        style['color'] = '#' + option.titleFontColor.replace('#', '');
        style['text-decoration'] = option.titleShowUnderline ? 'underline' : 'none';
        style['font-weight'] = option.titleFontWeight;
        return style;
    },

    getTitleHoverStyle: function (option) {
        var style = {};
        if (option.titleHoverFontColor.toString() !== '-1') {
            style['color'] = '#' + option.titleHoverFontColor.toString().replace('#', '');
        }
        if (option.titleHoverShowUnderline.toString() !== '-1') {
            style['text-decoration'] = option.titleHoverShowUnderline ? 'underline' : 'none';
        }
        if (option.titleHoverBackgroundColor.toString() !== '-1') {
            style['background-color'] = '#' + option.titleHoverBackgroundColor.toString().replace('#', '');
        }
        return style;
    },

    getDescStyle: function (option) {
        var style = {};
        style['outer-width'] = parseInt(option.descWidth, 10);
        style['outer-height'] = parseInt(option.descHeight, 10);
        style['padding-left'] = parseInt(option.descPaddingLeft, 10);
        style['padding-right'] = parseInt(option.descPaddingRight, 10);
        style['padding-top'] = parseInt(option.descPaddingTop, 10);
        style['padding-bottom'] = parseInt(option.descPaddingBottom, 10);
        style['line-height'] = this.calculateDescLineHeight(option);
        style['width'] = style['outer-width'] - style['padding-left'] - style['padding-right'];
        style['height'] = style['outer-height'] - style['padding-top'] - style['padding-bottom'];
        style['overflow'] = 'hidden';
        style['font-size'] = option.descFontSize;
        style['font-family'] = option.titleFontFamily;
        style['text-align'] = option.descTextAlign;
        style['color'] = '#' + option.descFontColor.replace('#', '');
        style['float'] = 'left';
        style['text-decoration'] = option.descShowUnderline ? 'underline' : 'none';
        style['font-weight'] = option.descFontWeight;
        return style;
    },

    getDescHoverStyle: function (option) {
        var style = {};
        if (option.descHoverFontColor.toString() !== '-1') {
            style['color'] = '#' + option.descHoverFontColor.toString().replace('#', '');
        }
        if (option.descHoverShowUnderline.toString() !== '-1') {
            style['text-decoration'] = option.descHoverShowUnderline ? 'underline' : 'none';
        }
        if (option.descHoverBackgroundColor.toString() !== '-1') {
            style['background-color'] = '#' + option.descHoverBackgroundColor.toString().replace('#', '');
        }
        return style;
    },
    getColumnSpaceStyle: function (option) {
        var style = {};
        style['width'] = option.columnSpaceWidth;
        style['height'] = option.columnSpaceHeight  - option.itemColumnMarginTop - option.itemColumnMarginBottom;
        style['float'] = 'left';
        style['overflow'] = 'hidden';
        style['margin-top'] = option.itemColumnMarginTop;
        style['margin-bottom'] = option.itemColumnMarginBottom;
        if (option.itemColumnBackgroundColor) {
            style['background-color'] = '#' + option.itemColumnBackgroundColor;
        }
        return style;
    },

    getRowSpaceStyle: function (option) {
        var style = {};
        style['width'] = option.rowSpaceWidth;
        style['height'] = option.rowSpaceHeight;
        style['clear'] = 'both';
        style['overflow'] = 'hidden';
        return style;
    },


    calculateTitleLineHeight: function (option) {
        var result = option.titleLineHeight > 0 ? option.titleLineHeight : option.titleFontSize + 2;
        return result;
    },

    calculateDescLineHeight: function (option) {
        var result = option.descLineHeight > 0 ? option.descLineHeight : option.descFontSize + 2;
        return result;
    }

});