const xlsx = require("xlsx");
const prompt = require("prompt-sync")();

var index = 1;
var wb = xlsx.readFile("matrix.xlsx");
var ws = wb.Sheets["matrix" + index];

var datamain = xlsx.utils.sheet_to_json(ws);

while (index < datamain.length - 1) {
  var outputobj = {};
  var ws = wb.Sheets["matrix" + index];
  var data = xlsx.utils.sheet_to_json(ws);
  var minfirst = Number.MAX_VALUE;
  var minptsecond;
  var minptfirst;

  for (var i = 0; i < data.length; i++) {
    for (var j = 1; j <= i; j++) {
      const key = Object.keys(data[i])[j];
      if (data[i][key] != 0 && minfirst > data[i][key]) {
        minfirst = data[i][key];
        minptfirst = i;
        minptsecond = j - 1;
      }
    }
  }

  var matrix = [];
  var j = 0;
  for (var i = 0; i < data.length; i++) {
    var obj = {};
    for (j = 0; j <= i + 1; j++) {
      const key = Object.keys(data[i])[j];
      if (key != "point") {
        if (
          (data[i].point == data[minptfirst].point ||
            data[i].point == data[minptsecond].point) &&
          j != minptsecond + 1 &&
          j != minptfirst + 1
        ) {
          var d1 = Number.MAX_VALUE;
          var d2 = Number.MAX_VALUE;
          var d3 = Number.MAX_VALUE;
          var d4 = Number.MAX_VALUE;
          if (data[minptfirst][key]) {
            d1 = data[minptfirst][key];
          }
          if (data[minptsecond][key]) {
            d2 = data[minptsecond][key];
          }
          const key1 = Object.keys(data[j - 1])[minptfirst + 1];
          if (data[j - 1][key1]) {
            d3 = data[j - 1][key1];
          }
          const key2 = Object.keys(data[j - 1])[minptsecond + 1];
          if (data[j - 1][key2]) {
            d4 = data[j - 1][key2];
          }
          obj["point"] = data[minptfirst].point + data[minptsecond].point;
          obj[key] = Math.min(d1, d2, d3, d4);
        } else if (
          (data[i].point == data[minptfirst].point ||
            data[i].point == data[minptsecond].point) &&
          (j == minptsecond + 1 || j == minptfirst + 1)
        ) {
          if (
            !Number.isNaN(
              Math.min(data[minptfirst][key], data[minptsecond][key])
            )
          ) {
            obj["point"] = data[minptfirst].point + data[minptsecond].point;
            obj[data[minptfirst].point + data[minptsecond].point] = 0;
          }
        } else if (
          data[i].point != data[minptfirst].point &&
          data[i].point != data[minptsecond].point &&
          (j == minptfirst + 1 || j == minptsecond + 1)
        ) {
          const key1 = Object.keys(data[data.length - 1])[minptfirst + 1];
          const key2 = Object.keys(data[data.length - 1])[minptsecond + 1];
          if (Math.min(data[i][key1], data[i][key2])) {
            obj["point"] = data[i].point;
            obj[data[minptfirst].point + data[minptsecond].point] = Math.min(
              data[i][key1],
              data[i][key2]
            );
          } else if (
            !Number.isNaN(
              Math.min(data[minptfirst][key], data[minptsecond][key])
            )
          ) {
            obj["point"] = data[i].point;
            obj[data[minptfirst].point + data[minptsecond].point] = Math.min(
              data[minptfirst][key],
              data[minptsecond][key]
            );
          }
        } else {
          const key = Object.keys(data[i])[j];
          obj["point"] = data[i].point;
          obj[key] = data[i][key];
        }
      }
    }
    matrix.push(obj);
  }
  var obj1 = Object.keys(matrix[minptfirst]).size;
  var obj2 = Object.keys(matrix[minptsecond]).size;
  if (obj1 < obj2) {
    matrix.splice(minptfirst, 1);
  } else {
    matrix.splice(minptsecond, 1);
  }

  var newWS = xlsx.utils.json_to_sheet(matrix);
  index++;
  xlsx.utils.book_append_sheet(wb, newWS, "matrix" + index);
  xlsx.writeFile(wb, "matrix" + ".xlsx");
}
