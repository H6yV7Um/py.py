/**
 * @file image_wap_banner_base
 */
 /* globals oojs */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_wap_banner_base',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if (antiArray) {
            this.anti.check('container', antiArray);
        }
    }
});