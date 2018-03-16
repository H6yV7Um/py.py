oojs.define({
    name: 'thumbnail',
    namespace: 'rs.common.model',
    pbType: 'rs.Thumbnail',
    property: {
        id: {
            dbType: 'INTEGER'
        },
        template_id: {
            dbType: 'INTEGER'
        },
        type: {
            dbType: 'INTEGER'
        },
        width: {
            dbType: 'STRING'
        },
        height: {
            dbType: 'STRING'
        },
        url: {
            dbType: 'STRING'
        }
    }
});