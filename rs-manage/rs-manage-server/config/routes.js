/**
 * @file router config(暂时无用)
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

module.exports = {

        '/': {
            method: 'GET',
            controller: 'index'
        },

        '/template/:methodId': {
            controller: 'template'
        },

        '/api/:methodId': {
            controller: 'api'
        }

    };
