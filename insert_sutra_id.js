///載入LJ_nocross.json & pb2f.js
var fs=require("fs");
var pb2f=require("./pb2f");
var vline=require("./vline.js");
var sutra=JSON.parse(fs.readFileSync("./LJ_nocorss.json","utf8"));
var lst=fs.readFileSync("jiangkangyur.lst","utf8").split(/\r?\n/);
var run=0;
var getFnLine1=function(input1,input2){
	var out=[];
	var count=0;
	for(var i in input1){
		///找出LJ_nocross.json的start line並把行數去掉
		var s=input1[i].split("-");
		var start=s[0],end=s[1];
		var noLine=s[0].substr(0,s[0].length-1); //此時的noLine已去掉行數
		var line=parseInt(s[0].substr(s[0].length-1));
		count++;
		///在pb2f.js 找此start line		
		for(var j=count; j<input2.length; j++){
			run++;//////目標將run 的次數減少 目前64096728 試著J不要每次都從零開始，用變數
			//找到之後 [J名,檔名,行數(LJ_nocross裡取的行數加上pb2f的行數)]
			if(input2[j][0]==noLine){   // input2[j].indexOf(noLine)>-1
				out.push([i,input2[j][1],line+input2[j][2]]);
				break;
			}
		}
	}
	return out;
}

var ObjSortNvline=function(input){
	var out=[];
	//對sutra做排序
	for(var i in input){
		var s=input[i].split("-");
		var start=s[0],end=s[1];
		start=start.substr(0,start.length-1);
		var startLine=vline.volpb2vl(start);
		out.push([i,startLine]);
		out.sort(function(a,b){return a[1]-b[1];});
			
	}
	return out;//out為一經排序的二為陣列，[J名,起始頁數的虛擬行]
}

var ArrSortNvline=function(input){
	var out=[];
	for(var i =0; i<input.length; i++){
		var start=input[i][0];
		var line=vline.volpb2vl(start);
		out.push([line,input[i][1],input[i][2]]);
	}
	return out;//[虛擬行,檔案名,行數]

}

var getLine=function(){
	var out=[];
	var input=ObjSortNvline(sutra);
	for(var i in input){
		var s=vline.vl2volpb(input[i][1]);		
		var line=parseInt(s.substr(s.length-1));
		out.push(s);
	}
	return out;
}

var getFnLine=function(M,N){
//M:[J名,起始頁數的虛擬行]
//N:[虛擬行,檔案名,行數]
	var out=[];
	var i=0;
	var j=0;
	console.log(M[0],N[0])
	//debugger//跑M的while，M的第一項比較N的第一項
	while(i<M.length){
		//若M>N則N再往下走直到N=M則push
		while(j<N.length-1 && M[i][1]>N[j][0]) j++; 
		if(M[i][1] == N[j][0]){
			
			console.log(M[i][0],N[j][1]);
			out.push([M[i][0],N[j][1],N[j][2]]);
		}
		i++;
	}
	return out; //[J id,file name,line offset]
}

var fixLineNum=function(){
	//從getFnLine(M,N)得到[J id,file name,line offset]
	var out=[];
	var arr=getFnLine(M,N);
	//從J id回到sutra抓起始行
	for(var i in arr){
		var p=sutra[arr[i][0]].split("-");
		out.push(p[0]);
		//取出起始行的行數
	}
	//回傳 line offset＋sutra內行數
	return out;
}

var getFileName=function(){
	//從getFnLine(M,N)得到[J id,file name,line offset]
	//回傳檔名：lst[file name]
}

var fetchLine=function(){
	//用getFileName打開該檔
	//var file=fs.readFileSync("../jiangkangyur/"+檔案名稱,"utf8").split(/\r?\n/);
	//用fixLineNum找出該行
	//回傳此行內容
}

var xxx=function(){
	var ln=fixLineNum(); //ln=line number
	var fn=getFileName();
	//.push([]);
}

var insertId=function(){
	///取上面的輸出結果
	var input=getFnLine(sutra,pb2f);
	//console.log(run);//////////
	//return////////////
	///J名：input[i][0] 檔名：input[i][1] 行數：input[i][2]
	//for(var i in input){}
		///檔名對照.lst檔 找出此檔案
		var file=fs.readFileSync("../jiangkangyur/"+lst[input[0][1]],"utf8").split(/\r?\n/);
		///在輸出結果[2]的行數插入<sutra id="J名">
		var line=input[0][2];
		file[line]='<sutra id="'+input[0][0]+'"/>'+file[line];

	return file[line];

}


var M=ObjSortNvline(sutra);//[J名,起始頁數的虛擬行]
var N=ArrSortNvline(pb2f);//[虛擬行,檔案名,行數]
console.time("t1");
console.log(fixLineNum());

//console.log(getFnLine(M,N));
//ArrSortNvline(pb2f)
//console.log(insertId());
console.timeEnd("t1");






