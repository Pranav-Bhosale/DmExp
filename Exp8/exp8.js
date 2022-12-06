const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["data"];

var data = xlsx.utils.sheet_to_json(ws);
var corr;
var a = 0,
  b = 0,
  a_b = 0;
for (var i = 0; i < data.length; i++) {
  if (data[i].A == 1 && data[i].B == 1) a_b++;
  if (data[i].A == 1) a++;
  if (data[i].B == 1) b++;
}
corr = (a_b / (a * b))*data.length;
console.log(corr);
var newdata = [];
var obj = { correaltion_Between_A_and_B: corr };
newdata.push(obj);
//Creating and writing data to the result file
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(newdata);

xlsx.utils.book_append_sheet(newWB, newWS, "Correlation");

xlsx.writeFile(newWB, "Correlation.xlsx");
