// djmapping_test.js // read jinglu, construct DJ, search dLineId, return jLineId
function deepEqual(A,B){
	return equal(JSON.stringify(A),JSON.stringify(B))
}
/////////////////////////////////////////////////////////////////////////////
// var djmapping=require("djmapping");
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
// jinglu.json ==> DJ
// DJ[  "1"].k	==> "1" (D1 ==> K1)
// DJ[  "1"].d	==> "1" (D1)
// DJ[  "1"].dv	==> "1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5"
// DJ[  "1"].dvn==> "1@8-4346(4339);2@8-4431(4424);3@8-4094(4087);4@8-4219(4212)[17062]"
//				==> [{"bookLines":17062},{"vol":"1","volLines":4339,"volLineBgn":8},{"vol":"2","volLines":4424,"volLineBgn":8},{"vol":"3","volLines":4087,"volLineBgn":8},{"vol":"4","volLines":4212,"volLineBgn":8}]
// DJ[  "1"].j	==> "1" (D1 ==> J1)
// DJ[  "1"].jv	==> "1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6"
// DJ[  "1"].jvn==> "1@9-5017(5009);2@9-5096(5088);3@9-5032(5024);4@9-4886(4878)[19999]"
// 				==> [{"bookLines":19999},{"vol":"1","volLines":5009,"volLineBgn":9},{"vol":"2","volLines":5088,"volLineBgn":9},{"vol":"3","volLines":5024,"volLineBgn":9},{"vol":"4","volLines":4878,"volLineBgn":9}]
// DJ["357"].k	==> "377" (D357 ==> K377)
// DJ["357"].d	==> "357" (D357)
// DJ["357"].dv	==> "76@220b6-232a7"
// DJ["357"].dvn==> "76@3079-3241(163)[163]"
// 				==> [{"bookLines":163},{"vol":"76","volLines":163,"volLineBgn":3079}]
// DJ["357"].j	==> "296" (D357 ==> J296)
// DJ["357"].jv	==> "71@229a2-242a2"
// DJ["357"].jvn==> ""71@3650-3858(209)[209]"
// 				==> [{"bookLines":209},{"vol":"71","volLines":209,"volLineBgn":3650}]
/////////////////////////////////////////////////////////////////////////////
// jinglu.json ==> JD
// JD[  "2"].k	==> "2" (J2 ==> K2)
// JD[  "2"].j	==> "2" (J2)
// JD[  "2"].jv	==> "5@1b1-21b4"
// JD[  "2"].jvn==> "5@9-332(324)[324]"
//  			==> [{"bookLines":324},{"vol":"5","volLines":324,"volLineBgn":9}]
// JD[  "2"].d	==> "2" (J2 ==> D2)
// JD[  "2"].dv	==> "5@1b1-20b7"
// JD[  "2"].dvn==> "5@8-280(273)[273]"
//  			==> [{"bookLines":273},{"vol":"5","volLines":273,"volLineBgn":8}]
// JD[ "8a"].k	==> "8" (J8a ==> K8)
// JD[ "8a"].j	==> "8a" (J8a)
// JD[ "8a"].jv	==> "12@94a1-297a7;13@1b1-321a6"
// JD[ "8a"].jvn==> "12@1489-4743(3255);13@9-5126(5118)[8373]"
//  			==> [{"bookLines":8373},{"vol":"12","volLines":3255,"volLineBgn":1489},{"vol":"13","volLines":5118,"volLineBgn":9}]
// JD[ "8a"].d	==> "7b" (J8a ==> D7b)
// JD[ "8a"].dv	==> "12@92b1-302a7;13@1b1-313a5"
// JD[ "8a"].dvn==> "12@1282-4221(2940);13@8-4373(4366)[7306]"
//  			==> [{"bookLines":7306},{"vol":"12","volLines":2940,"volLineBgn":1282},{"vol":"13","volLines":4366,"volLineBgn":8}]
'use strict'
/////////////////////////////////////////////////////////////////////////////
var fs=require('fs')
var jinglu=JSON.parse(fs.readFileSync('jinglu.json'))
var fieldValuep='([0-9liI!]+[ab][0-9liI!]-[0-9liI!]+[ab][0-9liI!]);?'
var fieldValueg=RegExp(fieldValuep,'g'), fieldValuep=RegExp(fieldValuep)
var DJ={},JD={},dRedef={},jRedef={},dj=[],dj=[]
var linesPerPageD=7, linesPerPageJ=8
/////////////////////////////////////////////////////////////////////////////
jinglu.forEach(function(CK){var k,d,j,nd,nj,f,m,g,id,a,dv,DJd,jv,JDj,dj,jd,r,n,dvn,jvn
	k=d=j='',nd=nj=0
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
			}
		}
	}
})
/////////////////////////////////////////////////////////////////////////////
for(var d in dRedef){ console.log('????? D'+d,'redefined in',dRedef[d].join(', ')) }
for(var j in jRedef){ console.log('????? J'+j,'redefined in',jRedef[j].join(', ')) }
/////////////////////////////////////////////////////////////////////////////
var djmapping=require("./djmapping"), T=djmapping.test
/////////////////////////////////////////////////////////////////////////////
// line(lineId,linesPerPage) ==> line#
	QUnit.test('01. line() testing',function(){
// line('1b1',7) ==> ((1-1)*2+1)*7+1 ==> 8
	equal(T.line('1b1',7),8)
// line('311a6',7) ==> ((311-1)*2+0)*7+6 ==> (310*2)*7+6 ==> 620*7+6 ==> 4346
	equal(T.line('311a6',7),4346)
})
/////////////////////////////////////////////////////////////////////////////
//	lineId(line#,linesPerPage) ==> lineId
	QUnit.test('02. lineId() testing',function(){
	equal(T.lineId(8,7),'1b1')
	equal(T.lineId(4346,7),'311a6')
})
/////////////////////////////////////////////////////////////////////////////
//	volRange(rangeId,linesPerPage) ==> {bgn:atBgn,end:atEnd}
	QUnit.test('03. volRange() testing',function(){
	var t=T.volRange("1b1-311a6",7)
	equal(t.bgn,8)
	equal(t.end,4346)
})
/////////////////////////////////////////////////////////////////////////////
//	volRanges(volRangesId,linesPerPage) ==> [{bookLines:n},{vol:v,volLines:n,volLineBgn:at},...]
	QUnit.test('04. volRanges() testing',function(){
	deepEqual(T.volRanges("1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5",7),
		[{bookLines:17062},{vol:'1',volLines:4339,volLineBgn:8},{vol:'2',volLines:4424,volLineBgn:8},{vol:'3',volLines:4087,volLineBgn:8},{vol:'4',volLines:4212,volLineBgn:8}])
})
/////////////////////////////////////////////////////////////////////////////
var DJd, JDj, dj=[], jd=[]
for(d in DJ) if((DJd=DJ[d]).j){
	DJd.dvn=T.volRanges(DJd.dv,linesPerPageD)
	DJd.jvn=T.volRanges(DJd.jv,linesPerPageJ)
	dj.push(DJd)
}
dj=dj.sort(T.dCompare)
console.log(T.dList(dj))
fs.writeFileSync('dj.json',JSON.stringify(dj,'','').replace(/,{/g,'\r\n,{'))
for(j in JD) if((JDj=JD[j]).d){
	JDj.jvn=T.volRanges(JDj.jv,linesPerPageJ)
	JDj.dvn=T.volRanges(JDj.dv,linesPerPageD)
	jd.push(JDj)
}
jd=jd.sort(T.jCompare)
console.log(T.dList(jd))
fs.writeFileSync('jd.json',JSON.stringify(jd,'','').replace(/,{/g,'\r\n,{'))
/////////////////////////////////////////////////////////////////////////////
	QUnit.test('05. DJ[d] testing',function(){
//	DJ[d].k ==> k
	equal(DJ[  "1"].k,"1")
	equal(DJ["357"].k,"377")
//	DJ[d].d ==> d (self)
	equal(DJ[  "1"].d,"1")
	equal(DJ["357"].d,"357")
//	DJ[d].dv ==> volRangsId of D
	equal(DJ[  "1"].dv,"1@1b1-311a6;2@1b1-317a7;3@1b1-293a6;4@1b1-302a5")
	equal(DJ["357"].dv,"76@220b6-232a7")
//	DJ[d].dvn ==> volRangsArray of D
	deepEqual(DJ[  "1"].dvn,[{"bookLines":17062},{"vol":"1","volLines":4339,"volLineBgn":8},{"vol":"2","volLines":4424,"volLineBgn":8},{"vol":"3","volLines":4087,"volLineBgn":8},{"vol":"4","volLines":4212,"volLineBgn":8}])
	deepEqual(DJ["357"].dvn,[{"bookLines":163},{"vol":"76","volLines":163,"volLineBgn":3079}])
//	DJ[d].j ==> j
	equal(DJ[  "1"].j,"1")
	equal(DJ["357"].j,"296")
//	DJ[d].jv ==> volRangsId of J
	equal(DJ[  "1"].jv,"1@1b1-314a9;2@1b1-319a8;3@1b1-315a8;4@1b1-306a6")
	equal(DJ["357"].jv,"71@229a2-242a2")
//	DJ[d].jvn ==> volRangsArray of J
	deepEqual(DJ[  "1"].jvn,[{"bookLines":19999},{"vol":"1","volLines":5009,"volLineBgn":9},{"vol":"2","volLines":5088,"volLineBgn":9},{"vol":"3","volLines":5024,"volLineBgn":9},{"vol":"4","volLines":4878,"volLineBgn":9}])
	deepEqual(DJ["357"].jvn,[{"bookLines":209},{"vol":"71","volLines":209,"volLineBgn":3650}])
})
/////////////////////////////////////////////////////////////////////////////
	QUnit.test('06. JD[j] testing',function(){
//	JD[j].k ==> k
	equal(JD["2"].k,"2")
	equal(JD["8a"].k,"8")
//	JD[j].j ==> j (self)
	equal(JD["2"].j,"2")
	equal(JD["8a"].j,"8a")
//	DJ[j].jv ==> volRangsId of J
	equal(JD["2"].jv,"5@1b1-21b4")
	equal(JD["8a"].jv,"12@94a1-297a7;13@1b1-321a6")
//	DJ[j].jvn ==> volRangsArray of J
	deepEqual(JD["2"].jvn,[{"bookLines":324},{"vol":"5","volLines":324,"volLineBgn":9}])
	deepEqual(JD["8a"].jvn,[{"bookLines":8373},{"vol":"12","volLines":3255,"volLineBgn":1489},{"vol":"13","volLines":5118,"volLineBgn":9}])
//	DJ[j].d ==> d
	equal(JD["2"].d,"2")
	equal(JD["8a"].d,"7b")
//	DJ[j].dv ==> volRangsId of D
	equal(JD["2"].dv,"5@1b1-20b7")
	equal(JD["8a"].dv,"12@92b1-302a7;13@1b1-313a5")
//	DJ[j].dvn ==> volRangsArray of D
	deepEqual(JD["2"].dvn,[{"bookLines":273},{"vol":"5","volLines":273,"volLineBgn":8}])
	deepEqual(JD["8a"].dvn,[{"bookLines":7306},{"vol":"12","volLines":2940,"volLineBgn":1282},{"vol":"13","volLines":4366,"volLineBgn":8}])
})
/////////////////////////////////////////////////////////////////////////////
	QUnit.test('07. dCompare() testing',function(){
	equal(T.dCompare(DJ['1'],DJ['2']),-1)
	equal(T.dCompare(DJ['1'],DJ['3']),-2)
	equal(T.dCompare(DJ['1'],DJ['4']),-3)
	equal(T.dCompare(DJ['3'],DJ['2']),1)
	equal(T.dCompare(DJ['2'],DJ['1']),1)
	equal(T.dCompare(DJ['3'],DJ['3']),0)
	equal(T.dCompare(DJ['7a'],DJ['7b']),-1)
	equal(T.dCompare(DJ['7b'],DJ['7a']),1)
	equal(T.dCompare(DJ['7a'],DJ['7a']),0)
})
/////////////////////////////////////////////////////////////////////////////
	QUnit.test('08. djmapping() testing',function(){
	equal(djmapping('1@1b1'),"J1:1@1b1")
	equal(djmapping('31@297a6'),"J12:36@75a2")
	equal(djmapping('32@397a7'),"J12:37@400a7")
})