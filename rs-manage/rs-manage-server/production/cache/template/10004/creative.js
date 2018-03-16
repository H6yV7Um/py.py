/**
 * @file 10004
 * @author fanwenjuan@baidu.com
 */
/* globals oojs */
oojs.define({
    name: '10004Creative',
    namespace: '',
    searchCreative: function (size) {
        var result = [];
        var creativeType = 0;
        var width = size.width;
        var height = size.height;
        var count = 1;
        if (width < 250) {
            count =  0;
        } else if (460 > width && width >= 250) {
            if (height < 260) {
                count =  Math.round(height / 28);
            }else {
                count =  Math.round(height / 32);
            }
        } else if (728 > width && width >= 360) {
            count =  Math.round(height / 28) * 2;
        } else {
            count = Math.round(height / 28) * 3;
        }
        var creativeRequired = {
            creativeType: creativeType,
            count: count
        };
        result.push(creativeRequired);
        return result;
    }
});