#! node
const fs = require('fs');
const path = require('path');
const PATH = __dirname;

let args = process.arguments
console.log('hello, my first cli', args);

let tmpStr = fs.readFileSync(path.join(PATH, 'editorTmp.vue'));
tmpStr = tmpStr.toString().replace('${NAME}', 'editor');
fs.writeFileSync(`${PATH}/lrz_cli_create.vue`, tmpStr);
