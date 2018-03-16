/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_banner_lunbo
* @author fanwenjuan
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_wap_wise',
    deps: {},
    getHeight: function (dom) {
        return parseInt(window.getComputedStyle(dom).height, 10);
    },
    addClickEvent: function (link) {
        link.addEventListener('click', function (event) {
            var href = link.getAttribute('href');
            window.open(href);
            event.preventDefault();
            return false;
        });
    },
    $page: function () {
        var container = document.querySelector('#container');
        var title = container.querySelector('.title');
        var pic = container.querySelector('.pic');

        var containerHeight = this.getHeight(container);
        // 获取图片高度时不能使用this.getHeight方法
        // 因为此时图片有可能还有没有被加载，所以获取不到高度
        var picHeight = parseInt(pic.getAttribute('data-height'), 10);
        var titleHeight = containerHeight - picHeight;

        title.style.opacity = 1;
        title.style.height = titleHeight + 'px';
        title.style.lineHeight = titleHeight + 'px';

        var link = document.querySelector('.container a');
        if (link) {
            this.addClickEvent(link);
        }
    }
});
