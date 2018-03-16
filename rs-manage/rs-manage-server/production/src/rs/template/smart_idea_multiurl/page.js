var dataArray = [];
dataArray[0] = {};
var pBlocksArray = {};
for (var i = 0,j=ads[0].smartIdeaProduct.length; i < j; i++) {
	var item = ads[0].smartIdeaProduct[i];		
	var pageBlocks = {};
	for(var k in item){
		if(k==="jsonData"){
			var jsonD=eval("["+item[k]+"]");
			item[k]=jsonD;
			for(var l in jsonD){
				for(var m in jsonD[l]){						
					if(typeof jsonD[l][m] === "object"){
						jsonD[l][m]["curl"] = jsonD[l][m]["curl"] || ads[0].smartIdeaProduct[i]["clickUrl"] ||ads[0]["clickUrl"];
						if(jsonD["midIndex"] === "" || typeof jsonD["midIndex"] === "undefined"){
							jsonD["midIndex"] = ads[0].smartIdeaProduct[i]["midIndex"]||ads[0]["midIndex"] || 0;
						}
						if(jsonD[l][m]["midIndex"] === "" || typeof jsonD[l][m]["midIndex"] === "undefined"){
							jsonD[l][m]["midIndex"] = jsonD["midIndex"];
						}
					}						
					pageBlocks[m]=jsonD[l][m];
				}
			}
		} else if(k == "clickUrl"){
			pageBlocks["curl"] = item[k]||ads[0]["clickUrl"];
		}else if(k == "midTime"){
			pageBlocks["midIndex"] = item[k]||ads[0]["midTime"];
		}
	}
	item['block'] =  item['block'] || "normalBlock";	
	pBlocksArray[item["block"]] = pBlocksArray[item["block"]] || [];
	pBlocksArray[item["block"]].push(pageBlocks);
}
dataArray[0]["pageBlocks"] = pBlocksArray;
if (dataArray[0].pageBlocks["normalBlock"].length > 0) {
    window.parent.postMessage('ad=1', 'http://tieba.baidu.com');
} else {
    window.parent.postMessage('ad=0', 'http://tieba.baidu.com');
}
var tpl = oojs.using('oojs.smTemplate');
var html = tpl.complie('smTpl', dataArray);
var logoStr = '<a href="" title="" class="bd-logo5"></a>';
document.getElementById('container').innerHTML = html+logoStr;
