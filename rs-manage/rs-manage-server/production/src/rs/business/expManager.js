/**
 * @file 实验分流管理
 * @author fanwenjuan@baidu.com
 */
/* global oojs */
oojs.define({
    /**
     * 实验分流管理类.
     * @class
     */
    name: 'expManager',
    namespace: 'rs.business',
    // 实验配置,实验号必须是170000-179999之间,流量总共是100
    expConfig: {
        all: [{
            index: 0,
            expSyleType: '',
            percent: 50,
            expId: 170001
        }, {
            index: 1,
            expSyleType: '',
            percent: 50,
            expId: 170002
        }],
        image_sdk_banner_base: [{
            index: 0,
            expSyleType: 'image_sdk_banner_base',
            percent: 5,
            expId: 170003
        }, {
            index: 1,
            expSyleType: 'image_sdk_banner_base_test',
            percent: 5,
            expId: 170004
        }]
    },
    expManager: function (context) {
        var basesSyleType = context.styleType;
        var currentRandom = parseInt(Math.random() * 100, 10);
        // 在具体的模板上实现分流实验
        if (this.expConfig[basesSyleType]) {
            for (var expIndex = 0, expLength = this.expConfig[basesSyleType].length; expIndex < expLength; expIndex++) {
                var currentExpObj = this.expConfig[basesSyleType][expIndex];
                var startExpValue = currentExpObj.percent * currentExpObj.index;
                var endExpValue = currentExpObj.percent * (currentExpObj.index + 1);
                if (startExpValue < currentRandom && currentRandom < endExpValue) {
                    context.styleType = currentExpObj.expSyleType;
                    context.expIdArray = context.expIdArray || [];
                    context.expIdArray.push(currentExpObj.expId);
                    break;
                }
            }
        }
        // 不区分模板名，在所有流量上分流实验，比如logo新旧样式的分流
        if (this.expConfig.all) {
            for (var expIndex = 0, expLength = this.expConfig.all.length; expIndex < expLength; expIndex++) {
                var currentExpObj = this.expConfig.all[expIndex];
                var startExpValue = currentExpObj.percent * currentExpObj.index;
                var endExpValue = currentExpObj.percent * (currentExpObj.index + 1);
                if (startExpValue < currentRandom && currentRandom < endExpValue) {
                    context.expIdArray = context.expIdArray || [];
                    context.expIdArray.push(currentExpObj.expId);
                    break;
                }
            }
        }
        return context;
    }
});
