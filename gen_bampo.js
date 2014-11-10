var fs=require("fs");
var jinglu=JSON.parse(fs.readFileSync("jinglu.json","utf8"));
var bampotsv=fs.readFileSync("bampo.tsv","utf8").replace(/\r?\n/g,"\n").split("\n")
var old2new=JSON.parse(fs.readFileSync("old2new_sutraid.json","utf8")); //from gen_sutraid.js
//var j2k=require("./j-k.js");
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
var newsutra_nbampo=function(oldfilename) {
	var newsutraid=old2new[oldfilename.substr(0,6)];
	if (!newsutraid) {
		throw "new sutra id not found from "+newsutraid+" "+oldfilename;
	}

	return newsutraid+oldfilename.substr(oldfilename.length-4);
}
var processbampo=function(line,idx,tsv) {
	if (idx==0)return; //skip field name
	if (idx==tsv.length-1) return;
	var fields=line.split("\t");
	var nextfields=tsv[idx+1].split("\t");

	var data={sutra_nbampo:newsutra_nbampo(fields[0]), jiang:fields[1],lhasa:fields[2],dege:fields[3]};
	/*
	if (!nextfields[0]) throw "missing nbampo at line:"+(idx+2)+" "+line;
	if (!nextfields[1]) throw "missing jiang at line:"+(idx+2)+" "+line;
	if (!nextfields[2]) throw "missing lhasa at line:"+(idx+2)+" "+line;
	if (!nextfields[3]) throw "missing dege at line:"+(idx+2)+" "+line;
	var next={sutra_nbampo:newsutra_nbampo(nextfields[0]), 
		       jiang:minusoneline(nextfields[1]),
		       //cone:minusoneline(nextfields[2]),
		       lhasa:minusoneline(nextfields[2]),
		   dege:minusoneline(nextfields[3])};
	*/	   
	var sutranbampo=data.sutra_nbampo.split("_");
	var nbampo=parseInt(sutranbampo[1]);
	var jiang_sutraid=parseInt(sutranbampo[0].substr(1));

	var nextnewsutra_nbampo=(newsutra_nbampo(nextfields[0]));
	var nextsutranbampo=nextnewsutra_nbampo.split("_");
	var next_sutraid=parseInt(nextsutranbampo[0].substr(1));
	if (next_sutraid!=jiang_sutraid && nbampo==1) return;
	var newdata={};
	newdata['K'+getSutra("K","J"+jiang_sutraid)+"_"+nbampo]="";
	newdata['J'+jiang_sutraid+'_'+nbampo]=data.jiang;
	newdata['D'+getSutra("D","J"+jiang_sutraid)+"_"+nbampo]=data.dege;
	newdata['H'+getSutra("H","J"+jiang_sutraid)+"_"+nbampo]=data.lhasa;
//	newdata['C'+getSutra("C","J"+jiang_sutraid)+"_"+nbampo]=data.cone+"-"+next.cone;

	console.log(JSON.stringify(newdata,""," ")+",");
}
bampotsv.map(processbampo);
