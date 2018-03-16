/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */
/* globals oojs */
/* eslint-disable */
oojs.define({
    name: '80001',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
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
        adIconType: 1
    },
    render: function (requestInfo) {
        var engine = this.basic;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var userConfig = requestInfo.styleConfig.userConfig;
        var ads = requestInfo.adElements;
        var adsLen = ads.length;
        var ad = ads[0];
        var engine = this.basic;

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var containerBorderWidth = 0;
        var videoWidth = containerWidth - containerBorderWidth * 2;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var a = engine.getLayout();
        a.tagName = 'a';
        a.id = 'a0';
        a.target = '_blank';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        a.trackingInfo = ad.action && ad.action[0] && ad.action[0].trackingInfo;
        container.childNodes.push(a);

        var item = engine.getLayout();
        item.class = 'item';
        item.id = 'item0';
        a.childNodes.push(item);

        var videoContainer = engine.getLayout();
        videoContainer.class = 'video-container';
        item.childNodes.push(videoContainer);

        var mask = engine.getLayout();
        mask.class = 'mask';
        videoContainer.childNodes.push(mask);

        var durationOnPoster = engine.getLayout();
        durationOnPoster.class = 'duration-on-poster';
        videoContainer.childNodes.push(durationOnPoster);

        var extentionInJson = JSON.parse(requestInfo.styleConfig.ext);
        // console.log('extentionInJson.autoplay---->', extentionInJson.autoplay);
        // var isAutoPlay = extentionInJson.appinfo.autoplay ? true: false;
        // console.log('isAutoPlay------>', isAutoPlay);
        var video = engine.getLayout();
        video.tagName = 'video';
        video.poster = ad.imgFileSrc && ad.imgFileSrc[0];
        video.muted = '';
        video.loop = '';
        // if (isAutoPlay) {
            // video.autoplay = '';
        // }
        videoContainer.childNodes.push(video);

        var source = engine.getLayout();
        source.tagName = 'source';
        source.src = ad.videoFileSrc;
        source.type = 'video/mp4';
        video.childNodes.push(source);

        var pauseIcon = engine.getLayout();
        pauseIcon.class = 'icon icon-pause clickable';
        videoContainer.childNodes.push(pauseIcon);

        var playIcon = engine.getLayout();
        playIcon.class = 'icon icon-play clickable';
        videoContainer.childNodes.push(playIcon);

        var control = engine.getLayout();
        control.class = 'control clickable';
        control.innerHTML = '<div class="control-time"></div>'
            + '<div class="show-time">'
                + '<span class="show-time-current">0:36</span> / <span class="show-time-total">0:58</span>'
            + '</div>';
        videoContainer.childNodes.push(control);

        var progress = engine.getLayout();
        progress.class = 'progress-bar';
        progress.innerHTML = '<div class="progress-bar-fill"></div>';
        videoContainer.childNodes.push(progress);

        style['.slider'] = {
            'width': '100%',
            'height': '100%',
            'background': 'transparent',
            'position': 'relative',
            'cursor': 'pointer'
        };

        style['.thumb'] = {
            'background': 'red',
            'position': 'absolute',
            'left': 0,
            'z-index': 10
        };

        style['.track'] = {
            'position': 'absolute',
            'width': '100%',
            'top': '50%',
            'background': 'yellow',
            'z-index': 4
        };

        style['.track-fill'] = {
            'background': 'black',
            'width': 0,
            'z-index': 5
        };

        style['*'] = {
            margin: 0,
            padding: 0
        };
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'background': 'black',
            'overflow': 'hidden'
        };

        style['a'] = {
            'text-decoration': 'none',
            'display': 'block',
            'width': '100%',
            'height': '100%'
        };

        style['.video-container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'background': 'black'
        };


        style['.video-container video'] = {
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 10
        };

        style['.control'] = {
            'width': '100%',
            'height': '50px',
            'box-sizing': 'border-box',
            'position': 'absolute',
            'left': 0,
            'bottom': 0,
            'z-index': 999,
            'padding': '0 20px',
            'visibility': 'hidden',
            'z-index': 30
        };

        style['.control-time'] = {
            'width': '85%',
            'float': 'left',
            'height': '50px'
        };

        style['.show-time'] = {
            'box-sizing': 'border-box',
            'padding-top': '2px',
            'color': 'white',
            'float': 'left',
            'height': '50px',
            'line-height': '50px',
            'margin-left': '20px',
            'font-size': '12px'
        };

        style['.show-time-total'] = {
            'opacity': 0.6,
        };

        style['.progress-bar'] = {
            'width': '100%',
            'height': '4px',
            'background': 'rgba(255, 255, 255, 0.5)',

            'position': 'absolute',
            'bottom': 0,
            'left': 0,
            'z-index': 999,

            'display': 'none',
            'z-index': 30
        };

        style['.progress-bar-fill'] = {
            'height': '4px',
            'width': '0%',
            'background': 'white',

            'position': 'absolute',
            'left': 0,
            'top': 0,

            '-webkit-transition': '300ms width ease',
            '-moz-transition': '300ms width ease',
            '-ms-transition': '300ms width ease',
            'transition': '300ms width ease'
        };

        var iconWidth = 48;

        style['.icon'] = {
            'width': iconWidth + 'px',
            'height': iconWidth + 'px',

            'position': 'absolute',
            'left': (containerWidth - iconWidth) / 2 + 'px',
            'top': (containerHeight - iconWidth) / 2 + 'px',

            'display': 'none',
            'z-index': 30
        };

        style['.mask'] = {
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,0.5)',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 20,
            'display': 'none'
        };

        style['.duration-on-poster'] = {
            'color': 'white',
            'font-size': '12px',
            'position': 'absolute',
            'right': '20px',
            'bottom': '20px',
            'z-index': 30,
            'display': 'none'
        };

        style['.icon-pause'] = {
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.0/80001_video_pause.png)'
        };

        style['.icon-pause:hover'] = {
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.0/80001_video_pause_hover.png)'
        }
        style['.icon-play'] = {
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.0/80001_video_play.png)'
        }
        style['.icon-play:hover'] = {
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.0/80001_video_play_hover.png)'
        }
        var result = {
            layoutObj: container,
            style: style
        };

        return result;

    }
});
