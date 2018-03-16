/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
    'creativeContents': [{
        'videoMaterial': [{
            'creativeName': '这里是信息流视频测试',
            'file': {
                'fileSrc': 'hhttp://fcvbjbcebos.baidu.com/95b5ce54e56b84bbe27aa896e82d256e.mp4'
            },
            'width': 640,
            'height': 360,
            'videoBitRate': 120,
            'videoLen': 90,
            'videoRealLen' : 20,
            'videoPlatformId' : 10001,
            'videoMd5': ''
        }],
        'imageMaterial': [{
            'file': {
                'fileSrc': 'http://10.100.62.54/media/v1/0f00051Aq9_ILc6qrHoJa6.png'
            },
            'width': 640,
            'height': 360
        }],
        'promoteAppMaterial': {
            'appName': 'baidusafe',
            'appLogoUrl': 'http://ubmcmm.baidustatic.com/media/v1/0f0005lYhtG66ld3dKxp7f.png',
            'appPackage': 'cn.opda.a.phonoalbumshoushou'
        },
        'wapAppInfo': '',
        'action': [{
            'actionType': '5',
            'clickLink': {
                'clickLink': 'curl.baidu.com',
                'antiCheating': 0,
                'middleClickLink': 'mcurl.baidu.com'
            },
            'forward': {
                'title': 'www.baidu.com'
            }
        }]
    }]
};

// 请求对象
var requestInfo = {
    client: {
        dspId: 8,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 80002,
    size: {
        sizeType: 2,
        width: 400,
        height: 300
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

