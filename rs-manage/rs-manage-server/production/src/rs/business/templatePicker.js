oojs.define({
    name: 'templatePicker',
    namespace: 'rs.business',
    deps: {
        templateSize: 'rs.common.model.templateSize'
    },
    $templatePicker: function () {
    },
    supportType: {
        px: {
            px: 1,
            range_px: 1
        },
        scale: {
            scale: 1,
            range_scale: 1
        }
    },
    
    getSizeScope: function (sizeInfo) {
        var size = sizeInfo.split('-');
        return {
            max: Math.max.apply(Math, size),
            min: Math.min.apply(Math, size)
        };
    },
    
    checkSize: function (reqSize, tempSizeInfo) {
        var result = false;

        var reqSizeType = this.templateSize.getReqSizeType(reqSize.sizeType);
        var tempSizeType = this.templateSize.getSizeType(tempSizeInfo.sizeType);
        // 自适应模板支持任意尺寸
        if (tempSizeType === 'auto') {
            return true;
        }
    
        // 支持指定像素和比例选择，未指定全局选择
        if (!reqSizeType || (this.supportType[reqSizeType] && this.supportType[reqSizeType][tempSizeType])) {
            // 像素模板选择
            if (this.supportType.px[tempSizeType]) {
                // 允许计算等误差范围
                var deviation = 1;
                // 模板支持尺寸范围
                var widthScope = this.getSizeScope(tempSizeInfo.width);
                var maxWidth = widthScope.max + deviation;
                var minWidth = widthScope.min - deviation;
                var heightScope = this.getSizeScope(tempSizeInfo.height);
                var maxHeight = heightScope.max + deviation;
                var minHeight = heightScope.min - deviation;
                
                result = ((reqSize.width >= minWidth)
                    && (reqSize.width <= maxWidth)
                    && (reqSize.height >= minHeight)
                    && (reqSize.height <= maxHeight));
            }
            // 比例模板选择
            if (this.supportType.scale[tempSizeType]) {
                var reqScale = reqSize.width / reqSize.height;
                // 允许计算等误差范围
                var deviation = 0.001;
                // 模板支持比例范围
                var widthScope = this.getSizeScope(tempSizeInfo.width);
                var maxWidth = widthScope.max;
                var minWidth = widthScope.min;
                var heightScope = this.getSizeScope(tempSizeInfo.height);
                var maxHeight = heightScope.max;
                var minHeight = heightScope.min;
                var maxScale = (maxWidth / minHeight) + deviation;
                var minScale = (minWidth / maxHeight) - deviation;
                
                result = result || (((reqScale >= minScale) && (reqScale <= maxScale)));
            }
        }
        
        /*reqSize.sizeType = reqSizeType;
        console.log('reqSize: '+JSON.stringify(reqSize));
        console.log('tempSizeInfo: '+JSON.stringify({
            sizeType: tempSizeType,
            width: tempSizeInfo.width,
            height: tempSizeInfo.height
        }));
        console.log('result:'+result);
        console.log('--------------------------');*/
        return result;
    },

    pick: function (tempArray, reqSize) {
    
        var length = tempArray.length;
        for (var i = 0; i < length; i++) {
            if (this.checkSize(reqSize, tempArray[i])) {
                return tempArray[i];
            }
        }
        
        return null;
    }
});