/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {
  	mainCreatives: [{
    		creativeTemplateId: 111,
    		deviceType: 1,
    		creativeType: 1,
    		creativeTypeMessageName: 'image',
    		creativeTypeMessageClass: 'ImageCreative',
    		image: {
      			material: {
        				creativeName: 'image_material',
        				file: {
        					fileSrc: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        					mediaId: 3333,
        					fileMd5: 'ABCDEFG',
        					fileSize: 888
        				},
        				width: 100,
        				height: 200,
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
    		creativeTypeMessageName: 'image',
    		creativeTypeMessageClass: 'ImageCreative',
    		image: {
      			material: {
        				creativeName: 'image_material',
        				file: {
        					fileSrc: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        					mediaId: 3333,
        					fileMd5: 'ABCDEFG',
        					fileSize: 888
        				},
        				width: 100,
        				height: 200,
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
    styleId: 20002,
    size: {
        sizeType: 1,
        width: 400,
        height: 90
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads)
};
        
module.exports = requestInfo;

