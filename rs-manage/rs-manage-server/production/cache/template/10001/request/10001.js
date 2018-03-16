/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
    mainCreatives: [{
        creativeTemplateId: 111,
        deviceType: 1,
        creativeType: 0,
        creativeTypeMessageName: 'text',
        creativeTypeMessageClass: 'TextCreative',
        text: {
            material: {
                creativeName: 'text_material',
                creativeTitle: 'Hello World',
                creativeDesc1: 'create desc 1',
                creativeDesc2: 'create desc 2'
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
    styleId: 10001,
    size: {
        sizeType: 1,
        width: 200,
        height: 90
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads)
};

module.exports = requestInfo;