var fs=require("fs");
var parseVolPage=function(str){
	var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-(\d+)([abcd])(\d*)/);
	if(!s){
		console.log("error!",str);
		return null;
	}
	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6],line2:parseInt(s[7]||"1")};
}

//var vline=require("./vline_for_search");
var jPedurma=JSON.parse(fs.readFileSync("./j-pedurma.json","utf8"));
var dPedurma=JSON.parse(fs.readFileSync("./d-pedurma.json","utf8"));
var rvp2rvp=function(){
	var out=[];
	var j=0;
	//從J的經號得到K的經號
	//從K的經號得到D的經號和頁碼
	for(var i =0; i<jPedurma.length; i++){
		for(var j=0; j<dPedurma.length; j++){
			if(jPedurma[i][2] == dPedurma[j][2]){
				var D=dPedurma[j][0];
				var Dpage=dPedurma[j][1];
				out.push([D,Dpage]);
				break;
			}
			
		}
	}
	return out;
}

var rvp2Vline=function(){
	var out=[];
	var pageRange=rvp2rvp();
	for(var i=0;i<pageRange.length; i++){
		var s=parseVolPage(pageRange[i][1]);
		out.push(s);
	}
	

	return out;
}


console.log(rvp2Vline());
