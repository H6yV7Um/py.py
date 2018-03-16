/**
 * @file feedback content
 */
/* eslint-disable max-len */
/* globals oojs */
oojs.define({
    name: 'Feedback',
    namespace: 'TemplateServer.',
    deps: {
        string: 'TemplateServer.Common.Utility.String',
        basic: 'TemplateServer.Template.basic'
    },

    addFeedback: function (layoutObj, styleObj, requestInfo) {
        try {
            var engine = this.basic;
            var logInfoDiv = engine.getLayout(fullConfig);
            logInfoDiv.class = 'logInfoDiv';
            logInfoDiv.id = 'logInfoDiv';
            styleObj['.logInfoDiv'] = {
                'display': 'none'
            };
            var dspDiv = engine.getLayout(fullConfig);
            dspDiv.class = 'dspDiv';
            dspDiv.id = 'dspDiv';
            styleObj['.dspDiv'] = {
                'display': 'none'
            };
            dspDiv.innerHTML = requestInfo.client && requestInfo.client.account;
            // dspId:发送日志参数
            logInfoDiv.innerHTML = requestInfo.styleConfig && requestInfo.styleConfig.logInfo
            && requestInfo.styleConfig.logInfo.closefeedback
            && requestInfo.styleConfig.logInfo.closefeedback.toString('utf8');
            // s:发送日志参数-反馈日志md5加密字符串
            layoutObj.childNodes.push(logInfoDiv);
            layoutObj.childNodes.push(dspDiv);
            var userConfig = requestInfo.styleConfig.userConfig;
            var fullConfig = requestInfo.styleConfig.fullConfig;
            var containerStyle = engine.getContainerStyle(fullConfig);
            // 80001时adIconType有可能为0（0-mobile,1-PC）
            var flowType = fullConfig.adIconType || 2;
            flowType = flowType === 0 ? 2 : flowType;
            layoutObj.childNodes.push(this.addFeedbackTip({'adW': containerStyle.width,
            'adH': containerStyle.height,
            'flowType': flowType}, styleObj));// 添加悬浮样式
            layoutObj.childNodes.push(this.addFeedbackIcon({'adW': containerStyle.width,
            'adH': containerStyle.height,
            'flowType': flowType}, styleObj));// 添加红点标识
            layoutObj.childNodes.push(this.getFeedback({'adW': containerStyle.width,
            'adH': containerStyle.height,
            'flowType': flowType}, styleObj));// 添加反馈内容
            return {layoutObj: layoutObj, styleObj: styleObj};
           // }
        }
        catch (e) {

        }
    },

    addFeedbackIcon: function (options, style) {
        var engine = this.basic;
        var fbIconDiv = engine.getLayout();
        fbIconDiv.class = 'fbIconDiv';
        fbIconDiv.id = 'fbIconDiv';
        fbIconDiv.flowType = options.flowType;
        var fbIcon = engine.getLayout();
        fbIcon.class = 'fbIcon';
        fbIcon.id = 'fbIcon';
        var bottomDis = options.flowType === 1 ? 12 : 10;
        var fbIconDivWidth = options.flowType === 2 ? 40 : 30;// logo (14*14,16*16) adIcon(26*14,30*16)
        style['.fbIconDiv'] = {
            'height': '16px',
            'width': fbIconDivWidth + 'px',
            'position': 'absolute',
            'bottom': '0px',
            'right': '0px',
            'cursor': 'pointer',
            'z-index': '2147483648'
        };
        style['.fbIcon'] = {
            'border-left': '1px solid #fff',
            'border-bottom': '1px solid #fff',
            'background-color': '#ff0000',
            'height': '3px',
            'width': '3px',
            'position': 'absolute',
            'bottom': bottomDis + 'px',
            'right': '0px',
            'overflow': 'hidden'
        };
        fbIconDiv.childNodes.push(fbIcon);
        return fbIconDiv;
    },

    addFeedbackTip: function (options, style) {
        var engine = this.basic;
        var fbTipDiv = engine.getLayout();
        fbTipDiv.class = 'fbTipDiv';
        fbTipDiv.id = 'fbTipDiv';
        var fbTipSpan1 = engine.getLayout();
        fbTipSpan1.tagName = 'span';
        fbTipSpan1.class = 'fbTipSpan1';
        fbTipSpan1.id = 'fbTipSpan1';
        var fbTipSpan2 = engine.getLayout();
        fbTipSpan2.tagName = 'span';
        fbTipSpan2.class = 'fbTipSpan2';
        fbTipSpan2.id = 'fbTipSpan2';
        style['.fbTipDiv'] = {
            'height': '14px',
            'width': '96px',
            'position': 'absolute',
            'bottom': '18px',
            'right': '0px',
            'cursor': 'pointer',
            'padding': '2px',
            'background-color': '#ccc',
            'opacity': '0.95',
            'filter': 'alpha(Opacity=80)',
            '-moz-opacity': '0.5',
            'font-family': '宋体',
            'font-size': '12px',
            'display': 'none',
            'z-index': '2147483648'
        };
        style['.fbTipSpan1'] = {
            'color': '#000'
        };
        style['.fbTipSpan2'] = {
            'color': '#7eccff'
        };
        fbTipSpan1.innerHTML = '不想看，';
        fbTipSpan2.innerHTML = '停止显示';
        fbTipDiv.childNodes.push(fbTipSpan1);
        fbTipDiv.childNodes.push(fbTipSpan2);
        return fbTipDiv;
    },

    getFeedback: function (options, style) {
        var feedbackCon = {};
        if (options.flowType === 1) {
            feedbackCon = this.getFeedbackPC(options, style);
        }
        else {
            feedbackCon = this.getFeedbackM(options, style);
        }
        return feedbackCon;
    },

    getFeedbackPC: function (options, style) {
        var result = '';
        var engine = this.basic;
        var feedbackCon = engine.getLayout();
        feedbackCon.class = 'feedbackCon';
        feedbackCon.id = 'feedbackCon';

        var feedbackLogoImg = engine.getLayout();
        feedbackLogoImg.tagName = 'img';
        feedbackLogoImg.class = 'feedbackLogoImg';

        var feedbackLogo = engine.getLayout();
        feedbackLogo.tagName = 'a';
        feedbackLogo.target = '_blank';
        feedbackLogo.class = 'feedbackLogo';
        feedbackLogo.id = 'feedbackLogo';

        var feedbackDiv = engine.getLayout();
        feedbackDiv.class = 'feedbackDiv';
        feedbackDiv.id = 'feedbackDiv';

        var feedbackTit = engine.getLayout();
        feedbackTit.tagName = 'span';
        feedbackTit.class = 'feedbackTit';
        feedbackTit.id = 'feedbackTit';

        var feedbackBorder = engine.getLayout();
        feedbackBorder.class = 'feedbackBorder';
        feedbackBorder.id = 'feedbackBorder';

        var feedbackCX = engine.getLayout();
        feedbackCX.tagName = 'span';
        feedbackCX.class = 'feedbackCX';
        feedbackCX.id = 'feedbackCX';
        var feedbackQue = engine.getLayout();
        feedbackQue.class = 'feedbackQue';
        feedbackQue.id = 'feedbackQue';
        var feedbackAns1 = engine.getLayout();
        feedbackAns1.class = 'feedbackAns1';
        feedbackAns1.id = 'feedbackAns1';
        var feedbackTSBtn = engine.getLayout();
        feedbackTSBtn.class = 'feedbackTSBtn';
        feedbackTSBtn.id = 'feedbackTSBtn';

        var feedbackTS = engine.getLayout();
        feedbackTS.class = 'feedbackTS';
        feedbackTS.id = 'feedbackTS';

        var feedbackTit2 = engine.getLayout();
        feedbackTit2.class = 'feedbackTit2';
        feedbackTit2.tagName = 'span';
        feedbackTit2.id = 'feedbackTit2';
        var feedbackBorder2 = engine.getLayout();
        feedbackBorder2.class = 'feedbackBorder2';
        feedbackBorder2.id = 'feedbackBorder2';
        var feedbackCX2 = engine.getLayout();
        feedbackCX2.class = 'feedbackCX2';
        feedbackCX2.tagName = 'span';
        feedbackCX2.id = 'feedbackCX2';
        var feedbackQue2 = engine.getLayout();
        feedbackQue2.class = 'feedbackQue2';
        feedbackQue2.id = 'feedbackQue2';
        var feedbackQueDiv = engine.getLayout();
        // feedbackQueDiv.tagName = 'input';
        feedbackQueDiv.class = 'feedbackQueDiv';
        feedbackQueDiv.id = 'feedbackQueDiv';
        var feedbackQueInput = engine.getLayout();// 请输入...
        feedbackQueInput.tagName = 'input';
        feedbackQueInput.class = 'feedbackQueInput';
        feedbackQueInput.id = 'feedbackQueInput';
        var feedbackQueArrow = engine.getLayout();// 箭头
        feedbackQueArrow.class = 'feedbackQueArrow';
        feedbackQueArrow.id = 'feedbackQueArrow';
        var feedbackQueUl = engine.getLayout();
        feedbackQueUl.tagName = 'ul';
        feedbackQueUl.class = 'feedbackQueUl';
        feedbackQueUl.id = 'feedbackQueUl';
        var feedbackQueList1 = engine.getLayout();// 内容低俗
        feedbackQueList1.class = 'feedbackQueList1';
        feedbackQueList1.id = 'feedbackQueList1';
        feedbackQueList1.tagName = 'li';
        var feedbackQueList2 = engine.getLayout();// 内容虚假
        feedbackQueList2.class = 'feedbackQueList2';
        feedbackQueList2.id = 'feedbackQueList2';
        feedbackQueList2.tagName = 'li';
        var feedbackQueList3 = engine.getLayout();// 不美观
        feedbackQueList3.class = 'feedbackQueList3';
        feedbackQueList3.id = 'feedbackQueList3';
        feedbackQueList3.tagName = 'li';
        var feedbackEDiv = engine.getLayout();
        feedbackEDiv.class = 'feedbackEDiv';
        feedbackEDiv.id = 'feedbackEDiv';
        var feedbackEmail = engine.getLayout();
        feedbackEmail.class = 'feedbackEmail';
        feedbackEmail.id = 'feedbackEmail';
        feedbackEmail.tagName = 'input';
        var feedbackTHSLeft = engine.getLayout();
        feedbackTHSLeft.class = 'feedbackTHSLeft';
        feedbackTHSLeft.id = 'feedbackTHSLeft';
        var feedbackTHSRight = engine.getLayout();
        feedbackTHSRight.class = 'feedbackTHSRight';
        feedbackTHSRight.id = 'feedbackTHSRight';
        var feedbackBtn2 = engine.getLayout();
        feedbackBtn2.class = 'feedbackBtn2';
        feedbackBtn2.id = 'feedbackBtn2';

        feedbackQueList1.innerHTML = '内容低俗';
        feedbackQueList2.innerHTML = '内容虚假';
        feedbackQueList3.innerHTML = '不美观';
        feedbackTit2.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;将为您停止此次推广展示&nbsp;&nbsp;';
        feedbackCX2.innerHTML = '撤销';
        feedbackQue2.innerHTML = '您投诉该推广的原因是：';
        feedbackBtn2.innerHTML = '确认';
        feedbackQueInput.value = '请输入…';
        feedbackEDiv.innerHTML = '（选填）您的邮箱：';

        // 感谢页
        var feedbackGX = engine.getLayout();
        feedbackGX.class = 'feedbackDiv';
        feedbackGX.id = 'feedbackGX';

        var feedbackTit3 = engine.getLayout();
        feedbackTit3.tagName = 'span';
        feedbackTit3.class = 'feedbackTit';
        feedbackTit3.id = 'feedbackTit3';

        var feedbackBorder3 = engine.getLayout();
        feedbackBorder3.class = 'feedbackBorder';
        feedbackBorder3.id = 'feedbackBorder3';
        var spanBorderL3 = engine.getLayout();
        spanBorderL3.tagName = 'span';
        spanBorderL3.class = 'spanBorderL';
        var spanBorderR3 = engine.getLayout();
        spanBorderR3.tagName = 'span';
        spanBorderR3.class = 'spanBorderR';
        var feedbackCX3 = engine.getLayout();
        feedbackCX3.tagName = 'span';
        feedbackCX3.class = 'feedbackCX';
        feedbackCX3.id = 'feedbackCX3';
        var feedbackLJXQ = engine.getLayout();
        feedbackLJXQ.tagName = 'a';
        feedbackLJXQ.class = 'feedbackCX';
        feedbackLJXQ.target = '_blank';
        feedbackLJXQ.id = 'feedbackLJXQ';
        var feedbackGXDes = engine.getLayout();
        feedbackGXDes.class = 'feedbackGXDes';
        feedbackTit3.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;感谢您的反馈！&nbsp;&nbsp';
        feedbackCX3.innerHTML = '撤销';
        feedbackLJXQ.innerHTML = '了解详情';
        feedbackLJXQ.href = 'http://yingxiao.baidu.com/zhichi/knowledge/detail.action?channelId=3&classId=10845&knowledgeId=14394';
        feedbackGXDes.innerHTML = '我们将努力改善您的浏览体验。';

        feedbackBorder3.childNodes.push(spanBorderL3);
        feedbackBorder3.childNodes.push(spanBorderR3);
        feedbackBorder3.childNodes.push(feedbackTit3);
        feedbackBorder3.childNodes.push(feedbackCX3);
        feedbackBorder3.childNodes.push(feedbackLJXQ);
        feedbackGX.childNodes.push(feedbackBorder3);
        feedbackGX.childNodes.push(feedbackGXDes);


        if (options.adW / options.adH < 2) {

            feedbackTit.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;将为您停止此次推广展示&nbsp;&nbsp;';
            feedbackCX.innerHTML = '撤销';
            feedbackQue.innerHTML = '此推广有什么问题？';
            feedbackTSBtn.innerHTML = '投诉跟踪';
            feedbackAns1.innerHTML = '<input name="feedbackAns" type="radio" value="丑陋" id="ans1" reasonId="11"/><label for="ans1"> 丑陋</label><br/>';// reasonid:11
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="动画干扰" id="ans2" reasonId="12"/><label for="ans2"> 动画干扰</label><br/>';// reasonid:12
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="内容不宜" id="ans3" reasonId="19"/><label  for="ans3"> 内容不宜</label><br/>';// reasonid:19
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="不感兴趣" id="ans4" reasonId="20"/><label  for="ans4"> 不感兴趣</label><br/>';// reasonid:20
            var spanBorderL = engine.getLayout();
            spanBorderL.tagName = 'span';
            spanBorderL.class = 'spanBorderL';
            var spanBorderR = engine.getLayout();
            spanBorderR.tagName = 'span';
            spanBorderR.class = 'spanBorderR';
            feedbackBorder.childNodes.push(spanBorderL);
            feedbackBorder.childNodes.push(spanBorderR);
            feedbackBorder.childNodes.push(feedbackTit);
            feedbackBorder.childNodes.push(feedbackCX);
            feedbackDiv.childNodes.push(feedbackBorder);
            feedbackDiv.childNodes.push(feedbackQue);
            feedbackDiv.childNodes.push(feedbackAns1);
            feedbackDiv.childNodes.push(feedbackTSBtn);
            // 矩形
            if (options.adW / options.adH < 2 && options.adW / options.adH >= 1) {
                var adW = options.adW * 9 / 10;
                var adH = options.adH * 9 / 10;
                var cxFS = 20; // Math.min(adH / 7, adW / 12);// 撤销的字体大小
                var queFS = 20;// Math.min(adH / 7, adW / 16);// 问题的字体大小
                // cxFS = Math.max(cxFS, 12);
                // queFS = Math.max(queFS, 12);
                style['.feedbackCon'] = {
                    'background': 'url({{dupDomain}}/cpro/exp/closead/img/bg_rb.png) no-repeat bottom right',
                    'width': options.adW + 'px',
                    'height': options.adH + 'px',
                    'background-color': '#fff',
                    'font-family': '微软雅黑',
                    'display': 'none',
                    'position': 'absolute',
                    'z-index': '2147483649',
                    'left': '0px',
                    'top': '0px'
                };
                style['.feedbackDiv'] = {
                    // 'background': 'url(https://{{dupDomain}}/cpro/exp/closead/img/bg_rb.png)',
                    'width': adW + 'px',
                    'height': adH + 'px',
                    'padding': adH / 20 + 'px ' + adW / 20 + 'px'
                };
                style['.feedbackTit'] = {
                    // 'height': adH / 3 + 'px',
                    // 'line-height': adH / 3 + 'px',
                    'width': adW + 'px',
                    'font-weight': 'bold'
                    // 'font-size': '24px'
                    // Math.min(adH / 5, adW / 12) + 'px',
                    // 'border-left': '2px solid #7eccff'
                };
                style['.feedbackBorder'] = {
                    // 'border-left': '2px solid #408fef'
                };
                style['.spanBorderL'] = {
                    'border-left': '2px solid #7eccff'
                };
                style['.spanBorderR'] = {
                    'border-left': '2px solid #408fef'
                };
                style['.feedbackCX'] = {
                    // 'height': adH / 6 + 'px',
                    // 'line-height': adH / 6 + 'px',
                    // 'margin-left': '5px',
                    'margin-right': '5px',
                    'width': adW + 'px',
                    // 'font-size': cxFS + 'px',
                    'color': '#7eccff',
                    'text-decoration': 'underline',
                    'cursor': 'pointer'
                };
                style['.feedbackQue'] = {
                    // 'height': adH / 4 + 'px',
                    // 'line-height': adH / 3 + 'px',
                    'margin-top': '5px',
                    'width': adW + 'px'
                    // 'font-size': cxFS + 'px'
                };
                style['.feedbackAns1 input'] = {
                    // 'height': adH / 24 + 'px',
                    // 'width': adH / 12 + 'px',
                    'margin-top': '5px',
                    // 'font-size': cxFS + 'px'
                    // 'vertical-align': 'middle'
                };
                style['.feedbackAns1'] = {
                    'float': 'left',
                    'cursor': 'pointer'
                    // 'line-height': '30px',
                    // 'height': adH / 3  + 'px',
                    // 'line-height': adH / 3 + 'px',
                    // 'font-size': cxFS + 'px'
                    // 'width': adW + 'px',
                    // 'font-size': Math.max(adH / 18, 12) + 'px'
                };
                style['.feedbackTSBtn'] = {
                    // 'height': Math.min(adH / 3, queFS + 20) + 'px',
                    // 'line-height': Math.min(adH / 3, queFS + 20) + 'px',
                    'clear': 'both',
                    'width': queFS * 8 + 'px',
                    // 'font-size': queFS + 'px',
                    'color': '#7eccff',
                    'border': '1px solid #7eccff',
                    '-moz-border-radius': adH / 3 + 'px',      /* Gecko browsers */
                    '-webkit-border-radius': adH / 3 + 'px',    /* Webkit browsers */
                    'border-radius': adH / 3 + 'px',
                    'text-align': 'center',
                    'margin-left': '5px',
                    'margin-top': '5px',
                    'float': 'left',
                    'cursor': 'pointer'
                };
                style['.feedbackTSBtn:hover'] = {
                    'color': '#fff',
                    'background-color': '#7eccff',
                    'cursor': 'pointer'
                };
            }
            // 竖幅
            else if (options.adW / options.adH < 1) {
                var adW = options.adW * 9 / 10;
                var adH = options.adH * 9 / 10;
                var cxFS = Math.min(adH / 7, adW / 12);// 撤销的字体大小
                var queFS = Math.min(adH / 7, adW / 16);// 问题的字体大小
                cxFS = Math.max(cxFS, 12);
                queFS = Math.max(queFS, 12);
                style['.feedbackCon'] = {
                    'background': 'url({{dupDomain}}/cpro/exp/closead/img/bg_rb.png) no-repeat bottom right',
                    'width': options.adW + 'px',
                    'height': options.adH + 'px',
                    'font-family': '微软雅黑',
                    'display': 'none',
                    'background-color': '#fff',
                    'position': 'absolute',
                    'z-index': '2147483649',
                    'left': '0px',
                    'top': '0px'
                };
                style['.feedbackDiv'] = {
                    // 'background': 'url(https://{{dupDomain}}/cpro/exp/closead/img/bg_rb.png)',
                    'width': adW + 'px',
                    'height': adH + 'px',
                    'padding': adH / 20 + 'px ' + adW / 20 + 'px'
                };
                style['.feedbackTit'] = {
                    // 'height': adH / 3 + 'px',
                    // 'line-height': adH / 3 + 'px',
                    'width': adW + 'px',
                    'font-weight': 'bold'
                    // 'font-size': Math.min(adH / 5, adW / 12) + 'px'
                    // 'border-left': '2px solid #7eccff'
                };
                style['.feedbackBorder'] = {
                    // 'border-left': '2px solid #408fef'
                };
                style['.spanBorderL'] = {
                    'border-left': '2px solid #7eccff'
                };
                style['.spanBorderR'] = {
                    'border-left': '2px solid #408fef'
                };
                style['.feedbackCX'] = {
                    // 'height': adH / 6 + 'px',
                    // 'line-height': adH / 6 + 'px',
                    // 'margin-left': '5px',
                    'margin-right': '5px',
                    'width': adW + 'px',
                    //  'font-size': cxFS + 'px',
                    'color': '#7eccff',
                    'text-decoration': 'underline',
                    'cursor': 'pointer'
                };
                style['.feedbackQue'] = {
                    // 'height': adH / 4 + 'px',
                    // 'line-height': adH / 3 + 'px',
                    'width': adW + 'px',
                    'margin-top': '5px'
                    // 'font-size': cxFS + 'px'
                };
                style['.feedbackAns1 input'] = {
                    // 'height': adH / 24 + 'px',
                    // 'width': adH / 12 + 'px',
                    'margin-top': '5px',
                    // 'font-size': cxFS + 'px',
                    'vertical-align': 'middle'
                };
                style['.feedbackAns1'] = {
                    'float': 'left',
                    'cursor': 'pointer',
                    // 'height': adH / 3  + 'px',
                    // 'line-height': adH / 3 + 'px',
                    // 'font-size': cxFS + 'px'
                    // 'width': adW + 'px',
                    // 'font-size': Math.max(adH / 18, 12) + 'px'
                };
                style['.feedbackTSBtn'] = {
                    // 'height': Math.min(adH / 3, queFS + 20) + 'px',
                    // 'line-height': Math.min(adH / 3, queFS + 20) + 'px',
                    'clear': 'both',
                    'width': queFS * 8 + 'px',
                    // 'font-size': queFS + 'px',
                    'color': '#7eccff',
                    'border': '1px solid #7eccff',
                    '-moz-border-radius': adH / 3 + 'px',      /* Gecko browsers */
                    '-webkit-border-radius': adH / 3 + 'px',    /* Webkit browsers */
                    'border-radius': adH / 3 + 'px',
                    'text-align': 'center',
                    'margin-left': '5px',
                    'margin-top': '5px',
                    'float': 'left',
                    'cursor': 'pointer'
                };
                style['.feedbackTSBtn:hover'] = {
                    'color': '#fff',
                    'background-color': '#7eccff',
                    'cursor': 'pointer'
                };
            }
            var spanBorderL2 = engine.getLayout();
            spanBorderL2.tagName = 'span';
            spanBorderL2.class = 'spanBorderL2';
            var spanBorderR2 = engine.getLayout();
            spanBorderR2.tagName = 'span';
            spanBorderR2.class = 'spanBorderR2';
            feedbackBorder2.childNodes.push(spanBorderL2);
            feedbackBorder2.childNodes.push(spanBorderR2);
            feedbackBorder2.childNodes.push(feedbackTit2);
            feedbackBorder2.childNodes.push(feedbackCX2);
            feedbackTS.childNodes.push(feedbackBorder2);
            // feedbackTS.childNodes.push(feedbackTit2);
            // feedbackTS.childNodes.push(feedbackCX2);
            feedbackTS.childNodes.push(feedbackQue2);
            feedbackQueDiv.childNodes.push(feedbackQueInput);
            feedbackQueDiv.childNodes.push(feedbackQueArrow);
            feedbackTS.childNodes.push(feedbackQueDiv);
            feedbackQueUl.childNodes.push(feedbackQueList1);
            feedbackQueUl.childNodes.push(feedbackQueList2);
            feedbackQueUl.childNodes.push(feedbackQueList3);
            feedbackTS.childNodes.push(feedbackQueUl);
            feedbackTS.childNodes.push(feedbackEDiv);
            feedbackTS.childNodes.push(feedbackEmail);
            feedbackTS.childNodes.push(feedbackBtn2);
        }
        else {// 横幅
            feedbackTit.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;将为您停止此次推广展示&nbsp;&nbsp;';
            feedbackCX.innerHTML = '撤销';
            feedbackQue.innerHTML = '此推广有什么问题？';
            feedbackTSBtn.innerHTML = '投诉跟踪';
            feedbackAns1.innerHTML = '<input name="feedbackAns" type="radio" value="丑陋" id="ans1" reasonId="11"/><label for="ans1"> 丑陋</label>  ';
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="动画干扰" id="ans2" reasonId="12"/><label for="ans2"> 动画干扰</label>  ';
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="内容不宜" id="ans3" reasonId="19"/><label  for="ans3"> 内容不宜</label>  ';
            feedbackAns1.innerHTML += '<input name="feedbackAns" type="radio" value="不感兴趣" id="ans4" reasonId="20"/><label  for="ans4"> 不感兴趣</label>  ';
            feedbackBorder.childNodes.push(feedbackTit);
            feedbackBorder.childNodes.push(feedbackCX);
            feedbackDiv.childNodes.push(feedbackBorder);
            // feedbackDiv.childNodes.push(feedbackCX);
            feedbackDiv.childNodes.push(feedbackQue);
            feedbackDiv.childNodes.push(feedbackAns1);
            feedbackDiv.childNodes.push(feedbackTSBtn);
            var adW = options.adW * 9 / 10;
            var adH = options.adH * 9 / 10;
            var cxFS = Math.min(adH / 7, adW / 12);// 撤销的字体大小
            var queFS = Math.min(adH / 7, adW / 16);// 问题的字体大小
            cxFS = Math.max(cxFS, 12);
            queFS = Math.max(queFS, 12);
            style['.feedbackCon'] = {
                'background': 'url({{dupDomain}}/cpro/exp/closead/img/bg_rb.png) no-repeat bottom right',
                'width': options.adW + 'px',
                'height': options.adH + 'px',
                'font-family': '微软雅黑',
                'display': 'none',
                'background-color': '#fff',
                'position': 'absolute',
                'z-index': '2147483649',
                'left': '0px',
                'top': '0px'
            };
            style['.feedbackDiv'] = {
                // 'background': 'url(https://{{dupDomain}}/cpro/exp/closead/img/bg_rb.png)',
                'width': adW + 'px',
                'height': adH + 'px',
                'padding': adH / 20 + 'px ' + adW / 20 + 'px'
            };
            style['.feedbackTit'] = {
                // 'height': adH / 3 + 'px',
                // 'line-height': adH / 3 + 'px',
                'width': adW + 'px',
                'font-weight': 'bold',
                // 'font-size': Math.min(adH / 5, adW / 12) + 'px',
                'border-left': '2px solid #7eccff',
                'font-weight': 'bold'
            };
            style['.feedbackBorder'] = {
                'border-left': '2px solid #408fef'
            };
            style['.feedbackCX'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'margin-left': '5px',
                'margin-right': '5px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            };
            style['.feedbackQue'] = {
                'height': adH / 4 + 'px',
                'line-height': adH / 3 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackAns1 input'] = {
                // 'height': adH / 24 + 'px',
                // 'width': adH / 12 + 'px',
                // 'font-size': cxFS + 'px',
                'vertical-align': 'middle'
            };
            style['.feedbackAns1'] = {
                'float': 'left',
                'cursor': 'pointer',
                'height': adH / 3  + 'px',
                'line-height': adH / 3 + 'px',
                // 'font-size': cxFS + 'px'
                // 'width': adW + 'px',
                // 'font-size': Math.max(adH / 18, 12) + 'px'
            };
            /*style['.feedbackAns2'] = {
                'height': adH / 12 + 'px',
                'line-height': adH / 12 + 'px',
                'width': adW + 'px',
                'font-size': queFS + 'px'
            };
            style['.feedbackAns4'] = {
                'height': adH / 12 + 'px',
                'line-height': adH / 12 + 'px',
                'width': adW + 'px',
                'font-size': queFS + 'px'
            };
            style['.feedbackAns4'] = {
                'height': adH / 12 + 'px',
                'line-height': adH / 12 + 'px',
                'width': adW + 'px',
                'font-size': queFS + 'px'
            };*/
            style['.feedbackTSBtn'] = {
                // 'height': Math.min(adH / 3, queFS + 20) + 'px',
                // 'line-height': Math.min(adH / 3, queFS + 20) + 'px',
                'width': queFS * 8 + 'px',
                // 'font-size': queFS + 'px',
                'color': '#7eccff',
                'border': '1px solid #7eccff',
                '-moz-border-radius': adH / 3 + 'px',      /* Gecko browsers */
                '-webkit-border-radius': adH / 3 + 'px',    /* Webkit browsers */
                'border-radius': adH / 3 + 'px',
                'text-align': 'center',
                'margin-left': '5px',
                // 'margin-top': '5px',
                'float': 'left',
                'cursor': 'pointer'
            };
            style['.feedbackTSBtn:hover'] = {
                'color': '#fff',
                'background-color': '#7eccff',
                'cursor': 'pointer'
            };
            /*feedbackTS.childNodes.push(feedbackTit2);
            feedbackTS.childNodes.push(feedbackCX2);
            feedbackTS.childNodes.push(feedbackQue2);
            feedbackTS.childNodes.push(feedbackQueDiv);
            feedbackTS.childNodes.push(feedbackEDiv);
            feedbackTS.childNodes.push(feedbackEmail);*/
            feedbackBorder2.childNodes.push(feedbackTit2);
            feedbackBorder2.childNodes.push(feedbackCX2);
            feedbackTS.childNodes.push(feedbackBorder2);
            feedbackQueUl.childNodes.push(feedbackQueList1);
            feedbackQueUl.childNodes.push(feedbackQueList2);
            feedbackQueUl.childNodes.push(feedbackQueList3);
            feedbackTS.childNodes.push(feedbackQueUl);

            feedbackTHSLeft.childNodes.push(feedbackQue2);
            feedbackQueDiv.childNodes.push(feedbackQueInput);
            feedbackQueDiv.childNodes.push(feedbackQueArrow);
            feedbackTHSLeft.childNodes.push(feedbackQueDiv);
            feedbackTHSRight.childNodes.push(feedbackEDiv);
            feedbackTHSRight.childNodes.push(feedbackEmail);
            feedbackTS.childNodes.push(feedbackTHSLeft);
            feedbackTS.childNodes.push(feedbackTHSRight);
            feedbackTS.childNodes.push(feedbackBtn2);
        }
        // 横幅，可与上面代码合并
        if (options.adW / options.adH > 2) {
            var adW = options.adW * 9 / 10;
            var adH = options.adH * 9 / 10;
            var titFS = Math.min(adH / 5, adW / 12);
            var cxFS =  Math.min(adH / 7, adW / 12);// 撤销的字体大小
            var queFS = Math.min(adH / 7, adW / 16);// 问题的字体大小
            cxFS = Math.max(cxFS, 12);
            queFS = Math.max(queFS, 12);
            style['.feedbackTS'] = {
                'width': adW + 'px',
                'height': adH + 'px',
                'padding': adH / 20 + 'px ' + adW / 20 + 'px',
                'display': 'none'
            };
            style['.feedbackTit2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                'font-weight': 'bold',
                // 'font-size': titFS + 'px',
                'border-left': '2px solid #7eccff'
            };
            style['.feedbackBorder2'] = {
                'border-left': '2px solid #408fef'
            };
            style['.feedbackCX2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            };

            var inputH = adH / 3 > cxFS * 2 ? cxFS * 2 : adH / 3;
            style['.feedbackQue2'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px' // ,
                // 'margin': '10px 0px'
                // 'width': adW + 'px',
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackQueDiv'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                // 'height': (adH - titFS - 4) / 3 + 'px',
                // 'line-height': (adH - titFS - 4) / 3 + 'px',
                // 'width': cxFS * 11 + 'px',
                // 'font-size': cxFS + 'px',
                'width': 0.24 * adW + 'px',
                'position': 'relative'
            };
            style['.feedbackQueInput'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                // 'height': (adH - titFS - 4) / 3 + 'px',
                // 'line-height': (adH - titFS - 4) / 3 + 'px',
                // 'width': cxFS * 11 + 'px',
                // 'font-size': cxFS + 'px',
                'height': ((inputH + 2) > 23 ? '23' : (inputH + 2)) + 'px',
                'line-height': ((inputH + 2) > 23 ? '23' : (inputH + 2)) + 'px',
                'width': 0.24 * adW + 'px',
                'border': '1px solid #999',
                'color': '#999',
                'vertical-align': 'top'
            };
            style['.feedbackQueArrow'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                'background': '#fff url("http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px',
                'height': (inputH  > 20 ? '20' : inputH) + 'px',
                'line-height': (inputH  > 20 ? '20' : inputH) + 'px',
                'width': '25px',
                'position': 'absolute',
                'top': '2px',
                'right': '0px',
                'overflow': 'hidden'
            };
            style['.feedbackQueUl'] = {
                // 'height': inputH * 3 + 2 + 'px',
                // 'width': cxFS * 11 + 'px',
                // 'font-size': cxFS + 'px',
                'border': '1px solid #999',
                'color': '#999',
                'list-style': 'none',
                'background-color': '#fff',
                'width': 0.24 * adW - 25 + 'px',
                'display': 'none',
                'position': 'absolute',
                'z-index': '1',
                'left': adW / 20 + 'px'
            };
            style['.feedbackQueList1'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer',
                'width': 0.24 * adW - 25 + 'px'
            };
            style['.feedbackQueList2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer'
            };
            style['.feedbackQueList3'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'cursor': 'pointer'
            };
            style['.feedbackQueList1:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'background-color': '#ccc',
                'width': 0.24 * adW - 25 + 'px'
            };
            style['.feedbackQueList2:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackQueList3:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackTHSLeft'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                // 'line-height': (adH - titFS - 4) / 2 + 'px',
                'float': 'left',
                'width': 0.4 * adW + 'px'
            };
            style['.feedbackTHSRight'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                // 'line-height': (adH - titFS - 4) / 2 + 'px',
                'float': 'left',
                'width': 0.35 * adW + 'px'
            };
            style['.feedbackEDiv'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px' // ,
                // 'margin': '10px 0px'
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackEmail'] = {
                // 'height': (adH - titFS - 4) / 3 + 'px',
                // 'line-height': (adH - titFS - 4) / 3 + 'px',
                'height': ((inputH + 2) > 23 ? '23' : (inputH + 2)) + 'px',
                'line-height': ((inputH + 2) > 23 ? '23' : (inputH + 2)) + 'px',
                'width': 0.24 * adW + 'px',
                // 'font-size': cxFS + 'px',
                'border': '1px solid #999',
                'vertical-align': 'top'
            };
            style['.feedbackBtn2'] = {
                /*'float': 'left',
                // 'height': cxFS + 4 + 'px',
                // 'line-height': inputH + 'px',
                'width': queFS * 8 + 'px',
                'font-size': cxFS + 'px',
                'color': '#7eccff',
                'border': '1px solid #7eccff',
                '-moz-border-radius': adH / 12 + 'px',
                '-webkit-border-radius': adH / 12 + 'px',
                'border-radius': adH / 12 + 'px',
                'text-align': 'center',
                'margin-top': (adH - titFS - 4) / 2 + 'px',
                'cursor': 'pointer'*/
                'width': queFS * 8 + 'px',
                // 'font-size': queFS + 'px',
                'color': '#7eccff',
                'margin-top': (adH - titFS - 4) / 4 + 'px',
                'border': '1px solid #7eccff',
                '-moz-border-radius': adH / 3 + 'px',      /* Gecko browsers */
                '-webkit-border-radius': adH / 3 + 'px',    /* Webkit browsers */
                'border-radius': adH / 3 + 'px',
                'text-align': 'center',
                'float': 'left',
                'cursor': 'pointer'
            };
            style['.feedbackBtn2:hover'] = {
                'color': '#fff',
                'background-color': '#7eccff',
                'cursor': 'pointer'
            };
        }
        // 竖幅
        else if (options.adW / options.adH < 1) {
            var adW = options.adW * 9 / 10;
            var adH = options.adH * 9 / 10;
            var titFS = Math.min(adH / 6 - 8, adW / 12);
            var cxFS = titFS > 40 ? (titFS / 2) : Math.min(adH / 12, adW / 12);// 撤销的字体大小
            var queFS = Math.min(adH / 6 - 14, adW / 14);// 问题的字体大小
            cxFS = Math.max(cxFS, 12);
            queFS = Math.max(queFS, 12);
            style['.feedbackTS'] = {
                'width': adW + 'px',
                'height': adH + 'px',
                'padding': adH / 20 + 'px ' + adW / 20 + 'px',
                'display': 'none'
            };
            style['.feedbackTit2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                'font-weight': 'bold'
                // 'font-size': titFS + 'px'
                // 'border-left': '2px solid #7eccff'
            };
            /*style['.feedbackBorder2'] = {
                'border-left': '2px solid #408fef'
            };*/
            style['.spanBorderL2'] = {
                'border-left': '2px solid #7eccff'
            };
            style['.spanBorderR2'] = {
                'border-left': '2px solid #408fef'
            };
            style['.feedbackCX2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'text-decoration': 'underline'
            };

            var inputH = adH / 9 > cxFS * 2 ? cxFS * 2 : adH / 9;
            style['.feedbackQue2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'margin-top': '5px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackQueDiv'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 2 + 'px',
                'color': '#999',
                'position': 'relative'
            };
            style['.feedbackQueInput'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 2 + 'px',
                'vertical-align': 'top'
            };
            style['.feedbackQueArrow'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                'background': '#fff url("http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px',
                'height': inputH - 7 + 'px',
                'line-height': inputH - 7 + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW + 'px',
                'width': '25px',
                'position': 'absolute',
                'top': '2px',
                'right': '0px',
                'overflow': 'hidden'
            };
            style['.feedbackQueUl'] = {
                'height': (inputH - 4) * 3 + 2 + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW - 25 + 'px',
                // 'font-size': cxFS + 'px',
                'border': '1px solid #999',
                'background-color': '#fff',
                'color': '#999',
                'list-style': 'none',
                'display': 'none',
                'position': 'absolute',
                'z-index': '1',
                'left': adW / 20 + 'px'
            };
            style['.feedbackQueList1'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer',
                'width': adW - 25 + 'px'
            };
            style['.feedbackQueList2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer'
            };
            style['.feedbackQueList3'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'cursor': 'pointer'
            };
            style['.feedbackQueList1:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'background-color': '#ccc',
                'width': adW - 25 + 'px'
            };
            style['.feedbackQueList2:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackQueList3:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackEDiv'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackEmail'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 2 + 'px',
                'border': '1px solid #999'
            };
            style['.feedbackBtn2'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px',
                // 'width': cxFS * 4 + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'border': '1px solid #7eccff',
                '-moz-border-radius': adH / 7 + 'px',      /* Gecko browsers */
                '-webkit-border-radius': adH / 7 + 'px',    /* Webkit browsers */
                'border-radius': adH / 7 + 'px',
                'text-align': 'center',
                'margin-top': '10px',
                'cursor': 'pointer'
            };
            style['.feedbackBtn2:hover'] = {
                'color': '#fff',
                'background-color': '#7eccff',
                'cursor': 'pointer'
            };
        }
        // 矩形
        else {
            var adW = options.adW * 9 / 10;
            var adH = options.adH * 9 / 10;
            var titFS = 20;
            var cxFS = 18;// 撤销的字体大小
            var queFS = 18;// 问题的字体大小
            // cxFS = Math.max(cxFS, 12);
            // queFS = Math.max(queFS, 12);
            style['.feedbackTS'] = {
                'width': adW + 'px',
                'height': adH + 'px',
                'padding': adH / 20 + 'px ' + adW / 20 + 'px',
                'display': 'none'
            };
            style['.feedbackTit2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                'font-weight': 'bold'
                // 'font-size': titFS + 'px'
                // 'border-left': '2px solid #7eccff'
            };
            /*style['.feedbackBorder2'] = {
                'border-left': '2px solid #408fef'
            };*/
            style['.spanBorderL2'] = {
                'border-left': '2px solid #7eccff'
            };
            style['.spanBorderR2'] = {
                'border-left': '2px solid #408fef'
            };
            style['.feedbackCX2'] = {
                // 'height': adH / 6 + 'px',
                // 'line-height': adH / 6 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            };

            var inputH = adH / 9 > cxFS * 2 ? cxFS * 2 : adH / 9;
            style['.feedbackQue2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'margin-top': '5px',
                'width': adW + 'px'
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackQueDiv'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 4 + 'px',
                // 'border': '1px solid #999',
                'color': '#999',
                'position': 'relative'
            };
            style['.feedbackQueInput'] = {// #fff url("//cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                // 'height': inputH - 6 + 'px',
                // 'line-height': inputH - 6 + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 2 + 'px',
                'vertical-align': 'top'
            };
            style['.feedbackQueArrow'] = {// #fff url("http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px
                'background': '#fff url("http://cpro.baidustatic.com/cpro/ui/noexpire/img/2.0.0/radio_btn.png") no-repeat scroll right -85px',
                'height': inputH - 7 + 'px',
                'line-height': inputH - 7 + 'px',
                'width': '25px',
                'position': 'absolute',
                'top': '2px',
                'right': '0px',
                'overflow': 'hidden'
            };
            style['.feedbackQueUl'] = {
                'height': (inputH - 4) * 3 + 2 + 'px',
                // 'width': cxFS * 11 + 'px',
                'width': adW - 25 + 'px',
                // 'font-size': cxFS - 4 + 'px',
                'border': '1px solid #999',
                'background-color': '#fff',
                'color': '#999',
                'list-style': 'none',
                'display': 'none',
                'position': 'absolute',
                'z-index': '1',
                'left': adW / 20 + 'px'
            };
            style['.feedbackQueList1'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer',
                'width': adW - 25 + 'px'
            };
            style['.feedbackQueList2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'border-bottom': '1px solid #999',
                'cursor': 'pointer'
            };
            style['.feedbackQueList3'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'cursor': 'pointer'
            };
            style['.feedbackQueList1:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',                'width': 0.24 * adW + 'px',
                'background-color': '#ccc',
                'width': adW - 25 + 'px'
            };
            style['.feedbackQueList2:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackQueList3:hover'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'background-color': '#ccc'
            };
            style['.feedbackEDiv'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                // 'font-size': cxFS + 'px'
            };
            style['.feedbackEmail'] = {
                'height': inputH + 'px',
                'line-height': inputH + 'px',
                'width': adW + 'px',
                // 'font-size': cxFS - 4 + 'px',
                'border': '1px solid #999'
            };
            style['.feedbackBtn2'] = {
                // 'height': inputH + 'px',
                // 'line-height': inputH + 'px',
                'width': '160px',
                // 'width': cxFS * 4 + 'px',
                // 'font-size': cxFS + 'px',
                'color': '#7eccff',
                'border': '1px solid #7eccff',
                '-moz-border-radius': adH / 7 + 'px',      /* Gecko browsers */
                '-webkit-border-radius': adH / 7 + 'px',    /* Webkit browsers */
                'border-radius': adH / 7 + 'px',
                'text-align': 'center',
                'margin-top': '10px',
                'cursor': 'pointer'
            };
            style['.feedbackBtn2:hover'] = {
                'color': '#fff',
                'background-color': '#7eccff',
                'cursor': 'pointer'
            };
        }

        style['.feedbackLogo'] = {
            'height': '19px',
            'width': '59px',
            'position': 'absolute',
            'right': '10px',
            'bottom': '10px'
        };
        feedbackLogo.href = 'http://www.baidu.com';
        feedbackLogoImg.src = 'https://cpro.baidustatic.com/cpro/exp/closead/img/bd_logo.png';
        feedbackLogo.childNodes.push(feedbackLogoImg);
        feedbackCon.childNodes.push(feedbackLogo);
        feedbackCon.childNodes.push(feedbackDiv);
        feedbackCon.childNodes.push(feedbackTS);
        feedbackCon.childNodes.push(feedbackGX);

        return feedbackCon;
    },

    getFeedbackM: function (options, style) {
        var result = '';
        var engine = this.basic;

        var feedbackCon = engine.getLayout();
        feedbackCon.tagName = 'div';
        feedbackCon.class = 'feedbackCon';
        feedbackCon.id = 'feedbackCon';

        var feedbackDiv = engine.getLayout();
        feedbackDiv.class = 'feedbackDiv';
        feedbackDiv.id = 'feedbackDiv';

        var shuntArrow = engine.getLayout();
        shuntArrow.class = 'shuntArrow';
        shuntArrow.id = 'shuntArrow';

        var shuntTriangle = engine.getLayout();
        shuntTriangle.class = 'shuntTriangle';
        shuntTriangle.id = 'shuntTriangle';

        var shuntFG = engine.getLayout();
        shuntFG.class = 'shuntFG';
        shuntFG.id = 'shuntFG';

        var shuntFGCon = engine.getLayout();
        shuntFGCon.class = 'shuntFGCon';
        shuntFGCon.id = 'shuntFGCon';

        var shuntZD = engine.getLayout();
        shuntZD.class = 'shuntZD';
        shuntZD.id = 'shuntZD';

        var shuntReturn = engine.getLayout();
        shuntReturn.class = 'shuntReturn';
        shuntReturn.id = 'shuntReturn';

        shuntArrow.innerHTML = '<img src="{{dupDomain}}/cpro/ui/luWrap/right.png"/>';
        shuntFGCon.innerHTML = '反感内容';
        shuntZD.innerHTML = '内容遮挡';
        shuntReturn.innerHTML = '返回';

        shuntFG.childNodes.push(shuntArrow);
        shuntFG.childNodes.push(shuntTriangle);
        shuntFG.childNodes.push(shuntFGCon);
        feedbackDiv.childNodes.push(shuntFG);
        feedbackDiv.childNodes.push(shuntZD);
        feedbackDiv.childNodes.push(shuntReturn);

        var adW = options.adW;
        var adH = options.adH;

        var shuntArrowW = adW / 5;
        var arrowBorder = shuntArrowW / 10;
        var shuntFG = (adW - shuntArrowW) / 3;
        style['.feedbackCon'] = {
            'width': adW + 'px',
            'height': adH + 'px',
            position: 'absolute',
            left: '0px',
            top: '0px',
            'display': 'none',
            'z-index': '2147483649',
            'left': '0px',
            'top': '0px'
        },
        style['.feedbackDiv'] = {
            'width': adW + 'px',
            'height': adH + 'px',
            'text-align': 'center',
            'line-height': adH + 'px',
            'color': '#ffffff',
            'font-family': '微软雅黑',
            'cursor': 'pointer'
            // 'position': 'absolute'
        };
        style['.shuntArrow'] = {
            'width': shuntArrowW + 'px',
            'height': adH + 'px',
            'background-color': '#7eccff',
            'position': 'absolute',
            'top': '0px',
            'left': '0px'
        };
        style['.shuntArrow img'] = {
            'vertical-align': 'middle'
        };
        style['.shuntTriangle'] = {
            'width': '0px',
            'height': '0px',
            'border-top': adH / 2 + 'px solid transparent',
            'border-bottom': adH / 2 + 'px solid transparent',
            'border-left': adH / 6 + 'px solid #7eccff',
            'font-size': '0px',
            'line-height': '0px',
            'position': 'absolute',
            'top': '0px',
            'left': shuntArrowW - 1 + 'px'
        };
        style['.shuntFGCon'] = {
            'width': shuntFG - adH / 6 + 'px',
            'height': adH + 'px',
            'position': 'absolute',
            'top': '0px',
            'right': '0px'
        };
        style['.shuntFG'] = {
            'width': shuntFG + shuntArrowW + 'px',
            'height': adH + 'px',
            'background-color': '#408fef',
            'position': 'absolute',
            'top': '0px',
            'left': '0px'
        };
        style['.shuntZD'] = {
            'width': shuntFG + 'px',
            'height': adH + 'px',
            'background-color': '#71bcfe',
            'position': 'absolute',
            'top': '0px',
            'left': shuntFG + shuntArrowW + 'px'
        };
        style['.shuntReturn'] = {
            'width': shuntFG + 'px',
            'height': adH + 'px',
            'background-color': '#5ea5fc',
            'position': 'absolute',
            'top': '0px',
            'left': shuntFG + shuntArrowW + shuntFG + 'px'
        };

        /******************感谢反馈页***********************/
        var feedbackThs = engine.getLayout();
        feedbackThs.class = 'feedbackThs';
        feedbackThs.id = 'feedbackThs';

        var thsTop = engine.getLayout();
        thsTop.class = 'thsTop';
        thsTop.id = 'thsTop';

        var thsTLeft = engine.getLayout();
        thsTLeft.class = 'thsTLeft';
        thsTLeft.id = 'thsTLeft';

        var thsTMiddle = engine.getLayout();
        thsTMiddle.class = 'thsTMiddle';
        thsTMiddle.id = 'thsTMiddle';

        var thsTRight = engine.getLayout();
        thsTRight.class = 'thsTRight';
        thsTRight.id = 'thsTRight';
        thsTRight.tagName = 'a';
        thsTRight.target = '_blank';

        var thsBottom = engine.getLayout();
        thsBottom.class = 'thsBottom';
        thsBottom.id = 'thsBottom';

        thsTLeft.innerHTML = '感谢您的反馈！';
        thsTRight.href = 'http://yingxiao.baidu.com/zhichi/knowledge/detail.action?channelId=3&classId=10845&knowledgeId=14394';
        thsTMiddle.innerHTML = '撤销';
        thsTRight.innerHTML = '了解详情';
        thsBottom.innerHTML = '我们将努力改善您的浏览体验。';

        thsTop.childNodes.push(thsTLeft);
        thsTop.childNodes.push(thsTMiddle);
        thsTop.childNodes.push(thsTRight);
        feedbackThs.childNodes.push(thsTop);
        feedbackThs.childNodes.push(thsBottom);

        var thsTopW = adW / 20 * 18;
        var thsTopH = adH / 6 * 4;

        style['.feedbackThs'] = {
            'width': thsTopW + 'px',
            'height': thsTopH + 'px',
            'background-color': '#fff',
            'font-family': '微软雅黑',
            'padding': adH / 6 + 'px ' + adW / 20 + 'px',
            'display': 'none'
        };

        style['.thsTop'] = {
            'width': thsTopW + 'px',
            'height': thsTopH / 2 + 'px',
            'line-height': thsTopH / 2 + 'px',
            'color': '#000000',
            'border-left': '2px solid #71bcfe',
            'font-weight': 'bold'
        };
        var topFS = Math.min(thsTopH - 4, thsTopW / 24);
        style['.thsTLeft'] = {
            'width': topFS * 8 + 'px',
            'height': thsTopH / 2 + 'px',
            'margin-left': topFS + 'px',
            'font-size': topFS + 'px',
            'font-weight': 'bold',
            'float': 'left'
        };
        style['.thsTMiddle'] = {
            'width': topFS * 3 + 'px',
            'height': thsTopH / 2 + 'px',
            'margin-left': topFS + 'px',
            'color': '#71bcfe',
            'font-size': topFS + 'px',
            // 'font-size': Math.min(thsTopH - 8, thsTopW / 48) + 'px',
            'text-decoration': 'underline',
            'float': 'left',
            'cursor': 'pointer'
        };
        style['.thsTRight'] = {
            'width': topFS * 5 + 'px',
            'height': thsTopH / 2 + 'px',
            'margin-left': topFS + 'px',
            'color': '#71bcfe',
            'font-size': topFS + 'px',
            // 'font-size': Math.min(thsTopH - 8, thsTopW / 48) + 'px',
            'text-decoration': 'underline',
            'float': 'left',
            'cursor': 'pointer'
        };
        style['.thsBottom'] = {
            'width': thsTopW + 'px',
            'font-size': topFS + 'px',
            'height': thsTopH / 2 + 'px'
            // 'font-size': Math.min(thsTopH - 10, thsTopW / 24) + 'px'
        };

        feedbackCon.childNodes.push(feedbackDiv);
        feedbackCon.childNodes.push(feedbackThs);
        /******************感谢反馈页*****end******************/
        return feedbackCon;
    }
});