/**
 * @file tuwen_qrcode template page event
 *@author qianxiaoli
 */

/* eslint-disable max-len */

/* globals oojs */

/* globals rs */

/* globals winUrlArr */

/* eslint-disable max-len */

/* globals oojs */

/* globals rs */

/* globals winUrlArr */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_qrcode_test1',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    downLoadTimer: null, // 获取下载的时间戳
    downloadIndex: -1,
    cash: 0.01, // 给用户的返现，单位为元
    charge: 0, // 点击提交的时候，给DC组的扣费比例，单位为分*1000
    $page: function () {
        this.page1 = document.querySelector('.item');
        this.page2 = document.querySelector('.item2');
        this.page3 = document.querySelector('.item3');
        this.page4 = document.querySelector('.item4');
        this.fireworks = document.querySelector('.fireworks');
        this.overlay = document.querySelector('.overlay');

        this.computeRootFontSize(750);
        this.initPage2();

        var width = document.body.clientWidth;
        this.adClick('container');
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('micromessenger') > -1) {
            var tipDiv = document.getElementById('tipDiv');
            // tipDiv.style.height = document.documentElement.scrollHeight + 'px';
            tipDiv.style.display = 'block';

            var closeBtn = document.getElementById('closeBtn');
            this.bind(closeBtn, 'click', function () {
                var tipDiv = document.getElementById('tipDiv');
                tipDiv.style.display = 'none';
            });
        }

        var self = this;
        var downloadBtn = document.querySelector('.page1-btn-dl');
        this.bind(downloadBtn, 'click', function () {
            // 跳转到第二页
            self.page1.style.display = 'none';
            self.page2.style.display = 'block';
            self.overlay.style.display = 'block';
            setTimeout(function () {
                self.overlay.style.display = 'none';
            }, 1000 * 15);
            self.computeRootFontSize(420);
        });

        if (winUrlArr && winUrlArr.length) {
            var tempArr = [
                winUrlArr[downloadIndex]];
            winUrlArr = tempArr;

            for (var i = 0, len = winUrlArr.length; i < len; i++) {
                for (var j = 0; j < winUrlArr[i].length; j++) {
                    var imageWin = new Image();
                    imageWin.src = winUrlArr[i][j];
                    imageWin.onload = imageWin.onerror = function () {};
                }
            }
        }

    },
    computeRootFontSize: function (comparedWidth) {
        var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        document.querySelector('html').style.fontSize = currentRootFontSize + 'px';
    },
    // disableDownload: function (reward) {
    //     var downBtn = document.getElementById('downBtn');
    //     var aDown = downBtn.getElementsByTagName('a');
    //     aDown[0].innerHTML = '已领取' + reward + '元现金奖励';
    //     aDown[0].href = 'javascript:void(0);';
    // },
    // 绑定广告点击
    adClick: function (containerId) {
        containerId = containerId || 'container';
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
            if (tempClassName) {
                tempClassName = tempClassName.toLowerCase();
                if (tempClassName === 'gylogo'
                    || tempClassName === 'bdlogo'
                    || tempClassName.substring(0, 7) === 'bd-logo' || linkArray[i].id.indexOf('downBtn') < 0) {
                    continue;
                }
            }

            this.bind(linkArray[i], 'click', this.onAdClick.proxy(this));
        }
    },
    // 广告被点击
    onAdClick: function (event) {
        var ua = window.navigator.userAgent.toLowerCase();
        // if (ua.match(/UCBrowser/i) == 'ucbrowser') {
        //     alert('抱歉，当前无法继续完成任务。请使用手机百度或百度浏览器重新扫码，完成任务领取现金。');
        //     event.preventDefault();
        //     return false;
        // }

        // // 为什么广告点击之后还要在提示一次？
        // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        //     var tipDiv = document.getElementById('tipDiv');
        //     tipDiv.style.display = 'block';
        //     var closeBtn = document.getElementById('closeBtn');
        //     this.bind(closeBtn, 'click',
        //     function () {
        //         var tipDiv = document.getElementById('tipDiv');
        //         tipDiv.style.display = 'none';
        //     });
        //     this.stopEvent(event);
        //     return false;
        // }
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        if (sourceElement.tagName.toLowerCase() === 'body') {
            return false;
        }

        if (sourceElement.innerHTML.indexOf('已领取') > -1) {
            return false;
        }

        this.downLoadTimer = new Date().getTime();
        var self = this;
        document.getElementById('item1').style.display = 'none';
        setTimeout(function () {
            document.getElementById('item2').style.display = 'block';
        }, 3000);
        try {
            // this.initPage2();
            document.querySelector('html').style.fontSize = this.currentRootFontSize + 'px';
        }
        catch (e) {}
    },
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else {
            element.attachEvent('on' + type, handler);
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        }

        return element[key];

    },
    formatEventObj: function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return e;
    },
    // 阻止默认行为
    stopEvent: function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        return false;
    },
    initPage2: function () {
        this.page2IsInited = this.page2IsInited || false;

        if (downloadIndex === -1) {
            return false;
        }

        // 已经初始化过了
        // 无需再初始化了
        if (this.page2IsInited) {
            return false;
        }

        this.page2IsInited = true;
        // 加载passport登陆框
        this.createPassportScript(this.passportOnloadCallback);
        // 加载问题
        this.getQuestion();
        // 绑定点击事件
        this.bindPage2EventHandler();
    },
    bindPage2EventHandler: function () {
        // page2
        var pag2SubmitBtn = document.querySelector('#submit');
        // 已经没有返回按钮了
        // var pag2ReturnBtn = document.querySelector('#return');
        // var pag3ReturnBtn = document.querySelector('#btn-last-return');

        // page3
        var btncheckout = document.querySelector('#btn-checkout');
        var btndownloads = Array.prototype.slice.call(document.querySelectorAll('.btn-download'));

        var self = this;

        this.bind(pag2SubmitBtn, 'click', this.submitBtnHandler.bind(self));
        // 已经没有返回按钮了
        // this.bind(pag2ReturnBtn, 'click', this.page2ReturnBtnHandler.bind(self));
        // this.bind(pag3ReturnBtn, 'click', this.page3ReturnBtnHandler.bind(self));
        this.bind(btncheckout, 'click', this.callBaidubaoHandler.bind(this));
        // this.bind(btndownload, 'click', this.downloadBaidubaoHandler.bind(this));
        btndownloads.forEach(function (element) {
            (function (element) {
                self.bind(element, 'click', function () {
                    var pageNum = self.getAttr(element, 'data-page');
                    self.downloadBaidubaoHandler.call(self, pageNum);
                });
            })(element);
        });
    },
    createJSONPRequest: function (url, params, callbackHandler) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        var paramsArr = [];
        for (var key in params) {
            paramsArr.push(key + '=' + params[key]);
        }
        var callbackName = params.callback;
        window[callbackName] = callbackHandler;

        s.src = url + '?' + paramsArr.join('&');
        var header = document.querySelector('head');
        header.appendChild(s);
    },
    sendEclickRequest: function (url, params) {
        var paramsArr = [];
        for (var key in params) {
            paramsArr.push(key + '=' + params[key]);
        }
        paramsArr.push('preventCache=' + (+new Date));
        var img = new Image();
        img.src = url + '?' + paramsArr.join('&');
    },
    getQuestionHandler: function (question, answers) {
        var quizTitleContainer = document.querySelector('#quiz-options');
        var quizOptionsContainer = document.querySelector('#quiz-answer');

        var questionContainer = document.querySelector('#quiz-detail');
        var options = Array.prototype.slice.call(document.querySelectorAll('.answer-option'));

        options.forEach(function (el, index) {
            el.querySelector('input').value = answers[index];
            el.querySelector('.answer-text').innerHTML = answers[index];
        });
        quizTitleContainer.style.display = 'block';
        quizOptionsContainer.style.display = 'block';
        questionContainer.innerHTML = question;
    },
    showDialog: function (content) {
        // 方案一：
        // var warnDialog = document.querySelector('#warn');
        // var warnDialogContent = document.querySelector('#warn p');

        // warnDialog.style.display = 'block';
        // warnDialogContent.innerHTML = content;

        // 方案二
        var msgWapper = document.querySelector('#PASSP__1__msgWrapper');
        msgWapper.style.display = 'block';
        msgWapper.innerHTML = content;
    },
    hideDialog: function () {
        // var warnDialog = document.querySelector('#warn');
        // warnDialog.style.display = 'none';

        // 方案二
        var msgWapper = document.querySelector('#PASSP__1__msgWrapper');
        msgWapper.style.display = 'none';
    },
    getAppid: function () {
        return adsExtention[downloadIndex].appinfo.promoteAppId;
    },
    getAnswer: function () {
        var options = Array.prototype.slice.call(document.getElementsByName('answer'));
        var answer = '';
        options.forEach(function (el, index) {
            if (el.checked) {
                answer = index; // 返回给服务端的答案必须是索引，而且从0开始
            }

        });
        return answer;
    },
    getTelNumber: function () {
        var phoneNumberInput = document.querySelector('#PASSP__1__mobilenum');
        var telNumber = phoneNumberInput.value;

        /*
            貌似没有更安全的办法获得输入的手机号码
            理想状态下应该由passport登陆成功后返回给我们手机号
            如果登陆成功后再从DOM中获取手机号，有风险
         */
        return telNumber;
    },
    getQuestion: function () {
        this.createJSONPRequest('http://madv.x.baidu.com/getQuestion', {
            appid: this.getAppid(),
            callback: 'getQuestion'
        }, this.getQuestionHandler);
    },
    checkAnswerIsSuccess: function (answer) {
        var telNumber = this.getTelNumber();
        var appid = adsExtention[downloadIndex].appid;
        this.createJSONPRequest('http://madv.x.baidu.com/checkAnswer', {
            appid: this.getAppid(),
            callback: 'isSuccess',
            answer: answer,
            tel: telNumber
        }, this.checkAnswerHandler.bind(this));
    },
    computeReward: function (answerIsCorrect) {
        var ad = adsExtention[downloadIndex];
        var cpc = adsExtention[downloadIndex].bid;
        var downloadTimestamp = this.downLoadTimer;
        var answerTimestamp = +new Date + 1000 * 3;
        var timeInterval = answerTimestamp - downloadTimestamp;
        var timeBaseline = 30 * 1000; // 30s
        if (answerIsCorrect) {
            if (timeInterval < timeBaseline) {
                this.charge = cpc * 0.8 * 0.1 * 1000;
                this.cash = Math.floor(cpc * 0.8 * 0.001 * ad.cashBackRate * 0.0001 * 100) / 100;
            }
            else {
                this.charge = cpc * 0.1 * 1000;
                this.cash = Math.floor(cpc * 0.001 * ad.cashBackRate * 0.0001 * 100) / 100;
            }
        }
        else {
            this.cash = 0.01;
            this.charge = 1000;
        }
        return this.cash;
    },
    showCash: function (number) {
        var cashNumber = document.querySelector('#cashNumber');
        cashNumber.innerHTML = number;
    },
    checkAnswerHandler: function (result) {
        // result = 1;
        var telNumber = this.getTelNumber();
        var ad = adsExtention[downloadIndex];

        this.computeRootFontSize(750);
        // 新逻辑，如果没有回答对问题，则不予以返现
        if (!result) {
            this.page2.style.display = 'none';
            this.page4.style.display = 'block';
            return;
        }

        try {
            var cash = this.computeReward(result);
        }
        catch (e) {
            return;
        }

        this.showCash(cash);
        this.finallyCash = cash;
        var self = this;
        this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
            url2: 'qrcode',
            tel: telNumber,
            charge: self.charge,
            ad_s: ad.ad_s, // qk
            timestamp: parseInt((+new Date) / 1000, 10)
        });

        // this.disableDownload(this.finallyCash);
        this.page2.style.display = 'none';
        this.page3.style.display = 'block';
        this.fireworks.style.display = 'block';

        // page3 元素对齐(不存在元素对其的问题了)
        // var infoContainer = document.querySelector('.info');
        // var infoText = document.querySelector('.info-text');

        // var infoConWidth = parseInt(window.getComputedStyle(infoContainer).width, 10);
        // var infoTextWidth = parseInt(window.getComputedStyle(infoText).width, 10);

        // infoText.style.left = (infoConWidth - infoTextWidth) / 2 + 'px';

        // this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
        //     url2: 'qrcode',
        //     tel: telNumber,
        //     charge: this.charge,
        //     ad_s: ad.ad_s, // qk
        //     timestamp: parseInt((+new Date) / 1000, 10)
        // });
    },
    callBaidubaoHandler: function () {
        this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
            url2: 'qrcode',
            pageNum: 3,
            btn: 'baifubao'
        });
    },
    submitBtnHandler: function () {
        this.hideDialog();
        var info = [];
        // 提交的时候要做三件事：
        // 1. 判断回答是否正确
        // 2. 前端计算金额
        // 3. 传回给检索端
        // 4. 跳转至下一页
        var answer = this.getAnswer();
        if (answer === '') {
            info.push('请回答问题');
        }

        if (!this.isLogin) {
            info.push('请登录');
        }

        if (info.length) {
            this.showDialog(info.join('，'));
            return;
        }

        this.checkAnswerIsSuccess(answer);
    },
    downloadBaidubaoHandler: function (pageNum) {
        this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
            url2: 'qrcode',
            pageNum: pageNum,
            btn: 'download_baifubao'
        });
    },
    // page2ReturnBtnHandler: function () {
    //     document.getElementsByTagName('html')[0].style.fontSize = document.body.clientWidth / 16 + 'px';
    //     this.page1.style.display = 'block';
    //     this.page2.style.display = 'none';

    //     this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
    //         url2: 'qrcode',
    //         pageNum: 2,
    //         btn: 'return'
    //     });
    // },
    // page3ReturnBtnHandler: function () {
    //     document.getElementsByTagName('html')[0].style.fontSize = document.body.clientWidth / 16 + 'px';
    //     this.page1.style.display = 'block';
    //     this.page3.style.display = 'none';

    //     this.sendEclickRequest('http://qrcode-logs.baidu.com/ad.jpg', {
    //         url2: 'qrcode',
    //         pageNum: 3,
    //         btn: 'return'
    //     });
    // },
    createPassportScript: function (callback) {
        var self = this;
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://wappass.baidu.com/static/touch/js/api/wrapper.js?cdnversion=' + (+new Date());

        s.onload = function () {
            callback.call(self);
        };

        var header = document.querySelector('head');
        header.appendChild(s);
    },
    insertAfter: function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    passportOnloadCallback: function () {
        var self = this;
        passport.use('smsLogin', {
            library: true,
            defaultCss: false
        }, function (apiMagic) {
            var loginInstance = new apiMagic.passport.smsLogin({
                product: 'display_ads',
                staticPage: 'http://pos.baidu.com/v3Jump.html', // 跨域用静态页面
                u: 'http://m.baidu.com' // 登录成功跳转的目标地址
            });

            var phoneNumberInput;
            var passwordInput;
            var requirePasswordBtn;
            var loginBtn;
            var requirePasswordSpan;

            function renderCallback() {
                var container = document.querySelector('#smsLogin');
                var phoneNumberLabel = document.querySelector('.pass-label-mobilenum'); // “手机号”字样
                phoneNumberInput = document.querySelector('.pass-text-input-mobilenum'); // 手机号码输入框
                passwordInput = document.querySelector('.pass-text-input-password');
                // 很奇葩，为什么页面上有两个相同id的元素
                // 将错就错吧，我和passport的人打好招呼让他们别改了，否则下面要报错了
                requirePasswordBtn = document.querySelector('input.pass-button-send');
                requirePasswordSpan = document.querySelector('.pass-tip-smsCodeSend');
                loginBtn = document.querySelector('.pass-button-submit');

                var baiduProtocol = document.querySelector('.pass-form-agreement');
                var form = document.querySelector('#smsLogin form');
                var msgWapper = document.querySelector('.pass-msg-generalMsgWrapper');

                msgWapper.style.fontSize = '0.875rem';
                phoneNumberInput.classList.add('text-input');
                phoneNumberInput.placeholder = '请输入手机号';

                passwordInput.classList.add('text-input');
                passwordInput.placeholder = '请输入验证码';

                requirePasswordBtn.classList.add('require-validate');
                requirePasswordBtn.classList.add('account-btn');
                loginBtn.classList.add('account-btn-login');
                loginBtn.classList.add('account-btn');
                loginBtn.value = '确定';

                var table = document.querySelector('#smsLogin table');
                form.appendChild(table);
                var tdArr = table.querySelectorAll('td');

                phoneNumberLabel.style.display = 'none';
                tdArr[1].appendChild(phoneNumberInput);
                tdArr[2].appendChild(requirePasswordBtn);
                tdArr[2].appendChild(requirePasswordSpan);
                tdArr[4].appendChild(passwordInput);
                // tdArr[5].appendChild(form); // 二选一
                tdArr[5].appendChild(loginBtn); // 二选一
                self.insertAfter(msgWapper, table);

                baiduProtocol.style.display = 'none';
                container.style.display = 'block';
            }

            loginInstance.on('render', function (rsp) {
                rsp.returnValue = false;
                renderCallback();
            });

            function disableLoginForm() {
                phoneNumberInput.disabled = true;
                passwordInput.disabled = true;
                requirePasswordBtn.style.display = 'none';
                loginBtn.style.display = 'none';
            }

            loginInstance.on('loginSuccess', function checkIsLogin(rsp) {
                rsp.returnValue = false; // 阻止跳转

                // var result = rsp.rsp;
                // var data = result.data;
                // var errInfo = result.errInfo;

                // self.isLogin = false;

                // 登陆失败
                // 这么判断非常不靠谱
                // 但是文档上又没有说明
                // if (errInfo.msg) {
                //     self.showDialog('登陆失败');
                //     return;
                // }
                self.isLogin = true;
                // 登陆成功
                self.showDialog('登陆成功');
                // 冻结登陆框
                disableLoginForm();
            });

            loginInstance.on('loginError', function (rsp) {
                // self.showDialog('登陆失败'); // 登陆自带显示框会有提示信息
            });

            loginInstance.render('smsLogin');
        });
    }
});
