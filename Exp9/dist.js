const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["data"];

var data = xlsx.utils.sheet_to_json(ws);

var x_centre = 0,
  y_centre = 0;
for (var i = 0; i < data.length; i++) {
  x_centre += data[i].x;
  y_centre += data[i].y;
  data[i].isIncluded = 0;
}
x_centre = x_centre / data.length;
y_centre = y_centre / data.length;
console.log("Centre(" + x_centre + "," + y_centre + ")");
data.push({ point: "centre", x: x_centre, y: y_centre });
console.log(data);

var index = 0;
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

console.log(matrix);
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(matrix);
xlsx.utils.book_append_sheet(newWB, newWS, "matrix" + index);
xlsx.writeFile(newWB, "matrix" + index + ".xlsx");
