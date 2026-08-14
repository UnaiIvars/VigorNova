const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node remove_comments.js <file_path>');
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Remove single line comments (//)
// Be careful with URLs (https://)
content = content.replace(/(?<!:)\/\/.*$/gm, '');

// Remove multi-line comments (/* */)
content = content.replace(/\/\*[\s\S]*?\*\//g, '');

// Remove JSX comments ({/* */})
content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

// Remove empty lines created by comment removal
content = content.split('\n').map(line => line.trimEnd()).filter(line => line.trim().length > 0 || line === '').join('\n');

fs.writeFileSync(filePath, content);
console.log('Comments removed successfully.');
