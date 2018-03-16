/**
 * @file HTML渲染引擎
 * @author zhangziqiu@baidu.com
 */
/* global oojs */
oojs.define({

    /**
     * 参数管理类.
     * @class
     */
    name: 'configManager',
    namespace: 'rs.business',
    deps: {
        defaultValueManager: 'rs.business.defaultValueManager'

    },

    /**
     * 将pb中传递的config格式: [{key:'A', value:'A1'}, {key:'B', value:'B1'}]
     * 转换成: {A:'A1', B:'B1'} 的形式
     * @param {Object} option pb中传递的config数组
     * @return {Object} 根据数组转换成的mapping object
     */
    getConfigFromProtobufOld: function (option) {
        var result = {};

        // 处理config部分
        var pbConfig = option.config;
        if (pbConfig && pbConfig.items && pbConfig.items.length) {
            var items = pbConfig.items;
            for (var i = 0, count = items.length; i < count; i++) {
                var item = items[i];
                var key = item.key;
                var value = item.value;
                // 如果一个key出现了多次, 则改成使用array存储
                if (key && typeof result[key] !== 'undefined' && result.hasOwnProperty(key)) {
                    var tempValue = result[key];
                    if (tempValue instanceof Array) {
                        result[key].push(value);
                    }
                    else {
                        result[key] = [];
                        result[key].push(tempValue);
                        result[key].push(value);
                    }

                }
                else {
                    result[key] = value;
                }

            }
        }

        result.styleType = option.styleType;
        result.templateWidth = option.width;
        result.templateHeight = option.height;

        return result;
    },

    /**
     * 将pb中传递的 styleConfig 转换成Object
     * 转换成: {A:'A1', B:'B1'} 的形式
     * @param {Object} context 请求的context上下文
     * @return {Object} 根据数组转换成的mapping object
     */
    getConfigFromContext: function (context) {
        var result = {};

        if (context && context.requestInfo && context.requestInfo.styleConfig) {
            try {
                result = JSON.parse(context.requestInfo.styleConfig);
            }
            catch (ex) {
                result = {};
            }
        }

        result.templateWidth = context.requestInfo.width;
        result.templateHeight = context.requestInfo.height;
        result.account = context.requestInfo.account;

        return result;
    },

    /**
     * 获取参数的全名. 比如参数缩写: conPL对应的参数全名为 containerPaddingLeft, 表示容器左边距
     * @method getFullName
     * @param {string} shortName 参数的缩写
     * @return {string} 参数的全名
     */
    getFullName: function (shortName) {
        return this.nameMapping[shortName];
    },

    /**
     * 获取转换为全名参数的配置文件
     * 返回一个用作mapping的object. 这个object有两个作用. 一个是编程时使用fullName获取到用户的设置值,
     * 还以判断用户是否传递了参数,以便在需要的时候决定是否使用默认值.
     * @method getFullNameConfig
     * @param {Object} userConfig 包含了所有参数的mapping object
     * @param {Object} 将参数缩写转换为参数全名的对象. 不在缩写映射表中的属性不改变.
     * @return {Object} config对象
     */
    getFullNameConfig: function (userConfig) {
        var result = {};
        var paramFullName;
        var paramValue;
        var lowerCaseConfig = {};
        var keys = Object.keys(userConfig);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!key || (typeof userConfig[key] === 'undefined')) {
                continue;
            }

            paramFullName = this.getFullName(key.toLowerCase());
            paramValue = userConfig[key];

            // 对于string类型, 一般是颜色参数要特殊处理, 去掉"#"号
            if (typeof paramValue === 'string') {
                paramValue = decodeURIComponent(paramValue).replace('#', '');
            }

            if (paramFullName) {
                result[paramFullName] = paramValue;
            }
            else {
                // 未定义参数, 不进行名字转换
                result[key] = paramValue;
            }

            lowerCaseConfig[key.toLowerCase()] = paramValue;
        }

        userConfig = lowerCaseConfig;

        // 特殊处理hn和wn参数
        if (!userConfig.column && userConfig.wn) {
            result.adColumnCount = parseInt(userConfig.wn, 10);
        }
        if (!userConfig.row && userConfig.hn) {
            result.adRowCount = parseInt(userConfig.hn, 10);
        }

        // 特殊处理容器宽高
        if (userConfig.conw && userConfig.conw > 0) {
            result.templateWidth = userConfig.conw;
        }
        if (userConfig.conh && userConfig.conh > 0) {
            result.templateHeight = userConfig.conh;
        }

        // 特殊处理容器边框
        if (typeof result.containerBorderWidth !== 'undefined') {
            result.containerBorderTop = parseInt(result.containerBorderWidth, 10);
            result.containerBorderRight = parseInt(result.containerBorderWidth, 10);
            result.containerBorderBottom = parseInt(result.containerBorderWidth, 10);
            result.containerBorderLeft = parseInt(result.containerBorderWidth, 10);
        }

        return result;
    },

    /**
     * 获取所有参数的值
     *
     * @param {Object} userConfig 包含了用户设置了的参数全名的mapping object
     * @return {Object} 包含了所有参数及其取值的mapping object
     */
    getVariables: function (userConfig) {
        // 从defaultValueManager类中, 根据当前用户的请求配置, 获取本次请求的默认值.
        var defaultValue = this.defaultValueManager.getDefaultValue(userConfig);

        // 使用用户设置的值替换默认值
        var paramValue;
        var keys = Object.keys(userConfig);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && (typeof userConfig[key] !== 'undefined')) {
                paramValue = userConfig[key];
                if (typeof paramValue === 'string') {
                    paramValue = decodeURIComponent(paramValue).replace('#', '');
                }
                if (paramValue !== '') {
                    defaultValue[key] = userConfig[key];
                }
            }
        }

        return defaultValue;
    },

    /**
     * 合并两个config对象
     * @param {Object} source 源对象, 会覆盖目标对象的同名属性
	 * @param {Object} to 目标对象, 会被源对象覆盖同名属性
     * @param {Object} exceptConfig 排除的参数对象, 在exceptConfig中的参数不进行覆盖
     * @return {Object} 合并后的对象, 如果两个对象存在同名属性, 则会用source的属性覆盖to的属性.
     */
    merge: function (source, to, exceptConfig) {
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && typeof source[key] !== 'undefined' && typeof exceptConfig[key] === 'undefined') {
                to[key] = source[key];
            }
        }
        return to;
    },

    /**
     * 保存参数"缩写"->"全名"的映射关系
     */
    nameMapping: {
        n: 'userChargingId',
        rsi0: 'templateWidth',
        rsi1: 'templateHeight',
        at: 'adDataType',
        row: 'adRowCount',
        column: 'adColumnCount',
        rsi5: 'keywordIsFlush',
        rss6: 'keywordFlushColor',
        rad: 'isShowUnrelated',
        cad: 'isShowPublicAd',
        isgongyi: 'isGongyi',
        rss7: 'backupColor',
        aurl: 'backupUrl',
        displaytype: 'displayType',
        stufftype: 'stuffType',
        layout: 'layout',
        scale: 'scale',
        rss0: 'containerBorderColor',
        conbw: 'containerBorderWidth',
        conbt: 'containerBorderTop',
        conbr: 'containerBorderRight',
        conbb: 'containerBorderBottom',
        conbl: 'containerBorderLeft',
        conbs: 'containerBorderStyle',
        rss1: 'containerBackgroundColor',
        conpl: 'containerPaddingLeft',
        conpr: 'containerPaddingRight',
        conpt: 'containerPaddingTop',
        conpb: 'containerPaddingBottom',
        conml: 'containerMarginLeft',
        conmr: 'containerMarginRight',
        conmt: 'containerMarginTop',
        conmb: 'containerMarginBottom',
        conop: 'containerOpacity',
        consl: 'containerShowLogo',
        conw: '<containerwidth></containerwidth>',
        conh: 'containerHeight',
        conhhf: 'containerHideHeaderFooter',
        conf: 'containerFloat',
        conls: 'containerLogoStyle',
        itepl: 'itemPaddingLeft',
        itepr: 'itemPaddingRight',
        itept: 'itemPaddingTop',
        itepb: 'itemPaddingBottom',
        iteva: 'itemVerticalAlign',
        itecs: 'itemColumnSpace',
        itecb: 'itemColumnBackgroundColor',
        itecbw: 'itemColumnBorderWidth',
        itecbs: 'itemColumnBorderStyle',
        itecbc: 'itemColumnBorderColor',
        itecpt: 'itemColumnPaddingTop',
        itecpl: 'itemColumnPaddingLeft',
        itecpr: 'itemColumnPaddingRight',
        itecpb: 'itemColumnPaddingBottom',
        itecmt: 'itemColumnMarginTop',
        itecml: 'itemColumnMarginLeft',
        itecmr: 'itemColumnMarginRight',
        itecmb: 'itemColumnMarginBottom',
        iters: 'itemRowSpace',
        iterbw: 'itemRowBorderWidth',
        iterbs: 'itemRowBorderStyle',
        iterbc: 'itemRowBorderColor',
        iterpt: 'itemRowPaddingTop',
        iterpl: 'itemRowPaddingLeft',
        iterpr: 'itemRowPaddingRight',
        iterpb: 'itemRowPaddingBottom',
        iteri: 'itemRightImage',
        iteris: 'itemRightImageSrc',
        iteriw: 'itemRightImageWidth',
        iterih: 'itemRightImageHeight',
        iteript: 'itemRightImagePaddingTop',
        iteripl: 'itemRightImagePaddingLeft',
        iteripr: 'itemRightImagePaddingRight',
        iteripb: 'itemRightImagePaddingBottom',
        logis: 'logoIsShow',
        logpl: 'logoPaddingLeft',
        logpr: 'logoPaddingRight',
        logpt: 'logoPaddingTop',
        logpb: 'logoPaddingBottom',
        blogpl: 'brandLogoPaddingLeft',
        blogpr: 'brandLogoPaddingRight',
        blogpt: 'brandLogoPaddingTop',
        blogpb: 'brandLogoPaddingBottom',
        rss2: 'titleFontColor',
        titff: 'titleFontFamily',
        titfs: 'titleFontSize',
        titl: 'titleLength',
        titse: 'titleIsShowEllipsis',
        titis: 'titleIsShow',
        titrc: 'titleRowCount',
        titpl: 'titlePaddingLeft',
        titpr: 'titlePaddingRight',
        titpt: 'titlePaddingTop',
        titpb: 'titlePaddingBottom',
        titsu: 'titleShowUnderline',
        titlh: 'titleLineHeight',
        titw: 'titleWidth',
        titfw: 'titleFontWeight',
        titbc: 'titleBackgroundColor',
        tithfc: 'titleHoverFontColor',
        tithsu: 'titleHoverShowUnderline',
        tithbc: 'titleHoverBackgroundColor',
        titvfc: 'titleVisitedFontColor',
        titvsu: 'titleVisitedShowUnderline',
        titvbc: 'titleVisitedBackgroundColor',
        titafc: 'titleActiveFontColor',
        titasu: 'titleActiveShowUnderline',
        titabc: 'titleActiveBackgroundColor',
        titta: 'titleTextAlign',
        titfis: 'titleFrontIconSrc',
        titfiw: 'titleFrontIconWidth',
        titfih: 'titleFrontIconHeight',
        titfil: 'titleFrontIconPaddingLeft',
        titfip: 'titleFrontIconPaddingRight',
        iconbh: 'iconBackgroundColorHig',
        iconbl: 'iconBackgroundColorLow',
        rss3: 'descFontColor',
        desff: 'descFontFamily',
        desfs: 'descFontSize',
        desl: 'descLength',
        desse: 'descIsShowEllipsis',
        desis: 'descIsShow',
        desrc: 'descRowCount',
        despl: 'descPaddingLeft',
        despr: 'descPaddingRight',
        despt: 'descPaddingTop',
        despb: 'descPaddingBottom',
        dessu: 'descShowUnderline',
        deslh: 'descLineHeight',
        desw: 'descWidth',
        desfw: 'descFontWeight',
        desbc: 'descBackgroundColor',
        deshfc: 'descHoverFontColor',
        deshsu: 'descHoverShowUnderline',
        deshbc: 'descHoverBackgroundColor',
        desvfc: 'descVisitedFontColor',
        desvsu: 'descVisitedShowUnderline',
        desvbc: 'descVisitedBackgroundColor',
        desafc: 'descActiveFontColor',
        desasu: 'descActiveShowUnderline',
        desabc: 'descActiveBackgroundColor',
        desta: 'descTextAlign',
        rss4: 'urlFontColor',
        urlff: 'urlFontFamily',
        urlfs: 'urlFontSize',
        urll: 'urlLength',
        urlse: 'urlIsShowEllipsis',
        urlis: 'urlIsShow',
        urlpl: 'urlPaddingLeft',
        urlpr: 'urlPaddingRight',
        urlpt: 'urlPaddingTop',
        urlpb: 'urlPaddingBottom',
        urlsu: 'urlShowUnderline',
        urlrc: 'urlRowCount',
        urllh: 'urlLineHeight',
        urlw: 'urlWidth',
        urlfw: 'urlFontWeight',
        urlbc: 'urlBackgroundColor',
        urlre: 'urlReplace',
        urlhfc: 'urlHoverFontColor',
        urlhsu: 'urlHoverShowUnderline',
        urlhbc: 'urlHoverBackgroundColor',
        urlvfc: 'urlVisitedFontColor',
        urlvsu: 'urlVisitedShowUnderline',
        urlvbc: 'urlVisitedBackgroundColor',
        urlafc: 'urlActiveFontColor',
        urlasu: 'urlActiveShowUnderline',
        urlabc: 'urlActiveBackgroundColor',
        rlta: 'urlTextAlign',
        resbc: 'resBorderColor',
        resbw: 'resBorderWidth',
        // 对广告位标准化中MSSP中已有的参数做转换
        cbackground: 'containerBackgroundColor',
        ctitle: 'titleFontColor',
        cdesc: 'descFontColor',
        cborder: 'containerBorderColor',
        fontName: 'titleFontFamily',
        bborder: 'containerBorderWidth',
        // 应对新广告法需要添加的推广2015
        tgis: 'promotionIsShow'
    }
});
