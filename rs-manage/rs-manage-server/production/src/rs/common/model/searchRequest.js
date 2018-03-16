oojs.define({
    name: 'searchRequest',
    namespace: 'rs.common.model',
    pbType: 'rs.SearchRequest',
    property: {
        account: {
            dbType: 'STRING'
        },
        user_platform: {
            dbType: 'STRING'
        },
        user_id: {
            dbType: 'STRING'
        },
        template_id: {
            dbType: 'INTEGER'
        },
        template_model_type: {
            dbType: 'INTEGER'
        },
        with_public:{
            dbType: 'BOOLEAN'
        },
        with_sub_template:{
            dbType: 'BOOLEAN'
        }
    }
});