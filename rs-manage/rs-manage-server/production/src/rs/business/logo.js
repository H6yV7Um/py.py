oojs.define({
    name: 'logo',
    namespace: 'rs.business',
    deps: {
        string: 'rs.common.utility.string'
    },
    // logoType必须是枚举集合中值, 否则使用默认值
    logoTypeEnum: {
        'bd-logo': 1,
        'bd-logo2': 1,
        'bd-logo3': 1,
        'bd-logo4': 1,
        'feed-logo': 1
    },
    getLogo: function (option) {
        var result = "";
        option = option || {};
        var logoType = option.logoType || 'bd-logo';
        logoType = this.logoTypeEnum[logoType] ? logoType : 'bd-logo';
        var isGongyi = option.isGongyi;

        var url = isGongyi ? 'http://gongyi.baidu.com/' : 'http://wangmeng.baidu.com/';
        var title = isGongyi ? '\u767e\u5ea6\u516c\u76ca' : '\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f';

        var logo = {
            tagName: 'a',
            class: logoType,
            href: url,
            title: title,
            target: '_blank',
            innerHTML: '&nbsp;',
            id: 'bd-logo'
        };

        return logo;
    }
});