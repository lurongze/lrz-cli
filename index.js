#! node
const path = require('path');
const fs = require('fs');
const workDir = process.cwd() // 当前操作的目录
const createEditor = require('./createEditor.js');
const createList = require('./createList.js');

// let args = process.argv.slice(2);
const args = ['g', 'both', '/ss2/index'];

if(args[0] === 'init') {
  const formItem = `[
    { "key": "title", "name": "标题", "type": "number" },
    { "key": "description", "name": "描述", "type": "varchar" },
    { "key": "picture", "name": "头图", "type": "picture" },
    { "key": "pictures", "name": "轮播图", "type": "pictures" },
    { "key": "createTime", "name": "时间", "type": "time" },
    { "key": "content", "name": "内容", "type": "editor" }
  ]`;
  const fileData = `{
  "generateData": ${formItem}
}`
  fs.writeFileSync(path.join(workDir, `generateData.json`), fileData);
}


if(args[0] === 'g') {

  const generateFile = path.join(workDir, 'generateData.json');
  if(!fs.existsSync(generateFile)) {
    console.error('ERROR:目录内缺少generateData.json配置文件，执行lrz-cli init生成文件')
    return false;
  }
  const generateData = fs.readFileSync(path.join(workDir, 'generateData.json'));

  const arg2 = args[1].toLowerCase()
  // 如果是文件夹的话
  let fileDir = path.join('/src/components/',path.normalize(args[2])).split(path.sep);
  let fileName = fileDir[fileDir.length - 1];
  fileName = fileName.substr(0,1).toUpperCase() + fileName.substr(1).toLowerCase()
  fileDir.splice(-1, 1);
  let createDir = workDir;
  let mapDir = fileDir.filter(item => item.length > 0);
  // 循环创建目录
  for(let i=0;i<mapDir.length; i++) {
    createDir = path.join(createDir, mapDir[i]);
    if (!fs.existsSync(createDir)) {
      fs.mkdirSync(createDir);
    }
  }
  fileDir = path.join(workDir, fileDir.join(path.sep)) // 最后生成的页面的目录
  const formItem = JSON.parse(generateData.toString()).generateData;

  if(arg2 === 'editor') { // 仅生成编辑页面
    createEditor.createEditor(formItem, fileName, fileDir);
  }
  if(arg2 === 'list') { // 仅生成列表页面
    createList.createList(formItem, fileName, fileDir);
  }
  if(arg2 === 'both') { // 生成列表和编辑页面
    createEditor.createEditor(formItem, fileName, fileDir);
    createList.createList(formItem, fileName, fileDir);
  }
}


