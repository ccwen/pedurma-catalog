fs=require("fs");
var olddir=process.cwd();
process.chdir("../jiangkangyur");
var lst=fs.readFileSync("jiangkangyur.lst","utf8").split(/\r?\n/);
var out=[];
var line=[];

for(var i=0; i<lst.length; i++){
	line=fs.readFileSync(lst[i],"utf8").split(/\r?\n/);
	var pbnum=0;
	for(var j=0; j<line.length; j++){
		var findpb=line[j].indexOf("<pb id=");
		if(findpb>-1){
			var pbid=line[j].substr(findpb+8,7);
			pbid=pbid.replace('"',"");
			pbid=pbid.replace('/',"");
			pbid=pbid.replace('>',"");
			var lineoff=j+1;
			out.push([pbid, i, lineoff]); //lst[i]
		}		
	}
}
var output="var pb2f="+JSON.stringify(out)+"\nif (module) module.exports=pb2f;";
process.chdir(olddir);
output=output.replace(/\],/g,"],\n");
fs.writeFileSync("pb2f.js",output,"utf8");

		