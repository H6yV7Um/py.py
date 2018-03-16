/**
 * @file tuwen_qrcode template layout
 * @author qianxiaoli
 */

/* global oojs */

/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_qrcode',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        http: 'http',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
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
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                extention.curl = extention.curl || ad.clickUrl;
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var clientWidth = containerStyle.width;
        var clientHeight = containerStyle.height;


        // items
        var items = container.childNodes;
        // 添加样式部分
        var scale = clientWidth / 380;
        var currentRootFontSize = scale * 16;
        var style = {};
        // var rem = clientWidth / 16;
        if (ads.length === 0) {
            var itemFailed = engine.getLayout(fullConfig);
            itemFailed.class = 'itemFailed';
            itemFailed.id = 'itemFailed';
            var failedImg = engine.getLayout(fullConfig);
            failedImg.class = 'failedImg';
            failedImg.tagName = 'img';
            failedImg.id = 'failedImg';
            failedImg.src = 'http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/failed.jpg';
            var failedTip1 = engine.getLayout(fullConfig);
            failedTip1.class = 'failedTip1';
            failedTip1.id = 'failedTip1';
            var failedTip2 = engine.getLayout(fullConfig);
            failedTip2.class = 'failedTip2';
            failedTip2.id = 'failedTip2';
            var failedTip3 = engine.getLayout(fullConfig);
            failedTip3.class = 'failedTip3';
            failedTip3.id = 'failedTip3';
            failedTip1.innerHTML = '对不起，扫码失败';
            failedTip2.innerHTML = '建议使用手机百度，';
            failedTip3.innerHTML = '或百度钱包重新扫码';
            itemFailed.childNodes.push(failedImg);
            itemFailed.childNodes.push(failedTip1);
            itemFailed.childNodes.push(failedTip2);
            itemFailed.childNodes.push(failedTip3);
            items.push(itemFailed);
            // var itemFW = 335 / 380 * clientWidth;
            // var itemFM = 45 / 380 * clientWidth / 2;

            style.html = {
                'background-image': 'url(http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/main.png)',
                'background-repeat': 'no-repeat',
                'background-size': '100%',
                'width': '100%',
                'color': '#000',
                'background-color': '#f9f3d8',
                'overflow': 'hidden'
            };
            style.body = {
                height: '100%',
                margin: '0',
                padding: '0',
                overflow: 'hidden'
            };
            style.div = {
                margin: '0',
                padding: '0'
            };
            style['.container'] = {
                // width: clientWidth + 'px'
            };
            style['.itemFailed'] = {
                'height': '100%',
                'background': 'rgba(255,255,255,0.8) none repeat scroll 0 0!important',
                'filter': 'Alpha(optacity=70)',
                'margin': '2rem 1rem 1rem 1rem',
                'text-align': 'center',
                'color': '#777'
            };
            style['.failedImg'] = {
                width: '10rem',
                border: 'none',
                margin: '2rem 0 0 0'
            };
            style['.failedTip1'] = {
                'font-size': '1.5rem'
            };
            style['.failedTip2'] = {
                'font-size': '1rem'
            };
            style['.failedTip3'] = {
                'font-size': '1rem'
            };
            var result = {
                layoutObj: container,
                style: style
            };
            return result;
        }

        // 前端所需数据
        var fontInfo = engine.getLayout(fullConfig);
        fontInfo.tagName = 'script';

        fontInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';';
        container.childNodes.push(fontInfo);

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item1';

        var downArr = [];
        for (var i = 0, len = ads.length; i < len; i++) {
            if (ads[i].actionType === 2) {
                downArr.push(i);
            }

        }

        var downIndex = -1;
        var adIndex = -1;
        if (downArr.length > 0) {
            downIndex = Math.round(Math.random() * (downArr.length - 1));
            adIndex = downArr[downIndex];
            downArr.splice(downIndex, 1);
            for (var i = 0, len = downArr.length; i < len; i++) {
                ads.splice(downArr[i], 1, '');
            }
            for (var i = ads.length - 1, len = -1; i > len; i--) {
                if (ads[i] === '') {
                    ads.splice(i, 1);
                }
            }
        }
        for (var i = 0, len = ads.length; i < len; i++) {
            var ad = ads[i];
            var adCon = engine.getLayout(fullConfig);
            adCon.class = 'adCon';
            adCon.id = 'adCon' + i;
            if (ad.actionType === 2) {
                var extention = JSON.parse(ad.extention);
                var logoCon = engine.getLayout(fullConfig);
                logoCon.class = 'logoCon';
                var logoDown = engine.getLayout(fullConfig);
                logoDown.tagName = 'img';
                logoDown.class = 'logoDown';
                var titleSize = engine.getLayout(fullConfig);
                titleSize.class = 'titleSize';
                var title = engine.getLayout(fullConfig);
                title.class = 'title';
                var size = engine.getLayout(fullConfig);
                size.class = 'size';
                var desc = engine.getLayout(fullConfig);
                desc.class = 'desc';
                var downBtn = engine.getLayout(fullConfig);
                downBtn.tagName = 'a';
                downBtn.class = 'downBtn';
                downBtn.id = 'downBtn' + i;
                downBtn.target = '_blank';
                var downDiv = engine.getLayout(fullConfig);
                downDiv.id = 'downBtn';
                downDiv.downIndex = adIndex;
                if (downArr.length > 0) {
                    downDiv.remove = downArr.join(',');
                }

                var dutyDesc = engine.getLayout(fullConfig);
                dutyDesc.class = 'dutyDesc';
                var dutyIntro = engine.getLayout(fullConfig);
                dutyIntro.class = 'dutyIntro';
                dutyIntro.innerHTML = '任务介绍：';
                var dutyCon = [
                    '在应用商店下载APP',
                    '安装并试用',
                    '回答问题',
                    '马上领取红包'
                ];
                dutyDesc.childNodes.push(dutyIntro);
                for (var j = 1; j < dutyCon.length + 1; j++) {
                    var duty = engine.getLayout(fullConfig);
                    duty.class = 'duty';
                    duty.innerHTML = '<div style="width: 1rem;height:1rem;margin-right:0.5rem;background-color:#fc4f38;color:#fff;float:left;text-align:center;">' + j + '</div>' + dutyCon[j - 1];
                    dutyDesc.childNodes.push(duty);
                }
                logoDown.src = ad.stuffSrc;
                title.innerHTML = extention.appinfo.name;
                size.innerHTML = extention.appinfo.size + 'M';
                desc.innerHTML = extention.appinfo.appDesc;
                downBtn.innerHTML = '先试玩，再回来领最高5元现金哦~<img src="http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/down.png" style="width:1.25rem;height:1.25rem;float:right;margin-top:0.425rem"/>';
                downBtn.href = ad.clickUrl;
                titleSize.childNodes.push(title);
                titleSize.childNodes.push(size);
                logoCon.childNodes.push(logoDown);
                logoCon.childNodes.push(titleSize);
                downDiv.childNodes.push(downBtn);
                adCon.childNodes.push(logoCon);
                adCon.childNodes.push(desc);
                adCon.childNodes.push(downDiv);
                adCon.childNodes.push(dutyDesc);
            }
            else if (ad.actionType === 1) { // 如果为图片以宽度为准，按比例缩放
                var adWidth = '100%';
                var adImg = engine.getLayout(fullConfig);
                adImg.tagName = 'img';
                adImg.class = 'adImg' + i;
                adImg.id = 'adImg' + i;
                adImg.src = ad.stuffSrc;
                style['.adImg' + i] = {
                    width: adWidth,
                    border: 'none'
                };
                var aImg = engine.getLayout(fullConfig);
                aImg.tagName = 'a';
                aImg.class = 'aImg';
                aImg.id = 'aImg' + i;
                aImg.target = '_blank';
                aImg.href = ad.clickUrl;
                style['.aImg'] = {
                    'width': adWidth,
                    'border': 'none',
                    'text-decoration': 'none',
                    'display': 'block',
                    'margin-top': '1rem'
                };
                aImg.childNodes.push(adImg);
                adCon.childNodes.push(aImg);
            }
            item.childNodes.push(adCon);
            if (i !== len - 1) {
                var adLine = engine.getLayout(fullConfig);
                adLine.class = 'adLine';
                item.childNodes.push(adLine);
            }
        }
        /*提示*/
        if (adIndex !== -1) {
            // 广告关闭按钮
            var closeBtn = engine.getLayout(fullConfig);
            closeBtn.tagName = 'div';
            closeBtn.id = 'closeBtn';
            var closeDiv = engine.getLayout(fullConfig);
            closeDiv.tagName = 'div';
            closeDiv.id = 'closeDiv';
            closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
            closeBtn.childNodes.push(closeDiv);
            var tipDiv = engine.getLayout(fullConfig);
            tipDiv.tagName = 'div';
            tipDiv.id = 'tipDiv';
            tipDiv.class = 'tipDiv';
            var tipCon = engine.getLayout(fullConfig);
            tipCon.tagName = 'div';
            tipCon.class = 'tipCon';
            var tip1 = engine.getLayout(fullConfig);
            tip1.tagName = 'div';
            tip1.class = 'tip1';
            var tip2 = engine.getLayout(fullConfig);
            tip2.tagName = 'div';
            tip2.class = 'tip2';
            var tip3 = engine.getLayout(fullConfig);
            tip3.tagName = 'div';
            tip3.class = 'tip3';
            var tip4 = engine.getLayout(fullConfig);
            tip4.tagName = 'div';
            tip4.class = 'tip4';
            var tipArrow = engine.getLayout(fullConfig);
            tipArrow.tagName = 'img';
            tipArrow.class = 'tipArrow';
            tip1.innerHTML = '跳转一步，才能下载应用！';
            tip2.innerHTML = '请点击右上角,选择在';
            tip3.innerHTML = '<span style="color:red">浏览器（或Safari）中打开</span>';
            tipArrow.src = 'http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/arrow.png';
            tip4.childNodes.push(tipArrow);
            tipCon.childNodes.push(closeBtn);
            tipCon.childNodes.push(tip1);
            tipCon.childNodes.push(tip2);
            tipCon.childNodes.push(tip3);
            tipCon.childNodes.push(tip4);
            tipDiv.childNodes.push(tipCon);
            items.push(tipDiv);
            style['div#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': 50,
                'height': 50,
                'text-align': 'center',
                'top': '2px',
                'left': '2px'
            };
            style['div#closeDiv'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': 30,
                'height': 30,
                'border-radius': 15 + 'px',
                'font': 'normal ' + 30 + 'px/' + 30 + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#888',
                'color': '#fff'
            };
            style['.tipDiv'] = {
                display: 'none',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7) none repeat scroll 0 0!important',
                filter: 'Alpha(optacity=70)',
                position: 'fixed',
                top: '0',
                left: '0'
            };
            style['.tipCon'] = {
                'width': '11rem',
                'height': '4rem',
                'padding': '1rem 1.5rem',
                'vertical-align': 'center',
                'margin': '0 1rem',
                'radius': '0.33rem',
                '-webkit-border-radius': '0.33rem',
                '-moz-border-radius': '0.33rem',
                'position': 'absolute',
                'background-color': '#fff',
                'color': '#000'
            };
            style['.tip1'] = {
                'font-size': '0.8rem',
                'font-weight': 'bold',
				'margin-bottom': '5px'
            };
            style['.tip2'] = {
                'font-size': '0.8rem',
				'margin-bottom': '5px'
            };
            style['.tip3'] = {
                'font-size': '0.8rem'
            };
            style['.tip4'] = {
                position: 'absolute',
                right: '0.5rem',
                top: '0.5rem'
            };
            style['.tipArrow'] = {
                width: '3.6rem'
            };
        }


        /**/
        items.push(item);

        // page 2
        var item2 = engine.getLayout(fullConfig);
        item2.class = 'item2 bg';
        item2.id = 'item2';
        container.childNodes.push(item2);

        var quiz = engine.getLayout(fullConfig);
        quiz.class = 'quiz';
        item2.childNodes.push(quiz);

        var title = engine.getLayout(fullConfig);
        title.class = 'quiz-title';
        quiz.childNodes.push(title);

        var titleP1 = engine.getLayout(fullConfig);
        titleP1.tagName = 'p';
        titleP1.innerHTML = '第一步：回答下列问题';
        title.childNodes.push(titleP1);

        var titleP2 = engine.getLayout(fullConfig);
        titleP2.tagName = 'p';
        titleP2.innerHTML = '回答正确即可领取现金奖励';
        title.childNodes.push(titleP2);

        var question = engine.getLayout(fullConfig);
        question.id = 'quiz-answer';
        question.tagName = 'h1';
        quiz.childNodes.push(question);

        var questionSpan1 = engine.getLayout(fullConfig);
        questionSpan1.tagName = 'span';
        questionSpan1.innerHTML = '问题：';
        question.childNodes.push(questionSpan1);

        var quizDetail = engine.getLayout(fullConfig);
        quizDetail.id = 'quiz-detail';
        quizDetail.tagName = 'span';
        question.childNodes.push(quizDetail);

        var options = engine.getLayout(fullConfig);
        options.id = 'quiz-options';
        options.class = 'options';
        quiz.childNodes.push(options);

        for (var i = 1; i <= 3; i++) {
            var label = engine.getLayout(fullConfig);
            label.tagName = 'label';
            label.class = 'answer-option';
            label.for = 'answer' + i;
            options.childNodes.push(label);

            var input = engine.getLayout(fullConfig);
            input.tagName = 'input';
            input.id = 'answer' + i;
            input.name = 'answer';
            input.type = 'radio';
            input['data-index'] = i;
            label.childNodes.push(input);

            var span = engine.getLayout(fullConfig);
            span.class = 'answer-text';
            span.tagName = 'span';
            label.childNodes.push(span);
        }

        var clearFloat = engine.getLayout(fullConfig);
        clearFloat.class = 'clear';
        options.childNodes.push(clearFloat);

        var account = engine.getLayout(fullConfig);
        account.class = 'account';
        item2.childNodes.push(account);

        var accountUnknown = engine.getLayout(fullConfig);
        accountUnknown.class = 'account-unknown';
        accountUnknown.id = 'smsLogin';
        account.childNodes.push(accountUnknown);

        var accountTitle = engine.getLayout(fullConfig);
        accountTitle.tagName = 'h1';
        accountTitle.class = 'account-title';
        accountTitle.innerHTML = '第二步：输入手机号查看获得的现金奖励金额';
        accountUnknown.childNodes.push(accountTitle);

        var table = engine.getLayout(fullConfig);
        table.tagName = 'table';
        accountUnknown.childNodes.push(table);

        var tdArr = [];

        for (var i = 0; i < 2; i++) {
            var tr = engine.getLayout(fullConfig);
            tr.tagName = 'tr';
            table.childNodes.push(tr);
            for (var j = 0; j < 3; j++) {
                // td
                var td = engine.getLayout(fullConfig);
                td.tagName = 'td';
                tr.childNodes.push(td);

                tdArr.push(td);
            }
        }

        var labelPhone = engine.getLayout(fullConfig);
        labelPhone.tagName = 'label';
        labelPhone.innerHTML = '手机号:';
        tdArr[0].childNodes.push(labelPhone);

        var labelCode = engine.getLayout(fullConfig);
        labelCode.tagName = 'label';
        labelCode.innerHTML = '验证码:';
        tdArr[3].childNodes.push(labelCode);

        var warn = engine.getLayout(fullConfig);
        warn.id = 'warn';
        warn.class = 'warn';
        account.childNodes.push(warn);

        var warnTitle = engine.getLayout(fullConfig);
        warnTitle.tagName = 'h3';
        warnTitle.innerHTML = '提示信息';
        warn.childNodes.push(warnTitle);

        var warnDetail = engine.getLayout(fullConfig);
        warnDetail.id = 'warnDetail';
        warnDetail.tagName = 'p';
        warnDetail.innerHTML = '';
        warn.childNodes.push(warnDetail);

        var btnsContainer = engine.getLayout(fullConfig);
        btnsContainer.class = 'btns';
        item2.childNodes.push(btnsContainer);

        var submitBtn = engine.getLayout(fullConfig);
        submitBtn.tagName = 'button';
        submitBtn.id = 'submit';
        submitBtn.class = 'btn btn-submit';
        submitBtn.innerHTML = '提交';
        btnsContainer.childNodes.push(submitBtn);

        var returnBtn = engine.getLayout(fullConfig);
        returnBtn.tagName = 'button';
        returnBtn.id = 'return';
        returnBtn.class = 'btn btn-return';
        returnBtn.innerHTML = '返回';
        btnsContainer.childNodes.push(returnBtn);

        // page 3
        var item3 = engine.getLayout(fullConfig);
        item3.class = 'item3 bg';
        item3.id = 'item3';
        container.childNodes.push(item3);

        var info = engine.getLayout(fullConfig);
        info.class = 'info';
        item3.childNodes.push(info);

        var resultWrap = engine.getLayout(fullConfig);
        resultWrap.class = 'info-text info-result-success';
        info.childNodes.push(resultWrap);

        var resultTitle = engine.getLayout(fullConfig);
        resultTitle.class = 'info-result-title';
        resultWrap.childNodes.push(resultTitle);

        var resultTitleP1 = engine.getLayout(fullConfig);
        resultTitleP1.tagName = 'p';
        resultTitle.childNodes.push(resultTitleP1);

        var resultTitleCupIcon = engine.getLayout(fullConfig);
        resultTitleCupIcon.tagName = 'img';
        resultTitleCupIcon.class = 'cup';
        resultTitleCupIcon.src = '//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/cup.png';
        resultTitleP1.childNodes.push(resultTitleCupIcon);

        var resultTitleCupText = engine.getLayout(fullConfig);
        resultTitleCupText.tagName = 'span';
        resultTitleCupText.innerHTML = '恭喜你';
        resultTitleP1.childNodes.push(resultTitleCupText);

        var resultTitleP2 = engine.getLayout(fullConfig);
        resultTitleP2.tagName = 'p';
        resultTitle.childNodes.push(resultTitleP2);

        [
            '获得',
            '100',
            '元现金奖励'
        ].forEach(function (text, index) {
            var tempSpan = engine.getLayout(fullConfig);
            if (index === 1) {
                tempSpan.id = 'cashNumber';
            }

            tempSpan.tagName = 'span';
            tempSpan.innerHTML = text;
            resultTitleP2.childNodes.push(tempSpan);
        });

        var resultDetail = engine.getLayout(fullConfig);
        resultDetail.tagName = 'p';
        resultDetail.class = 'info-result-detail';
        [
            '现金已经放入您',
            // 'XXXX',
            '的百度钱包-优惠券中'
        ].forEach(function (text, index) {
            var tempSpan = engine.getLayout(fullConfig);
            // if (index === 1) {
            //     tempSpan.id = 'accountName';
            // }

            tempSpan.tagName = 'span';
            tempSpan.innerHTML = text;
            resultDetail.childNodes.push(tempSpan);
        });
        resultWrap.childNodes.push(resultDetail);

        var tip = engine.getLayout(fullConfig);
        tip.tagName = 'p';
        tip.class = 'please-wait';
        tip.innerHTML = '由于不同网络环境差异，奖励发放可能会产生一定延时，请您耐心等待。';
        item3.childNodes.push(tip);

        var btnWrap = engine.getLayout(fullConfig);
        btnWrap.class = 'item3-btns';
        item3.childNodes.push(btnWrap);

        var btnDownload = engine.getLayout(fullConfig);
        btnDownload.class = 'btns-download';
        btnWrap.childNodes.push(btnDownload);

        var buttonCheckout = engine.getLayout(fullConfig);
        buttonCheckout.id = 'btn-checkout';
        buttonCheckout.tagName = 'button';
        buttonCheckout.class = 'button checkout';
        btnDownload.childNodes.push(buttonCheckout);

        var buttonCheckoutLink = engine.getLayout(fullConfig);
        buttonCheckoutLink.tagName = 'a';
        buttonCheckoutLink.id = 'btn-checkout-link';
        buttonCheckoutLink.class = 'useless';
        buttonCheckoutLink.href = 'https://wallet.baidu.com/content/mywallet/h5/sdk_page/sdk_quan_manager.html?ua=1-1-1-wirelessadv';
        buttonCheckoutLink.target = '_blank';
        buttonCheckoutLink.innerHTML = '你可以点击查看';
        buttonCheckout.childNodes.push(buttonCheckoutLink);

        var buttonDownload = engine.getLayout(fullConfig);
        buttonDownload.tagName = 'button';
        buttonDownload.id = 'btn-download';
        buttonDownload.class = 'button download';
        btnDownload.childNodes.push(buttonDownload);

        var buttonDownloadImg = engine.getLayout(fullConfig);
        buttonDownloadImg.tagName = 'img';
        buttonDownloadImg.src = '//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/icon.png';
        buttonDownload.childNodes.push(buttonDownloadImg);

        var buttonDownloadText = engine.getLayout(fullConfig);
        buttonDownloadText.tagName = 'a';
        buttonDownloadText.class = 'useless';
        buttonDownloadText.id = 'btn-download-link';
        buttonDownloadText.target = '_blank';
        buttonDownloadText.href = '//app.baifubao.com';
        buttonDownloadText.innerHTML = '下载百度钱包提取现金';
        buttonDownload.childNodes.push(buttonDownloadText);

        var lastReturnBtnWrap = engine.getLayout(fullConfig);
        lastReturnBtnWrap.class = 'last-return-container';
        btnWrap.childNodes.push(lastReturnBtnWrap);

        var lastReturnBtn = engine.getLayout(fullConfig);
        lastReturnBtn.id = 'btn-last-return';
        lastReturnBtn.class = 'btn last-return';
        lastReturnBtn.tagName = 'button';
        lastReturnBtn.innerHTML = '返回';
        lastReturnBtnWrap.childNodes.push(lastReturnBtn);

        style.a = {
            'text-decoration': 'none'
        };
        style['input[type=submit]'] = {
            '-webkit-appearance': 'none',
            'border-radius': '0.3125rem'
        };
        style.html = {
            'background-image': 'url(//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/main.png)',
            'background-repeat': 'no-repeat',
            'background-size': '100%',
            'width': '100%',
            'color': '#000',
            'font-size': currentRootFontSize + 'px',
            'background-color': '#f9f3d8',
            'overflow-x': 'hidden'
        };
        style['::-webkit-input-placeholder'] = {
            'text-align': 'center'
        };
        style['::-moz-placeholder'] = {
            'text-align': 'center'
        };
        style[':-ms-input-placeholder'] = {
            'text-align': 'center'
        };
        style[':-moz-placeholder'] = {
            'text-align': 'center'
        };
        style.body = {
            'height': '100%',
            'margin': '0',
            'padding': '0',
            'overflow-x': 'hidden'
        };
        style.div = {
            margin: '0',
            padding: '0'
        };
        style['.container'] = {
            'position': 'relative'
            // width: clientWidth + 'px'
        };
        style['.adLine'] = {
            'height': '1px',
            'width': '14rem',
            'margin': '0.5rem 1rem 0 1rem',
            'background-color': '#ccc'
        };
        style['.logoCon'] = {
            width: '14rem',
            height: '2.25rem',
            margin: '1rem 1rem 0.5rem 1rem'
        };
        style['.logoDown'] = {
            'height': '2.25rem',
            'width': '2.25rem',
            'border': 'none',
            'float': 'left',
            'margin-right': '0.5rem'
        };
       // var titleSizeW = clientWidth - 5 * rem;
        style['.titleSize'] = {
            'width': '11rem',
            'height': '2.25rem',
            'float': 'left'
        };
        style['.title'] = {
            'width': '11rem',
            'height': '1.5rem',
            'line-height': '1.5rem',
            'font-size': '1.4rem',
            'color': '#474747',
            'font-weight': 'bold',
            'overflow': 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis'
        };
        // var sizeFont = (0.75 * rem - 2) > 12 ? (0.75 * rem - 2) : 12;
        style['.size'] = {
            'width': '11rem',
            'height': '0.75rem',
            'font-size': '0.70rem',
            'color': '#666',
            'overflow': 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis'
        };
        style['.desc'] = {
            'width': '14rem',
            'margin': '0 1rem 0.5rem 1rem',
            'color': '#666',
            'font-size': '0.74rem'
        };
        // var downBtnFS = clientWidth > 1000 ? (13.4 * rem - 80) / 17 : sizeFont;
        style['.downBtn'] = {
            'background-color': '#25bc61',
            'height': '2.1rem',
            'line-height': '2.1rem',
            'width': '13.4rem',
            'padding': '0  0.8rem',
            'margin': '0 0.5rem 0.5rem 0.5rem',
            'radius': '0.33rem',
            '-webkit-border-radius': '0.33rem',
            '-moz-border-radius': '0.33rem',
            'color': '#fff',
            'text-decoration': 'none',
            'display': 'block',
            'font-size': '0.70rem',
            '-moz-box-shadow': '0px 2px 3px #ccc',
            '-webkit-box-shadow': '0px 2px 3px #ccc',
            'box-shadow': '0px 2px 3px #ccc'
        };
        style['.dutyDesc'] = {
            'background-color': '#ffeb81',
            'width': '13.4rem',
            'padding': '0.5rem 0.8rem',
            'margin': '0 0.5rem 0.2rem 0.5rem',
            'height': '6.5rem',
            'radius': '0.33rem',
            '-webkit-border-radius': '0.33rem',
            '-moz-border-radius': '0.33rem',
            'color': '#474747',
            '-moz-box-shadow': '0px 2px 3px #ccc',
            '-webkit-box-shadow': '0px 2px 3px #ccc',
            'box-shadow': '0px 2px 3px #ccc',
            'background': 'rgba(255, 235, 129, 0.7) none repeat scroll 0 0 !important',
            'filter': 'Alpha(opacity=70)'
        };
        style['.duty'] = {
            'height': '1rem',
            'line-height': '1rem',
            'font-size': '0.74rem',
            'margin-bottom': '0.2rem'
        };
        style['.dutyIntro'] = {
            'height': '1.5rem',
            'line-height': '1.5rem',
            'font-weight': 'bold',
            'font-size': '1.4rem',
            'margin-bottom': '0.2rem'
        };


        // page 2
        style['.item2'] = {
            display: 'none'
        };
        style['.page'] = {
            'box-sizing': 'border-box',
            'padding': '1.125rem',
            'position': 'relative'
        };
        var bgWidth = 335 / 380 * clientWidth;
        style['.bg'] = {
            'padding': '1.125rem',
            'position': 'relative',
            'width': '90%',
            'margin': '10% auto 0',
            // 'height': clientHeight * 0.8 + 'px',
            // 'position': 'absolute',
            // 'left': (clientWidth - bgWidth) / 2 + 'px',
            // 'bottom': 0,
            // 'background': 'rgba(255, 255, 255, 0.7)',
            'box-sizing': 'border-box',
            'position': 'absolute',
            'left': '5%',
            'bottom': 0,
            'height': '95%'
        };

        /* 问题部分 */
        style['.quiz-title'] = {
            'box-sizing': 'border-box',
            'border-left': '0.3125rem solid #fa4727',
            'padding-left': '0.3125rem',
            'color': '#fa4727',
            'font-weight': 'bold',
            'font-size': '1rem'
        };
        style['.quiz-title p'] = {
            'margin-bottom': '0.3125rem'
        };
        style['.quiz-title p:first-of-type'] = {
            'color': 'black',
            'font-size': '0.875rem'
        };
        style['.quiz'] = {
            'border-bottom': '2px solid #db5943',
            'margin-bottom': '1.5rem'
        };
        style['#quiz-answer'] = {
            'text-align': 'left',
            'font-size': '1rem',
            'margin': '1.8rem 0',
            'display': 'none'
        };

        style['.answer-option'] = {
            'text-align': 'left',
            'display': 'block',
            'width': '100%',
            'float': 'left',
            'font-size': '0.8125rem',
            'font-weight': 'bold',
            'margin-bottom': '0.625rem'
        };
        style['.answer-option input'] = {
            'margin-right': '0.3125rem'
        };
        style['#quiz-options'] = {
            'width': '100%',
            'text-align': 'center',
            'margin-bottom': '2rem',
            'display': 'none'
        };

        style['.clear'] = {
            clear: 'both',
            display: 'block'
        };


        /* 账号部分 */
        style['.account-btn'] = {
            'font-size': '0.75rem',
            'padding': '0.1875rem 0.625rem',
            'border-radius': '0.3125rem',
            'width': '100%'
        };

        style['.require-validate'] = {
            'background-color': 'transparent',
            'border': '1px solid #ed6a4e',
            'color': '#ed6a4e',
            'font-weight': 'bold'
        };

        style['.account-btn-login'] = {
            'color': 'white',
            'background-color': '#26bc62',
            'border': 'none'
        };

        style['.require-validate.disabled'] = {
            'color': 'gray',
            'border-color': 'gray'
        };

        style['.account-unknown'] = {
            // display: 'none'
        };

        style['.account-title'] = {
            'font-size': '0.875rem',
            'font-weight': 'bold',
            'margin-bottom': '0.625rem'
        };

        style['.account-unknown label'] = {
            'font-size': '0.75rem',
            'font-weight': 'bold'
        };

        // style['.account-unknown input'] = {
        //     'border':'none',
        //     'border': '1px solid rgba(0,0,0,0.3)',
        //     'box-shadow': 'inset 0 0 2px rgba(0,0,0,0.3)',
        //     height: '1.5625rem'
        // }
        style['.account-unknown .text-input'] = {
            'border': 'none',
            'border': '1px solid rgba(0,0,0,0.3)',
            'box-shadow': 'inset 0 0 2px rgba(0,0,0,0.3)',
            'height': '1.5625rem',
            'width': '9.125rem',
            'font-size': '0.75rem'
        };

        style['.account-unknown table'] = {
            'width': '100%',
            'margin-bottom': '1.25rem'
        };

        style['.account-unknown table td'] = {
            'padding-bottom': '0.625rem'
        };
        style['.account'] = {
            'margin-bottom': '1.875rem'
        };
        style['.warn'] = {
            display: 'none'
        };
        style['.warn h3'] = {
            'color': '#fb5137',
            'font-size': '1rem',
            'margin-bottom': '0.625rem'
        };
        style['.warn p'] = {
            'margin-left': '1.25rem',
            'font-size': '0.875rem',
            'line-height': '1.125rem'
        };
        style['.account-known p'] = {
            'float': 'left',
            'width': '50%',
            'font-size': '14px',
            'padding': '0 10px',
            'box-sizing': 'border-box'
        };
        style['.account-known div'] = {
            'width': '50%',
            'float': 'right'
        };
        style['.account-known button'] = {
            'border': 'none',
            'color': 'white',
            'padding': '5px 20px',
            'border-radius': '5px',
            'background-color': '#fa4727',
            'display': 'block',
            'margin': '0 auto'
        };
        style['.account-known:after'] = {
            content: '',
            display: 'block',
            clear: 'both'
        };


        /* 提交按钮部分 */
        style['.btns'] = {
            width: '100%'
            // position: 'absolute',
            // left: '0',
            // bottom: '10px'
        };
        style['.btn'] = {
            'width': '16.25rem',
            'height': '2.5rem',
            'border-radius': '0.3125rem',
            'border': 'none',
            'margin': '0 auto',
            'margin-bottom': '0.625rem',
            'display': 'block',
            'font-size': '1rem'
        };
        style['.btn-submit'] = {
            'color': 'white',
            'background-color': '#26bc62'
        };
        style['.btn-return'] = {
            'background-color': 'transparent',
            'border': '1px solid #ed6a4e'
        };

        // page 3
        style['.item3'] = {
            display: 'none'
        };
        style['.info'] = {
            'height': '50%',
            'border-bottom': '1px solid #db624d',
            'position': 'relative'
        };
        style['.info-text'] = {
            'background-image': 'url(//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.3/rs_img/envelope.png)',
            'background-repeat': 'no-repeat',
            'background-size': '12.5rem',
            'background-position': '50% 100%',

            'width': '12.5rem',
            'height': '12.5rem',
            'position': 'absolute',
            'left': '50px',
            'bottom': '0'
        };
        style['.info-result-title'] = {
            'margin-top': '2.5rem',
            'text-align': 'center'
        };
        style['.cup'] = {
            width: '1.25rem',
            height: '1.25rem',
            position: 'absolute',
            left: '-1.5625rem',
            bottom: '0'
        };
        style['.info-result-title p:first-of-type'] = {
            'font-size': '1rem',
            'color': 'red',
            'font-weight': 'bold',
            'display': 'inline-block',
            'position': 'relative'
        };
        style['.info-result-title p:last-of-type'] = {
            'font-size': '0.875rem',
            'color': 'red',
            'margin-top': '0.5rem'
        };
        style['.info-result-detail'] = {
            'margin': '2.5rem auto 0',
            'font-size': '0.75rem',
            'color': 'white',
            'width': '6.5rem'
        };
        style['.please-wait'] = {
            'font-size': '0.75rem',
            'margin-top': '1.25rem'
        };
        style['.btns-download'] = {
            'margin-top': '1.25rem'
        };
        style['.btns-download .button'] = {
            'display': 'block',
            'margin': '0.625rem auto 0',
            'border-radius': '5px'
        };
        style['.checkout'] = {
            'font-size': '0.875rem',
            'padding': '0.3125rem 3.125rem',
            'color': 'white',
            'border': 'none',
            'background-color': '#26bc62'
        };
        style['.checkout a'] = {
            color: 'white'
        };
        style['.download'] = {
            'font-size': '0.8125rem',
            'background-color': 'transparent',
            'color': '#fe5b52',
            'border': '2px solid #fe5b52',
            'padding': '0.3125rem 0.625rem',
            'font-weight': 'bold',
            'position': 'relative'
        };
        style['.btns-download button.download'] = {
            'margin-left': '5rem'
        };
        style['.download a'] = {
            color: '#fe5b52'
        };
        style['.download img'] = {
            width: '1.5625rem',
            height: '1.5625rem',
            position: 'absolute',
            left: '-2.1875rem',
            top: '0'
        };

        style['.last-return-container'] = {
            width: '100%',
            // 'margin-top': '0.625rem'
            position: 'absolute',
            bottom: '1.25rem',
            left: '0'
        };
        style['.last-return'] = {
            'border': 'none',
            'background-color': '#fe473f',
            'font-size': '0.875rem',
            'color': 'white',
            'margin': '0 auto',
            'display': 'block'
        };
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
