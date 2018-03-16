/**
 * @file styleTypeEnum file
 * @author liguangyi@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'styleType',
    namespace: 'rs.common.model',
    styleTypeEnum: {
            // 'int1000': 'TEXT_BASE',
            int1001: 'TEXT_APP_DOWNLOAD',
            int1002: 'TEXT_APP_DOWNLOAD_20_5',
            int1003: 'TEXT_APP_DOWNLOAD_6_5',
            int1005: 'TEXT_MOBILE',
            int1006: 'TEXT_APP_DOWNLOAD_LBS',
            int1007: 'TEXT_SDK',
            int1008: 'TEXT_SDK_BANNER_BASE',
            int1009: 'TEXT_SDK_BANNER_RANK',
            int1010: 'TEXT_SDK_BANNER_LUNBO',
            int1011: 'TEXT_SDK_BC',
            int1012: 'TEXT_WAP_MDSP',
            int1013: 'TEXT_WAP_MDSP_WIN',
            int1014: 'TEXT_SDK_BANNER_BASE_NEW',
            int1015: 'TEXT_SDK_BANNER_BASE_EXTENDED',
            int1016: 'TEXT_SDK_BANNER_BASE_EXTENDED_1',
            int2000: 'IMAGE_BASE',
            int2001: 'IMAGE_APP_DOWNLOAD',
            int2002: 'IMAGE_APP_DOWNLOAD_FULL',
            int2003: 'IMAGE_SPLASH',
            int2004: 'IMAGE_SDK_BANNER_BASE',
            int2005: 'IMAGE_SDK_BANNER_ICON',
            int2006: 'IMAGE_SDK',
            int2007: 'IMAGE_SDK_FEED_WINDOW',
            int2008: 'IMAGE_SDK_FEED_LUNBO_TITLE',
            int2009: 'IMAGE_SDK_FEED_LUNBO',
            int2010: 'IMAGE_FULL_SPLASH',
            int2011: 'IMAGE_SPLASH_BASE',
            int2012: 'IMAGE_SDK_1',
            int2013: 'IMAGE_SDK_2',
            int2014: 'IMAGE_WAP_BANNER_LUNBO',
            int2015: 'IMAGE_SDK_2_1',
            int2016: 'IMAGE_SDK_BANNER_LBS',
            int2017: 'IMAGE_WAP_BANNER_BASE',
            int2018: 'IMAGE_SDK_BANNER_BASE_TEST',
            int2998: 'IMAGE_BASE_DSPAUTO',
            int2999: 'IMAGE_GOOGLE_ADX',
            int3000: 'FLASH_BASE',
            int3001: 'FLASH_BASE_DSPAUTO',
            int3999: 'FLASH_GOOGLE_ADX',
            int4001: 'TUWEN_APP_DOWNLOAD',
            int4002: 'TUWEN_APP_DOWNLOAD_20_5',
            int4003: 'TUWEN_APP_DOWNLOAD_20_2',
            int4004: 'TUWEN_APP_DOWNLOAD_6_5',
            int4005: 'TUWEN_MOBILE',
            int4006: 'TUWEN_APP_ICON_DOWNLOAD',
            int4007: 'TUWEN_SDK',
            int4008: 'TUWEN_MOBILE_SCREEN',
            int4009: 'TUWEN_SDK_BANNER_BASE',
            int4010: 'TUWEN_SDK_BANNER_LUNBO',
            int4011: 'TUWEN_IMAGE_TEXT_FULLLUNBO_6_5',
            int4012: 'TUWEN_IMAGE_TEXT_LUNBO_6_5',
            int4013: 'TUWEN_IMAGE_TEXT_FULLLUNBO',
            int4014: 'TUWEN_BASE',
            int4015: 'TUWEN_QRCODE',
            int4016: 'TUWEN_APP_FULLLUNBO',
            int4017: 'TUWEN_SDK_FEED',
            int4018: 'TUWEN_SDK_BC',
            int4019: 'TUWEN_QRCODE_TEST1',
            int4020: 'TUWEN_QRCODE_TEST2',
            int4021: 'TUWEN_IMAGE_TEXT_FULLLUNBO_BC',
            int4022: 'TUWEN_QRCODE_CAR_1',
            int4023: 'TUWEN_QRCODE_CAR_2',
            int4024: 'TUWEN_APP_FULLLUNBO_6_5',
            int4025: 'TUWEN_WAP_MDSP',
            int4026: 'TUWEN_WAP_GLB',
            int4027: 'TUWEN_WAP_MOBILEBD',
            int4028: 'TUWEN_WAP_MDSP_WIN',
            int4029: 'TUWEN_WAP_FEED_IMAGE_1',
            int4030: 'TUWEN_WAP_FEED_IMAGE_2',
            int4031: 'TUWEN_WAP_FEED_BANNER_1',
            int4032: 'TUWEN_WAP_FEED_BANNER_2',
            int4033: 'TUWEN_WAP_FEED_BANNER_3',
            int4034: 'TUWEN_WAP_GLB_VIDEO',
            int4035: 'TUWEN_SDK_BANNER_BASE_NEW',
            int4036: 'TUWEN_WAP_FEED_BANNER_4',
            int4035: 'TUWEN_SDK_BANNER_BASE_NEW',
            int4037: 'TUWEN_WAP_WISE',
            int4038: 'TUWEN_IMAGE_TEXT_FULLLUNBO_BC_NO_BLUR',
            int4039: 'TUWEN_IMAGE_TEXT_FULLLUNBO_BC_RAF',
            int4040: 'TUWEN_IMAGE_TEXT_FULLLUNBO_BC_RAF_NO_BLUR',
            int4041: 'TUWEN_SDK_BANNER_BASE_EXTENDED',
            int4042: 'TUWEN_SDK_BANNER_BASE_IMAGE',
            int4043: 'TUWEN_WAP_SOCIAL_FEED_1',
            int4044: 'TUWEN_WAP_SOCIAL_FEED_2',
            int4045: 'TUWEN_SDK_LOGO_SINGLE_IMAGE',
            int4046: 'TUWEN_SDK_LOGO_MULTI_IMAGE',
            int4047: 'TUWEN_SDK_BANNER_BASE_EXTENDED_1',
            int4048: 'TUWEN_SDK_BANNER_BASE_EXTENDED_2',
            int8000: 'VIDEO_BASE',
            int8001: 'VIDEO_FEED_SDK',
            int9000: 'SMART_IDEA_BASE',
            int9001: 'SMART_IDEA_MULTIURL'
        },

    get: function (intValue) {
        intValue = intValue || 2000;
        var result = this.styleTypeEnum['int' + intValue] || 'IMAGE_BASE';
        result = result.toLowerCase();
        return result;
    },

    getAll: function () {
        var result = [];
        for (var key in this.styleTypeEnum) {
            if (key && this.styleTypeEnum.hasOwnProperty(key) && this.styleTypeEnum[key]) {
                result.push(this.styleTypeEnum[key]);
            }
        }
        return result;
    }
});
