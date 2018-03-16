/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'flash',
    namespace: 'TemplateServer.Template',
    deps: {
        string: 'rs.common.utility.string'
    },
    /* eslint-disable max-len */
    flashIETemplate: '<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="{{flashid}}"' + ' codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"' + ' border="0" width="{{width}}" height="{{height}}">' + '<param name="quality" value="high">' + '<param name="wmode" value="opaque">' + '<param name="menu" value="false">' + '<param name="movie" value="{{url}}">' + '<param name="FlashVars" value="{{flashvars}}">' + '<param name="scale" value="{{scale}}">' + '<param name="AllowFullScreen" value="{{allowfullscreen}}">' + '<param name="AllowScriptAccess" value="{{allowscriptaccess}}">' + '<param name="AllowNetworking" value="{{allownetworking}}">' + '</object>',
    flashNormalTemplate: '<embed pluginspage="//www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"' + 'wmode="opaque" quality="High"' + 'name="{{flashid}}" src="{{url}}"' + 'width="{{width}}" height="{{height}}"' + 'scale="{{scale}}"' + 'allowfullscreen="{{allowfullscreen}}" ' + 'allowscriptaccess="{{allowscriptaccess}}"' + 'allownetworking="{{allownetworking}}"' + 'flashvars="{{flashvars}}">' + '</embed>',
    /* eslint-enable max-len */
    getFlashHtml: function (option) {
        option.browser = option.browser || 'chrome';
        option.id = option.id || 'flash' + parseInt(Math.random() * 10000, 10);
        option.flashvars = option.flashvars || '';
        option.scale = option.scale || 'exactfit';
        option.allowFullScreen = option.allowFullScreen || 'false';
        option.allowScriptAccess = option.allowScriptAccess || 'never';
        option.allowNetworking = option.allowNetworking || 'internal';
        option.url = option.url || '';
        option.width = option.width || 960;
        option.height = option.height || 90;
        /* eslint-disable max-len */
        var flashTemplate = (option.browser && option.browser.type === 'ie' && option.browser.version < 9) ? this.flashIETemplate : this.flashNormalTemplate;
        /* eslint-enable max-len */
        var result = this.string.template(flashTemplate, option);
        return result;
    }
});
