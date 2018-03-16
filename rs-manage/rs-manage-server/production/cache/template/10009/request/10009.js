/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
    mainCreatives: [{
        creativeTemplateId: 111,
        deviceType: 2,
        creativeType: 0,
        creativeTypeMessageName: 'text',
        creativeTypeMessageClass: 'TextCreative',
        text: {
            material: {
                creativeName: 'text_material',
                creativeTitle: '买福特汽车到中汽福特4S店',
                creativeDesc1: '福特全系现车惊喜报价,福特车特价疯狂抢购! 咨询热线:010-68868800',
                creativeDesc2: ''
            },
            action: {
                actionType: 4,
                actionTypeMessageName: 'forward',
                actionTypeMessageClass: 'ForwardAction',
                forward: {
                    pcClickLink: 'www.baidu.com',
                    mobileClickLink: 'www.mobile.baidu.com',
                    targetPage: 'www.baidu.com',
                    monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'],
                    clickLink: {
                        clickLink: 'http://www.baidu.com/cpro.php?',
                        antiCheating: 123456
                    }
                }
            }
        }
    }]
};

// 请求对象
var requestInfo = {
    client: {
        dspId: 1,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 10009,
    size: {
        sizeType: 2,
        width: 840,
        height: 126
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    styleConfig: {
        ext: '{}'
    },
    ads: JSON.stringify(ads)
};

module.exports = requestInfo;

