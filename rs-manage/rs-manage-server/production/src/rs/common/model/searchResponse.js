oojs.define({
    name: 'searchResponse',
    namespace: 'rs.common.model',
    pbType: 'rs.SearchResponse',
    property: {
        status: {
            dbType: 'INTEGER'
        },
        error: {
            dbType: 'STRING'
        },
        template: {
            metaType: 'rs.common.model.template'
        }
    }
});