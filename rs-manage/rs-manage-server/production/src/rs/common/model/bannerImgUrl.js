/* global oojs */
/**
* @file base64ImgUrl
* @author fanwenjuan
*/
/* eslint-env javascirpt */
/* eslint-disable no-console */
oojs.define({
    name: 'bannerImgUrl',
    namespace: 'rs.common.model',
    dataUrlEnum: {
        lp: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/lp.png',
        dl: '{{dupDomain}}/adserv/img/click_ivn_4.gif',
        tel: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tel.png',
        sms: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/sms.png',
        map: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/lp.png'
    },
    get: function (act) {
        var act = act || 1;
        var result = '';
        if (act === 1) {
            result = this.dataUrlEnum['lp'];
        } else if (act === 2) {
            result = this.dataUrlEnum['dl'];
        } else if (act === 4) {
            result = this.dataUrlEnum['map'];
        } else if (act === 8) {
            result = this.dataUrlEnum['sms'];
        } else if (act === 32) {
            result = this.dataUrlEnum['tel'];
        }
        return result;
    }
});