/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_feedtemplet_static
* @author liguangyi
*/

/* eslint-disable max-len */
/**
 * HOW TO USE:
 *
 * 1) HTML markup:
 * <div id="container"><!--mask-->
 * 		<ul id="target">
 * 	 		<li>
 * 	 		<li>
 * 	 		<li>
 *  	</ul>
 * </div>
 *
 * 2)Javascript:
 * var carousel = SwipeCarousel.init(
 * 					document.querySelector('#target')
 * 				);
 *
 * 3) API:
 * carousel.onchange(function (curItem, prevItem) {
 *
 * })
 * test
 */
oojs.define({
    name: 'SwipeCarousel',
    namespace: 'rs.template',
    $SwipeCarousel: function () {},
    init: function (target, surface) {
        // var surface = document.querySelector('body');
        // var isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1? true: false;
        var items = target.children;
        // if (!surface) {
        // surface = target;
        // }
        this.target = target;
        this.count = items.length;

        var startPos = null;
        var curPos = null;

        this.itemWidth = parseInt(window.getComputedStyle(items[0]).width, 10);
        var maxOffsetLeft = (this.count - 1) * this.itemWidth * (-1);
        var minOffsetLeft = 0;
        this.curCarouselStyleLeft = 0;

        this.eventQueue = {};
        this.curItemIndex = 0;
        this.prevItemIndex = -1;

        var self = this;
        this.carouselInterval = null;

        function checkClose2WhichItem(offsetLeft) {
            if (self.count === 1) {
                return 0;
            }

            for (var i = 0; i < self.count - 1; i++) {
                var j = i + 1;
                var max = self.itemWidth * i * (-1);
                var min = self.itemWidth * j * (-1);
                if (offsetLeft >= min && offsetLeft < j) {
                    return Math.abs(offsetLeft - min) > Math.abs(offsetLeft - max) ? i : j;
                }

            }
        }

        if (this.count > 1) {
            this.carouselClockSetup();
        }

        // if (!isAndroid) {
        // 	surface.addEventListener('touchstart', function (e) {

        // 		self.pause();
        // 		// if (self.carouselInterval) {
        // 		// 	window.clearInterval(self.carouselInterval);
        // 		// 	self.carouselInterval = null;
        // 		// }
        // 		// 因为专供移动轮播广告，需要a标签被点击到，所以不需要阻止默认行为
        // 		// e.preventDefault();
        // 		startPos = {
        // 			// 目前相对于视口计算位移——但或许相对于页面会比较好？（pageX）
        // 			x: e.changedTouches[0].clientX,
        // 			y: e.changedTouches[0].clientY
        // 		}
        // 	});

        // 	surface.addEventListener('touchmove', function (e) {
        // 		e.preventDefault();
        // 		curPos = {
        // 			x: e.changedTouches[0].clientX,
        // 			y: e.changedTouches[0].clientY
        // 		}
        // 		// 目前只支持横向
        // 		var moveHorizontalDistance = curPos.x - startPos.x;
        // 		// 不支持无限滚动（因为PM没有说，哈哈哈哈）
        // 		var tempLeft = self.curCarouselStyleLeft + moveHorizontalDistance;
        // 		if (tempLeft < maxOffsetLeft) {
        // 			tempLeft = maxOffsetLeft;
        // 		} else if (tempLeft > minOffsetLeft) {
        // 			tempLeft = minOffsetLeft;
        // 		} else {
        // 			tempLeft = tempLeft;
        // 		}

        // 		target.style.left = tempLeft + 'px';
        // 	});

        // 	function transitionEndHander() {
        // 		target.style.transition = '';
        // 	}

        // 	target.addEventListener('transitionend', transitionEndHander);
        // 	target.addEventListener('oTransitionEnd', transitionEndHander);
        // 	target.addEventListener('webkitTransitionEnd', transitionEndHander);

        // 	surface.addEventListener('touchend', function (e) {
        // 		e.preventDefault();
        // 		startPos = null;
        // 		curPos = null;
        // 		self.curCarouselStyleLeft = parseInt(target.style.left);

        // 		var tempCurItemIndex = checkClose2WhichItem(self.curCarouselStyleLeft);

        // 		if (tempCurItemIndex != self.curItemIndex) {
        // 			self.prevItemIndex = self.curItemIndex;
        // 			self.curItemIndex = tempCurItemIndex;

        // 			self.triggerChangeEvent();
        // 		}

        // 		self.curCarouselStyleLeft = self.curItemIndex * self.itemWidth * (-1);

        // 		target.style.transition = '.3s all ease-out';
        // 		target.style.oTransition = '.3s all ease-out';
        // 		target.style.webkitTransition = '.3s all ease-out';
        // 		target.style.left = self.curCarouselStyleLeft + 'px';

        // 		if (self.count > 1) {
        // 			self.continue();
        // 		}
        // 	});
        // }
        return this;
    },
    getAdsLength: function () {
        return this.count;
    },
    getCurAdIndex: function () {
        return this.curItemIndex;
    },
    carouselClockSetup: function () {
        var self = this;
        if (this.carouselInterval) {
            return;
        }

        this.carouselInterval = setInterval(function () {
            // document.querySelector('.container').style.background
            // alert('!!!');
            self.next();
        }, 1000 * 5);
    },
    on: function (eventName, eventHandler) {
        this.eventQueue[eventName] = this.eventQueue[eventName] || [];
        this.eventQueue[eventName].push(eventHandler);
    },
    to: function (index) {
        this.curCarouselStyleLeft = index * this.itemWidth * (-1);
        this.target.style.transition = '.3s all ease-out';
        this.target.style.left = this.curCarouselStyleLeft + 'px';
    },
    go2: function (index) {
        this.pause();
        this.conti();

        this.prevItemIndex = this.curItemIndex;
        this.curItemIndex = index % this.count;
        this.triggerChangeEvent();

        this.to(this.curItemIndex);
    },
    next: function () {
        this.prevItemIndex = this.curItemIndex;
        this.curItemIndex = ++this.curItemIndex % this.count;
        this.triggerChangeEvent();
        this.to(this.curItemIndex);
    },
    prev: function () {
        this.prevItemIndex = this.curItemIndex;
        this.curItemIndex = (this.count + --this.curItemIndex) % this.count;
        this.triggerChangeEvent();
        this.to(this.curItemIndex);
    },
    conti: function () {
        this.carouselClockSetup();
    },
    pause: function () {
        if (this.carouselInterval) {
            window.clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }

    },
    triggerChangeEvent: function () {
        var self = this;
        var handlerQueue = this.eventQueue.change;
        if (handlerQueue && handlerQueue.length) {
            handlerQueue.forEach(function (handler) {
                handler.call(self, self.prevItemIndex, self.curItemIndex);
            });
        }

    }
});
