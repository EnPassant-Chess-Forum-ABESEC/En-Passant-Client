const fs = require('fs');
let content = fs.readFileSync('C:\\\\Users\\\\ASUS\\\\en-passant-frontend-v1\\\\scratch_lighthouse.json', 'utf8');

const perfMatch = content.match(/"performance":\s*\{\s*"id":\s*"performance",\s*"title":\s*"Performance",\s*"score":\s*([\d\.]+)/);
const lcpMatch = content.match(/"largest-contentful-paint":\s*\{[^}]*?"displayValue":\s*"([^"]+)"/);
const tbtMatch = content.match(/"total-blocking-time":\s*\{[^}]*?"displayValue":\s*"([^"]+)"/);
const fcpMatch = content.match(/"first-contentful-paint":\s*\{[^}]*?"displayValue":\s*"([^"]+)"/);
const clsMatch = content.match(/"cumulative-layout-shift":\s*\{[^}]*?"displayValue":\s*"([^"]+)"/);
const siMatch = content.match(/"speed-index":\s*\{[^}]*?"displayValue":\s*"([^"]+)"/);

console.log('Performance: ' + (perfMatch ? parseFloat(perfMatch[1]) * 100 : 'not found'));
console.log('LCP: ' + (lcpMatch ? lcpMatch[1] : 'not found'));
console.log('TBT: ' + (tbtMatch ? tbtMatch[1] : 'not found'));
console.log('FCP: ' + (fcpMatch ? fcpMatch[1] : 'not found'));
console.log('CLS: ' + (clsMatch ? clsMatch[1] : 'not found'));
console.log('SI: ' + (siMatch ? siMatch[1] : 'not found'));
