oojs.define({
    name: 'layoutEngineProcess',
    namespace: 'rs.business',
    deps: {
        layoutEngineFactory: 'rs.business.layoutEngineFactory',
        layoutEngineCache: 'rs.business.layoutEngineCache',
        htmlRenderEngine: 'rs.business.htmlRenderEngine',
        dataEngine: 'rs.business.dataEngine',
        logoIsShow: 'rs.business.logoIsShow'
    },

    addMonitor: function (layoutObj, ads, isNeedRenderData) {
        if (ads && ads.length > 0) {
            var monitorUrl;
            var monitorBlock = {
                style: {'display': 'none'},
                childNodes: [],
                tagName: 'div'
            };
            for (var i = 0; i < ads.length; i++) {
                if (ads[i].monitorUrl && ads[i].monitorUrl.length) {
                    monitorUrl = isNeedRenderData ? '{{monitorUrl' + i + '}}' : ads[i].monitorUrl;
                    monitorBlock.childNodes.push({
                        src: monitorUrl,
                        style: {'width': '1px', 'height': '1px'},
                        width: '1px',
                        height: '1px',
                        childNodes: [],
                        tagName: 'img'
                    });
                }
            }

            if(monitorBlock && monitorBlock.childNodes && monitorBlock.childNodes.length) {
                if(layoutObj) {
                    layoutObj.childNodes = layoutObj.childNodes || [];
                    layoutObj.childNodes.push(monitorBlock);
                } else {
                    layoutObj = monitorBlock;
                }
            }
        }
        return layoutObj;
    },

    process: function (context, layoutEngine) {
        //处理布局
        var layoutHtml = "";
        var styleString = "";
        var ads = context.requestInfo.adElements;

        //使用Cache, layoutEngine不处理数据
        if (layoutEngine.isNeedLayoutCache && layoutEngine.isNeedRenderData) {
            var result = this.layoutEngineCache.get(context.userConfig);
            //直接从Cache中获取, 否则读取后写入Cache
            if (result) {
                layoutHtml = result.layoutHtml;
                layoutHtml = this.dataEngine.render(layoutHtml, ads);
                styleString = result.styleString;
            }
            else {
                //运行布局引擎, 获取页面布局
                var layoutResult = layoutEngine.render(context);
                var layoutObj = layoutResult.layoutObj;
                var styleObj = layoutResult.style;
                /****************添加广告标识的点击区域******************/
                try {
                    var result = this.logoIsShow.addLogoClkArea(layoutObj, styleObj);
                    layoutObj = result.layoutObj;
                    styleObj = result.styleObj;
                }
                catch (e) {
                }
                /****************添加广告标识的点击区域********end**********/
                // 广告监控URL
                layoutObj = this.addMonitor(layoutObj, ads, true);

                layoutHtml = this.htmlRenderEngine.renderHtml(layoutObj);
                styleString = this.htmlRenderEngine.renderCss(styleObj);
                this.layoutEngineCache.put(context.userConfig, {
                    layoutHtml: layoutHtml,
                    styleString: styleString
                });
                layoutHtml = this.dataEngine.render(layoutHtml, ads);
            }
        }
        else {
            var layoutResult = layoutEngine.render(context);
            var layoutObj = layoutResult.layoutObj;
            var styleObj = layoutResult.style;
            /****************添加广告标识的点击区域******************/
            try {
                var result = this.logoIsShow.addLogoClkArea(layoutObj, styleObj);
                layoutObj = result.layoutObj;
                styleObj = result.styleObj;
            }
            catch (e) {
            }
            /****************添加广告标识的点击区域********end**********/

            // 广告监控URL
            layoutObj = this.addMonitor(layoutObj, ads, layoutEngine.isNeedRenderData);

            layoutHtml = this.htmlRenderEngine.renderHtml(layoutObj);
            styleString = this.htmlRenderEngine.renderCss(styleObj);
            if (layoutEngine.isNeedRenderData) {
                layoutHtml = this.dataEngine.render(layoutHtml, ads);
            }
        }

        return {
            layoutHtml: layoutHtml,
            styleString: styleString
        };
    },

});