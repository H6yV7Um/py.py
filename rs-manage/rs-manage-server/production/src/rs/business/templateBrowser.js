oojs.define({
    name: 'templateBrowser',
    namespace: 'rs.business',
    deps: {
        layoutEngineFactory: 'rs.business.layoutEngineFactory',
        configManager: 'rs.business.configManager',
        logo: 'rs.business.logo',
        htmlRenderEngine: 'rs.business.htmlRenderEngine',
        templateVars: 'rs.business.templateVariableManager',
        layoutEngineCache: 'rs.business.layoutEngineCache',
        dataEngine: 'rs.business.dataEngine',
        file: 'rs.data.file',
		string: 'rs.common.utility.string'
    },
    $templateBrowser: function (option) {},

    getTemplate: function (option, callback) {
	
		var templateVars = JSON.parse(option.templateVarsJson);
		var templateName = option.templateName;

    }

});