var _J=["1b1","17b8","27b4","37b3","47a2","67a8","79a1","90b6","102b5","115a2",
		"128a3","140b6","155b2","168a2","181b8","197a7","212a5","224b1","238a8",
		"251a8","264a5","278a1","290a1","302b2"];
var _H=["1b1","20b7","33b6","47a3","63a1","88b2","105a6","121b6","138a7",
		"155b3","173a7","192a6","213b5","231a4","248b2","269b3","289b3","306b1",
		"325a2","343a2","361a3"];

var from_vp=function(vp, lpp) { // pseudo line from volume-page
	var parts=vp.split(/[ab]+/);
	var npage=2* parseInt(parts[0]),  side=vp[parts[0].length],  line=parseInt(parts[1] || "1")  - 1;
	var out=npage * lpp + line;
	if ("b"==side) out+=lpp;
	return out;
}
var to_vp=function(estimate,lpp) { // pseudo line to volume-page
	var vline=Math.round(estimate); 
	var line =(vline % lpp );
	var npage = Math.floor( vline / lpp );
	var side = npage % 2 ? "b":"a" ;
	return Math.floor( npage / 2 ) +side+ (line+1);
}
var J=_J.map(function(a){ return from_vp(a,8)}) ; J.linesPerPage=8;
var H=_H.map(function(a){ return from_vp(a,7)}); H.linesPerPage=7;

var guess_page=function(vp,from,to) {
	var vline=from_vp(vp,from.linesPerPage);
	var i=from.findIndex(function(e){ return e>vline }) ;
	if (i==0) return "underflow !";
	if (i==-1) return "overflow !";

	var ratio=(vline-from[i-1]) / (from[i] - from[i-1]);
	var estimate=to[i-1]  +  ratio*(to[i] - to[i-1]);
	return to_vp(estimate,to.linesPerPage);
}

/* UI related code */
var j_volpage=document.getElementById("j_volpage");
var h_volpage=document.getElementById("h_volpage");

var jiang2lhasa=function() {
	h_volpage.value=guess_page(j_volpage.value, J, H);
}
var lhasa2jiang=function() {
	j_volpage.value=guess_page(h_volpage.value, H, J);
}