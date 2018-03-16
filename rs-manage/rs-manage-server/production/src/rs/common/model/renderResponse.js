/**
 * @file TemplateResponseInfo meta
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'renderResponse',
    namespace: 'rs.common.model',
    pbType: 'rs.TemplateResponseInfo',
    property: {
        searchId: {
            dbType: 'STRING'

        },
        returnCode: {
            dbType: 'INTEGER'

        },
        error: {
            dbType: 'STRING'

        },
        htmlSnippet: {
            dbType: 'STRING'
        },
        expIds: {
            dbType: 'INTEGER'
        }

    }

});
