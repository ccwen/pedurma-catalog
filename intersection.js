var a=[1,3,5,7,9,11,13,15,25];
var b=[2,3,5,7,11,13,17,19,25];
var c=[1,3,6,9,12,15,18,21,25];

for(var i=0; i<a.length; i++){
	for(var j=0; b.length; j++){
		if(a[i] == b[j]){
			for(var k=0; k<c.length; k++){
				if(b[j] == c[k]){
					console.log("union:"+c[k]);
				}
			}
		}
	}
}
