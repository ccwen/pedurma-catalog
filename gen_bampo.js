var fs=require("fs");
var jinglu=JSON.parse(fs.readFileSync("jinglu.json","utf8"));
var bampotsv=fs.readFileSync("bampo.tsv","utf8").replace(/\r?\n/g,"\n").split("\n")

var getSutra=function( ret, key) {
	var out="";
	var found=jinglu.some(function(jing){
		if (typeof jing[key]!="undefined") {
			for (var i in jing) {
				if (i[0]==ret) out=i.substr(1);
			}
		}
	});
	return out;
}
var minusoneline=function(pageline) {
	var pl=pageline.match(/(\d+)@(\d+)([ab])(\d)/);
	if (!pl) {
		console.error("error pageline format",pageline);
	}

	var vol=pl[1], page=parseInt(pl[2]), side=pl[3],line=parseInt(pl[4]);
	if (line>1) {
		line--;
	} else {
		line=8;
		if (side=="b") side="a";
		else {
			side="b";
			page--;
		}
	}

	return page+side+line;
}
var processbampo=function(line,idx,tsv) {
	if (idx==0)return; //skip field name
	if (idx==tsv.length-1) return;
	var fields=line.split("\t");
	var nextfields=tsv[idx+1].split("\t");
	var data={sutra_nbampo:fields[0], jiang:fields[1],lhasa:fields[2],dege:fields[3]};
	
	if (!nextfields[0]) throw "missing nbampo at line:"+(idx+2)+" "+line;
	if (!nextfields[1]) throw "missing jiang at line:"+(idx+2)+" "+line;
	if (!nextfields[2]) throw "missing lhasa at line:"+(idx+2)+" "+line;
	if (!nextfields[3]) throw "missing dege at line:"+(idx+2)+" "+line;
	var next={sutra_nbampo:nextfields[0], 
		       jiang:minusoneline(nextfields[1]),
		       //cone:minusoneline(nextfields[2]),
		       lhasa:minusoneline(nextfields[2]),
		   dege:minusoneline(nextfields[3])};
	var nbampo=parseInt(data.sutra_nbampo.substr(7));
	var jiang_sutra=parseInt(data.sutra_nbampo.substr(2,4));
	var newdata={};
	newdata['J'+jiang_sutra+'_'+nbampo]=data.jiang+"-"+next.jiang;
	newdata['D'+getSutra("D","J"+jiang_sutra)+"_"+nbampo]=data.dege+"-"+next.dege;
	newdata['H'+getSutra("H","J"+jiang_sutra)+"_"+nbampo]=data.lhasa+"-"+next.lhasa;
	newdata['C'+getSutra("C","J"+jiang_sutra)+"_"+nbampo]=data.cone+"-"+next.cone;

	console.log(JSON.stringify(newdata,""," ")+",");
}
bampotsv.map(processbampo);
