/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
    'mainCreatives': [{
        'creativeTemplateId': 10005,
        'deviceType': 3,
        'creativeType': 0,
        'creativeTypeMessageName': 'text',
        'creativeTypeMessageClass': 'textCreative',
        'text': {
            'material': {
                'creativeName': 'text_with_icon_material',
                'creativeTitle': '记录儿时成长的点点滴滴',
                'creativeDesc1': '用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑',
                'creativeDesc2': '',
                'file': {
                    'fileSrc': 'http://ubmcmm.baidustatic.com/media/v1/0f000KY9nPw7E19YPam676.jpg',
                    'mediaId': 3333,
                    'fileMd5': 'ABCDEFG',
                    'fileSize': 888
                },
                'width': 999,
                'height': 111
            },
            'action': {
                'actionType': 4,
                'actionTypeMessageName': 'forward',
                'actionTypeMessageClass': 'ForwardAction',
                'forward': {
                    'pcClickLink': 'www.baidu.com',
                    'mobileClickLink': 'www.mobile.baidu.com',
                    'targetPage': 'www.baidu.com',
                    'monitorLinks': ['www.winnotice.baidu.com', 'www.baidu.com'],
                    'clickLink': {
                        'clickLink': 'pos.baidu.com',
                        'antiCheating': 123456
                    }
                }
            }
        }
    }, {
        'creativeTemplateId': 111,
        'deviceType': 3,
        'creativeType': 0,
        'creativeTypeMessageName': 'text',
        'creativeTypeMessageClass': 'textCreative',
        'text': {
            'material': {
                'creativeName': 'text_with_icon_material',
                'creativeTitle': '2014级雅思新生开学啦',
                'creativeDesc1': '留学?考研?就业?作为现代大学生,雅思必学! 雅思培训认准17年领导品',
                'creativeDesc2': '',
                'file': {
                    'fileSrc': 'http://ubmcmm.baidustatic.com/media/v1/0f000nY2aSc2H90MjPksLf.jpg',
                    'mediaId': 3333,
                    'fileMd5': 'ABCDEFG',
                    'fileSize': 888
                },
                'width': 999,
                'height': 111
            },
            'action': {
                'actionType': 4,
                'actionTypeMessageName': 'forward',
                'actionTypeMessageClass': 'ForwardAction',
                'forward': {
                    'pcClickLink': 'www.baidu.com',
                    'mobileClickLink': 'www.mobile.baidu.com',
                    'targetPage': 'www.baidu.com',
                    'monitorLinks': ['www.winnotice.baidu.com', 'www.baidu.com'],
                    'clickLink': {
                        'clickLink': 'pos.baidu.com',
                        'antiCheating': 123456
                    }
                }
            }
        }
    }, {
        'creativeTemplateId': 111,
        'deviceType': 3,
        'creativeType': 0,
        'creativeTypeMessageName': 'text',
        'creativeTypeMessageClass': 'textCreative',
        'text': {
            'material': {
                'creativeName': 'text_with_icon_material',
                'creativeTitle': '企业法律风险防控',
                'creativeDesc1': '企业法律风险免费识别，30天评估法律风险 盈科润达高级律师，专业法律风险防控团队',
                'creativeDesc2': '企业法律风险免费识别，30天评估法律风险 盈科润达高级律师，专业法律风险防控团队',
                'file': {
                    'fileSrc': 'http://ubmcmm.baidustatic.com/media/v1/0f000QD_r1aAfPam-ssvYs.jpg',
                    'mediaId': 3333,
                    'fileMd5': 'ABCDEFG',
                    'fileSize': 888
                },
                'width': 999,
                'height': 111
            },
            'action': {
                'actionType': 4,
                'actionTypeMessageName': 'forward',
                'actionTypeMessageClass': 'ForwardAction',
                'forward': {
                    'pcClickLink': 'www.baidu.com',
                    'mobileClickLink': 'www.mobile.baidu.com',
                    'targetPage': 'www.baidu.com',
                    'monitorLinks': ['www.winnotice.baidu.com', 'www.baidu.com'],
                    'clickLink': {
                        'clickLink': 'pos.baidu.com',
                        'antiCheating': 123456
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
    styleId: 10007,
    size: {
        sizeType: 1,
        width: 320,
        height: 48
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

