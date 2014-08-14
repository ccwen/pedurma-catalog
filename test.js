var fs=require("fs");
var jPedurma=JSON.parse(fs.readFileSync("./j-pedurma.json","utf8"));
debugger;
for (var i=0;i<10;i++)
console.log( process.platform+i );