var ads = {
	mainCreatives: [{
			creativeTemplateId : 111,
			deviceType : 1,
			creativeType : 4,
			creativeTypeMessageName : 'textWithIcon',
			creativeTypeMessageClass : 'TextWithIconCreative',
			textWithIcon : {
				material : {
					creativeName : 'text_with_icon_material',
					creativeTitle : '企业法律风险防控',
					creativeDesc1 : '企业法律风险免费识别，30天评估法律风险 盈科润达高级律师企业法律风险免费识别，30天评估法律风险 盈科润达高级律师',
					creativeDesc2 : '专业法律风险防控团队',
					file : {
						fileSrc : 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
						mediaId : 3333,
						fileMd5 : 'ABCDEFG',
						fileSize : 888
					},
					width : 999,
					height : 111
				},
				action : {
					actionType : 4,
					actionTypeMessageName : 'forward',
					actionTypeMessageClass : 'ForwardAction',
					forward : {
						pcClickLink : 'www.baidu.com',
						mobileClickLink : 'www.mobile.baidu.com',
						targetPage : 'www.baidu.com',
						monitorLinks : ['www.winnotice.baidu.com', 'www.baidu.com'],
						clickLink : {
							clickLink : 'pos.baidu.com',
							antiCheating : 123456
						}
					}
				}
			}
		}, {
			creativeTemplateId : 111,
			deviceType : 1,
			creativeType : 4,
			creativeTypeMessageName : 'textWithIcon',
			creativeTypeMessageClass : 'TextWithIconCreative',
			textWithIcon : {
				material : {
					creativeName : 'text_with_icon_material',
					creativeTitle : '企业法律风险防控',
					creativeDesc1 : '企业法律风险免费识别，30天评估法律风险 盈科润达高级律师企业法律风险免费识别，30天评估法律风险 盈科润达高级律师',
					creativeDesc2 : '专业法律风险防控团队',
					file : {
						fileSrc : 'http://ubmcmm.baidustatic.com/media/v1/0f000a4uVQhMnybd8Iwjsf.jpg',
						mediaId : 3333,
						fileMd5 : 'ABCDEFG',
						fileSize : 888
					},
					width : 999,
					height : 111
				},
				action : {
					actionType : 4,
					actionTypeMessageName : 'forward',
					actionTypeMessageClass : 'ForwardAction',
					forward : {
						pcClickLink : 'www.baidu.com',
						mobileClickLink : 'www.mobile.baidu.com',
						targetPage : 'www.baidu.com',
						monitorLinks : ['www.winnotice.baidu.com', 'www.baidu.com'],
						clickLink : {
							clickLink : 'pos.baidu.com',
							antiCheating : 123456
						}
					}
				}
			}
		}
	]
};

// 请求对象
var requestInfo = {
	client : {
        dspId: 9,
		sspId : 1,
		requestId : 'requestId',
		account : 'account'
	},
	styleId : 50016,
	size : {
		sizeType : 1,
		width : 300, //767,
		height : 60 //192
	},
	device : {
		userAgent : 'Mozilla/5.0 (Windows NT ...o/20100101 Firefox/45.0'
		//'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)'
	},
	ads : JSON.stringify(ads),
	//dupDomain: 'www.123.com',
	styleConfig : {
		'isShowCloseFeedBack' : true,
		//'adslot_type': 0,
		'ext' : '{}' // '{"conbw":5,"rss0":"#999","bborder":2,"txt": {"number":1,"txtSkin":1},"cdesc":"#ff00cc","descPaddingTop":10,"cborder":"ff00cc","itemRightImage":1}'
	}, //,"":"","":"","":"","":"","":"","":"","":"","":""
	dupDomain : 'www.hao123.com'
};

module.exports = requestInfo;
