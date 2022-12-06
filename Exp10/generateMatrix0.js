const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["data"];

var data = xlsx.utils.sheet_to_json(ws);

console.log("data input\n" + data);
console.log(data);
console.log("\n");

var index = 1;
var matrix = [];
var j = 0;
for (var i = 0; i < data.length; i++) {
  var obj = {};

  for (j = 0; j <= i; j++) {
    var eucDist = Math.sqrt(
      (data[j].x - data[i].x) * (data[j].x - data[i].x) +
        (data[j].y - data[i].y) * (data[j].y - data[i].y)
    );
    obj["point"] = data[i].point;
    obj[data[j].point] = eucDist;
  }
  matrix.push(obj);
}

console.log("matrix" + index + "\n");
console.log(matrix);
console.log("\n");
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(matrix);
xlsx.utils.book_append_sheet(newWB, newWS, "matrix" + index);
xlsx.writeFile(newWB, "matrix" + ".xlsx");
