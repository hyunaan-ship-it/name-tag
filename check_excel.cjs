const xlsx = require('xlsx');
const workbook = xlsx.readFile('./public/data.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to see row-by-row arrays
console.log(data.slice(0, 10));
