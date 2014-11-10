var jinglu=require("./jinglu.json");

var recensions={"K":[],"D":[],"N":[],"C":[],"H":[],"J":[],"U":[]};
var linenow;
var parseRange=function(s,sid,ckid) {
	if (!s) return [];
	var ranges=s.split(";");
	var out=[];
	for (var i=0;i<ranges.length;i++) {
		var r=ranges[i];

		var sep=r.indexOf("@");
		if (sep==-1) {
			throw "invalid entry "+sid+" line"+linenow;
		}
		var vol=r.substr(0,sep);
		vol="00"+vol;
		vol=vol.substr(vol.length-3);
		var pr=r.substr(sep+1);
		var pagerange=pr.split("-");
		if (pagerange.length!=2) {//range is optional
			//throw "invalid entry"+ranges+ " line"+linenow;
		}
		var fixwidth=5;
		if (!ckid) { //pedurma
			fixwidth=3;
		} 
		for (var j=0;j<pagerange.length;j++) {
			pagerange[j]="00"+pagerange[j];
			pagerange[j]=pagerange[j].substr(pagerange[j].length-fixwidth);
		}
		if (pagerange.length>1) {
			var o=[sid,vol+"@"+pagerange[0]+"-"+pagerange[1]];	
		} else {
			var o=[sid,vol+"@"+pagerange[0]];	
		}
		
		if (ckid) o.push(ckid);
		out.push(o);
	}
	return out;
}
var parseEntry=function(entries) {
	var ckid=null;
	for (var e in entries) {
		R=recensions[e[0]];
		if (!R) continue;
		var sid=e.substr(1);
		if (e[0]=="K") ckid=sid;
		var ranges=parseRange(entries[e],sid,ckid);
		recensions[e[0]]=R.concat(ranges);
	}	
}

var checkSequencial=function(R) {
	var prev=parseInt(R[0][0]);
	var error=[];
	for (var j=1;j<R.length;j++) {
		var now=parseInt(R[j][0]);
		if (now==prev || now==prev+1) {
			//ok
		} else {
			error.push(R[j][0]);
		}
		prev=now;
	}
	return error;
}
for (var i=0;i<jinglu.length;i++) {
	linenow=i;
	parseEntry(jinglu[i]);
}

var removeRedundantSutra=function(R){
	var hasbampo={};
	R.forEach(function(r){
		var sutranbampo=r[0].split("_");
		if (sutranbampo.length!=2)return;
		if (sutranbampo[1]=="1") {
			hasbampo[sutranbampo[0]]=true;
		}
	});
//remove repeated data in pedurma book,
//bampo from treasure.org tsv
//sutra from pedurma book
	return R.filter(function(r){return !hasbampo[r[0]]});
}

for (var r in recensions) {

	R=recensions[r].sort(function(a,b){return a[1]>b[1]?1:a[1]<b[1]?-1:0  });
	var error=checkSequencial(R);

	R=removeRedundantSutra(R);

	var texts=JSON.stringify(R,"","").replace(/\],\[/g,"],\n[");


	require("fs").writeFileSync(r.toLowerCase()+"-pedurma.json", 
		texts,"utf8");


	require("fs").writeFileSync(r.toLowerCase()+"-error.json", 
		JSON.stringify(error,""," "),"utf8");

}


