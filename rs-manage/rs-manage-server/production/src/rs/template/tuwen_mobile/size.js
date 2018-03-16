oojs.define({
    name: 'size',
    namespace: 'rs.template.tuwen_mobile',
    deps: {},
    $size: function () {},
	/**
        根据广告位尺寸计算组件尺寸，调整布局
        @method calculate_20_3
		@param containerWidth Number 广告位宽，单位px
		@param containerHeight Number 广告位高，单位px
        @return {Object} data组件尺寸
        */
    calculate_20_3: function (containerWidth, containerHeight) {
		
		//广告相对像素
		//以广告宽840px作为参照
		var px = containerWidth / 840;
		
		//广告位比例20.3时组件尺寸
		var result = {
			itemWidth: containerWidth,
			itemHeight: containerHeight,
			logoWidth: Math.round(110 * px),
			logoHeight: Math.round(110 * px),
			logoPadding: 0,
			titleFontSize: Math.round(52 * px),
			titleLineHeight: Math.round(70 * px),
			titleRowCount: 1,
			titleWidth: 0,
			titleHeight: 0,
			titleFontColor: '#003399',
			descFontSize: Math.round(40 * px),
			descLineHeight: Math.round(46 * px),
			descRowCount: 1,
			descWidth: 0,
			descHeight: 0,
			descFontColor: '#999999',
			descPaddingTop: 0
		};
		
		//动态计算部分属性
		result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
		result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
		result.titleHeight = result.titleLineHeight * result.titleRowCount;
		result.descWidth = result.titleWidth;
		result.descHeight = result.descLineHeight * result.descRowCount;
		
		return result;
	},
	/**
        根据广告位尺寸计算组件尺寸，调整布局
        @method calculate_20_5
		@param containerWidth Number 广告位宽，单位px
		@param containerHeight Number 广告位高，单位px
        @return {Object} data组件尺寸
        */
    calculate_20_5: function (containerWidth, containerHeight) {
		
		//广告相对像素
		//以广告宽840px作为参照
		var px = containerWidth / 840;
		
		//广告位比例20.3时组件尺寸
		var result = {
			itemWidth: containerWidth,
			itemHeight: containerHeight,
			logoWidth: Math.round(188 * px),
			logoHeight: Math.round(188 * px),
			logoPadding: 0,
			titleFontSize: Math.round(50 * px),
			titleLineHeight: Math.round(72 * px),
			titleRowCount: 1,
			titleWidth: 0,
			titleHeight: 0,
			titleFontColor: '#003399',
			descFontSize: Math.round(38 * px),
			descLineHeight: Math.round(48 * px),
			descRowCount: 2,
			descWidth: 0,
			descHeight: 0,
			descFontColor: '#999999',
			descPaddingTop: Math.round(10 * px)
		};
		
		//动态计算部分属性
		result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
		result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
		result.titleHeight = result.titleLineHeight * result.titleRowCount;
		result.descWidth = result.titleWidth;
		result.descHeight = result.descLineHeight * result.descRowCount;
		
		return result;
	},
	/**
        根据广告位尺寸计算组件尺寸，调整布局
        @method calculate_6_5
		@param containerWidth Number 广告位宽，单位px
		@param containerHeight Number 广告位高，单位px
        @return {Object} data组件尺寸
        */
    calculate_6_5: function (containerWidth, containerHeight) {
		
		//广告相对像素
		//以广告宽840px作为参照
		var px = containerWidth / 840;
		
		//广告位比例20.3时组件尺寸
		var result = {
			itemWidth: Math.round(600 * px),
			itemHeight: Math.round(310 * px),
			logoWidth: Math.round(144 * px),
			logoHeight: Math.round(144 * px),
			logoPadding: 0,
			titleFontSize: Math.round(50 * px),
			titleLineHeight: Math.round(72 * px),
			titleRowCount: 2,
			titleWidth: 0,
			titleHeight: 0,
			titleFontColor: '#003399',
			descFontSize: Math.round(38 * px),
			descLineHeight: Math.round(48 * px),
			descRowCount: 3,
			descWidth: 0,
			descHeight: 0,
			descFontColor: '#999999',
			descPaddingTop: Math.round(15 * px)
		};
		
		//动态计算部分属性
		result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
		result.titleHeight = result.titleLineHeight * result.titleRowCount;
		result.descWidth = result.itemWidth;
		result.descHeight = result.descLineHeight * result.descRowCount;
		
		return result;
	}
});