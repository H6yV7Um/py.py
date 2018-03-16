oojs.define({
    name: 'webpCompressResponse',
    namespace: 'rs.common.model',
    pbType: 'rs.WebpCompressResponse',
    property: {
        status: {
            dbType: 'INTEGER'
        },
        data: {
            dbType: 'STRING.BINARY'
        },
        error: {
            dbType: 'STRING'
        }
    }
});