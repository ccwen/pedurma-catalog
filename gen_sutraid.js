var fs=require("fs");
var lst=process.argv[2] || "../jiangkangyur/jiangkangyur.lst";
var files=fs.readFileSync(lst,"utf8").replace(/\r?\n/g,"\n").split("\n");
var out=[];
var scanfile=function(fn) {
	var content=fs.readFileSync("../jiangkangyur/"+fn,"utf8");
	content.replace(/<sutra id="(.*?)"/g,function(m,m1){
		var oldid=fn.substr(5,5);
		out.push('"l'+oldid+'":"'+m1+'"');
	});
}
files.map(scanfile);
fs.writeFileSync("old2new_sutraid.json","{"+out.join(",\n")+"}","utf8");