oojs.define({
    name: 'layoutEngineCache',
    namespace: 'rs.business',
    deps: {
        bufferCache: 'rs.data.bufferCache',
        defaultValueManager: 'rs.business.defaultValueManager'
    },
    $layoutEngineCache: function () {
        this.cache = oojs.create(this.bufferCache, 1024);
    },
    get: function (userConfig) {
        var cacheKey;
        for (var key in userConfig) {
            if (key && typeof userConfig[key] !== 'undefined' 
					&& userConfig.hasOwnProperty(key) 
					&& typeof this.defaultValueManager.globalDefaultValue[key] !== 'undefined') {
                cacheKey += key + "-" + userConfig[key] + "_";
            }
        }
        var result = this.cache.get(cacheKey);
		return result;
    },

    put: function (userConfig, value) {		
        var cacheKey;
        for (var key in userConfig) {
            if (key && typeof userConfig[key] !== 'undefined' 
					&& userConfig.hasOwnProperty(key) 
					&& typeof this.defaultValueManager.globalDefaultValue[key] !== 'undefined') {
                cacheKey += key + "-" + userConfig[key] + "_";
            }
        }

        this.cache.put(cacheKey, value);
    }
});