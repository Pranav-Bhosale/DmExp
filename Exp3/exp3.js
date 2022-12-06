const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("Games.xlsx");
var ws = wb.Sheets["PlayingInfo"];

var data = xlsx.utils.sheet_to_json(ws);
var parentattri = prompt("Enter Parent attribute : ");
var childattri = prompt("Enter Child attribute : ");
var posR = 0,
  negR = 0;
var arr = {};
// console.log(data);
for (let i = 0; i < data.length; i++) {
  if (data[i][parentattri] == 1) {
    posR++;
  } else if (data[i][parentattri] == 0) {
    negR++;
  }

  if (!(data[i][childattri] in arr)) {
    arr[data[i][childattri]] = 0;
  }

  arr[data[i][childattri]]++;
}

//
let arr2 = {};
for (let i = 0; i < data.length; i++) {
  if (!(data[i][childattri] in arr2)) {
    arr2[data[i][childattri]] = { 1: 0, 0: 0 };
  }

  var res = data[i][parentattri];
  // console.log(arr2[data[i].Wind].Yes);
  if (res == 0) {
    arr2[data[i][childattri]]["0"]++;
  } else if (res == 1) {
    arr2[data[i][childattri]]["1"]++;
  }
}
// console.log(arr2);

/// Parent Entropy

var totRecord = data.length;
var entropy = -(
  (posR / totRecord) * Math.log2(posR / totRecord) +
  (negR / totRecord) * Math.log2(negR / totRecord)
);

entropy = entropy.toFixed(4);
// console.log(entropy);
var ent_sum = 0;
for (const key in arr2) {
  var array = arr2[key];
  let posRes = array["0"],
    negRes = array["1"];
  let totRes = posRes + negRes;

  let ent =
    -((posRes / totRes) * Math.log2(posRes / totRes)) -
    (negRes / totRes) * Math.log2(negRes / totRes);
  ent_sum += arr2[key].ent = ent * (totRes / data.length);
}

// console.log(arr2);
// console.log(ent_sum);

var infoGain = entropy - ent_sum;
// console.log(infoGain);
var newdata = [];
newdata.push({
  Parent_ent: entropy,
  Child_ent: ent_sum,
  InfoGain: infoGain,
});

// console.log(newdata);

//Creating and writing data to the result file
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(newdata);

xlsx.utils.book_append_sheet(newWB, newWS, "InfoGain");

xlsx.writeFile(newWB, "InfoGain.xlsx");
