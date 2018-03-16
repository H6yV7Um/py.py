/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_wap_wise
* @author qianxiaoli
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
        var ua = navigator.userAgent;
        var itemA = document.getElementById('res0');
        var url = itemA.href || '';
        if (/(iPhone|iPod|iPad)/.test(ua) && /baiduboxapp\//i.test(ua)) {
            url = 'baiduboxapp://easybrowse?opentype=1&isla=0&openurl=' + encodeURIComponent(url) + '&newbrowser=1';
            itemA.href = url;
        }
        var tu = this.getAttr(itemA, 'data-tu');
        if (!tu && !!location.href) {
            var arr1 = location.href.split('&di=');
            if (arr1.length > 1) {
                var arr2 = arr1[1].split('&');
                if (arr2.length > 1) {
                    tu = arr2[0];
                }
            }
        }
        if (!tu) {
            return;
        }
        var message = {
            msgName: 'cpro_displayAd',
            msg: {
                tu: tu,
                dspid: 9,
                dsiplayAd: 1
            }
        };
        var msgStr = '{"msgName":"cpro_displayAd","msg":{"tu":"' + tu + '","dspid":9,"displayAd":1}}';
        if (!!window.postMessage) {
            parent.postMessage(msgStr, '*');
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        }
        else {
            return element[key];
        }
    }
});
