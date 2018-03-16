oojs.define({
    name: 'basic',
    namespace: 'rs.template',
    /**
        获取CssName, 允许添加前缀
        @method GetCssName
        @return {String} CssName字符串
        */
    GetCssName: function (name, option) {
        var result = name;
        if (option.idPrefix) {
            result = option.idPrefix + result;
        }
        return result;
    },
	
	getLayout:function(option){
		var result =  {
            style: {},
            childNodes: [],
            tagName: "div"
        };
		
		return result;
	},
	
	getContainerStyle:function(option){
		var style = {};
        style["outer-width"] = option.templateWidth;
        style["outer-height"] = option.templateHeight;
        style["padding-left"] = parseInt(option.containerPaddingLeft);
        style["padding-right"] = parseInt(option.containerPaddingRight);
        style["padding-top"] = parseInt(option.containerPaddingTop);
        style["padding-bottom"] = parseInt(option.containerPaddingBottom);
        style["margin-top"] = parseInt(option.containerMarginTop);
        style["border-style"] = option.containerBorderStyle;
        style["border-top-width"] = option.containerBorderTop;
        style["border-right-width"] = option.containerBorderRight;
        style["border-bottom-width"] = option.containerBorderBottom;
        style["border-left-width"] = option.containerBorderLeft;
        style["border-color"] = "#" + option.containerBorderColor.replace("#", "");
        style["width"] = option.templateWidth - style["padding-left"] - style["padding-right"] - style["border-right-width"] - style["border-left-width"];
        style["height"] = option.templateHeight - style["padding-top"] - style["padding-bottom"] - style["border-top-width"] - style["border-bottom-width"];
        style["background-color"] = "#" + option.containerBackgroundColor.replace("#", "");
        if (parseInt(option.containerOpacity) === 1) {
            style["background-color"] = "transparent";
        }
        style["position"] = "relative";
        style["overflow"] = "hidden";
        style["float"] = option.containerFloat;
		return style;
	},


    /**
        item容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutItem: function (width, height, option) {
        var item = {
            style: {},
            childNodes: [],
            dataType: "layout",
            tagName: "div",
            class: this.GetCssName("item", option)
        };
        var style = item.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.itemPaddingLeft);
        style["padding-right"] = parseInt(option.itemPaddingRight);
        style["padding-top"] = parseInt(option.itemPaddingTop);
        style["padding-bottom"] = parseInt(option.itemPaddingBottom);
        style["width"] = Math.floor(style["outer-width"] - style["padding-left"] - style["padding-right"]);
        style["height"] = Math.floor(style["outer-height"] - style["padding-top"] - style["padding-bottom"]);
        style["float"] = "left";
        style["overflow"] = "hidden";
        style["text-align"] = option.itemTextAlign || "left";
        //=========公益广告的特殊处理==========
        if (typeof isGongyi !== "undefined" && isGongyi && (option.stuffType === "text" || option.stuffType === "tuwen")) {
            //对item做特殊处理, 限制最大高度和宽度 
            style["width"] = style["width"] > 250 ? 250 : style["width"];
            style["height"] = style["height"] > 90 ? 90 : style["height"];
            style["padding-left"] = style["padding-left"] + ((width - style["width"]) / 2);
            style["padding-top"] = style["padding-top"] + ((height - style["height"]) / 2);
        }
        return item;
    },
    /**
        icon容器布局函数 
        @method layoutIcon
        @return {Object} 布局对象
        */
    layoutIcon: function (width, height, option) {
        var icon = {
            style: {},
            childNodes: [],
            dataType: "icon",
            tagName: "div",
            dataKey: "icon",
            enableClick: option.iconLinkUnitConfig.enableClick
        };
        var style = icon.style;
        style["padding-left"] = parseInt(option.titleFrontIconPaddingLeft) || 0;
        style["padding-right"] = parseInt(option.titleFrontIconPaddingRight) || 0;
        style["padding-top"] = parseInt(option.titleFrontIconPaddingTop) || 0;
        style["padding-bottom"] = parseInt(option.titleFrontIconPaddingBottom) || 0;
        style.width = width;
        style.height = height;
        style["float"] = "left";
        return icon;
    },
    /**
        item右边图片容器布局函数 
        @method layoutRightImage
        @return {Object} 布局对象
        */
    layoutRightImage: function (width, height, itemWidth, itemHeight, option) {
        var image = {
            style: {},
            childNodes: [],
            dataType: "text",
            tagName: "div",
            class: this.GetCssName("itemRightImage", option),
            dataKey: "rightimage"
        };
        var style = image.style;
        style.width = width;
        style.height = height;
        style["position"] = "absolute";
        style.overflow = "hidden";
        if (option.templateWidth <= 180) { //如果宽度小于180，则箭头在广告的下方，否则，在广告的右方
            style["right"] = (option.itemRightImagePaddingRight || (itemWidth - width) / 2) + "px";
            style["bottom"] = option.itemRightImagePaddingBottom + "px";
        }
        else {
            style["right"] = option.itemRightImagePaddingRight + "px";
            style["top"] = (option.itemRightImagePaddingTop || (itemHeight - height) / 2) + "px";
        }
        return image

    },
    /**
        title容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutTitle: function (width, height, option, floatDirection) {
        var title = {
            style: {},
            childNodes: [],
            dataType: "text",
            tagName: "div",
            class: this.GetCssName("title", option),
            dataKey: "title"
        };
        var style = title.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.titlePaddingLeft);
        style["padding-right"] = parseInt(option.titlePaddingRight);
        style["padding-top"] = parseInt(option.titlePaddingTop);
        style["padding-bottom"] = parseInt(option.titlePaddingBottom);
        style["line-height"] = this.calculateTitleLineHeight(option);
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["overflow"] = "hidden";
        style["font-size"] = option.titleFontSize;
        style["font-family"] = option.titleFontFamily;
        style["text-align"] = option.titleTextAlign;
        style["color"] = "#" + option.titleFontColor.replace("#", "");
        style["text-decoration"] = option.titleShowUnderline ? "underline" : "none";
        style["font-weight"] = option.titleFontWeight;
        title.rowCount = option.titleRowCount > 0 ? option.titleRowCount : this.calculateTitleRowCount(height, option);
        title.showEllipsis = option.titleIsShowEllipsis;
        if (floatDirection) {
            style["float"] = floatDirection;
        }
        if (option.titleHoverFontColor.toString() !== "-1" || option.titleHoverShowUnderline.toString() !== "-1" || option.titleHoverBackgroundColor.toString() !== "-1") {
            var styleHover = title.styleHover = {};
            if (option.titleHoverFontColor.toString() !== "-1") {
                styleHover["color"] = "#" + option.titleHoverFontColor.toString().replace("#", "");
            }
            if (option.titleHoverShowUnderline.toString() !== "-1") {
                styleHover["text-decoration"] = option.titleHoverShowUnderline ? "underline" : "none";
            }
            if (option.titleHoverBackgroundColor.toString() !== "-1") {
                styleHover["background-color"] = "#" + option.titleHoverBackgroundColor.toString().replace("#", "");
            }
        }

        return title;
    },


    /**
        url容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutUrl: function (width, height, option, floatDirection) {
        var url = {
            style: {},
            childNodes: [],
            dataType: "text",
            tagName: "div",
            class: this.GetCssName("url", option),
            dataKey: "surl"
        };
        var style = url.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.urlPaddingLeft);
        style["padding-right"] = parseInt(option.urlPaddingRight);
        style["padding-top"] = parseInt(option.urlPaddingTop);
        style["padding-bottom"] = parseInt(option.urlPaddingBottom);
        style["line-height"] = this.calculateUrlLineHeight(option);
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["overflow"] = "hidden";
        style["font-size"] = option.urlFontSize;
        style["font-family"] = option.urlFontFamily;
        style["text-align"] = option.urlTextAlign;
        style["color"] = "#" + option.urlFontColor.replace("#", "");
        style["float"] = "left";
        style["text-decoration"] = option.urlShowUnderline ? "underline" : "none";
        style["font-weight"] = option.urlFontWeight;
        url.rowCount = option.urlRowCount > 0 ? option.urlRowCount : 1;
        url.showEllipsis = option.urlIsShowEllipsis;
        if (floatDirection) {
            style["float"] = floatDirection;
        }

        if (option.urlHoverFontColor.toString() !== "-1" || option.urlHoverShowUnderline.toString() !== "-1" || option.urlHoverBackgroundColor.toString() !== "-1") {
            var styleHover = url.styleHover = {};
            if (option.urlHoverFontColor.toString() !== "-1") {
                styleHover["color"] = "#" + option.urlHoverFontColor.toString().replace("#", "");
            }
            if (option.urlHoverShowUnderline.toString() !== "-1") {
                styleHover["text-decoration"] = option.urlHoverShowUnderline ? "underline" : "none";
            }
            if (option.urlHoverBackgroundColor.toString() !== "-1") {
                styleHover["background-color"] = "#" + option.urlHoverBackgroundColor.toString().replace("#", "");
            }
        }

        return url;
    },


    /**
        desc容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutDesc: function (width, height, option, floatDirection) {
        var desc = {
            style: {},
            childNodes: [],
            dataType: "text",
            tagName: "div",
            class: this.GetCssName("desc", option),
            dataKey: "desc"
        };
        var style = desc.style;
        //style["word-wrap"] = "break-word";
        //style["word-break"] = "break-all";
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.descPaddingLeft);
        style["padding-right"] = parseInt(option.descPaddingRight);
        style["padding-top"] = parseInt(option.descPaddingTop);
        style["padding-bottom"] = parseInt(option.descPaddingBottom);
        style["line-height"] = this.calculateDescLineHeight(option);
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["overflow"] = "hidden";
        style["font-size"] = option.descFontSize;
        style["font-family"] = option.descFontFamily;
        style["text-align"] = option.descTextAlign;
        style["color"] = "#" + option.descFontColor.replace("#", "");
        style["float"] = "left";
        style["text-decoration"] = option.descShowUnderline ? "underline" : "none";
        style["font-weight"] = option.descFontWeight;
        //显示几行, 如果值为-1表示自动计算, 否则以用户设置的为准.
        desc.rowCount = option.descRowCount > 0 ? option.descRowCount : this.calculateDescRowCount(height, option);
        desc.showEllipsis = option.descIsShowEllipsis;
        if (floatDirection) {
            style["float"] = floatDirection;
        }

        if (option.descHoverFontColor.toString() !== "-1" || option.descHoverShowUnderline.toString() !== "-1" || option.descHoverBackgroundColor.toString() !== "-1") {
            var styleHover = desc.styleHover = {};
            if (option.descHoverFontColor.toString() !== "-1") {
                styleHover["color"] = "#" + option.descHoverFontColor.toString().replace("#", "");
            }
            if (option.descHoverShowUnderline.toString() !== "-1") {
                styleHover["text-decoration"] = option.descHoverShowUnderline ? "underline" : "none";
            }
            if (option.descHoverBackgroundColor.toString() !== "-1") {
                styleHover["background-color"] = "#" + option.descHoverBackgroundColor.toString().replace("#", "");
            }
        }

        return desc;
    },

    /**
        logo容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutLogo: function (width, height, option) {
        var logo = {
            style: {},
            childNodes: [],
            dataType: "image",
            tagName: "div",
            class: this.GetCssName("logo", option),
            dataKey: "res"
        };
        var style = logo.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.logoPaddingLeft);
        style["padding-right"] = parseInt(option.logoPaddingRight);
        style["padding-top"] = parseInt(option.logoPaddingTop);
        style["padding-bottom"] = parseInt(option.logoPaddingBottom);
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["float"] = "left";
        style["overflow"] = "hidden";
        return logo;
    },

    /**
        brandLogo容器布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutBrandLogo: function (width, height, option, floatDirection) {
        var brandLogo = {
            style: {},
            childNodes: [],
            dataType: "image",
            tagName: "div",
            class: this.GetCssName("brandLogo", option),
            dataKey: "brand"
        };
        var style = brandLogo.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.brandLogoPaddingLeft);
        style["padding-right"] = parseInt(option.brandLogoPaddingRight);
        style["padding-top"] = parseInt(option.brandLogoPaddingTop);
        style["padding-bottom"] = parseInt(option.brandLogoPaddingBottom);
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["overflow"] = "hidden";

        if (floatDirection) {
            style["float"] = floatDirection;
        }
        return brandLogo;
    },

    /**
        container的布局函数 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutImage: function (width, height, option) {
        var image = {
            style: {},
            childNodes: [],
            dataType: "image",
            tagName: "div",
            class: this.GetCssName("image", option),
            dataKey: "res"
        };
        var style = image.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.imagePaddingLeft) || 0;
        style["padding-right"] = parseInt(option.imagePaddingRight) || 0;
        style["padding-top"] = parseInt(option.imagePaddingTop) || 0;
        style["padding-bottom"] = parseInt(option.imagePaddingBottom) || 0;
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["float"] = "left";
        style["overflow"] = "hidden";
        return image;
    },

    /**
        flash元素的布局函数 
        @method layoutFlash
        @return {Object} 布局对象
        */
    layoutFlash: function (width, height, option) {
        var flash = {
            style: {},
            childNodes: [],
            dataType: "flash",
            tagName: "div",
            class: this.GetCssName("flash", option),
            dataKey: "res"
        };
        var style = flash.style;
        style["outer-width"] = width;
        style["outer-height"] = height;
        style["padding-left"] = parseInt(option.flashPaddingLeft) || 0;
        style["padding-right"] = parseInt(option.flashPaddingRight) || 0;
        style["padding-top"] = parseInt(option.flashPaddingTop) || 0;
        style["padding-bottom"] = parseInt(option.flashPaddingBottom) || 0;
        style["width"] = style["outer-width"] - style["padding-left"] - style["padding-right"];
        style["height"] = style["outer-height"] - style["padding-top"] - style["padding-bottom"];
        style["float"] = "left";
        style["overflow"] = "hidden";
        return flash;
    },

    /**
        列间距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutColumnSpace: function (width, height, option) {
        var columnSpace = {
            style: {},
            childNodes: [],
            dataType: "layout",
            tagName: "div",
            class: this.GetCssName("itemColumnSpace", option)
        };
        var style = columnSpace.style;
        style["width"] = width;
        style["height"] = height - option.itemColumnMarginTop - option.itemColumnMarginBottom;
        style["float"] = "left";
        style["overflow"] = "hidden";
        style["margin-top"] = option.itemColumnMarginTop;
        style["margin-bottom"] = option.itemColumnMarginBottom;
        if (option.itemColumnBackgroundColor) {
            style["background-color"] = "#" + option.itemColumnBackgroundColor;
        }
        if (option.itemColumnBorderWidth) {
            //间距元素需要添加横线 option.itemRowBorderWidth
            var line = {
                style: {},
                childNodes: [],
                dataType: "layout",
                tagName: "div",
                class: this.GetCssName("itemColumnSpaceLine", option)
            };

            line.style["width"] = 1;
            line.style["height"] = height;
            line.style["border-style"] = option.itemColumnBorderStyle;
            if (option.itemColumnBorderColor.toString() === "-1") {
                line.style["border-color"] = "#" + option.containerBorderColor;
            }
            else {
                line.style["border-color"] = "#" + option.itemColumnBorderColor;
            }
            line.style["border-width"] = 0;
            line.style["border-left-width"] = option.itemColumnBorderWidth;
            line.style["margin-left"] = Math.floor(width / 2) - 1;
            line.style["overflow"] = "hidden";
            columnSpace.childNodes.push(line);
        }

        return columnSpace;
    },

    /**
        行间距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutRowSpace: function (width, height, option) {
        var rowSpace = {
            style: {},
            childNodes: [],
            dataType: "layout",
            tagName: "div",
            class: this.GetCssName("itemRowSpace", option)
        };

        var style = rowSpace.style;
        style["width"] = width;
        style["height"] = height;
        style["clear"] = "both";
        style["overflow"] = "hidden";

        if (option.itemRowBorderWidth) {
            //间距元素需要添加横线 option.itemRowBorderWidth
            var line = {
                style: {},
                childNodes: [],
                dataType: "layout",
                tagName: "div",
                class: this.GetCssName("itemRowSpaceLine", option)
            };

            line.style["width"] = width;
            line.style["height"] = 1;
            line.style["border-style"] = option.itemRowBorderStyle;
            if (option.itemRowBorderColor.toString() === "-1") {
                line.style["border-color"] = "#" + option.containerBorderColor;
            }
            else {
                line.style["border-color"] = "#" + option.itemRowBorderColor;
            }
            line.style["border-width"] = 0;
            line.style["border-top-width"] = option.itemRowBorderWidth;
            line.style["margin-top"] = Math.floor(height / 2) - 1;
            line.style["overflow"] = "hidden";
            rowSpace.childNodes.push(line);
        }

        return rowSpace;
    },

    /**
        为container添加item, 以及行距和列距元素 
        @method layoutContainer
        @return {Object} 布局对象
        */
    layoutSpace: function (container, item, option) {
        //行间距元素和列间距元素 
        var columnSpace = this.layoutColumnSpace(option.itemColumnSpace, item.style["height"], option);
        var rowSpace = this.layoutRowSpace(container.style["width"], option.itemRowSpace, option);
        //组织container 
        var rowIndex, columnIndex;
        for (rowIndex = 0;
        rowIndex < option.adRowCount;
        rowIndex++) {
            for (columnIndex = 0;
            columnIndex < option.adColumnCount;
            columnIndex++) {
                container.childNodes.push(item);
                //非最后一列, 添加列间距元素 
                if (columnIndex != option.adColumnCount - 1) {
                    container.childNodes.push(columnSpace);
                }
            }
            //非最后一行, 添加行间距元素 
            if (rowIndex != option.adRowCount - 1) {
                container.childNodes.push(rowSpace);
            }
        }
        return container;
    },

    calculateLogo: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.height = parentHeight > 64 ? 64 : parentHeight;
        result.width = result.height + option.logoPaddingLeft + option.logoPaddingRight;
        return result;
    },
    calculateImage: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.height = parentHeight;
        result.width = parentWidth;
        return result;
    },
    calculateFlash: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.height = parentHeight;
        result.width = parentWidth;
        return result;
    },
    calculateTitle: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.width = option.titleWidth !== -1 ? option.titleWidth : parentWidth - option.titleFrontIconWidth;
        var titleLineHeight = this.calculateTitleLineHeight(option);
        var defaultTitleRowCount = 1;
        if ((parentHeight > 60 && parentWidth <= 120) || (parentHeight > 110 && parentWidth <= 180)) {
            defaultTitleRowCount = 2;
        }
        var titleRowCount = option.titleRowCount > 0 ? option.titleRowCount : defaultTitleRowCount;
        result.height = titleLineHeight * titleRowCount + option.titlePaddingTop + option.titlePaddingBottom;
        return result;
    },
    calculateUrl: function (parentWidth, parentHeight, option) {
        var result = {
            height: 0,
            width: 0
        };
        result.width = parentWidth;
        var urlLineHeight = this.calculateUrlLineHeight(option);
        var urlRowCount = option.urlRowCount > 0 ? option.urlRowCount : 1;
        result.height = urlLineHeight * urlRowCount + option.urlPaddingTop + option.urlPaddingBottom;
        return result;
    },
    calculateTitleRowCount: function (outerHeight, option) {
        var result;
        var titleLineHeight = this.calculateTitleLineHeight(option);
        //预留的高度足够时, 最多显示两行title
        result = Math.floor((outerHeight - option.titlePaddingTop - option.titlePaddingBottom) / titleLineHeight);
        result = result >= 2 ? 2 : result;
        return result;
    },
    calculateDescRowCount: function (outerHeight, option) {
        var result;
        var descLineHeight = this.calculateDescLineHeight(option);
        result = Math.floor((outerHeight - option.descPaddingTop - option.descPaddingBottom) / descLineHeight);
        //最大行数为4
        result = result > 4 ? 4 : result;
        return result;
    },
    calculateTitleLineHeight: function (option) {
        var result = option.titleLineHeight > 0 ? option.titleLineHeight : option.titleFontSize + 2;
        return result;
    },
    calculateDescLineHeight: function (option) {
        var result = option.descLineHeight > 0 ? option.descLineHeight : option.descFontSize + 2;
        return result;
    },
    calculateUrlLineHeight: function (option) {
        var result = option.urlLineHeight > 0 ? option.urlLineHeight : option.urlFontSize + 2;
        return result;
    }
});