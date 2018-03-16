oojs.define({
    name: 'template',
    namespace: 'rs.common.model',
    pbType: 'rs.Template',
    property: {
        id: {
            dbType: 'INTEGER'
        },
        style_type: {
            dbType: 'INTEGER'
        },
        name: {
            dbType: 'STRING'
        },
        content: {
            dbType: 'TEXT'
        },
        thumbnail: {
            metaType: 'rs.common.model.thumbnail'
        },
        sdl: {
            dbType: 'TEXT'
        },
        version: {
            dbType: 'INTEGER'
        },
        create_time: {
            dbType: 'DATE'
        },
        create_account: {
            dbType: 'STRING'
        },
        create_user_id: {
            dbType: 'STRING'
        },
        create_user_platform: {
            dbType: 'STRING'
        },
        update_time: {
            dbType: 'DATE'
        },
        update_account: {
            dbType: 'STRING'
        },
        update_user_id: {
            dbType: 'STRING'
        },
        update_user_platform: {
            dbType: 'STRING'
        },
        status: {
            dbType: 'INTEGER'
        },
        remark: {
            dbType: 'STRING'
        },
        size: {
            metaType: 'rs.common.model.templateSize'
        }
    }
});