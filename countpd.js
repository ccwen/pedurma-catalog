fs=require("fs");
var lst=fs.readFileSync("jiangkangyur.lst","utf8").split(/\r?\n/);
var out=[];
var line=[];

var findpb=new RegExp("<pb id=","g");

for(var i=0; i<lst.length; i++){
	out=fs.readFileSync(lst[i],"utf8").split(/\r?\n/);
	var pbnum=0;
	for(var j in out){
		var find=out[j].indexOf("<pb id=");
		if(find>-1)
			{pbnum++;}
	}
		//console.log(lst[i]+" "+pbnum);
}

//for(var i=0; i<lst.length; i++){}
	line=fs.readFileSync(lst[0],"utf8").split(/\r?\n/);
	var pbnum=0;
	for(var j in line){
		var find=line[j].indexOf("<pb id=");
		if(find>-1){


		}
		
	}
		console.log(lst[i]+" "+pbnum);


//<CK n=”??”/>


/*
var text=fs.readFileSync(lst[0],"utf8");
var t1=text.replace(findpb,function(){return });
console.log(t1);*/




