oojs.define({
    name: 'layout',
    namespace: 'rs.template.widget_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
		logo: 'rs.business.logo',
		flash: 'rs.common.utility.flash'
    },
    $layout: function () {},
	isNeedLayoutCache: false, //是否缓存Layout的结果
	isNeedRenderData: false,  //是否需要数据引擎渲染数据
	
	defaultValue:{
		containerBorderTop:0,
		containerBorderRight:0,
		containerBorderBottom:0,
		containerBorderLeft:0,
		containerPaddingTop:0,
		containerPaddingRight:0,
		containerPaddingBottom:0,
		containerPaddingLeft:0
	},
	
    /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
    render: function (option) {
        var userConfig = option.userConfig;
        var fullConfig = option.fullConfig;
        var ads = option.adElements;
		
        var engine = this.basic;
		

		//添加样式部分
		var style = {};
		var containerStyle = engine.getContainerStyle(fullConfig);
		var containerWidth = containerStyle.width;
		var containerHeight = containerStyle.height;
		
		var columnCount = fullConfig.adColumnCount;
		var rowCount = fullConfig.adRowCount;
		
		var itemColumnSpace = fullConfig.itemColumnSpace;
		var itemRowSpace = fullConfig.itemRowSpace;
		
		var itemWidth = (containerWidth-(columnCount-1)*itemColumnSpace)/fullConfig.adColumnCount;
		var itemHeight = (containerHeight-(rowCount-1)*itemRowSpace)/fullConfig.adRowCount;
		
		style[".container"] = containerStyle;
		style[".item"] = {
			width: itemWidth,
			height: itemHeight
		};
		style[".item a"] = {
			width: itemWidth,
			height: itemHeight,
			position: 'absolute',
			opacity: 0,
			top: 0,
			left: 0,
			display: 'block',
			'z-index': '9'	
		};
		style[".item a:hover"] = {};
		style[".item div"] = {				
			width: itemWidth,
			height: itemHeight
		};
		
		style[".column-space"] = {
			width:itemColumnSpace,
			height: "0px"
		};
		style[".row-space"] = {
			width: "100%",
			height: "0px"
		};

        //container
        var container = engine.getLayout(fullConfig);
		container.class = 'container';
		container.id = 'container'		

        //items
        var items = container.childNodes;
        var columnSpace = engine.getLayout(fullConfig);
		columnSpace.class = 'column-space';
        var rowSpace = engine.getLayout(fullConfig);
		columnSpace.class = 'row-space';
        var rowCount = fullConfig.adColumnCount;
        var columnCount = fullConfig.adRowCount;
        for (var i = 0; i < rowCount; i++) {			
            for (var j = 0; j < columnCount; j++) {
				//item
				var adIndex = i*j +j;
				var ad=ads[adIndex]; 			
				var item = engine.getLayout(fullConfig);
				item.class = 'item';
				var flashDiv = engine.getLayout(fullConfig);
				flashDiv.tagName = 'div';
				
				var flashOption = {};
				flashOption.userAgent = option.userAgent;
				flashOption.width = itemWidth;
				flashOption.height = itemHeight;
				flashOption.url = ad.stuffSrc;
				flashOption.browser = option.browser;
				flashDiv.innerHTML = this.flash.getFlashHtml(flashOption);
				

				//填充广告数据
				item.childNodes.push(flashDiv);
                items.push(item);
				
                if (j < columnCount - 1) {
                    items.push(columnSpace);
                }
				else if( i < rowCount - 1){
					items.push(rowSpace);
				}
            }
        }
		

		
		//add logo
		container.childNodes.push( this.logo.getLogo(fullConfig) );
		
		var result = {
			layoutObj: container,
			style: style
		}
        return result;
    }
});