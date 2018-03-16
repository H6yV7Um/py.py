/**
 * @file tools
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');
const path = require('path');

exports.isExist = function (target) {
    try {
        return !!fs.statSync(target);
    }
    catch (e) {
        return false;
    }
};

/**
 * require without cache
 *
 * @param {string} mod    node.js module path(name)
 * @return {*} node.js module
 */
exports.requireWithoutCache = function requireWithoutCache(mod) {
    let name = require.resolve(mod);
    delete require.cache[name];
    return require(name);
};

exports.getMockFile = function (mockDir, mockFile) {
    // 这里必须用 path.resolve 因为 mockFile 可能是绝对路径
    let filePath = path.resolve(mockDir, mockFile);
    console.log('filePath====' + filePath)
    let mod = void 0;

    /* eslint-disable fecs-camelcase, no-console */
    // fake oojs define
    // TODO: 副作用很大啊～～～ 也只能用在 requireWithoutCache 上
    if (!global.oojs) {
        global.oojs = {
            __vsr_tmp__: void 0,
            define(obj) {
                this.__vsr_tmp__ = obj;
            }
        };
    }


    try {
        // 必须先 requireWithoutCache 之后，global.oojs.__vsr_tmp__ 才可能不为 undefined
        // 顺序不能遍，必须先 requireWithoutCache 再判断赋值
        let tmp = exports.requireWithoutCache(filePath);
        mod = global.oojs.__vsr_tmp__ || tmp;
        global.oojs.__vsr_tmp__ = void 0;
    }
    catch (e) {
        console.error(`Mock File [${filePath}] error:`);
        console.error(e);
    }
    return mod;
    /* eslint-enable fecs-camelcase, no-console */
};
