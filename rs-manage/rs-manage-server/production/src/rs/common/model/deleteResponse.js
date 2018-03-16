oojs.define({
    name: 'deleteResponse',
    namespace: 'rs.common.model',
    pbType: 'rs.DeleteResponse',
    property: {
        status: {
            dbType: 'INTEGER'
        },
        count: {
            dbType: 'INTEGER'
        },
        error: {
            dbType: 'STRING'
        }
    }
});