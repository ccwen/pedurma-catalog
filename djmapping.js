// djmapping.js // line, lineId, volRange, volRanges, dCompare, jCompare
var linesPerPageD=7, linesPerPageJ=8
/////////////////////////////////////////////////////////////////////////////
// djmapping('1@1b1') ==> 'J1:1@1b1'
// searching D 1@1b1 founded in dj (K1)
// D1 1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5 0/17062 <== 1@1b1
// J1 1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6 0/19999 ==> 1@1b1
// djmapping('31@207b1') ==> "J12:36@1b1"
// searching D 31@207b1 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 0/6803 <== 31@207b1
// J12 36@1b1-92a8;37@93b1-400a7 0/6367 ==> 36@1b1
// djmapping('32@397a7') ==> "J12:37@400a7"
// searching D 32@397a7 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 6802/6803 <== 32@397a7
// J12 36@1b1-92a8;37@93b1-400a7 6366/6367 ==> 37@400a7
// djmapping('31@297a6') ==> "J12:36@75a2"
// searching D 31@297a6 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 1258/6803 <== 31@297a6
// J12 36@1b1-92a8;37@93b1-400a7 1177/6367 ==> 36@75a2
/////////////////////////////////////////////////////////////////////////////
//	assert("line('1b1',7)",8)
//		line('1b1',7) ==> ((1-1)*2+1)*7+1 ==> 8
//	assert("line('311a6',7)",4346)
//		line('311a6',7) ==> ((311-1)*2+0)*7+6 ==> (310*2)*7+6 ==> 620*7+6 ==> 4346
/////////////////////////////////////////////////////////////////////////////
function line(lineId,linesPerPage) { var m, PAGE, SIDE, LINE
	m=lineId.match(/(\d+)([ab])(\d)/), PAGE=m[1], SIDE=m[2], LINE=m[3]
	PAGE=parseInt(PAGE), SIDE=(SIDE==='a'?0:1), LINE=parseInt(LINE)
	return ((PAGE-1)*2+SIDE)*linesPerPage+LINE
}
/////////////////////////////////////////////////////////////////////////////
//	assert("lineId(8,7)",'1b1')
//	assert("lineId(4346,7)",'311a6')
/////////////////////////////////////////////////////////////////////////////
function lineId(line,linesPerPage){ var PAGE,SIDE,LINE
	LINE=line%linesPerPage, PAGE=(line-LINE)/linesPerPage
	SIDE=PAGE%2, PAGE=(PAGE-SIDE)/2, SIDE=SIDE?'b':'a'
	return (PAGE+1)+SIDE+LINE
}
/////////////////////////////////////////////////////////////////////////////
//	assert('volRange("1b1-311a6",7)',{"bgn":8,"end":4346})
/////////////////////////////////////////////////////////////////////////////
function volRange(lineRangeId,linesPerPage){var m, lineId, lineBgn, lineEnd
	m=lineRangeId.match(/(\d+[ab]\d)-(\d+[ab]\d)/)
	lineId=m[1], lineBgn=line(lineId,linesPerPage)
	lineId=m[2], lineEnd=line(lineId,linesPerPage)
	return {bgn:lineBgn, end:lineEnd}
}
/////////////////////////////////////////////////////////////////////////////
/* assert('volRanges("1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5",7)',
	[{bookLines:17062}
	,{vol:'1',volLines:4339,volLineBgn:8}
	,{vol:'2',volLines:4424,volLineBgn:8}
	,{vol:'3',volLines:4087,volLineBgn:8}
	,{vol:'4',volLines:4212,volLineBgn:8}]) */
/////////////////////////////////////////////////////////////////////////////
function volRanges(volRangesId,linesPerPage){var m,vol,volRangeId,r,volLines,bookLines=0,result=[]
	volRangesId.split(';').forEach(function(range){
		m=range.split(/@/), vol=m[0], volRangeId=m[1]
		r=volRange(volRangeId,linesPerPage)
		volLines=r.end-r.bgn+1, bookLines+=volLines
		result.push({vol:vol,volLines:volLines,volLineBgn:r.bgn})
	})
	result.unshift({bookLines:bookLines})
	return result
}
/////////////////////////////////////////////////////////////////////////////
function compare(a,b,fld){ var x,ia,fa,ib,fb
	x=(ia=parseInt(fa=fld?a[fld]:a))-(ib=parseInt(fb=fld?b[fld]:b))  // 先比數值
	return x=x?x:fa<fb?-1:fa===fb?0:1						// 若同數值 就比字符
}
/////////////////////////////////////////////////////////////////////////////
// assert('lib.dList([{d:'a'},{d:'b'},{d:'c'}]','a,b,c')
/////////////////////////////////////////////////////////////////////////////
function dList(dj){ return dj.map(function(d){return d.d}).join() }
/////////////////////////////////////////////////////////////////////////////
// assert(lib.dCompare(DJ['1'],DJ['2']),-1)	D1<D2
// assert(lib.dCompare(DJ['1'],DJ['3']),-2)	D1<D3
// assert(lib.dCompare(DJ['1'],DJ['4']),-3)	D1<D4
// assert(lib.dCompare(DJ['3'],DJ['2']),1)		D3>D2
// assert(lib.dCompare(DJ['2'],DJ['1']),1)		D2>D1
// assert(lib.dCompare(DJ['3'],DJ['3']),0)		D3=D3
// assert(lib.dCompare(DJ['7a'],DJ['7b']),-1)	D7a<D7b
// assert(lib.dCompare(DJ['7b'],DJ['7a']),1)	D7b>D7a
// assert(lib.dCompare(DJ['7a'],DJ['7a']),0)	D7a=D7a
/////////////////////////////////////////////////////////////////////////////
function dCompare(a,b){ return compare(a,b,'d') } // compare D bookId
function jCompare(a,b){ return compare(a,b,'j') } // compare J bookId
/////////////////////////////////////////////////////////////////////////////
// read dj.json and jd.json
/////////////////////////////////////////////////////////////////////////////
if (typeof(dj)==='undefined'){
	var fs=require('fs')
	var dj=JSON.parse(fs.readFileSync('dj.json'))
	var jd=JSON.parse(fs.readFileSync('jd.json'))
}
/////////////////////////////////////////////////////////////////////////////
// assert("djmapping('1@1b1')","J1:1@1b1")
// assert("djmapping('31@297a6')","J12:36@75a2")
// assert("djmapping('32@397a7')","J12:37@400a7")
/////////////////////////////////////////////////////////////////////////////
function djmapping(dLnId){
	var msg, volLines, volLineBgn
	var n, jLnId
// djmapping('1@1b1') ==> 'J1:1@1b1'
// searching D 1@1b1 founded in dj (K1)
// D1 1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5 0/17062 <== 1@1b1
// J1 1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6 0/19999 ==> 1@1b1 
// djmapping('31@297a6') ==> "J12:36@75a2"
// searching D 31@297a6 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 1258/6803 <== 31@297a6
// J12 36@1b1-92a8;37@93b1-400a7 1177/6367 ==> 36@75a2
// djmapping('32@397a7') ==> "J12:37@400a7"
// searching D 32@397a7 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 6802/6803 <== 32@397a7
// J12 36@1b1-92a8;37@93b1-400a7 6366/6367 ==> 37@400a7
	var m=dLnId.match(/(\d+)@(\d+[ab]\d)/)
	if(!m) { console.log('????? invalited D LineId '+dLnId); return }
	var vol=m[1], volLine=line(m[2],linesPerPageD)
	for(var i=0; i<dj.length; i++){ // search in each book D dji.d for dLnId
		var dji=dj[i], dvn=dji.dvn, dBookLines=dvn[0].bookLines
		var at=0, jvn=dji.jvn, jBookLines=jvn[0].bookLines
		for(var j=1;j<dvn.length;j++){ // search in each vol of dij.dvn of book D dji.d for dLnId
			var dvnj=dvn[j], volLines=dvnj.volLines, volLineBgn=dvnj.volLineBgn
			if( vol===dvnj.vol && volLine>=volLineBgn && volLine<=volLineBgn+volLines ) { // found dLnId in D book dji.d
			//	msg ='searching D '+dLnId+' founded in dj (K'+dji.k+')\n'
				at+=volLine-volLineBgn
			//	msg+='D'+dji.d+' '+dji.dv+' '+at+'/'+dBookLines+' '+dLnId+'\n'
				at=Math.round(at/dBookLines*jBookLines)
			//	msg+='J'+dji.j+' '+dji.jv+' '+at+'/'+jBookLines
				for(j=1;j<jvn.length;j++){ // search jLnId in each vol of dji.jvn of corresponding J book dji.j
					var jvnj=jvn[j]
					if(at<(n=jvnj.volLines)){ // found jLnId at jvnj.vol in dji.jvn
						jLnId=jvnj.vol+'@'+lineId(at+jvnj.volLineBgn,linesPerPageJ)
					//	console.log(msg+' '+jLnId)
						return 'J'+dji.j+':'+jLnId
					}
					at-=n
				}
			}
			at+=volLines
		}
	}
}
djmapping.test={
	line:line,
	lineId:lineId,
	volRange:volRange,
	volRanges:volRanges,
	dList:dList,
	compare:compare,
	dCompare:dCompare,
	jCompare:jCompare	
}
/////////////////////////////////////////////////////////////////////////////
module.exports=djmapping