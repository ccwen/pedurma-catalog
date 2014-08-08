var fs=require("fs");
var vline=require("./vline.js");
var line=fs.readFileSync("../pedurma-catalog/jinglu.json","utf8").split(/\r?\n/);
var crossVol=0;
var out=[];
var out_cross=[];

var count_cross=function(){
	for(var i in line){
		var searchJ=line[i].indexOf("J");
		var searchCross=line[i].indexOf(";");
		if(searchJ>-1 && searchCross>-1){
			crossVol++;
			out_cross.push(line[i]);
		}
	}
	return out_cross;
}

var count_cross_sutra=function(){
	var cross=count_cross();
	var sutra=0;
	for(var i in cross){
		for(var j in cross[i]){
			var searchCross=cross[i][j].indexOf(";");
			if(searchCross>-1){
				sutra++;
			}
		}
		sutra++;
	}
	return sutra;
}

var count_no_cross=function(){
	for(var i in line){
		searchJ=line[i].indexOf("J");
		searchCross=line[i].indexOf(";");
		
		if(searchJ>-1 && searchCross<=0){
			out.push(line[i]);
		}
	}
	return out;
}
var parseVolPage=function(str){

	var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)/);

	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"0")};

}

var count_line=function(sutra){
	//var sutra=count_no_cross();	
	var line=[];
	
	for(var i in sutra){

	//find strat and end
		var s=sutra[i].split("-");
		var start=s[0],end=s[1];
		
	//prefix end with vol 在end前面加上vol
		end=parseVolPage(start).vol+"@"+end;
	//convert to start and end vline
		var startLine=vline.volpb2vl(start);
		var endLine=vline.volpb2vl(end);
		console.log(startLine,endLine);
	//相減
		line.push([i,(endLine-startLine)]);
	}

	line.sort(function(a,b){
			return b[1]-a[1];});

	return line;
}



var sutra=JSON.parse(fs.readFileSync("./LJ_nocorss.json","utf8"));
console.log(sutra);
//console.log(count_line(sutra));




