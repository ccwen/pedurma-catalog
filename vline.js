fs=require("fs");
//var pb2f=require("./pb2f");
//var f2pb=require("./f2pb_test");
//console.log(pb2f[0][0]);
var sutra=JSON.parse(fs.readFileSync("./LJ_nocorss.json","utf8"));

var parseVolPage=function(str){
	var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)/);
	if(!s){
		console.log("error!",str);
		return null;
	}
	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1")};
}

var volpb2vl=function(str){
	var out=[];
	//for(var i in str){}
	var volpage=parseVolPage(str);
	if(! volpage){console.log(str); return 0;}
	//out.push(volpage["vol"]);
	if(volpage["side"]=="a"){side=1;}
	else if(volpage["side"]=="b"){side=2;}
	else if(volpage["side"]=="c"){side=3;}
	else if(volpage["side"]=="d"){side=4;}
	
	var vline=volpage["vol"]*500*4*10+volpage["page"]*4*10+side*10+volpage["line"];
	/*var volpage=str.split(/[@.]/);
	var vol=parseInt(volpage[0]);
	var page=parseInt(volpage[1].substr(0,volpage[1].length-1));
	var side=volpage[1].substr(volpage[1].length-1);
	var vline=vol*500*4*10+page*4*10+side*10;*/
	
	return vline;
}

//console.log(volpb2vl('96.305a'));

var vl2volpb=function(vline){
	//var out=[];
	//for(var i in f2pb){
		//var vline=f2pb[i];
		var vol=Math.floor(vline/(500*4*10));
		var page_p=vline%(500*4*10);
		var page=Math.floor(page_p/(4*10));
		var side_p=page_p%(4*10);
		var side=Math.floor(side_p/10);
		if(side==1){side="a";}
		else if(side==2){side="b";}
		else if(side==3){side="c";}
		else if(side==4){side="d";}
		var volpb=vol+"."+page+side;
	//}
	return volpb;
}

module.exports={volpb2vl:volpb2vl,vl2volpb:vl2volpb,parseVolPage:parseVolPage};

//console.log(volpb2vl());


