oojs.define({
    name: 'page',
    namespace: 'rs.template.text_mobile',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if(antiArray){
            this.anti.check('container', antiArray);
        }
    }
});