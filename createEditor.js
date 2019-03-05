const fs = require('fs');
const path = require('path');
const PATH = __dirname;

function createEditor(formItem, fileName, fileDir) {
  let tmpStr = fs.readFileSync(path.join(PATH, 'editorTmp.vue'));
  tmpStr = tmpStr.toString().replace('${NAME}', fileName);

  let formItemStr = [];
  let componentsStr = [];
  let formData = [];
  let formEditorSet = [];
  let formEditorGet = [];
  let formPicture = [];
  let formPictures = [];

  formItem.map((item)=>{

    // 数字类型
    if(item.type === 'number') {
      formItemStr.push(`
      <el-form-item label="${item.name}" prop="${item.key}">
        <el-input-number v-model="form.${item.key}"></el-input-number>
      </el-form-item>
      `);
      formData.push(`
        ${item.key}:0`)
    }

    // 字符串类型， 给input 框
    if(item.type === 'varchar') {
      formItemStr.push(`
      <el-form-item label="${item.name}" prop="${item.key}">
        <el-input v-model="form.${item.key}"></el-input>
      </el-form-item>
      `);
      formData.push(`
        ${item.key}:''`)
    }

    // 富文本框类型
    if(item.type === 'editor') {
      formItemStr.push(`
      <el-form-item label="${item.name}" prop="${item.key}">
        <Editor :default-content="form.${item.key}" ref="${item.key}_editor" />
      </el-form-item>
      `);
      formData.push(`
        ${item.key}:''`)
      formEditorGet.push(`this.form.${item.key} = this.$refs.${item.key}_editor.getContent();`);
      formEditorSet.push(`this.$refs.${item.key}_editor.setContent(this.form.${item.key});`);
      componentsStr.push(`Editor`)
    }

    // 单图片上传
    if(item.type === 'picture') {
      formItemStr.push(`
      <el-form-item label="${item.name}">
        <ImageUpload :image.sync="form.${item.key}" />
      </el-form-item>
      `);
      componentsStr.push(`ImageUpload`)
    }

    // 多图片上传
    if(item.type === 'pictures') {
      formItemStr.push(`
      <el-form-item label="${item.name}">
        <ImagesUpload :images.sync="form.${item.key}" :limit="15" />
      </el-form-item>
      `);
      componentsStr.push(`ImagesUpload`)
    }

  })

  // 替换表单结构
  tmpStr = tmpStr.replace('${formItem}', formItemStr.join(''));
  // 替换this.form 结构
  tmpStr = tmpStr.replace('${formData}', formData.join(','));
  // 替换import 和components
  tmpStr = tmpStr.replace('${componentsStr}', Array.from(new Set(componentsStr)).join(','));

  const filePath = path.join(fileDir, `${fileName}Editor.vue`);

  const srcPath = path.join(process.cwd(), `src/`) ;
  let fileReplace = filePath.replace(srcPath, '');
  fileReplace = fileReplace.split(path.sep);
  let relate = '';
  for(let i=0;i<fileReplace.length-2;i++) {
    relate = relate + '../'
  }
  componentsStr = Array.from(new Set(componentsStr)).map((item)=>{
    return `import ${item} from '${relate}common/${item}';`;
  });
  tmpStr = tmpStr.replace('${importStr}', componentsStr.join('\n'));
  // 替换富文本框的
  tmpStr = tmpStr.replace('${formEditorGet}', formEditorGet.join('\n'));
  tmpStr = tmpStr.replace('${formEditorSet}', formEditorSet.join('\n'));
  // 替换链接
  tmpStr = tmpStr.replace('${serviceLinkBaseStr}', `/t/app/${fileName}`);
  fs.writeFileSync(filePath, tmpStr);

  const routerPath = fileReplace.join('/').replace('.vue', '');
  const routerStr= `把修改下面链接的path和name的值，加入到路由中\n{ path: '${fileName}Editor/:id', component: require('@/${routerPath}').default, name: '${fileName}',hidden: false }`;
  console.log(routerStr)
}

module.exports = {
  createEditor
}
