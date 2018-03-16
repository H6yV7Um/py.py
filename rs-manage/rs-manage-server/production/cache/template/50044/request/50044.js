/* eslint-disable */
/**
 * @file 测试数据
 * @author qianxiaoli@baidu.com
 */
// 模拟的广告数据部分
     var ads = {
      	creativeContents: [{
      			textMaterial: [{
      					creativeName: 'text_with_icon_material',
      					creativeTitle: '企业法律风险防控',
      					creativeDesc1: '企业法律风险免费识别，30天评估法律风险 盈科润达高级律师企业法律风险免费识别，30天评估法律风险 盈科润达高级律师',
      					creativeDesc2: '专业法律风险防控团队',
      					file: {
      						fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
      						mediaId: 3333,
      						fileMd5: 'ABCDEFG',
      						fileSize: 888
      					},
      					width: 999,
      					height: 111
      				}
      			],
      			imageMaterial: [{
      					creativeName: 'image_material',
      					file: {
      						fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
      						mediaId: 3333,
      						fileMd5: 'ABCDEFG',
      						fileSize: 888
      					},
      					width: 180,
      					height: 100,
      					imageSource: 0,
      					rainbowTemplateId: 999
      				},
                    {
      					creativeName: 'image_material',
      					file: {
      						fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
      						mediaId: 3333,
      						fileMd5: 'ABCDEFG',
      						fileSize: 888
      					},
      					width: 180,
      					height: 100,
      					imageSource: 0,
      					rainbowTemplateId: 999
      				},
                    {
      					creativeName: 'image_material',
      					file: {
      						fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
      						mediaId: 3333,
      						fileMd5: 'ABCDEFG',
      						fileSize: 888
      					},
      					width: 180,
      					height: 100,
      					imageSource: 0,
      					rainbowTemplateId: 999
      				}
      			],
      			action: [{
      					actionType: 4,
      					actionTypeMessageName: 'forward',
      					actionTypeMessageClass: 'ForwardAction',
      					forward: {
      						pcClickLink: 'www.baidu.com',
      						mobileClickLink: 'www.mobile.baidu.com',
      						targetPage: 'www.baidu.com',
      						monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'],
      						clickLink: {
      							clickLink: 'pos.baidu.com',
      							antiCheating: 123456
      						}
      					},
                        clickLink: {
      							clickLink: 'pos.baidu.com',
      							antiCheating: 123456
      						}
      				}
      			]
      		}
      	]
    };

// 请求对象
var requestInfo = {
    client: {
        dspId: 1,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 50042,
    size: {
        sizeType: 1,
        width: 640,
        height: 178
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads),
	styleConfig: {
		ext: '{"nativead":{"screen":{"width":154,"height":89}},"txt":{"ctitle":"000"},"pdp":1}'
	}
};

module.exports = requestInfo;

