const fs = require('fs');
let content = fs.readFileSync('C:\\\\Users\\\\ASUS\\\\en-passant-frontend-v1\\\\scratch_lighthouse.json', 'utf8');

const perfMatch = content.match(/"id":\s*"performance"[^}]*?"score":\s*([\d\.]+)/);
console.log('Performance: ' + (perfMatch ? parseFloat(perfMatch[1]) * 100 : 'not found'));
