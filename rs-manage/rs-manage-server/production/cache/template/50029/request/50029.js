/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
        'mainCreatives': [{
            'creativeTemplateId': 10005,
            'deviceType': 2,
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
                'material': {
                    'creativeName': 'text_with_icon_material',
                    'creativeTitle': '掌上{刀塔传奇}卡牌因你而变',
                    'creativeDesc1': '2014年不容错过的动作卡牌手游{《刀塔传奇》} 带给你绝无仅有的Dota情缘!',
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
                            'clickLink': 'http://www.baidu.com/cpro.php?',
                            'antiCheating': 123456
                        }
                    }
                }
            }
        }, {
            'creativeTemplateId': 111,
            'deviceType': 1,
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
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
            'deviceType': 1,
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
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
    styleId: 50012,
    size: {
        sizeType: 2,
        width: 320,
        height: 80
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

