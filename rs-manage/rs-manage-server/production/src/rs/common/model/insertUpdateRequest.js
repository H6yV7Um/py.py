oojs.define({
    name: 'insertUpdateRequest',
    namespace: 'rs.common.model',
    pbType: 'rs.InsertUpdateRequest',
    property: {
        account: {
            dbType: 'STRING'
        },
        template: {
            metaType: 'rs.common.model.template'
        },
        sub_template: {
            metaType: 'rs.common.model.template'
        }
    }
});