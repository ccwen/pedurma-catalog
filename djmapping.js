// djmapping.js // read jinglu.json, construct DJ and JD, search dLineId, return jLineId
/////////////////////////////////////////////////////////////////////////////
// djmaping('1@1b1') ==> 'J1:1@1b1'
// searching D 1@1b1 founded in dj (K1)
// D1 1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5 0/17062 <== 1@1b1
// J1 1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6 0/19999 ==> 1@1b1
// djmaping('31@207b1') ==> "J12:36@1b1"
// searching D 31@207b1 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 0/6803 <== 31@207b1
// J12 36@1b1-92a8;37@93b1-400a7 0/6367 ==> 36@1b1
// djmaping('32@397a7') ==> "J12:37@400a7"
// searching D 32@397a7 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 6802/6803 <== 32@397a7
// J12 36@1b1-92a8;37@93b1-400a7 6366/6367 ==> 37@400a7
// djmaping('31@297a6') ==> "J12:36@75a2"
// searching D 31@297a6 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 1258/6803 <== 31@297a6
// J12 36@1b1-92a8;37@93b1-400a7 1177/6367 ==> 36@75a2
/////////////////////////////////////////////////////////////////////////////
// jinglu.json ==> DJ
// DJ[  "1"].k	==> "1" (D1 ==> K1)
// DJ[  "1"].d	==> "1" (D1)
// DJ[  "1"].dv	==> "1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5"
// DJ[  "1"].dvn==> "1@8-4346(4339);2@8-4431(4424);3@8-4094(4087);4@8-4219(4212)[17062]"
//				==> [17062,"1",4339,8,"2",4424,8,"3",4087,8,"4",4212,8]
// DJ[  "1"].j	==> "1" (D1 ==> J1)
// DJ[  "1"].jv	==> "1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6"
// DJ[  "1"].jvn==> "1@9-5017(5009);2@9-5096(5088);3@9-5032(5024);4@9-4886(4878)[19999]"
// 				==> [19999,"1",5009,9,"2",5088,9,"3",5024,9,"4",4878,9]
// DJ["357"].k	==> "377" (D357 ==> K377)
// DJ["357"].d	==> "357" (D357)
// DJ["357"].dv	==> "76@220b6-232a7"
// DJ["357"].dvn==> "76@3079-3241(163)[163]"
// 				==> [163,"76",163,3079]
// DJ["357"].j	==> "296" (D357 ==> J296)
// DJ["357"].jv	==> "71@229a2-242a2"
// DJ["357"].jvn==> ""71@3650-3858(209)[209]"
// 				==> [209,"71",209,3650]
/////////////////////////////////////////////////////////////////////////////
// jinglu.json ==> JD
// JD[  "2"].k	==> "2" (J2 ==> K2)
// JD[  "2"].j	==> "2" (J2)
// JD[  "2"].jv	==> "5@1b1-21b4"
// JD[  "2"].jvn==> "5@9-332(324)[324]"
//  			==> [324,"5",324,9]
// JD[  "2"].d	==> "2" (J2 ==> D2)
// JD[  "2"].dv	==> "5@1b1-20b7"
// JD[  "2"].dvn==> "5@8-280(273)[273]"
//  			==> [273,"5",273,8]
// JD[ "8a"].k	==> "8" (J8a ==> K8)
// JD[ "8a"].j	==> "8a" (J8a)
// JD[ "8a"].jv	==> "12@94a1-297a7;13@1b1-321a6"
// JD[ "8a"].jvn==> "12@1489-4743(3255);13@9-5126(5118)[8373]"
//  			==> [8373,"12",3255,1489,"13",5118,9]
// JD[ "8a"].d	==> "7b" (J8a ==> D7b)
// JD[ "8a"].dv	==> "12@92b1-302a7;13@1b1-313a5"
// JD[ "8a"].dvn==> "12@1282-4221(2940);13@8-4373(4366)[7306]"
//  			==> [7306,"12",2940,1282,"13",4366,8]
debugger
'use strict'
/////////////////////////////////////////////////////////////////////////////
function assert(EVALUATED,EXPECTED) { var v // EVALUATED should be equal to EXPECTED
	if ( (v=JSON.stringify(eval(EVALUATED))) !== (EXPECTED=JSON.stringify(EXPECTED)))
		console.log('EVALUATED', EVALUATED, v, 'not EXPECTED', EXPECTED)
}
/////////////////////////////////////////////////////////////////////////////
// line('1b1',7) ==> ((1-1)*2+1)*7+1 ==> 8
assert("line('1b1',7)",8)
// line('311a6',7) ==> ((311-1)*2+0)*7+6 ==> (310*2)*7+6 ==> 620*7+6 ==> 4346
assert("line('311a6',7)",4346)
/////////////////////////////////////////////////////////////////////////////
function line(lineId,linesPerPage) { var m, PAGE, SIDE, LINE
	m=lineId.match(/(\d+)([ab])(\d)/), PAGE=m[1], SIDE=m[2], LINE=m[3]
	PAGE=parseInt(PAGE), SIDE=(SIDE==='a'?0:1), LINE=parseInt(LINE)
	return ((PAGE-1)*2+SIDE)*linesPerPage+LINE
}
/////////////////////////////////////////////////////////////////////////////
assert("lineId(8,7)",'1b1')
assert("lineId(4346,7)",'311a6')
/////////////////////////////////////////////////////////////////////////////
function lineId(line,linesPerPage){ var PAGE,SIDE,LINE
	LINE=line%linesPerPage, PAGE=(line-LINE)/linesPerPage
	SIDE=PAGE%2, PAGE=(PAGE-SIDE)/2, SIDE=SIDE?'b':'a'
	return (PAGE+1)+SIDE+LINE
}
/////////////////////////////////////////////////////////////////////////////
assert('volRange("1b1-311a6",7)',{"bgn":8,"end":4346})
/////////////////////////////////////////////////////////////////////////////
function volRange(lineRangeId,linesPerPage){var m, lineId, lineBgn, lineEnd
	m=lineRangeId.match(/(\d+[ab]\d)-(\d+[ab]\d)/)
	lineId=m[1], lineBgn=line(lineId,linesPerPage)
	lineId=m[2], lineEnd=line(lineId,linesPerPage)
	return {bgn:lineBgn, end:lineEnd}
}
/////////////////////////////////////////////////////////////////////////////
assert('volRanges("1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5",7)',
	[17062,'1',4339,8,'2',4424,8,'3',4087,8,'4',4212,8])
// [bookLines,volLines,vol,volLineBgn],...]
/////////////////////////////////////////////////////////////////////////////
function volRanges(volRangesId,linesPerPage){var m,vol,volRangeId,r,volLines,bookLines=0,result=[]
	volRangesId.split(';').forEach(function(range){
		m=range.split(/@/), vol=m[0], volRangeId=m[1]
		r=volRange(volRangeId,linesPerPage)
		volLines=r.end-r.bgn+1, bookLines+=volLines
		result.push(vol),result.push(volLines),result.push(r.bgn)
	})
	result.unshift(bookLines)
	return result
}
/////////////////////////////////////////////////////////////////////////////
var fs=require('fs')
var jinglu=JSON.parse(fs.readFileSync('jinglu.json'))
var fieldValuep='([0-9liI!]+[ab][0-9liI!]-[0-9liI!]+[ab][0-9liI!]);?'
var fieldValueg=RegExp(fieldValuep,'g'), fieldValuep=RegExp(fieldValuep)
var DJ={},JD={},dRedef={},jRedef={},dj=[],dj=[]
var linesPerPageD=7, linesPerPageJ=8
/////////////////////////////////////////////////////////////////////////////
jinglu.forEach(function(CK){var k,d,j,f,m,g,id,a,dv,DJD,jv,JDJ,dj,jd,r,n,dvn,jvn
	k=d=j='' 
	for(f in CK){
		if(m=f.match(/^(K|D|J)(\d+)([a-z]?)/)){ // match only for groups K, D, or J
			g=m[1], id=parseInt(m[2]), a=m[3]
			if(g==='K'){
				k=id+a // K id
			}else if(g==='D'){
				d=id+a,dv=CK[f] // D id and D volPages
				if(DJ[d]) {
					DJd=dRedef[d] // d should not be redefined !!!
					if(!DJd) DJd=dRedef[d]=['K'+DJ[d].k+' D'+d+':'+DJ[d].dv]
					DJd.push('K'+k+' D'+d+':'+CK[f])
				}
			}else{
				j=id+a,jv=CK[f] // J id and J volPages
				if(JD[j]) {
					JDj=jRedef[j] // j should not be redefined !!!
					if(!JDj) JDj=jRedef[j]=['K'+JD[j].k+' J'+j+':'+JD[j].jv]
					JDj.push('K'+k+' J'+j+':'+CK[f])
				}
			}
			if(k && d && j) { // both d and j defined
				dj=DJ[d]={}, dj.k=k, dj.d=d, dj.dv=dv, dj.j=j, dj.jv=jv
				jd=JD[j]={}, jd.k=k, jd.j=j, jd.jv=jv, jd.d=d, jd.dv=dv, nd=nj=0
				jd.dvn=dj.dvn=dvn=volRanges(dv,linesPerPageD)
				jd.jvn=dj.jvn=jvn=volRanges(jv,linesPerPageJ)
			}
		}
	}
})
/////////////////////////////////////////////////////////////////////////////
for(d in dRedef){ console.log('????? D'+d,'redefined in',dRedef[d].join(', ')) }
for(j in jRedef){ console.log('????? J'+j,'redefined in',jRedef[j].join(', ')) }
/////////////////////////////////////////////////////////////////////////////
assert('DJ[  "1"].k',"1")
assert('DJ[  "1"].d',"1")
assert('DJ[  "1"].dv',"1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5")
assert('DJ[  "1"].dvn',[17062,"1",4339,8,"2",4424,8,"3",4087,8,"4",4212,8])
assert('DJ[  "1"].j',"1")
assert('DJ[  "1"].jv',"1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6")
assert('DJ[  "1"].jvn',[19999,"1",5009,9,"2",5088,9,"3",5024,9,"4",4878,9])
assert('DJ["357"].k',"377")
assert('DJ["357"].d',"357")
assert('DJ["357"].dv',"76@220b6-232a7")
assert('DJ["357"].dvn',[163,"76",163,3079])
assert('DJ["357"].j',"296")
assert('DJ["357"].jv',"71@229a2-242a2")
assert('DJ["357"].jvn',[209,"71",209,3650])
assert('JD["2"].k',"2")
assert('JD["2"].j',"2")
assert('JD["2"].jv',"5@1b1-21b4")
assert('JD["2"].jvn',[324,"5",324,9])
assert('JD["2"].d',"2")
assert('JD["2"].dv',"5@1b1-20b7")
assert('JD["2"].dvn',[273,"5",273,8])
assert('JD["8a"].k',"8")
assert('JD["8a"].j',"8a")
assert('JD["8a"].jv',"12@94a1-297a7;13@1b1-321a6")
assert('JD["8a"].jvn',[8373,"12",3255,1489,"13",5118,9])
assert('JD["8a"].d',"7b")
assert('JD["8a"].dv',"12@92b1-302a7;13@1b1-313a5")
assert('JD["8a"].dvn',[7306,"12",2940,1282,"13",4366,8])
/////////////////////////////////////////////////////////////////////////////
function compare(a,b,fld){ var x,ia,fa,ib,fb
	x=(ia=parseInt(fa=fld?a[fld]:a))-(ib=parseInt(fb=fld?b[fld]:b))  // 先比數值
	return x=x?x:fa<fb?-1:fa===fb?0:1						// 若同數值 就比字符
}
function dList(DJ){ return DJ.map(function(d){return d.d}).join() }
function dCompare(a,b){ return compare(a,b,'d') }
assert(dCompare(DJ['1'],DJ['2']),-1)
assert(dCompare(DJ['1'],DJ['3']),-2)
assert(dCompare(DJ['1'],DJ['4']),-3)
assert(dCompare(DJ['3'],DJ['2']),1)
assert(dCompare(DJ['2'],DJ['1']),1)
assert(dCompare(DJ['3'],DJ['3']),0)
assert(dCompare(DJ['7a'],DJ['7b']),-1)
assert(dCompare(DJ['7b'],DJ['7a']),1)
assert(dCompare(DJ['7a'],DJ['7a']),0)
function jCompare(a,b){ return compare(a,b,'j') }
/////////////////////////////////////////////////////////////////////////////
dj=[]
for(d in DJ) if(DJ[d].j) dj.push(DJ[d])
dj=dj.sort(dCompare)
console.log(dList(dj))
fs.writeFileSync('dj.json',JSON.stringify(dj,'','').replace(/,{/g,'\r\n,{'))
jd=[]
for(j in JD) if(JD[j].d) jd.push(JD[j])
jd=jd.sort(jCompare)
console.log(dList(jd))
fs.writeFileSync('jd.json',JSON.stringify(jd,'','').replace(/,{/g,'\r\n,{'))
/////////////////////////////////////////////////////////////////////////////
function djmaping(dLnId){
	var m, vol, volLine, i, dji, dvn, at, j, jvn, msg, volLines, volLineBgn
// djmaping('1@1b1') ==> 'J1:1@1b1'
// searching D 1@1b1 founded in dj (K1)
// D1 1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5 0/17062 <== 1@1b1
// J1 1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6 0/19999 ==> 1@1b1 
// djmaping('31@297a6') ==> "J12:36@75a2"
// searching D 31@297a6 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 1258/6803 <== 31@297a6
// J12 36@1b1-92a8;37@93b1-400a7 1177/6367 ==> 36@75a2
// djmaping('32@397a7') ==> "J12:37@400a7"
// searching D 32@397a7 founded in dj (K28)
// D11 31@207b1-297a6;32@1b1-397a7 6802/6803 <== 32@397a7
// J12 36@1b1-92a8;37@93b1-400a7 6366/6367 ==> 37@400a7
	m=dLnId.match(/(\d+)@(\d+[ab]\d)/)
	if(!m) { console.log('????? invalited D LineId '+dLnId); return }
	vol=m[1], volLine=line(m[2],linesPerPageD)
	for(i=0; i<dj.length; i++){ // search in all D books for dLnId
		dji=dj[i], dvn=dji.dvn, dBookLines=dvn[0], at=0, jvn=dji.jvn, jBookLines=jvn[0]
		for(j=1;j<dvn.length;j+=3){ // search in all vols of a D book for dLnId
			if( vol===dvn[j] && (volLines=dvn[j+1])<=volLines+(volLineBgn=dvn[j+2]) ) { // found
				msg ='searching D '+dLnId+' founded in dj (K'+dji.k+')\n'
				msg+='D'+dji.d+' '+dji.dv+' '+(at+=volLine-volLineBgn)+'/'+dBookLines+' '+dLnId+'\n'
				msg+='J'+dji.j+' '+dji.jv+' '+(at=Math.round(at/dBookLines*jBookLines))+'/'+jBookLines
				for(j=1;j<jvn.length;j+=3){
					if(at<(n=jvn[j+1])){
						jLnId=jvn[j]+'@'+lineId(at+jvn[j+2],linesPerPageJ)
						console.log(msg+' '+jLnId)
						return 'J'+dji.j+':'+jLnId
					}
					at-=n
				}
			}
			at+=dvn[j+1]
		}
	}
	return r
}
/////////////////////////////////////////////////////////////////////////////
assert("djmaping('1@1b1')","J1:1@1b1")
assert("djmaping('31@297a6')","J12:36@75a2")
assert("djmaping('32@397a7')","J12:37@400a7")