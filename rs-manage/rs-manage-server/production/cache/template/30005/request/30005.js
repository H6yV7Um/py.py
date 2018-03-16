/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
  	mainCreatives: [{
  		creativeTemplateId: 111,
  		deviceType: 1,
  		creativeType: 1,
  		creativeTypeMessageName: 'flash',
  		creativeTypeMessageClass: 'FlashCreative',
  		flash: {
  			material: {
  				creativeName: 'flash_material',
  				file: {
  					fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000ADoViV6GwLjMic2r0.swf',
  					mediaId: 3333,
  					fileMd5: 'ABCDEFG',
  					fileSize: 888
  				},
  				width: 100,
  				height: 200,
  				flashSource: 0,
  				rainbowTemplateId: 999
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
  						clickLink: '',
  						antiCheating: 123456
  					}
  				}
  			}
  		}
  	}, {
  		creativeTemplateId: 111,
  		deviceType: 1,
  		creativeType: 1,
  		creativeTypeMessageName: 'flash',
  		creativeTypeMessageClass: 'FlashCreative',
  		flash: {
  			material: {
  				creativeName: 'flash_material',
  				file: {
  					fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000ADoViV6GwLjMic2r0.swf',
  					mediaId: 3333,
  					fileMd5: 'ABCDEFG',
  					fileSize: 888
  				},
  				width: 100,
  				height: 200,
  				flashSource: 0,
  				rainbowTemplateId: 999
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
  						clickLink: '',
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
    styleId: 30004,
    size: {
        sizeType: 1,
        width: 150,
        height: 500
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads)
};

module.exports = requestInfo;

