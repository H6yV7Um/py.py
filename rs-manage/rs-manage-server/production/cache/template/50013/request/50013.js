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
                    'creativeTitle': '买福特汽车到中汽福特4S店',
                    'creativeDesc1': '福特全系现车惊喜报价,福特车特价疯狂抢购! 咨询热线:010-68868800',
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
    styleId: 50013,
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

