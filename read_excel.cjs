const xlsx = require('xlsx');
const workbook = xlsx.readFile('./public/data.xlsx', { cellDates: true });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });
console.log(data.slice(0, 5));
