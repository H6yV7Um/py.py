/**
 * @file 50008
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: '50008',
    namespace: '',
    searchCreative: function (size) {
        var result = [];
        var creativeType = 4;
        var width = size.width;
        var height = size.height;
        var creativeRequired = {
            creativeType: creativeType,
            width: width,
            height: height,
            count: 1
        };
        result.push(creativeRequired);
        return result;
    }
});