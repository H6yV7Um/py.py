/**
 * @file tuwen_mobile_screen
 */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_app_icon_download',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据
    templateRegex: new RegExp('{([^}]*)}', 'g'),

    defaultValue: {
        logoType: 'bd-logo4',
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },

    /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        var engine = this.basic;
        var adCount = ads.length;
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        style['a:-webkit-any-link'] = {// chrome浏览器的reset css
            'text-decoration': 'none'
        };
        style['.container'] = containerStyle;
        style['div'] =  {
            'overflow': 'hidden'
        };

        var pt = containerWidth / 320;
        // 移动广告占满整个广告位
        var firstItemPaddingLeft = 2;
        if(adCount>3){
            var firstItemPaddingLeft = 7;
            var itemWidth = (containerWidth-7*adCount)/2.5;//每行展示3个广告，添加5px的paddingLeft
            containerStyle.width =(itemWidth+7)*adCount;
        }else{
            var itemWidth = (containerWidth-7*2-2)/3;//每行展示3个广告，添加5px的paddingLeft
        }
        var itemHeight = containerHeight;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight,
            'padding-left':'7px',
            'float':'left'
        };
        style['.itemFirst'] = {
            'padding-left':firstItemPaddingLeft
        };
        //  全区域可点击
        style['.item a'] = {
            display: 'block',
            width: '100%',
            height: '100%'
        };
        style['.item a:hover'] = {};

        // log区域
        var logWidth = Math.round(40*pt);//以320为基础来算logWidth
        var logHeight = logWidth;
        var logTop = (itemHeight-logHeight)/2;
        style['.item .logImg'] = {
            width: logWidth,
            height: logHeight,
            'padding-top':logTop,
            'float':'left'
        };
        // content区域
        var contentPaddingLeft = adCount>3?6:3;
        var contentWidth = itemWidth - logWidth -contentPaddingLeft;
        var contentHeight = logHeight;
        style['.content'] = {
            width: contentWidth,
            height: contentHeight,
            'padding-top':logTop,
            'padding-left':contentPaddingLeft+'px',
            'float':'left'
        };
        var titleHeight = 16*pt;
        var titleFontSize = 14*pt;
        var titleColor = userConfig['titleFontColor'] || '#3c3c3c';
        style['.title'] = {
            'text-align': 'left',
            width: '100%',
            'height':titleHeight+'px',
            'line-height':titleHeight+'px',
            color: titleColor,
            'font-size': titleFontSize+'px',
            'text-overflow': 'clip',
            'overflow':'hidden'
        };
        var gradeWidth = Math.round(48 * pt);
        var gradeHeight = Math.round(8 * pt);
        style['.grade'] = {
            width: gradeWidth+'px',
            height: gradeHeight+'px',
            background: 'url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/grade.png) no-repeat bottom left',
            'background-size':gradeWidth*2+'px '+ gradeHeight+'px'
        };
        var buttonHeight = contentHeight - gradeHeight - titleHeight;
        var buttonFontSize = Math.round(12*pt);
        style['.button'] = {
            width: buttonFontSize*4+4+'px',
            height: buttonHeight-4+'px',
            'line-height': buttonHeight-4+'px',
            'margin-top':'2px',
            color: '#71beff',
            'border': '1px solid',
            'border-radius': '3px',
            'text-align':'center',
            'font-size': buttonFontSize+'px'
        };
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     width: Math.round(12 * pt),
        //     height: Math.round(12 * pt),
        //     'background-size': 'contain'
        // };

        // 添加DOM部分
        // 建立layoutObj，以container作为Root
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container'

        // items
        var items = container.childNodes;
        
        // 检索出的广告数
        var adCount = ads.length;
        // console.log(adCount);
        for (var i = 0; i < adCount; i++) {
            var ad=ads[i];
            var ext = {};
            if (ad.extention) {
                ext = JSON.parse(ad.extention);
            }
            ext.appinfo = ext.appinfo || {};
            // 下载类扩展字段
            var item = engine.getLayout(fullConfig);
            item.class = 'item';
            if (i % 3 == 0) {
                item.class = 'item itemFirst';
            }
            // item内domLink属性
            var createDomLink = function(){
                return {
                    style: {},
                    childNodes: [],
                    title : ad.showUrl || '',
                    href : ad.clickUrl,
                    target:'blank',
                    tagName : 'a'
                };
            };

            // item-A
            var logA = createDomLink();
            logA.id = 'item' + i;
            // logo
            var logImg = engine.getLayout(fullConfig);
            logImg.tagName = 'img';
            logImg.class = 'logImg';
            logImg.src = ad.stuffSrc;
            // content
            var content = engine.getLayout(fullConfig);
            content.class = 'content';
            // title
            var title = engine.getLayout(fullConfig);
            title.class = 'title';
            title.innerHTML = ad.title;
            // grade
            var rank = ext.appinfo.rank || 0;
            rank = Math.min(100, rank);
            rank = Math.max(0, rank);
            rank = Math.round(rank / 20);
            var grade = engine.getLayout(fullConfig);
            grade.class = 'grade';
            grade.id = 'grade'+i;
            style['#grade'+i]={
                'background-position': ((5 - rank) * 20) + '% 86%'// 86%是计算后转化为%单位
            }
            // button
            var button = engine.getLayout(fullConfig);
            button.class = 'button';
            button.innerHTML = '免费下载';
            // 组装layoutObj
            item.childNodes.push(logA);
            // 组装logo图片
            logA.childNodes.push(logImg);
            content.childNodes.push(title);
            content.childNodes.push(grade);
            content.childNodes.push(button);
            logA.childNodes.push(content);
            items.push(item);
        }
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        var result = {
            layoutObj: container,
            style: style
        }
        return result;
    }
});