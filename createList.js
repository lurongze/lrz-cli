const fs = require('fs');
const path = require('path');
const PATH = __dirname;

function createList(formItem, fileName, fileDir) {
  let tmpStr = fs.readFileSync(path.join(PATH, 'listTmp.vue'));
  tmpStr = tmpStr.toString().replace('${NAME}', fileName);
  let formItemStr = [];
  formItem.map((item)=> {
    formItemStr.push(`
      <el-table-column prop='${item.key}' label='${item.name}'></el-table-column>
    `);
  })

  // 替换表单结构
  tmpStr = tmpStr.replace('${formItem}', formItemStr.join(''));
  // 替换链接
  tmpStr = tmpStr.replace('${serviceLinkBaseStr}', `/t/app/${fileName}`);

  const filePath = path.join(fileDir, `${fileName}List.vue`);

  const srcPath = path.join(process.cwd(), `src/`) ;
  let fileReplace = filePath.replace(srcPath, '');
  fileReplace = fileReplace.split(path.sep);

  fs.writeFileSync(filePath, tmpStr);

  const routerPath = fileReplace.join('/').replace('.vue', '');
  const routerStr= `把修改下面链接的path和name的值，加入到路由中\n{ path: '${fileName}List/:id', component: require('@/${routerPath}').default, name: '${fileName}',hidden: false }`;
  console.log(routerStr)
}

module.exports = {
  createList
}
