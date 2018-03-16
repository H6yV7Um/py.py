/**
 * @file 测试数据
 * @author
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
                creativeName: 'text_with_icon_material',
                creativeTitle: '记录儿时成长的点点滴滴记录儿时成长的点点滴滴',
                creativeDesc1: '用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑',
                creativeDesc2: '',
                file: {
                    fileSrc: 'http://10.95.24.19/img/nieyuxin/phone.png'
                }
            },
            action: {
                actionType: 4,
                actionTypeMessageName: 'forward',
                actionTypeMessageClass: 'ForwardAction',
                forward: {
                    mobileClickLink: 'www.mobile.baidu.com',
                    targetPage: 'www.baidu.com',
                    monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'],
                    clickLink: {
                        clickLink: 'http://www.baidu.com/cpro.php?',
                        antiCheating: 123456
                    }
                }
            },
            additionalAction: [{
                actionType: 6,
                actionTypeMessageName: 'phone',
                actionTypeMessageClass: 'PhoneAction',
                phone: {
                    phoneNumber: '400-123-456',
                    traceUrl: 'http://www.hao123.com'  // 检查是否存在电话/发短信动作时的点击串
                }
            }]
        }
    },
    {
        creativeTemplateId: 111,
        deviceType: 2,
        creativeType: 0,
        creativeTypeMessageName: 'text',
        creativeTypeMessageClass: 'TextCreative',
        text: {
            material: {
                creativeName: 'text_with_icon_material',
                creativeTitle: '记录儿时成长的点点滴滴记录儿时成长的点点滴滴',
                creativeDesc1: '用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑',
                creativeDesc2: '',
                file: {
                    fileSrc: 'http://10.95.24.19/img/nieyuxin/message.png'
                }
            },
            action: {
                actionType: 4,
                actionTypeMessageName: 'forward',
                actionTypeMessageClass: 'ForwardAction',
                forward: {
                    mobileClickLink: 'www.mobile.baidu.com',
                    targetPage: 'www.baidu.com',
                    monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'],
                    clickLink: {
                        clickLink: 'http://www.baidu.com/cpro.php?',
                        antiCheating: 123456
                    }
                }
            },
            additionalAction: [{
                actionType: 4,
                actionTypeMessageName: 'forward',
                actionTypeMessageClass: 'ForwardAction',
                forward: {
                    mobileClickLink: 'www.mobile.baidu.com',
                    targetPage: 'www.baidu.com',
                    monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'],
                    clickLink: {
                        clickLink: 'http://www.baidu.com/cpro.php?',
                        antiCheating: 123456
                    }
                }
            }]
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
    styleId: 10012,
    size: {
        sizeType: 1,
        width: 320,
        height: 48
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads)
};

module.exports = requestInfo;

