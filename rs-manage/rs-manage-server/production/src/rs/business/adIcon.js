/**
 * @file rs.business.adIcon
 * @author yuxinxiao
 * 为应对广告法添加广告标识
 */
/* globals oojs */
oojs.define({
    name: 'adIcon',
    namespace: 'rs.business',
    deps: {},
    getAdIcon: function (option) {
        // option.adIconType为0出移动样式
        // option.adIconType为1出PC样式
        // option.adIconType为'feed-adIcon'出信息流样式
        if (option.adIconType === 'feed-adIcon') {
            var adIconType =  'feed-adIcon';
        } else {
            option.adIconType = option.adIconType || 0;
            if (option.adIconType === 1) {
                var adIconType =  'bd-adIcon';
            } else {
                var adIconType = 'mob-bd-adIcon';
            }
        }
        var adIcon = {
            'tagName': 'div',
            'class': adIconType,
            'innerHTML': '&nbsp;'
        };
        return adIcon;
    }
});









