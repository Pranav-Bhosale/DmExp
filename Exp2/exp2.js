const prompt = require("prompt-sync")();
const xlsx = require("xlsx");

//Reading the input file
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["Student_Data"];

var data = xlsx.utils.sheet_to_json(ws);

var old_min = Number.POSITIVE_INFINITY,
  old_max = Number.NEGATIVE_INFINITY;

//Finding old_min and old_max values min max normalization
for (let i = 0; i < data.length; i++) {
  old_min = Math.min(old_min, data[i].Marks);
  old_max = Math.max(old_max, data[i].Marks);
}

//Taking the new range of scale formin max normalization
console.log("Enter New Range For Marks (for min-max normalization) ");
var new_min = parseInt(prompt("From : "));
var new_max = parseInt(prompt("To : "));

//Calculating normalized data min max normalization

var newData = data.map(function (record) {
  record.min_max_normalized_marks =
    ((record.Marks - old_min) / (old_max - old_min)) * (new_max - new_min) +
    new_min;
  record.min_max_normalized_marks = record.min_max_normalized_marks.toFixed(2); //round off to two decimal digits
  return record;
});

//Z -score Normalization
let n = data.length;
let sum = 0;

// calculating mean

for (let i = 0; i < data.length; i++) {
  sum += data[i].Marks;
}
var mean = sum / n;

// calculating standard deviation
var sd_sum = 0;
for (let i = 0; i < data.length; i++) {
  sd_sum += (data[i].Marks - mean) * (data[i].Marks - mean);
}
var std_dev = Math.sqrt(sd_sum / n);
std_dev = std_dev.toFixed(2);

// calculating z-score normalized value
var newData = data.map(function (record) {
  record.zscore_normalized_marks = ((record.Marks - mean) / std_dev).toFixed(2);
  return record;
});

//console.log(newData);

//Creating and writing data to the result file for min max normalization and z score
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(newData);

xlsx.utils.book_append_sheet(newWB, newWS, "Normalized Student Data");

xlsx.writeFile(newWB, "Normalized_Data.xlsx");
