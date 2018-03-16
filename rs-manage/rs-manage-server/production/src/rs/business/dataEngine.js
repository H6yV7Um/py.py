oojs.define({
	name:'dataEngine',
	namespace:'rs.business',
	deps:{
		string:'rs.common.utility.string'
	},
	render:function(html, ads){
		var data = {};
		for(var i=0, count=ads.length; i<count; i++){
			var ad = ads[i];
			for(var key in ad){
				if(key && typeof ad[key] !== 'undefined' && ad.hasOwnProperty(key) ){
					data[key + i] = ad[key];
				}
			}
		}
		
		return this.string.template( html, data );
	}
});