var _J=["1b1","17b8","27b4","37b3","47a2","67a8","79a1","90b6","102b5","115a2",
		"128a3","140b6","155b2","168a2","181b8","197a7","212a5","224b1","238a8",
		"251a8","264a5","278a1","290a1","302b2"];
var _H=["1b1","20b7","33b6","47a3","63a1","88b2","105a6","121b6","138a7",
		"155b3","173a7","192a6","213b5","231a4","248b2","269b3","289b3","306b1",
		"325a2","343a2","361a3"];

var volpage2line=function(vp) {
	var parts=vp.split(/[ab]+/);
	var pg=parseInt(parts[0]),  side=vp[ parts[0].length],  line=parseInt(parts[1] || "1")  - 1;
	var out=pg * 2 * 8 + line;
	if ("b"==side) out+=8;
	return out;
}
var line2volpage=function(absline) {
	var line =( absline % 8 );
	var page = Math.floor( absline / 8 ) ;
	var side = page % 2 ? "b":"a" ;
	page = Math.floor( page / 2 );
	return page+side+ (line+1);
}
var J=_J.map(function(a){ return volpage2line(a)});
var H=_H.map(function(a){ return volpage2line(a)});

var guess_page=function(vp,from,to) {
	var line=volpage2line(vp);
	var r=from.findIndex(function(e){ return e>line }) ;
	if (r==0) return "**underflow**";
	if (r==-1) return "**overflow**";

	var ratio=(line-from[r-1]) / (from[r] - from[r-1]);
	var estimate=to[r-1]  +  ratio*(to[r] - to[r-1]);
	return line2volpage(Math.floor(estimate));
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