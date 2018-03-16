/* eslint-disable */
/**
 * @file 测试数据
 * @author qianxiaoli@baidu.com
 */
var ads = {
  "creativeContents": [{
    "imageMaterial": [{
      "file": {
        "fileSrc": "http://ubmcmm.baidustatic.com/media/v1/0f0000J1CFBykyP9Catl00.jpg"
      },
      "width": 600,
      "height": 500
    }],
    "textMaterial": [{
      "creativeTitle": '内容内容',
    }],
    "promoteAppMaterial": {
      "appName": "baidusafe",
      "appLogoUrl": "http://ubmcmm.baidustatic.com/media/v1/0f0005lYhtG66ld3dKxp7f.png",
      "appPackage": "cn.opda.a.phonoalbumshoushou"
    },
    "wapAppInfo": '',
    "action": [{
      "actionType": "5",
      "clickLink": {
        "clickLink": "xxx.baidu.com://clicklink",
        "antiCheating": 0
      },
      "forward": {
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
    styleId: 20012,
    size: {
        sizeType: 1,
        width: 320,
        height: 48
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        deviceType: 2
    },
    ads: JSON.stringify(ads)
};
        
module.exports = requestInfo;

