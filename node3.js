/* eslint-disable camelcase */
const rd = require('rd');
const path = require('path');
const fs = require('fs');

// 同步遍历目录下的所有文件
rd.eachSync(path.resolve(process.cwd()), f => {
  const stat = fs.statSync(f);

  // 注意：
  // 1、在完全干净的情况下执行；
  // 2、手动处理包含.git的文件，例如.gitignore
  // 3、排除图片等
  if (
    stat.isFile() &&
    !f.includes('.git') &&
    !f.includes('node_modules') &&
    !f.includes('png') &&
    !f.includes('jpeg') &&
    !f.includes('gif') &&
    !f.includes('svg') &&
    !f.includes('json') &&
    !f.includes('node3.js')
  ) {
    const contentBuffer = fs.readFileSync(f);
    const str = contentBuffer.toString();


    // 找到原始label，插入到title
    const reg_ErrorTooltip = /(?<=<ErrorTooltip)/g
    const listErrorTooltipPlace = str.match(reg_ErrorTooltip)

    // 测试是否有解构labelId变量
    // const { form } = this.props
    const reg_form_declearation = /(?<=render\(\)\s?{[\s\S]*?(?<!\/\/\s*)const {[\s\S]*?)labelId(?!:)(?=[\s\S]*?} = this.props)/g
    const hasFormDeclearation = reg_form_declearation.test(str)

    if (Array.isArray(listErrorTooltipPlace)) {
      if (hasFormDeclearation) {
        let final_result = str;
        let count = 0
        // 第一次替换
        final_result = final_result.replace(reg_ErrorTooltip, () => {
          const insert = `\nlabelId={labelId}`
          count += 1

          return insert
        })
        fs.writeFileSync(f, final_result);
      }
    }



  }
});
