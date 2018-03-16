/**
 * @file tuwen_mobile_screen
 */
oojs.define({
    name: 'page',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if(antiArray){
            this.anti.check('container', antiArray);
        }
    }
});