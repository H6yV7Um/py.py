/**
 * @file image_base_dspauto template page event
 */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_base_dspauto',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if (antiArray) {
            this.anti.check('container', antiArray);
        }
    }
});