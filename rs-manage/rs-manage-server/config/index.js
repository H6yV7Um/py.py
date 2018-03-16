/**
 * @file app config
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

const path = require('path');

/**
 * root directory
 *
 * @type {string}
 * @public
 */
exports.ROOT_DIR = path.resolve(__dirname, '..', '..');

/**
 * mock tool directory
 *
 * @type {string}
 * @public
 */
exports.MOCK_DIR = path.resolve(__dirname, '..');

/**
 * mock data directory
 *
 * @type {string}
 * @public
 */
exports.MOCK_DATA_DIR = path.join(exports.MOCK_DIR, 'mockData');

/**
 * protobuf file path
 *
 * @type {string}
 * @public
 */
exports.PROTO_PATH = path.join(exports.ROOT_DIR, 'src', 'rs', 'api', 'protocol', 'rs.proto');

/**
 * templates dir
 *
 * @type {Object}
 * @public
 */
exports.TPL_DIR = {
    0: {
        dir: path.join(exports.ROOT_DIR, 'src', 'rs', 'template'),
        mockData: 'request'
    },
    1: {
        dir: path.join(exports.ROOT_DIR, 'cache'),
        mockData: null
    },
    8: {
        dir: path.join(exports.ROOT_DIR, 'cache', 'template'),
        mockData: 'request'
    }
};

/**
 * rpc server config
 *
 * @type {Object}
 * @public
 */
exports.RPC = {
    address: '127.0.0.1',
    port: 3000
};

/**
 * http server config
 *
 * @type {Object}
 * @public
 */
exports.SERVER = {
    address: '0.0.0.0',
    port: 8123
};

/**
 * router config
 *
 * @type {Object}
 * @public
 */
// exports.router = require('./router');

/**
 * view config
 *
 * @type {Object}
 * @public
 */
// exports.VIEW = require('./view')(exports.MOCK_DIR);
