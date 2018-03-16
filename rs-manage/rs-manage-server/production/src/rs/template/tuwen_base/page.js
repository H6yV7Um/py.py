/**
 * @file tuwen_base template page event
 * @author qianxiaoli
 */
/* eslint-disable max-len */
/* globals oojs */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_base',
    deps: {},
    // Sdk js 接口
    sdk: {},
    // 广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            /* globals winUrlArr */
            for (var i = 0, len = winUrlArr.length; i < len; i++) {
                for (var j = 0, lenWinCur = winUrlArr[i].length; j < lenWinCur; j++) {
                    var imageWin = new Image();
                    imageWin.src = winUrlArr[i][j];
                    imageWin.onload = imageWin.onerror = function () {};
                }
            }
        } catch (e) {}
    }
});
