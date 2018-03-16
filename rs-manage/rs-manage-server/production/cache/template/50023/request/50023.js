/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
    'creativeContents': [{
        'imageMaterial': [{
            'file': {
                'fileSrc': 'http://ubmcmm.baidustatic.com/media/v1/0f0000J1CFBykyP9Catl00.jpg'
            },
            'width': 600,
            'height': 500
        }],
        'textMaterial': [{
            'creativeTitle': '记录儿时成长的点点滴滴,用动态影像给我们留下美好的回忆,把您孩子 儿时稚嫩的声音与天真无邪的笑'
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
                'clickLink': 'xxx.baidu.com',
                'antiCheating': 0
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
        dspId: 1,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 50023,
    size: {
        sizeType: 2,
        width: 750,
        height: 188
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

