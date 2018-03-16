/**
 * @file image_wap_banner_lunbo
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_wap_banner_lunbo',
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

    render: function (context) {

        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;


        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        container.class = 'container';
        container.id = 'container';

        // 前端所需数据
        var fontInfo = engine.getLayout(fullConfig);
        fontInfo.tagName = 'script';
        fontInfo.innerHTML = 'var ads = ' + JSON.stringify(ads) + ';';
        container.childNodes.push(fontInfo);


        // cproContainer
        var cproContainer = engine.getLayout(fullConfig);
        cproContainer.class = 'cproContainer';
        cproContainer.id = 'cproContainer';
        container.childNodes.push(cproContainer);


        var imageList = engine.getLayout();
        imageList.class = 'image-list';
        imageList.id = 'image-list';
        imageList.tagName = 'ul';
        cproContainer.childNodes.push(imageList);


        // createElement ol
        var btnsList = engine.getLayout();
        btnsList.class = 'btns-list';
        btnsList.id = 'btns-list';
        btnsList.tagName = 'ol';
        container.childNodes.push(btnsList);

        // creatElement li
        for (var i = 0; i < ads.length; i++) {
            var imageListItem = engine.getLayout();
            imageListItem.class = 'image-list-item';
            imageListItem.tagName = 'li';
            imageList.childNodes.push(imageListItem);

            // creatElement a
            var aList = engine.getLayout();
            aList.tagName = 'a';
            aList.id = 'a0';
            aList.target = '_blank';
            aList['data-adindex'] = i;
            aList.href = ads[i].clickUrl;

            imageListItem.childNodes.push(aList);


            // creatElement img
            var img = engine.getLayout();
            img.tagName = 'img';
            img['src'] = ads[i].stuffSrc;
            aList.childNodes.push(img);

            // creatElement ol-->li
            var btnsListItem = engine.getLayout();
            btnsListItem.tagName = 'li';
            btnsList.childNodes.push(btnsListItem);
        }


        var style = {};
        style['#container.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative'
        };
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container .bd-logo4'] = {
        //     'bottom': 6 + 'px',
        //     'position': 'absolute'
        // };
        // style['#container .mob-bd-adIcon'] = {
        //     'bottom': 6 + 'px',
        //     'position': 'absolute'
        // };
        style['#cproContainer.cproContainer'] = {
            'width': 100 + '%',
            'height': containerHeight + 'px',
            'position': 'relative',
            'overflow': 'hidden',
            'background': 'rgba(0,0,0,.2)'
        };
        style['.image-list'] = {
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'height': containerHeight + 'px'
        };
        // add logo
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
    }
});
