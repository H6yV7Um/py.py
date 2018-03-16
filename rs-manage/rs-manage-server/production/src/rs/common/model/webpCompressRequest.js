oojs.define({
    name: 'webpCompressRequest',
    namespace: 'rs.common.model',
    pbType: 'rs.WebpCompressRequest',
    property: {
        account: {
            dbType: 'STRING'
        },
        data: {
            dbType: 'STRING.BINARY'
        }
    }
});