/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */

/* globals oojs */
/* eslint-disable */oojs.define({
    name: '80002',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,

    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        logoType: 'feed-logo',
        adIconType: 'feed-adIcon'
    },
    //  秋实Sdk所需信息
    adsExtention: function (requestInfo) {
        var adsExtention = [];
        if (requestInfo.adElements && requestInfo.adElements.length) {
            for (var i = 0, count = requestInfo.adElements.length; i < count; i++) {
                var ad = requestInfo.adElements[i];
                var extention = ad.sdkInteractionInfo && JSON.parse(ad.sdkInteractionInfo);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    recomputeRootFontSize: function (viewportWidth) {
        var comparedWidth = 400;
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        return currentRootFontSize;
    },
    checkEnableControl: function () {
        return true;
    },
    checkIsWifiConnection: function () {
        return true;
    },
    checkIsWapVersion: function () {
        return false;
    },
    getVideoPoster: function (ad) {
        return ad.imgFileSrc;
    },
    getVideoInfo: function (ad) {
        return {
            videoSrc: ad.videoFileSrc,
            videoWidth: ad.videoWidth[0],
            videoHeight: ad.videoHeight[0]
        };
    },
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var ad = ads[0];
        var engine = this.basic;
        var action = ad.action[0];
        var showControl = this.checkEnableControl();
        var isWifiConnection = this.checkIsWifiConnection();
        var isWapVersion = this.checkIsWapVersion()
        var muted = true;
        var autoplay = showControl ? false : true;
        var allAreaIsClickable = (
            isWapVersion
            || !isWifiConnection
            || (isWifiConnection && !showControl) ) ? true : false;
        var usePosterReplaceVideo = (isWapVersion || !isWifiConnection) ? true : false;
        var showBigPlayIcon = showControl && isWifiConnection;
        usePosterReplaceVideo = true;
        allAreaIsClickable = true;
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var containerBorderWidth = 1;
        var videoWidth = containerWidth - containerBorderWidth * 2;
        var videoHeight = videoWidth / 16 * 9;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        container['data-iswap'] = isWapVersion ? 1 : 0;
        container['data-wifi'] = isWifiConnection ? 1 : 0;
        container['data-mcurl'] = action.clickLink.middleClickLink || '';
        var item = engine.getLayout();
        item.class = 'item';
        item.id = 'item0';
        container.childNodes.push(item);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }

        var videoInfo = JSON.stringify({
            v_video: ad.videoFileSrc[0],
            v_video_w: ad.videoWidth[0],
            v_video_h: ad.videoHeight[0],
            v_image: ad.imgFileSrc[0],
            v_url: action.clickLink.clickLink
        });
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';'
            + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo) + ';'
            + 'var videoInfo=' + videoInfo + ';';

        container.childNodes.push(qiushiInfo);
        // act =2是下载，act=1是lp ,将0号的act转成mdsp的
        var act_temp = parseInt(action.actionType, 10) || 1;
        var act = 1;
        switch (act_temp){
            case 5: 
                act =2;
                break;
            case 4: 
                act =1;
                break;
            default: 
                act =1;
        }
        if (allAreaIsClickable) {
            var clickArea = engine.getLayout();
            clickArea.class = 'item-a';
            clickArea.id = 'a0';
            clickArea.tagName = 'a';
            clickArea['data-adindex'] = 0;
            clickArea['data-adtype'] = act || 1;
            clickArea.href = action.clickLink.clickLink;
            item.childNodes.push(clickArea);
            // 不再新窗口打开对我们是有利的
            // 但不排除PM会有这样的需求
            // clickArea.target = '_blank';
        } else {
            var clickArea = item;
        }
        var title = engine.getLayout();
        title.class = 'title';
        if (allAreaIsClickable) {
            title.tagName = 'div'
        } else {
            title.tagName = 'a';
            title.id = 'title0';
            title.href = action.clickLink.clickLink;
            // title.tagret = '_blank';
        }
        title.innerHTML = '<span class="title-text">' + ad.textTitle + '</span>';
        clickArea.childNodes.push(title);

        var videoWrap = engine.getLayout();
        videoWrap.class = 'video-wrap';
        clickArea.childNodes.push(videoWrap);

        //------分割线------

        var video = engine.getLayout();
        video.tagName = 'video';
        video.poster = this.getVideoPoster(ad);
        video.width = videoWidth;
        video.height = videoHeight;

        if (showControl) {
            video.controls = true;
        }

        if (muted) {
            video.muted = true;
        }

        if (autoplay) {
            video.autoplay = true;
        }

        var source = engine.getLayout();
        var videoInfo = this.getVideoInfo(ad);
        source.tagName = 'source';
        source.src = videoInfo.videoSrc;
        source.type = 'mp4';
        video.childNodes.push(source);

        var coverImage = engine.getLayout();
        coverImage.class = 'video-cover-image';

        var playIcon = engine.getLayout();
        playIcon.class = 'play-icon';
        playIcon.tagName = 'img';
        playIcon.src = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.0/80002_video_icon.png';
        coverImage.childNodes.push(playIcon);

        var playEndCover = engine.getLayout();
        playEndCover.tagName = allAreaIsClickable ? 'div' : 'a';
        playEndCover.href = action.clickLink.clickLink;
        playEndCover.class = 'play-end-cover';
        playEndCover.id = 'video0';
        playEndCover.innerHTML = '<span class="play-end-cover-text">查看详情</span>';

        if (usePosterReplaceVideo) {
            videoWrap.childNodes.push(coverImage);
        } else {
            videoWrap.childNodes.push(video);
            videoWrap.childNodes.push(playEndCover);
        }

        if (showBigPlayIcon) {
            videoWrap.childNodes.push(playIcon);
        }

        var footer = engine.getLayout();
        footer.class = 'footer';
        if (allAreaIsClickable) {
            footer.tagName = 'div';
        } else {
            footer.tagName = 'a';
            footer.id = 'footer0';
            footer.href = action.clickLink.clickLink;
        }
        var text = act == 1 ? '查看详情' : '立即下载';
        if (act === 1) {
            footer.innerHTML = '<span class="footer-text">' + text + '</span>';
            clickArea.childNodes.push(footer);
        } else if (act === 2) {
            footer.innerHTML = 
                '<a id="btn0"  data-adindex="0" data-adtype="2" href="' + action.clickLink.clickLink + '">' 
                    + '<span class="footer-text">' + text + '</span>' 
                + '</a>';
            clickArea.href = action.clickLink.middleClickLink;
            container.childNodes.push(footer);    
        }

        style['*'] = {
            margin: 0,
            padding: 0
        };

        style.html = {
            'font-size': this.recomputeRootFontSize(containerWidth) + 'px'
        };

        style.a = {
            'text-decoration': 'none',
            'outline': 'none',
            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
            '-webkit-tap-highlight-color': 'transparent',
            '-webkit-focus-ring-color': 'rgba(0, 0, 0, 0)',
            '-webkit-focus-ring-color': 'transparent',
            'color': 'black'
        };

        style['.container'] = {
            width : containerWidth + 'px',
            height : containerHeight + 'px',
            'box-sizing' : 'border-box',
            'border': containerBorderWidth + 'px solid rgba(0, 0, 0, 0.3)',
            'position': 'relative'
        };

        style['.item-a'] = {
            width: '100%',
            height: '100%',
            display: 'block'
        };

        var titleHeight = (containerHeight - containerBorderWidth * 2 - videoHeight) / 2;
        style['.title'] = {
            height: titleHeight + 'px',
            'line-height': titleHeight + 'px',
            'box-sizing': 'border-box',
            padding: '0 0.625rem', // 有待修改
            display: 'block'
        };

        style['.video-wrap'] = {
            width: videoWidth + 'px', /* 16:9 固定 */
            height: videoHeight + 'px',
            position: 'relative'
        };

        style['.video-cover-image'] = {
            position: 'relative',
            width: '100%',
            height: '100%',
            'background-size': videoWidth + 'px ' + videoHeight + 'px', /* 固定 */
            'background-image': 'url(' + this.getVideoPoster(ad) + ')'
        };

        style['.play-end-cover'] = {
            background: 'rgba(0,0,0,0.5)',
            width: '100%',
            height: videoHeight + 'px',
            'line-height': videoHeight + 'px',
            'text-align': 'center',
            'display': 'none',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };

        style['.play-end-cover-text'] = {
            color: 'white',
            background: 'skyblue',
            background: '#2b98d0',
            padding: '0.625rem 0.9375rem', // 有待修改
            'border-radius': '1.625rem'
        };

        var playIconWidth = containerWidth / 5;
        var playIconHeight = playIconWidth;
        style['.play-icon'] = {
            width: playIconWidth + 'px', /* 固定 是广告宽度的五分之一 */
            display: 'block',
            position: 'absolute',
            top: (videoHeight - playIconHeight) / 2 + 'px', /* 固定 视频的宽高我知道，那么icon的宽高我也知道了，所以居中的位移我也知道 */
            left: (videoWidth - playIconWidth) / 2 + 'px' /* 固定 */
        };
        style['.footer'] = {
            height: titleHeight + 'px',
            'line-height': titleHeight - 3 + 'px', // Bug
            'text-align': 'right',
            padding: '0 0.625rem', // 有待修改
            'box-sizing': 'border-box',
            display: 'block'
        };

        style['.footer-text'] = {
            background: '#2b98d0',
            color: 'white',
            'border-radius': '1.25rem',
            // bug，不明白为什么
            padding: '0.5rem 0.9375rem',
            'font-size': '0.8rem',
        };
        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});
