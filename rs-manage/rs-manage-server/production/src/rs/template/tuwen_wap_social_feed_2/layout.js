/**
 * @file tuwen_wap_social_feed_2 template layout
 * @author yanghuabei(yanghuabei@baidu.com)
 */
/* global oojs */
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_wap_social_feed_2',
    deps: {
        basic: 'rs.template.basic',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () { },
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false, // 是否需要数据引擎渲染数据

    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },
    // 布局, 生成布局对象
    render: function (context) {
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        // WAP只出一条广告
        var ad = ads[0];
        var act = ad.actionType || 1;

        var engine = this.basic;
        var getElement = function (id, tagName) {
            tagName = tagName || 'div';
            var element = engine.getLayout(fullConfig);
            element.tagName = tagName;
            element.id = id;
            element.class = id;
            return element;
        };

        // container
        var container = getElement('container');

        // 子元素
        var children = container.childNodes;
        var item = getElement('item');

        // 广告点击区域——item可点
        var a = getElement('item0', 'a');
        a.target = '_blank';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        // 头像
        var avatar = getElement('avatar', 'img');
        // 右侧内容容器
        var content = getElement('content');
        // 作者 对应物料中的品牌名称
        var author = getElement('author');
        // 评论内容
        var commentContent = getElement('comment-content');
        // 描述 对应物料中的标题
        var description = getElement('description');
        // 图片 对应物料中的创意图片图片
        var image = getElement('image', 'img');

        commentContent.childNodes.push(description);
        commentContent.childNodes.push(image);
        content.childNodes.push(author);
        content.childNodes.push(commentContent);
        item.childNodes.push(avatar);
        item.childNodes.push(content);
        item.childNodes.push(a);

        children.push(item);

        var logo = this.logo.getLogo({logoType: 'feed-logo'});
        container.childNodes.push(logo);

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({adIconType: 'feed-adIcon'}));
        }

        // extension
        var materialElements = {};
        try {
            materialElements = JSON.parse(ad.extention);
        }
        catch (ex) {}

        // 填充各种数据
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        avatar.src = ad.customizedContent && ad.customizedContent.image && ad.customizedContent.image[0];
        avatar.alt = '头像';
        author.innerHTML = materialElements && materialElements.appinfo && materialElements.appinfo.name;
        // MDSP业务端控制了长度，不会超出，这里不作特殊处理
        description.innerHTML = ad.title;
        image.src = ad.stuffSrc;

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = 216;

        // 添加样式部分
        var style = {
            '#container': {
                'width': containerWidth + 'px',
                'height': containerHeight + 'px',
                'background-color': '#fff',
                'position': 'relative',
                'padding-left': '16px',
                'box-sizing': 'border-box'
            },
            '#item': {
                width: '100%',
                height: '100%',
                position: 'relative'
            },
            '#avatar': {
                'width': '38px',
                'height': '38px',
                'border-radius': '50%',
                'position': 'absolute',
                'z-index': 1,
                'top': 0
            },
            '#content': {
                'width': '100%',
                'padding-left': '54px',
                'box-sizing': 'border-box'
            },
            '#author': {
                'font-size': '14px',
                'color': '#b4b4b4',
                'height': '21px',
                'line-height': '21px'
            },
            '#comment-content': {
                'width': '100%',
                'margin-top': '5px',
                'padding-right': '16px',
                'padding-bottom': '21px',
                'border-bottom': '1px solid #e7e5e2',
                'box-sizing': 'border-box'
            },
            '#description': {
                'line-height': '21px',
                'height': '21px',
                'font-size': '14px',
                'color': '#666'
            },
            '#image': {
                'margin-top': '5px',
                'height': '137px',
                'width': '274px'
            },
            '#item0': {
                'width': containerWidth + 'px',
                'height': containerHeight + 'px',
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'z-index': 2
            },
            '.feed-logo': {
                left: '70px',
                bottom: '10px'
            },
            '.container .feed-adIcon': {
                left: '82px',
                bottom: '10px'
            },
            '.container .logoArea': {
                width: '23px',
                height: '12px',
                left: '70px',
                bottom: '10px'
            }
        };

        return {
            layoutObj: container,
            style: style
        };
    }
});
