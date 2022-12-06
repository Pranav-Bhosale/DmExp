const prompt = require("prompt-sync")();
const xlsx = require("xlsx");

//Reading the input file
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["Student_Data"];

var data = xlsx.utils.sheet_to_json(ws);

var min_val;
var max_val;

data.sort((a, b) => (a.Marks > b.Marks ? 1 : -1));

min_val = data[0].Marks;
max_val = data[data.length - 1].Marks;

let n = data.length;

let q1Term = Math.round((25 / 100) * (n + 1));

let q1 = data[q1Term - 1].Marks;

let q2;

if (n % 2 == 1) {
  q2 = data[(n - 1) / 2].Marks;
} else {
  q2 = (data[n / 2 - 1].Marks + data[n / 2].Marks) / 2;
}

let q3term = Math.round((75 / 100) * (n + 1));

let q3 = data[q3term - 1].Marks;
var IQ = q3 - q1;
var lowerwhisers = q1 - 1.5 * IQ,
  upperWhisers = q3 + 1.5 * IQ;
var newdata = [];
newdata.push({
  Lowerwhisers: lowerwhisers,
  MinimumValue: min_val,
  LowerQuartile: q1,
  MedianValue: q2,
  UpperQuartile: q3,
  MaximumValue: max_val,
  UpperWhisers: upperWhisers,
});

console.log(newdata);

//Creating and writing data to the result file
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(newdata);

xlsx.utils.book_append_sheet(newWB, newWS, "FiveNOSummery");

xlsx.writeFile(newWB, "FiveNOSummery.xlsx");
