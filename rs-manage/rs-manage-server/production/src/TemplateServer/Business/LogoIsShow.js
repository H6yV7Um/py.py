/**
 * @file feedback content
 */
/* eslint-disable max-len */
/* globals oojs */
oojs.define({
    name: 'LogoIsShow',
    namespace: 'TemplateServer.Business',
    deps: {
        string: 'TemplateServer.Common.Utility.String',
        basic: 'TemplateServer.Template.basic'
    },

    addLogoClkArea: function (layoutObj, styleObj) {
        try {
            var engine = this.basic;
            var logoArea = engine.getLayout();
            logoArea.class = 'logoArea';
            logoArea.id = 'logoArea';
            styleObj['.logoArea'] = {
                'height': '16px',
                'width': '30px',
                'position': 'absolute',
                'bottom': '0px',
                'right': '0px',
                'cursor': 'pointer',
                'z-index': '2147483648'
            };
            layoutObj.childNodes.push(logoArea);
            return {layoutObj: layoutObj, styleObj: styleObj};
        } catch (e) {}
    }
});