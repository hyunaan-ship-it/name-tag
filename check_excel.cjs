const xlsx = require('xlsx');
const workbook = xlsx.readFile('./public/data.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log("Header row (index 2):", data[2]);
console.log("First data row (index 3):", data[3]);
console.log("Middle data row (index 7):", data[7]);
