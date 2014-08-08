fs=require("fs");
var lst=fs.readFileSync("jiangkangyur.lst","utf8").split(/\r?\n/);
var out=[];


for(var i=0; i<lst.length; i++){
	var line=fs.readFileSync(lst[i],"utf8").split(/\r?\n/);
	out.push([lst[i],line.length]);
	//console.log(out);
}


out.sort(function(a,b){
			return b[1]-a[1];});
console.log(out.join("\n"));	
