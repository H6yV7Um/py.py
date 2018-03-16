/**
 * @file 测试数据
 * @author liguangyi@baidu.com
 */
var ads = {mainCreatives: [{creativeTemplateId: 111, deviceType: 1, creativeType: 1, creativeTypeMessageName: 'flash', creativeTypeMessageClass: 'FlashCreative', flash: {material: {creativeName: 'flash_material', file: {fileSrc: 'http://ubmcmm.baidustatic.com/media/v1/0f000ADoViV6GwLjMic2r0.swf', mediaId: 3333, fileMd5: 'ABCDEFG', fileSize: 888}, width: 100, height: 200, flashSource: 0, rainbowTemplateId: 999}, action: {actionType: 4, actionTypeMessageName: 'forward', actionTypeMessageClass: 'ForwardAction', forward: {pcClickLink: 'www.baidu.com', mobileClickLink: 'www.mobile.baidu.com', targetPage: 'www.baidu.com' , monitorLinks: ['www.winnotice.baidu.com', 'www.baidu.com'], clickLink: {clickLink: 'http://www.baidu.com/cpro.php?R6_K00Kcw_DbKoDkcFM1XaDsI4Mdrg3BVchOjZldFQIgrEDML3WPHhErloNTnOc_lW8lhixuxEfIB6eQ_nCZyh1pl_ld0GdQMhLSmMtEnJ7hn90q-ylaIM4IRnT3.7Y_aOQslQvRQDk8LyN4QnhO-9k1QjPakg3eS5mC.IgF_5y9YIZ0lQzqLILT8IyV9UB4WmzqomM0Efh-mpy78ih-8uY9dUWnE0ZwV5HDYPj0YP1b0IZRqIHDzrHmvPH60Ivsqn6KWUMw85HRdnjDznjc4gvPsT6K9uAP_mgP15H00TMnqn0KWIAYqIAN3I7qbuyu9IykYg1bvn7t4n0K8mgwd5Hb0pgwGujYs0A-Ypy4hUv-b5H00uLKGujYs0ZF-uMKGujYs0APsThqGujY0mgwGujYCUMN_Uab0mgwYXHYCUMN_Uab0mMNbuvNYgvN3TA-b5HD0my-s5yPLpN6kiNqgnb410ZNGTjYdNRuawyImnZ9GmsKWpjYs0Zw9TWYz0AwYTjYk0ZP-UAk-T-qGujYk0A-1gv7sTjYs0A7sT7qGujYs0APdTLfq0A-1gLIGThN_ugP15H00Iv7sgLw4TARqn0KsUjYs0Ak3mWYs0AdW5HDYuWD4mhf40Adv5HD0UMus5H08nj0snj0snj00u1bqn0KhpgF1I7qzuyIGUv3qnfK1uyPEUhwxThNMpyq85HTYrfK1TL0qnfK1TL0z5HD0IZws5HD0uA-1IZ0qn0K9mWYs0A7bXjYk0ZKGujYs0ZIspyfqn0KWThnqnWbLn1T0', antiCheating: 123456}}}}}]};

// 请求对象
var requestInfo = {
    client: {
        dspId: 1,
        sspId: 1,
        requestId: 'requestId',
        account: 'account'
    },
    styleId: 30001,
    size: {
        sizeType: 1,
        width: 960,
        height: 90
    },
    device: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36'
        + ' (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    ads: JSON.stringify(ads),
    styleConfig: {
        actionType: 1,
        ext: '{"conbw":4,"rss0":"#999"}'
    }
};

module.exports = requestInfo;

