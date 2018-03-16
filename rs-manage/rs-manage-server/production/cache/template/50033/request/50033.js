/**
 * @file ��������
 * @author liguangyi@baidu.com
 */
var ads = {
        'mainCreatives': [{
            'creativeTemplateId': 10005,
            'deviceType': 3,
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
                'material': {
                    'creativeName': 'text_with_icon_material',
                    'creativeTitle': '��¼��ʱ�ɳ��ĵ��ε�',
                    'creativeDesc1': '�ö�̬Ӱ��������������õĻ���,�������� ��ʱ���۵�������������а��Ц',
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
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
                'material': {
                    'creativeName': 'text_with_icon_material',
                    'creativeTitle': '2014����˼������ѧ��',
                    'creativeDesc1': '��ѧ?����?��ҵ?��Ϊ�ִ���ѧ��,��˼��ѧ! ��˼��ѵ��׼17���쵼Ʒ',
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
            'creativeType': 4,
            'creativeTypeMessageName': 'textWithIcon',
            'creativeTypeMessageClass': 'TextWithIconCreative',
            'textWithIcon': {
                'material': {
                    'creativeName': 'text_with_icon_material',
                    'creativeTitle': '��ҵ���ɷ��շ���',
                    'creativeDesc1': '��ҵ���ɷ������ʶ��30���������ɷ��� ӯ�����߼���ʦ��רҵ���ɷ��շ����Ŷ�',
                    'creativeDesc2': '��ҵ���ɷ������ʶ��30���������ɷ��� ӯ�����߼���ʦ��רҵ���ɷ��շ����Ŷ�',
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

// �������
var requestInfo = {
    client: {
        dspId: 1,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 50033,
    size: {
        sizeType: 2,
        width: 700,
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

