/**
 * @file 10005
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: '10005Creative',
    namespace: '',
    searchCreative: function (size) {
        var result = [];
        var creativeType = 0;
        var width = size.width;
        var height = size.height;
        var scale = width / height;
        var count = 2;
        if (scale < 7 && scale > 5) {
            count = 2;
        }
        else if (scale <= 5 && scale > 4) {
            count = 3;
        }
        else if (scale <= 4 && scale >= 3) {
            count = 4;
        }
        else if (scale < 3 && scale > 2.5) {
            count = 5;
        }
        else {
            count = 6;
        }
        var creativeRequired = {
            creativeType: creativeType,
            width: width,
            height: height,
            count: count
        };
        result.push(creativeRequired);
        return result;
    }
});