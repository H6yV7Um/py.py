oojs.define({
    name: 'smartIdea',
    namespace: 'rs.common.model',

    //向to插入属性key, 如果key已经存在, 则将key属性转变成数组
    insert: function (to, key, val) {
        if (to[key]) {
            if (to[key] instanceof Array) {
                to[key].push(val);
            }
            else {
                var tempArray = [];
                tempArray.push(to[key]);
                tempArray.push(val);
                to[key] = tempArray;
            }
        }
        else {
            to[key] = val;
        }
        return true;
    },

    //内容源为 key:value的形式
    getObjColon: function (source) {
        var result = {};
        var sourceArray = source.split('\n');
        for (var i = 0, count = sourceArray.length; i < count; i++) {
            var regex = /^\s*([^\:]*)\s*\:\s*(.*)/gi;
            var itemString = sourceArray[i];
            var itemResult = null;
            if (itemString) {
                itemString = itemString.trim();
                itemResult = regex.exec(itemString);
            }

            if (itemResult) {
                var itemKey = itemResult[1];
                var itemValue = itemResult[2];

                if (itemKey) {
                    itemKey = itemKey.trim();
                    itemKey = itemKey.replace(/^\s*\$\s*/gi, '');
                }
                else {
                    continue;
                }

                if (itemValue) {
                    itemValue = itemValue.trim();
                    this.insert(result, itemKey, itemValue);
                }
            }
        }
        return result;
    },


    /*内容源格式为:		
		[@template]
		id : 2
		code_file : smartidea_02
		global_css_name : GlobalCss
		[.@size_config]
		width : 400
		height : 300
		config_name : layoutConfig_400_300	
	*/
    getObjBracket: function (source) {
        var regex = /(\[[^\[]*)/gi;
        var itemArray = source.match(regex);

        var result = {};
        for (var i = 0, count = itemArray.length; i < count; i++) {
            var itemString = itemArray[i];
            var itemRegexp = /\[([^\]]*)\]([\s\S]*)/gi;
            var itemResult = itemRegexp.exec(itemString);

            var itemKey = itemResult[1];
			var itemValue = itemResult[2];
			
			if(itemKey){
				itemKey = itemKey.trim();
				itemKey = itemKey.replace(/^[\s\.]*\@\s*/gi, '');
			}
			else{
				continue;
			}
			
			if( itemValue ){
				var item = this.getObjColon(itemValue);
				this.insert(result, itemKey, item);
			}

        }
		return result;
    },
	
	/*内容源格式为:	
		# for general hotel
		GlobalCss = <code>
		{
					'.container div':'{position:absolute;overflow:hidden}',
					'a':'{text-decoration:none}',
		'.container':'{position:relative;padding:0;margin:0;overflow:hidden;border:1px solid #436CE9;background:#FFFFFF;}',
		'.title':'{color:#436CE9;}',
		'.price':'{color:#000;}',
		'.bookButtonText':'{color:#FFF}'
		}
		</code>
	*/
    getObjTag: function (source) {
		var result = {};
	
		//过滤注释
		var source = source.replace(/^\#.*/gi,'');
		var regex = /^\s*([^=]*)\s*\=\s*\<code\>\s*([\s\S]*?)<\/code>/gmi;

		var itemArray = source.match(regex);
		for(var i=0, count=itemArray.length; i<count; i++){
			var itemString = itemArray[i];
			var itemRegex = /^\s*([^=]*)\s*\=\s*\<code\>\s*([\s\S]*?)<\/code>/gmi;
			var itemResult = itemRegex.exec(itemString);
			
			var itemKey = itemResult[1];
			var itemValue = itemResult[2];
			
			if(itemKey){
				itemKey = itemKey.trim();
			}
			else{
				continue;
			}
			
			if( itemValue ){
				var item = this.getObjColon(itemValue);
				this.insert(result, itemKey, itemValue);
			}
		}
		
		return result;
    }


});