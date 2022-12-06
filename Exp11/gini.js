const xlsx = require("xlsx");
const prompt = require("prompt-sync")();
var wb = xlsx.readFile("data.xlsx");
var ws = wb.Sheets["data"];

var data = xlsx.utils.sheet_to_json(ws);
var attri = new Map();
var count = new Map();
for (var i = 0; i < data.length; i++) {
  for (var key in data[i]) {
    var name = data[i][key] + data[i].class;
    if (!count.has(name)) {
      count.set(name, 1);
    } else {
      count.set(name, count.get(name) + 1);
    }
    if (!attri.has(key)) {
      attri.set(key, {});
    }
    var obj = attri.get(key);
    if (!(data[i][key] in obj)) obj[data[i][key]] = 0;
    obj[data[i][key]]++;
    attri.set(key, obj);
  }
}
console.log(count);
console.log(attri);

for (let [key, value] of attri.entries()) {
  if (key != "class") {
    var gini = 0;
    for (attribute in value) {
      var temp = value[attribute] / data.length;
      var temp2 = 1;
      var classObj = attri.get("class");
      for (classname in classObj) {
        var name = attribute + classname;
        if (count.get(name)) {
          temp2 =
            temp2 -
            (count.get(name) / value[attribute]) *
              (count.get(name) / value[attribute]);
        }
      }
      gini = gini + temp * temp2;
    }
    console.log("gini index for " + key + " is " + gini);
  }
}
