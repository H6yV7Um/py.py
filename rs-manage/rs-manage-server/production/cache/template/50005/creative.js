/**
 * @file 50005
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: '50005Creative',
    namespace: '',
    searchCreative: function (size) {
        var result = [];
        var creativeType = 4;
        var width = size.width;
        var height = size.height;
        var count = 1;
        var creativeRequired = {
            creativeType: creativeType,
            count: count
        };
        result.push(creativeRequired);
        return result;
    }
});