/**
 * @file tuwen_mobile_screen
 */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_mobile_screen',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,
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

    /**
     * 布局, 生成布局对象
     *
     * @method layout
     * @param {Object} context 环境对象
     * @return {Object} layoutObject布局对象
     */
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

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

        // chrome浏览器的reset css
        style['a:-webkit-any-link'] = {
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
            height: '100%'
        };
        style['.item a:hover'] = {};
        // 横向排列，排除margin padding border干扰
        style['.item .left'] = {
            'float': 'left',
            'overflow': 'hidden',
            'margin': 0,
            'padding': 0,
            'border': 0
        };

        // 广告内容区背景色
        var txtBgColor = userConfig['appDescribeBackgroundColor'] || 'ffffff';
        if (txtBgColor.indexOf(')') < 0) {
            txtBgColor = '#' + txtBgColor;
        }
        style['.item .log'] = {
            'width': logWidth,
            'height': logHeight,
            // 与文字区域保持一致
            'background-color': txtBgColor
        };
        var logImgWidth = Math.round(90 * px);
        var logImgHeight = Math.round(90 * px);
        // 与文字区title上部空白保持一致
        var logTop = Math.round(25 * px);
        var logBottom = logHeight - logTop - logImgHeight;
        var logLeft = logWidth - logImgWidth;
        style['.item .log .con'] = {
            'width': logImgWidth,
            'height': logImgHeight,
            'margin-top': logTop,
            'margin-bottom': logBottom,
            'margin-left': logLeft
        };
        style['.item .log .con img'] = {
            width: '100%',
            height: '100%'
        };

        // 强调文字
        var emColor = userConfig['heightLightColor'] || 'ffb92f';
        style['.item span em'] = {
            'text-decoration': 'none',
            'font-style': 'normal',
            'color': '#' + emColor
        };
        // 文字区域
        var textMargin = Math.round(25 * px);
        style['.item .tit span, .item .dec span'] = {
            'float': 'left',
            'text-align': 'left',
            'margin-left': textMargin,
            'margin-right': textMargin,
            'color': '#999999',
            'font': 'normal normal 18px FZLTXHK,\'Microsoft YaHei\''
        };
        style['.item .tit'] = {
            'width': titWidth,
            'height': titHeight,
            'position': 'relative',
            'background-color': txtBgColor
        };
        // title字体尺寸颜色定义
        var titleFontSize = userConfig['titleFontSize'] && Number(userConfig['titleFontSize']) ?
                Math.round(Number(userConfig['titleFontSize']) * cpx) : Math.round(44 * px);
        var titleLineHeight = Math.round(1.05 * titleFontSize);
        style['.item .tit span.title'] = {
            'margin-left': Math.round(14 * px),
            'width': titWidth - textMargin - Math.round(14 * px),
            'font-size': titleFontSize,
            'line-height': titleLineHeight,
            'height': 2 * titleLineHeight,
            'padding-top': Math.round(25 * px - px),
            'overflow': 'hidden'
        };
        userConfig['titleFontColor'] && (style['.item .tit span.title']['color'] = '#' + userConfig['titleFontColor']);
        userConfig['titleFontFamily']
                && (style['.item .tit span.title']['font-family'] = userConfig['titleFontFamily']);
        style['.item .dec'] = {
            'width': decWidth,
            'height': decHeight,
            'position': 'relative',
            'background-color': txtBgColor
        };
        // desc字体尺寸颜色定义
        var descFontSize = userConfig['descFontSize'] && Number(userConfig['descFontSize']) ?
                Math.round(Number(userConfig['descFontSize']) * cpx) : Math.round(30 * px);
        var descLineHeight = Math.round(descFontSize * 1.25);
        style['.item .dec span.desc'] = {
            'width': decWidth - textMargin * 2,
            'overflow': 'hidden',
            'font-size': descFontSize,
            'line-height': descLineHeight,
            'height': 2 * descLineHeight
        };
        userConfig['descFontColor'] && (style['.item .dec span.desc']['color'] = '#' + userConfig['descFontColor']);
        userConfig['descFontFamily'] && (style['.item .dec span.desc']['font-family'] = userConfig['descFontFamily']);

        // 应用信息区背景色
        var graBgColor = userConfig['appInfoBackgroundColor'] || 'eaeaea';
        if (graBgColor.indexOf(')') < 0) {
            graBgColor = '#' + graBgColor;
        }
        style['.item .greybg'] = {
            'width': itemWidth,
            'height': graHeight + dowHeight,
            'position': 'relative',
            'background-color': graBgColor
        };

        style['.item .gra'] = {
            width: graWidth,
            height: graHeight,
            position: 'relative'
        };
        // 评级内容布局
        var _20px = Math.round(20 * px);
        var _85px = Math.round(85 * px);
        var conWidth = graWidth - 2 * _85px;
        var conHeight = graHeight - _20px;
        var conBgWidth = Math.round(240 * px);
        var conBgHeight = Math.round(21 * px);
        style['.item .gra .con'] = {
            'width': conWidth,
            'height': conHeight,
            'margin-left': _85px,
            'margin-right': _85px,
            'margin-top': _20px
        };
        // 评级区文字
        var graFontSize = userConfig['appInfoFontSize'] && Number(userConfig['appInfoFontSize']) ?
                Math.round(Number(userConfig['appInfoFontSize']) * cpx) : Math.round(24 * px);
        var graFontColor = userConfig['appInfoFontColor'] || '999999';
        var graFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appInfoFontFamily']
                && (graFontFamily = userConfig['appInfoFontFamily'] + ',' + graFontFamily);
        style['.item .gra .con span'] = {
            'text-align': 'center',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'float': 'left',
            'color': '#' + graFontColor,
            'width': conWidth,
            'font': 'normal normal ' + graFontSize + 'px/' + 1.5 * graFontSize + 'px ' + graFontFamily
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
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/grade.png)'
                + ' no-repeat bottom left',
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
        // 下载按钮
        var dowBgColor = userConfig['appDownloadBackgroundColor'] || 'ebac51';
        if (dowBgColor.indexOf(')') < 0) {
            dowBgColor = '#' + dowBgColor;
        }
        style['.item .dow .dowbtn'] = {
            'text-align': 'center',
            'width': btnWidth,
            'height': btnHeight,
            'margin-left': btnMargin,
            'margin-right': btnMargin,
            'position': 'relative',
            'background': dowBgColor
        };
        // “继续访问”文字
        var dowFontSize = userConfig['appDownloadFontSize'] && Number(userConfig['appDownloadFontSize']) ?
                Math.round(Number(userConfig['appDownloadFontSize']) * cpx) : Math.round(28.93 * px);
        var dowFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appDownloadFontFamily']
                && (dowFontFamily = userConfig['appDownloadFontFamily'] + ',' + dowFontFamily);
        style['.item .dow .dowbtn span'] = {
            'text-shadow': '1px 1px 1px rgba(0,0,0,0.38)',
            'color': '#ffffff',
            'font': 'normal normal ' + dowFontSize + 'px/' + btnHeight + 'px ' + dowFontFamily
        };

        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': Math.round(25 * px),
        //     'height': Math.round(25 * px),
        //     'background-size': 'contain'
        // };

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
            try {
                if (ad.extention) {
                    ext = JSON.parse(ad.extention);
                }
            }catch(e) {}
            // 下载类扩展字段
            ext.appinfo = ext.appinfo || {};
            var item = engine.getLayout(fullConfig);
            item.class = 'item';

            // item内domLink属性
            var createDomLink = function () {
                return {
                    style: {},
                    childNodes: [],
                    title: ad.showUrl || '',
                    href: ad.clickUrl,
                    tagName: 'a',
                    target: '_blank'
                };
            };

            // 图文物料左侧logo
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'div';
            logoImg.class = 'log left';
            var logA = createDomLink();
            logA.id = 'log' + i;
            var logContent = engine.getLayout(fullConfig);
            logContent.tagName = 'div';
            logContent.class = 'con';
            var log = engine.getLayout(fullConfig);
            log.tagName = 'img';
            log.src = ad.stuffSrc;

            // title与desc
            var title = engine.getLayout(fullConfig);
            title.tagName = 'div';
            title.class = 'tit left';
            var titA = createDomLink();
            titA.id = 'tit' + i;
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.class = 'title';
            titleText.innerHTML = this.emphasize(ad.title);
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'div';
            desc.class = 'dec left';
            var decA = createDomLink();
            decA.id = 'dec' + i;
            var descText = engine.getLayout(fullConfig);
            descText.tagName = 'span';
            descText.class = 'desc';
            descText.innerHTML = this.emphasize(ad.desc);

            // 灰色背景
            var grey = engine.getLayout(fullConfig);
            grey.tagName = 'div';
            grey.class = 'greybg left';
            var greyA = createDomLink();
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
                // 86%是计算后转化为%单位
                'background-position': ((5 - rank) * 20) + '% 50%'
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
            // 继续访问
            dowText.innerHTML = '\u7ee7\u7eed\u8bbf\u95ee';

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

            grey.childNodes.push(greyA);
            greyA.childNodes.push(grade, download);

            items.push(item);
        }
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }

        try {
            if (fullConfig.isShowCloseFeedBack) {
                var logInfoDiv = engine.getLayout(fullConfig);
                logInfoDiv.class = 'logInfoDiv';
                logInfoDiv.id = 'logInfoDiv';
                style['.logInfoDiv'] = {
                    'display': 'none'
                };
                var dspDiv = engine.getLayout(fullConfig);
                dspDiv.class = 'dspDiv';
                dspDiv.id = 'dspDiv';
                style['.dspDiv'] = {
                    'display': 'none'
                };
                dspDiv.innerHTML = context.requestInfo.account;// dspId:发送日志参数
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');// s:发送日志参数-反馈日志md5加密字符串
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加反馈内容
            }
        }
        catch (e) {

        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },

    /**
     * 工具函数，强调通配符{}引用的字符
     *
     * @method emphasize
     * @param {string} text 文字
     * @return {string}
     */
    emphasize: function (text) {
        var result = String(text).replace(this.templateRegex, function (match, subMatch, index, s) {
            return '<em>' + subMatch + '</em>';
        });
        this.templateRegex.lastIndex = 0;
        return result;
    }
});