const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["data"];

var data = xlsx.utils.sheet_to_json(ws);
var parentattri = "class";

var obj = {};
for (var i = 0; i < Object.keys(data[0]).length; i++) {
  let arr2 = {};
  const key = Object.keys(data[0])[i];
  for (let i = 0; i < data.length - 1; i++) {
    if (!(data[i][key] in arr2)) {
      arr2[data[i][key]] = { 1: 0, 0: 0 };
    }
    var res = data[i][parentattri];
    if (res == 0) {
      arr2[data[i][key]]["0"]++;
    } else if (res == 1) {
      arr2[data[i][key]]["1"]++;
    }
  }
  obj[key] = arr2;
}

console.log(obj);
var prob = {};
for (classkey in obj["class"]) {
  var value = 1;
  var classtot = obj["class"][classkey][classkey];
  for (var i = 0; i < Object.keys(data[data.length - 1]).length; i++) {
    const key = Object.keys(data[data.length - 1])[i];
    value = value * (obj[key][data[data.length - 1][key]][classkey] / classtot);
  }
  value = value * (classtot / (data.length - 1));
  prob[classkey] = value;
}
console.log("====================================");
console.log("probablities");
console.log("====================================");
console.log(prob);
