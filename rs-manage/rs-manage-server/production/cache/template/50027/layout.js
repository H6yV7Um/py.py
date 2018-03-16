/**
 * @file tuwen_app_download_6_5
 * @author
 */
/* global oojs */
oojs.define({
    name: '50027',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据
    templateRegex: new RegExp('{([^}]*)}', 'g'),

    defaultValue: {
        logoType: 'bd-logo4',
        containerBorderTop: 1,
        containerBorderRight: 1,
        containerBorderBottom: 1,
        containerBorderLeft: 1,
        containerBorderColor: 'd9d9d9',
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 1;
        var style = {};
        var engine = this.basic;

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 移动广告占满整个广告位
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;

        // 计算组件尺寸
        var dowHeight = Math.round(((90 + 25) / 500) * itemHeight);
        var graHeight = Math.round((256 / 500) * itemHeight) - dowHeight;
        var titHeight = Math.round(((90 + 50) / 500) * itemHeight);
        var logHeight = titHeight;
        var decHeight = itemHeight - titHeight - graHeight - dowHeight;
        var decWidth = itemWidth;
        var graWidth = itemWidth;
        var dowWidth = itemWidth;
        var logWidth = Math.round(((90 + 25) / 600) * itemWidth);
        var titWidth = itemWidth - logWidth;

        // 计算一个pt(600 * 500)的像素值
        // var pt = containerWidth / 450;这次设计更改像素密度，pt不再使用
        // 计算一个600*500像素与当前像素比例
        var px = containerWidth / 600;
        // styleConfig用户设置相对像素单位 —— 移动模板以 320px 宽为基准
        var cpx = containerWidth / 320;

        style['a:-webkit-any-link'] = {// chrome浏览器的reset css
            'text-decoration': 'none'
        };
        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        //  全区域可点击
        style['.item a'] = {
            display: 'block',
            width: '100%',
            height: '100%'
        };
        style['.item a:hover'] = {};
        //  横向排列，排除margin padding border干扰
        style['.item .left'] = {
            float: 'left',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            border: 0
        };

        //  广告内容区背景色
        var txtBgColor = userConfig['appDescribeBackgroundColor'] || 'ffffff';
        if (txtBgColor.indexOf(')') < 0) {
            txtBgColor = '#' + txtBgColor;
        }
        style['.item .log'] = {
            width: logWidth,
            height: logHeight,
            'background-color': txtBgColor//  与文字区域保持一致
        };
        var logImgWidth = Math.round(90 * px);
        var logImgHeight = Math.round(90 * px);
        var logTop = Math.round(25 * px);// 与文字区title上部空白保持一致
        var logBottom = logHeight - logTop - logImgHeight;
        var logLeft = logWidth - logImgWidth;
        style['.item .log .con'] = {
            width: logImgWidth,
            height: logImgHeight,
            'margin-top': logTop,
            'margin-bottom': logBottom,
            'margin-left': logLeft
        };
        style['.item .log .con img'] = {
            width: '100%',
            height: '100%'
        };

        //  强调文字
        var emColor = userConfig['heightLightColor'] || 'ffb92f';
        style['.item span em'] = {
            'text-decoration': 'none',
            'font-style': 'normal',
            color: '#' + emColor
        };
        //  文字区域
        var textMargin = Math.round(25 * px);
        style['.item .tit span, .item .dec span'] = {
            float: 'left',
            'text-align': 'left',
            'margin-left': textMargin,
            'margin-right': textMargin,
            color: '#999999',
            font: 'normal normal 18px FZLTXHK,\'Microsoft YaHei\''
        };
        style['.item .tit'] = {
            width: titWidth,
            height: titHeight,
            position: 'relative',
            'background-color': txtBgColor
        };
        //  title字体尺寸颜色定义
        var titleFontSize = userConfig['titleFontSize'] && Number(userConfig['titleFontSize'])
        ? Math.round(Number(userConfig['titleFontSize']) * cpx) : Math.round(44 * px);
        var titleLineHeight = Math.round(1.05 * titleFontSize);
        style['.item .tit span.title'] = {
            'margin-left': Math.round(14 * px),
            width: titWidth - textMargin - Math.round(14 * px),
            'font-size': titleFontSize,
            'line-height': titleLineHeight,
            height: 2 * titleLineHeight,
            'padding-top': Math.round(25 * px - px),
            overflow: 'hidden'
        };
        userConfig['titleFontColor'] && (style['.item .tit span.title']['color']
            = '#' + userConfig['titleFontColor']);
        userConfig['titleFontFamily'] && (style['.item .tit span.title']['font-family']
            = userConfig['titleFontFamily']);
        style['.item .dec'] = {
            width: decWidth,
            height: decHeight,
            position: 'relative',
            'background-color': txtBgColor
        };
        //  desc字体尺寸颜色定义
        var descFontSize = userConfig['descFontSize'] && Number(userConfig['descFontSize'])
        ? Math.round(Number(userConfig['descFontSize']) * cpx) : Math.round(30 * px);
        var descLineHeight = Math.round(descFontSize * 1.25);
        style['.item .dec span.desc'] = {
            width: decWidth - textMargin * 2,
            overflow: 'hidden',
            'font-size': descFontSize,
            'line-height': descLineHeight,
            height: 2 * descLineHeight
        };
        userConfig['descFontColor'] && (style['.item .dec span.desc']['color']
            = '#' + userConfig['descFontColor']);
        userConfig['descFontFamily'] && (style['.item .dec span.desc']['font-family']
            = userConfig['descFontFamily']);

        //  应用信息区背景色
        var graBgColor = userConfig['appInfoBackgroundColor'] || 'eaeaea';
        if (graBgColor.indexOf(')') < 0) {
            graBgColor = '#' + graBgColor;
        }
        style['.item .greybg'] = {
            width: itemWidth,
            height: graHeight + dowHeight,
            position: 'relative',
            'background-color': graBgColor
        };

        style['.item .gra'] = {
            width: graWidth,
            height: graHeight,
            position: 'relative'
        };
        // 评级内容布局
        var pxT = Math.round(20 * px);
        var pxE = Math.round(85 * px);
        var conWidth = graWidth - 2 * pxE;
        var conHeight = graHeight - pxT;
        var conBgWidth = Math.round(240 * px);
        var conBgHeight = Math.round(21 * px);
        style['.item .gra .con'] = {
            width: conWidth,
            height: conHeight,
            'margin-left': pxE,
            'margin-right': pxE,
            'margin-top': pxT
        };
        // 评级区文字
        var graFontSize = userConfig['appInfoFontSize'] && Number(userConfig['appInfoFontSize'])
        ? Math.round(Number(userConfig['appInfoFontSize']) * cpx) : Math.round(24 * px);
        var graFontColor = userConfig['appInfoFontColor'] || '999999';
        var graFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appInfoFontFamily'] && (graFontFamily = userConfig['appInfoFontFamily'] + ',' + graFontFamily);
        style['.item .gra .con span'] = {
            'text-align': 'center',
            'white-space': 'nowrap',
            overflow: 'hidden',
            float: 'left',
            color: '#' + graFontColor,
            width: conWidth,
            font: 'normal normal ' + graFontSize + 'px/' + 1.5 * graFontSize + 'px ' + graFontFamily
        };
        style['.item .gra .con span.line1'] = {
            'text-align': 'left',
            'width': Math.round(220 * px)
        };
        style['.item .gra .con span.line2'] = {
            'text-align': 'right',
            'width': conWidth - Math.round(220 * px) - Math.round(130 * px)
        };
        style['.item .gra .con .graicon'] = {
            'width': Math.round(120 * px),
            'height': 1.5 * graFontSize,
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/grade.png) no-repeat bottom left',
            'background-size': conBgWidth + 'px ' + conBgHeight + 'px'
        };

        style['.item .dow'] = {
            width: dowWidth,
            height: dowHeight,
            position: 'relative'
        };
        var btnMargin = Math.round(172 * px);
        var btnWidth = dowWidth - 2 * btnMargin;
        var btnHeight = Math.round(90 * px);
        //  下载按钮
        var dowBgColor = userConfig['appDownloadBackgroundColor'] || 'ebac51';
        if (dowBgColor.indexOf(')') < 0) {
            dowBgColor = '#' + dowBgColor;
        }
        style['.item .dow .dowbtn'] = {
            'width': btnWidth,
            'height': btnHeight,
            'margin-left': btnMargin,
            'margin-right': btnMargin,
            'position': 'relative',
            'background': dowBgColor + ' url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/download.png) no-repeat top left',
            'background-size': '48% 133%'
        };
        //  “免费下载”文字
        var dowFontSize = userConfig['appDownloadFontSize'] && Number(userConfig['appDownloadFontSize'])
        ? Math.round(Number(userConfig['appDownloadFontSize']) * cpx) : Math.round(28.93 * px);
        var dowFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appDownloadFontFamily'] && (dowFontFamily
            = userConfig['appDownloadFontFamily'] + ',' + dowFontFamily);
        style['.item .dow .dowbtn span'] = {
            float: 'right',
            'text-align': 'center',
            'text-shadow': '1px 1px 1px rgba(0,0,0,0.38)',
            width: Math.round(165 * px),
            color: '#ffffff',
            font: 'normal normal ' + dowFontSize + 'px/' + btnHeight + 'px ' + dowFontFamily
        };


        // 生成广告layout对象
        // container
        // 建立layoutObj，以container作为Root
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;

        // 检索出的广告数
        var adCount = ads.length;

        for (var i = 0; i < adCount; i++) {
            // item
            var adIndex = i;
            var ad = ads[i];
            var ext = {};
            if (ad.wapAppInfo) {
                ext = JSON.parse(ad.wapAppInfo);
            }
            // 下载类扩展字段
            ext.appinfo = ext.appinfo || {};
            // app探测相关
            var deteConf = ext.appinfo.deteConf || {};
            var appData = ext.appinfo.appData || {};
            var item = engine.getLayout(fullConfig);
            item.class = 'item';

            // item内domLink属性
            var createDomLink = function () {
                return {
                    style: {},
                    childNodes: [],
                    title: ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '',
                    href: ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '',
                    tagName: 'a',
                    //  解决下载链接打开appstore问题 target : '_blank',
                    //  为了性能逐条属性写入
                    timeInterval: deteConf.timeInterval || '',
                    checkCount: deteConf.checkCount || '',
                    expiredTime: deteConf.expiredTime || '',
                    maxDetectTimes: deteConf.maxDetectTimes || '',
                    appkey: appData.appkey || '',
                    sk: appData.sk || ''
                };
            };

            // 图文物料左侧logo
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'div';
            logoImg.class = 'log left';
            var logA = createDomLink();
            logA['data-adtype'] = act;
            logA.id = 'log' + i;
            var logContent = engine.getLayout(fullConfig);
            logContent.tagName = 'div';
            logContent.class = 'con';
            var log = engine.getLayout(fullConfig);
            log.tagName = 'img';
            log.src = ad.iconFileSrc[0];

            // title与desc
            var title = engine.getLayout(fullConfig);
            title.tagName = 'div';
            title.class = 'tit left';
            var titA = createDomLink();
            titA['data-adtype'] = act;
            titA.id = 'tit' + i;
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.class = 'title';
            titleText.innerHTML = this.emphasize(ad.textTitle[0]);
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'div';
            desc.class = 'dec left';
            var decA = createDomLink();
            decA['data-adtype'] = act;
            decA.id = 'dec' + i;
            var descText = engine.getLayout(fullConfig);
            descText.tagName = 'span';
            descText.class = 'desc';
            descText.innerHTML = this.emphasize(ad.textDesc1[0] + ad.textDesc2[0]);

            // 灰色背景
            var grey = engine.getLayout(fullConfig);
            grey.tagName = 'div';
            grey.class = 'greybg left';
            var greyA = createDomLink();
            greyA['data-adtype'] = act;
            greyA.id = 'gre' + i;

            // 秋实下载类广告 文字 图文 模板应用评定
            var grade = engine.getLayout(fullConfig);
            grade.tagName = 'div';
            grade.class = 'gra left';
            // 应用评定内容模块
            var graContent = engine.getLayout(fullConfig);
            graContent.tagName = 'div';
            graContent.class = 'con';
            // 应用名称、介绍
            var appName = ext.appinfo.name || '';
            var nameText = engine.getLayout(fullConfig);
            nameText.tagName = 'span';
            nameText.innerHTML = '\u540d\u79f0\uff1a' + this.emphasize(appName);
            var appDesc = ext.appinfo.appDesc || '';
            var appDescText = engine.getLayout(fullConfig);
            appDescText.tagName = 'span';
            appDescText.innerHTML = '\u4ecb\u7ecd\uff1a' + this.emphasize(appDesc);
            // 应用大小
            var size = ext.appinfo.size || 0;
            var sizeText = engine.getLayout(fullConfig);
            sizeText.tagName = 'span';
            sizeText.class = 'line1';
            sizeText.innerHTML = '\u5927\u5c0f\uff1a' + parseInt(size, 10) + 'MB';
            var rank = ext.appinfo.rank || 0;
            rank = Math.min(100, rank);
            rank = Math.max(0, rank);
            rank = Math.round(rank / 20);
            var graText = engine.getLayout(fullConfig);
            graText.tagName = 'span';
            graText.class = 'line2';
            // '星级：'
            graText.innerHTML = '\u661f\u7ea7\uff1a';
            // 星级评定样式
            var graIcon = engine.getLayout(fullConfig);
            graIcon.tagName = 'span';
            graIcon.class = 'graicon';
            style['.item .greybg #' + greyA.id + ' .gra .con .graicon'] = {
                'background-position': ((5 - rank) * 20) + '% 50%'// 86%是计算后转化为%单位
            };

            // 秋实下载类广告模板右侧统一下载图标
            var download = engine.getLayout(fullConfig);
            download.tagName = 'div';
            download.class = 'dow left';
            var dowButton = engine.getLayout(fullConfig);
            dowButton.tabName = 'div';
            dowButton.class = 'dowbtn';
            var dowText = engine.getLayout(fullConfig);
            dowText.tagName = 'span';
            dowText.innerHTML = '\u514d\u8d39\u4e0b\u8f7d';// 免费下载

            // 组装layoutObj
            item.childNodes.push(logoImg, title, desc, grey);
            // 组装logo图片
            logoImg.childNodes.push(logA);
            logA.childNodes.push(logContent);
            logContent.childNodes.push(log);
            // 组装text
            title.childNodes.push(titA);
            titA.childNodes.push(titleText);
            desc.childNodes.push(decA);
            decA.childNodes.push(descText);
            // 组装grade
            grade.childNodes.push(graContent);
            graContent.childNodes.push(nameText, appDescText, sizeText, graText, graIcon);
            // 组装download
            download.childNodes.push(dowButton);
            dowButton.childNodes.push(dowText);
            //
            grey.childNodes.push(greyA);
            greyA.childNodes.push(grade, download);

            items.push(item);
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },

    emphasize: function (text) {
        var result = String(text).replace(this.templateRegex, function (match, subMatch, index, s) {
            return '<em>' + subMatch + '</em>';
        });
        this.templateRegex.lastIndex = 0;
        return result;
    }
});