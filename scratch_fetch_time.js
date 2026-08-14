const fs = require('fs');
let content = fs.readFileSync('C:\\\\Users\\\\ASUS\\\\en-passant-frontend-v1\\\\scratch_lighthouse.json', 'utf8');
const fetchTimeMatch = content.match(/"fetchTime":\s*"([^"]+)"/);
console.log('FetchTime: ' + (fetchTimeMatch ? fetchTimeMatch[1] : 'not found'));
