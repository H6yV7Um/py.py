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
                creativeTitle: '掌上{刀塔传奇}卡牌因你而变',
                creativeDesc1: '2014年不容错过的动作卡牌手游{《刀塔传奇》} 带给你绝无仅有的Dota情缘!',
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
    styleId: 10008,
    size: {
        sizeType: 2,
        width: 960,
        height: 144
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    styleConfig: {
        ext: '{"appinfo":{"rank":80,"size": 87,"name":"xxxx官方版","appDesc":"xxxx介绍","deteConf": {"timeInterval":1000000, "checkCount":5, "expiredTime":3600000000,"maxDetectTimes":5},"appData": {"appkey":"appkey","sk":"sk"}}}'
    },
    ads: JSON.stringify(ads)
};

module.exports = requestInfo;

