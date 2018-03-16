oojs.define({
    name: 'page',
    namespace: 'rs.template.image-basic',
    deps: {},
    $page: function () {
        var antiArray = window.antiArray;
        if(antiArray){
            this.anti.check('container', antiArray);
        }
    }
});