oojs.define({
    name: 'insertUpdateResponse',
    namespace: 'rs.common.model',
    pbType: 'rs.InsertUpdateResponse',
    property: {
        status: {
            dbType: 'INTEGER'
        },
        template_id: {
            dbType: 'INTEGER'
        },
        error: {
            dbType: 'STRING'
        }
    }
});