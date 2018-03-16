/**
 * @file 10008
 * @author
 */
/* global oojs */
oojs.define({
    name: '10008',
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
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
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
        var dowWidth = Math.round((3 / 20) * itemWidth);
        var graWidth = Math.round((4 / 20) * itemWidth);
        var txtWidth = itemWidth - graWidth - dowWidth;
        var dowHeight = itemHeight;
        var graHeight = itemHeight;
        var txtHeight = itemHeight;

         // 计算一个pt(800 * 120)的像素值
        var pt = containerWidth / 600;
        // 计算一个800*120像素与当前像素比例
        var px = containerWidth / 800;
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

        // 全区域可点击
        style['.item a'] = {
            display: 'block',
            width: '100%',
            height: itemHeight
        };
        style['.item a:hover'] = {};
        // 横向排列，排除margin padding border干扰
        style['.item .row'] = {
            'float': 'left',
            'overflow': 'hidden',
            'margin': 0,
            'padding': 0,
            'border': 0
        };
        // 文字区背景色
        var txtBgColor = userConfig['appDescribeBackgroundColor'] || 'ffffff';
        if (txtBgColor.indexOf(')') < 0) {
            txtBgColor = '#' + txtBgColor;
        }
        style['.item .txt'] = {
            'width': txtWidth,
            'height': txtHeight,
            'position': 'relative',
            'background-color': txtBgColor
        };
        var textLeft = Math.round(25 * px);
        style['.item .txt span'] = {
            'float': 'left',
            'text-align': 'left',
            'margin-left': textLeft,
            'width': txtWidth - textLeft,
            'color': '#999999',
            'font': 'normal normal 18px FZLTXHK,\'Microsoft YaHei\''
        };
        // 强调文字
        var emColor = userConfig['heightLightColor'] || 'ffb92f';
        style['.item .txt span em'] = {
            'text-decoration': 'none',
            'font-style': 'normal',
            'color': '#' + emColor
        };
        // title字体尺寸颜色定义
        var titleFontSize = userConfig['titleFontSize'] && Number(userConfig['titleFontSize']) ? Math.round(Number(userConfig['titleFontSize']) * cpx) : Math.round(24 * pt);
        style['.item .txt span.title'] = {
            'font-size': titleFontSize,
            'line-height': titleFontSize,
            'padding-top': Math.round(15 * px),
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis', // 文字截断
            'overflow': 'hidden'
        };
        userConfig['titleFontColor'] && (style['.item .txt span.title']['color'] = '#' + userConfig['titleFontColor']);
        userConfig['titleFontFamily'] && (style['.item .txt span.title']['font-family'] = userConfig['titleFontFamily']);
        // desc字体尺寸颜色定义
        var descFontSize = userConfig['descFontSize'] && Number(userConfig['descFontSize']) ? Math.round(Number(userConfig['descFontSize']) * cpx) : Math.round(16 * pt);
        var descLineHeight = Math.round(descFontSize * 1.125);
        style['.item .txt span.desc'] = {
            'overflow': 'hidden',
            'font-size': descFontSize,
            'line-height': descLineHeight,
            'height': 2 * descLineHeight,
            'padding-top': Math.round(13 * px - pt)
        };
        userConfig['descFontColor'] && (style['.item .txt span.desc']['color'] = '#' + userConfig['descFontColor']);
        userConfig['descFontFamily'] && (style['.item .txt span.desc']['font-family'] = userConfig['descFontFamily']);

        // 应用信息区背景色
        var graBgColor = userConfig['appInfoBackgroundColor'] || 'eaeaea';
        if (graBgColor.indexOf(')') < 0) {
            graBgColor = '#' + graBgColor;
        }
        style['.item .gra'] = {
            'width': graWidth,
            'height': graHeight,
            'position': 'relative',
            'background-color': graBgColor
        };
        // 评级内容布局
        var conWidth = dowWidth;// 设计宽度与下载图标相同，先这么写。。。
        var conHeight = graHeight;
        var conBgWidth = Math.round(240 * px);
        var conBgHeight = Math.round(21 * px);
        style['.item .gra .con'] = {
            'width': conWidth,
            'height': conHeight,
            'margin': 'auto',
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/grade.png) no-repeat bottom left',
            'background-size': conBgWidth + 'px ' + conBgHeight + 'px'
        };
        // 评级区文字
        var graFontSize = userConfig['appInfoFontSize'] && Number(userConfig['appInfoFontSize']) ? Math.round(Number(userConfig['appInfoFontSize']) * cpx) : Math.round(14 * pt);
        var graFontColor = userConfig['appInfoFontColor'] || '999999';
        var graFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appInfoFontFamily'] && (graFontFamily = userConfig['appInfoFontFamily'] + ',' + graFontFamily);
        style['.item .gra .con span'] = {
            'text-align': 'left',
            'float': 'left',
            'width': '100%',
            'color': '#' + graFontColor,
            'font': 'normal normal ' + graFontSize + 'px/' + graFontSize + 'px ' + graFontFamily
        };
        style['.item .gra .con span.line1'] = {
            'white-space': 'nowrap',
            'line-height': Math.round(38 * px + graFontSize)
        };
        style['.item .gra .con span.line2'] = {
            'line-height': Math.round(8 * px + graFontSize)
        };

        // 下载按钮
        var dowBgColor = userConfig['appDownloadBackgroundColor'] || 'ebac51';
        if (dowBgColor.indexOf(')') < 0) {
            dowBgColor = '#' + dowBgColor;
        }
        style['.item .dow'] = {
            'width': dowWidth,
            'height': dowHeight,
            'position': 'relative',
            'background': dowBgColor + ' url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/download.png) no-repeat top left',
            'background-size': 'contain'
        };
        // “免费下载”文字
        var dowFontSize = userConfig['appDownloadFontSize'] && Number(userConfig['appDownloadFontSize']) ? Math.round(Number(userConfig['appDownloadFontSize']) * cpx) : Math.round(14 * pt);
        var dowFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appDownloadFontFamily'] && (dowFontFamily = userConfig['appDownloadFontFamily'] + ',' + dowFontFamily);
        style['.item .dow span'] = {
            'position': 'absolute',
            'text-align': 'center',
            'text-shadow': '1px 1px 1px rgba(0,0,0,0.38)',
            'width': '100%',
            'color': '#ffffff',
            'font': 'normal normal ' + dowFontSize + 'px/' + dowFontSize + 'px ' + dowFontFamily,
            'bottom': Math.round(14 * px) + 'px'
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
                    href: ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink,
                    tagName: 'a',
                    // 解决下载链接打开appstore问题 target : '_blank',
                    // 为了性能逐条属性写入
                    timeInterval: deteConf.timeInterval || '',
                    checkCount: deteConf.checkCount || '',
                    expiredTime: deteConf.expiredTime || '',
                    maxDetectTimes: deteConf.maxDetectTimes || '',
                    appkey: appData.appkey || '',
                    sk: appData.sk || ''
                };
            };

            // title与desc
            var text = engine.getLayout(fullConfig);
            text.tagName = 'div';
            text.class = 'txt row';
            var txtA = createDomLink();
            txtA.id = 'txt' + i;
            txtA['data-adtype'] = act;
            var title = engine.getLayout(fullConfig);
            title.tagName = 'span';
            title.class = 'title';
            title.innerHTML = this.emphasize(ad.textTitle[0]);
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'span';
            desc.class = 'desc';
            var descText =  ad.textDesc1[0] + ad.textDesc2[0];
            desc.innerHTML = this.emphasize(descText);
            // 秋实下载类广告 文字 图文 模板应用评定
            var grade = engine.getLayout(fullConfig);
            grade.tagName = 'div';
            grade.class = 'gra row';
            var graA = createDomLink(fullConfig);
            graA['data-adtype'] = act;
            graA.id = 'gra' + i;
            // 应用评定内容模块
            var graContent = engine.getLayout(fullConfig);
            graContent.tagName = 'div';
            graContent.class = 'con';
            // 应用大小
            var size = ext.appinfo.appSize || 0;
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
            graText.innerHTML = '\u661f\u7ea7\uff1a'; // '星级：'
            // 星级评定样式
            style['.item .gra #' + graA.id + ' .con'] = {
                'background-position': ((5 - rank) * 20) + '% 86%'// 86%是计算后转化为%单位
            };

            // 秋实下载类广告模板右侧统一下载图标
            var download = engine.getLayout(fullConfig);
            download.tagName = 'div';
            download.class = 'dow row';
            var dowA = createDomLink(fullConfig);
            dowA['data-adtype'] = act;
            dowA.id = 'dow' + i;
            var dowText = engine.getLayout(fullConfig);
            dowText.tagName = 'span';
            dowText.innerHTML = '\u514d\u8d39\u4e0b\u8f7d';// 免费下载

            // 组装layoutObj
            item.childNodes.push(text, grade, download);
            // 组装imgLayout
            text.childNodes.push(txtA);
            txtA.childNodes.push(title, desc);
            // txtA.childNodes.push(title);
            // 组装grade
            grade.childNodes.push(graA);
            graA.childNodes.push(graContent);
            graContent.childNodes.push(sizeText, graText);
            // 组装download
            download.childNodes.push(dowA);
            dowA.childNodes.push(dowText);

            items.push(item);
        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },

    /**
        工具函数，强调通配符{}引用的字符
        @method emphasize
        @return {string}
     */
    emphasize: function (text) {
        var result = String(text).replace(this.templateRegex, function (match, subMatch, index, s) {
            return '<em>' + subMatch + '</em>';
        });
        this.templateRegex.lastIndex = 0;
        return result;
    }
});