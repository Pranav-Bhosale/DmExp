const prompt = require("prompt-sync")();
const xlsx = require("xlsx");

//Reading the input file
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["Movies"];

var data = xlsx.utils.sheet_to_json(ws);
console.log(data);

var tot = {};
var classNames = {};
var type = {};
for (let i = 0; i < data.length; i++) {
  if (!(data[i].class in tot)) {
    tot[data[i].class] = 0;
    classNames[data[i].class] = 0;
  }
  tot[data[i].class] += data[i].count;

  if (!(data[i].type in tot)) {
    tot[data[i].type] = 0;
    type[data[i].type] = 0;
  }
  tot[data[i].type] += data[i].count;
}
console.log(tot);

for (let i = 0; i < data.length; i++) {
  data[i].t_weight = (data[i].count / tot[data[i].class]) * 100;
  data[i].d_weight = (data[i].count / tot[data[i].type]) * 100;
}

var grandTot = 0;
for (var key in tot) {
  grandTot += tot[key];
}
grandTot = grandTot / 2;

for (var key in tot) {
  newdata = {};
  newdata.class = "tot";
  newdata.type = key;
  newdata.count = tot[key];
  if (key in classNames) {
    newdata.t_weight = 100;
    newdata.d_weight = (tot[key] / grandTot) * 100;
  } else {
    newdata.t_weight = (tot[key] / grandTot) * 100;
    newdata.d_weight = 100;
  }
  data.push(newdata);
}

console.log(data);

//Creating and writing data to the result file
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(data);

xlsx.utils.book_append_sheet(newWB, newWS, "T_D_Weight");

xlsx.writeFile(newWB, "T_D_Weight.xlsx");
