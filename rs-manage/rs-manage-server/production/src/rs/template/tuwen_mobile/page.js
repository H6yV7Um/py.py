oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_mobile',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if(antiArray){
            this.anti.check('container', antiArray);
        }
    }
});