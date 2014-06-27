// djmapping.js
var fs=require('fs')
var fileD=fs.readFileSync('d-pedurma.json','utf8').replace(/\r\n/g,'\n')
var fileJ=fs.readFileSync('j-pedurma.json','utf8').replace(/\r\n/g,'\n')
console.log('fileD.length',fileD.length,'fileJ.length',fileJ.length)
var D=JSON.parse(fileD)
var J=JSON.parse(fileJ)
console.log('D.length',D.length,'J.length',J.length)
	
function dLine(dLindId){
	var m=dLindId.match(/(\d+)([ab])(\d)/)
	if(!m) {
		console.log('????? invalided dLindId',dLindId)
		return
	}
	var P=m[1], S=m[2], L=m[3]
	P=parseInt(P), S=(S==='a'?0:1), L=parseInt(L)
	return ((P-1)*2+S)*7+L
// 001b1 ==> ((1-1)*2+1)*7+1 ==> 8
// 311a6 ==> ((311-1)*2+0)*7+6 ==> (310*2)*7+6 ==> 620*7+6 ==> 4346
}
function dLineRange(dLineRangeId){
	var m=dLineRangeId.match(/(\d+[ab]\d)-(\d+[ab]\d)/)
	if(!m) {
		console.log('????? invalided dLindRangeId',dLineRangeId)
		return
	}
	var lineB=dLine(m[1]), lineE=dLine(m[2])
	if(lineB>=lineE) {
		console.log('????? dLindRange lineB>=lineE',dLineRangeId)
		return
	}
	return {bgn:lineB,end:lineE}
}
var id='',ids=[], expect=1, vol='', lineB, lineE
for(var i=0;i<D.length;i++){ // checking D id sequence
	d=parseInt(D[i][0])
	if(id!==d){
		ids.push(id=d)
		if(id!==expect){
			console.log('????? in d-pedurma.json line',i+1,'expect D',expect,'but found D',id)
			console.log('after D',D[i-1][0],D[i-1][1],'for CK',D[i-1][2])
			console.log('found D',id,D[i][1],'for CK',D[i][2])
		}
		expect=id+1
	}
	var m=D[i][1].match(/(\d+)@(\d+[ab]\d-\d+[ab]\d)/)
	if(!m){
		console.log('????? invalided dVolRangeId',D[i][1])
		continue
	}
	if (vol!==m[1])
		lastLine=0, vol=m[1]
	var Range=dLineRange(m[2])
	if (!Range) continue
	if (Range.bgn<lastLine) {
		console.log('????? Range.bgn',D[i][1],'< lastLine',lastLine)
	}
	lastLine=Range.end
}
id='',ids=[], expect=1
for(var i=0;i<J.length;i++){ // checking J id sequence
	d=parseInt(J[i][0])
	if(id!==d){
		ids.push(id=d)
		if(id!==expect){
			console.log('????? in j-pedurma.json line',i+1,'expect J',expect,'but found J',id)
			console.log('after J',J[i-1][0],J[i-1][1],'for CK',J[i-1][2])
			console.log('found J',id,J[i][1],'for CK',J[i][2])
		}
		expect=id+1
	}
}
//console.log(ids.join())
function djmapping(DLineId) {
//			     return {D:DId,mapping:JLineId
// given DlineId='001@001b1' return {D:'1',mapping:'001@001b1'}
// given DlineId='001@311a6' return {D:'1',mapping:'001@314a9'}
// given DlineId='002@001b1' return {D:'1',mapping:'002@001b1'}
// given DlineId='002@317a7' return {D:'1',mapping:'002@319a8'}
// given DlineId='003@001b1' return {D:'1',mapping:'003@001b1'}
// given DlineId='003@293a6' return {D:'1',mapping:'003@315a8'}
// given DlineId='004@001b1' return {D:'1',mapping:'003@001b1'}
// given DlineId='004@302a5' return {D:'1',mapping:'003@306a6'}
// given DlineId='005@001b1' return {D:'2',mapping:'005@001b1'}
// given DlineId='005@020b7' return {D:'2',mapping:'005@021b4'}
// given DlineId='005@021a1' return {D:'3',mapping:'005@021b4'}?????
// given DlineId='005@292a7' return {D:'3',mapping:'005@300a7'}
// given DlineId='006@001b1' return {D:'3',mapping:'006@001b1'}
// given DlineId='006@287a7' return {D:'3',mapping:'006@328a4'}
// given DlineId='007@001b1' return {D:'3',mapping:'007@001b1'}
// given DlineId='007@287a7' return {D:'3',mapping:'007@297a4'}
// given DlineId='008@001b1' return {D:'3',mapping:'008@001b1'}
// given DlineId='008@296a6' return {D:'3',mapping:'008@264a6'}
}
