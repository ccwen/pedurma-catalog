fs=require("fs");
//var pb2f=require("./pb2f");
//var f2pb=require("./f2pb_test");
//console.log(pb2f[0][0]);

var volpb2vl=function(str){
	//var out=[];
	//for(var i in pb2f){
	var volpage=str.split(/[@.]/);
	var vol=parseInt(volpage[0]);
	var page=parseInt(volpage[1].substr(0,volpage[1].length-1));
	var side=volpage[1].substr(volpage[1].length-1);
	if(side=="a"){side=1;}
	else if(side=="b"){side=2;}
	else if(side=="c"){side=3;}
	else if(side=="d"){side=4;}
	var vline=vol*500*4*10+page*4*10+side*10;
		//out.push(vline);
	//}
	return vline;
}

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

module.exports={volpb2vl:volpb2vl,vl2volpb:vl2volpb};

//console.log(volpb2vl());


