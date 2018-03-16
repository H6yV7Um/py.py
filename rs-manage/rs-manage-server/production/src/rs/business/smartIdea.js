oojs.define({
    name: 'smartIdea',
    namespace: 'rs.business',
    deps: {
        config: 'rs.common.model.smartIdea',
        data: 'rs.data.smartIdeaFile'
    },

    getVars: function (templateId, width, height) {
        var result;
        var smGlobleCss = '';
        var smLayoutconfig = '';
        var smLunboConfig = '';
		var smCssConfig='';

        if (!this.configCache) {
            this.configCache = this.getConfig();
        }

        if (templateId < 10) {
            templateId = "0" + templateId;
        }

        var templateConfig = this.configCache['template' + templateId];


        if (templateConfig) {
            smGlobleCss = templateConfig.global_css;
            smLayoutConfig = templateConfig[width.toString() + "_" + height.toString()];
            smLunboConfig = templateConfig["lunbo_" + width.toString() + "_" + height.toString()] || '""';
			smCssConfig=templateConfig["css_" + width.toString() + "_" + height.toString()] || '""';
        }

        return {
            smGlobleCss: smGlobleCss,
            smLayoutConfig: smLayoutConfig,
            smLunboConfig: smLunboConfig,
			smCssConfig:smCssConfig
        }

    },

    loadConfig: function () {
        if (!this.configCache) {
            this.configCache = this.getConfig();
        }
    },

    getConfig: function () {
        var result = {};
        var mainString = this.data.getMainFile();
        var mainConfig = this.config.getObjColon(mainString);
        for (var i = 0, count = mainConfig.include.length; i < count; i++) {
            var subFileName = mainConfig.include[i];
            var subFileString = this.data.getSubFile(subFileName);
            var subConfig = this.config.getObjBracket(subFileString);
            var subFileId = subConfig.template.id;
            if (subFileId < 10) {
                subFileId = "0" + subFileId;
            }
            var subFile = result['template' + subFileId] = {};
            subFile.global_css_name = subConfig.template.global_css_name;

            var varFileName = subConfig.template.code_file;
            var varFileString = this.data.getVarFile(varFileName);
            var varFileConfig = this.config.getObjTag(varFileString);

            subFile.global_css = varFileConfig[subFile.global_css_name];

            if (subConfig && subConfig.size_config && subConfig.size_config.length) {

                for (var j = 0, jcount = subConfig.size_config.length; j < jcount; j++) {
                    var sizeConfig = subConfig.size_config[j];
                    if (sizeConfig) {
                        subFile[sizeConfig.width + "_" + sizeConfig.height] = varFileConfig[sizeConfig.config_name];
                        if (sizeConfig.lunbo_config_name) {
                            subFile["lunbo_" + sizeConfig.width + "_" + sizeConfig.height] = varFileConfig[sizeConfig.lunbo_config_name];
                        }
						if(sizeConfig.css_config_name){
							subFile["css_"+sizeConfig.width+"_"+sizeConfig.height]=varFileConfig[sizeConfig.css_config_name];
						}
                    }
                }
            }

        }
        return result;
    }
});