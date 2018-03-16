/**
 * @file rs.business.promotion
 */
/* globals oojs */
oojs.define({
    name: 'promotion',
    namespace: 'rs.business',
    deps: {},
    getPromotion: function (option) {
        var promotionType = option.promotionType || 'bd-promotion';
        var promotion = {
            'tagName': 'div',
            'class': promotionType,
            'innerHTML': '&nbsp;'
        };
        return promotion;
    }
});









