/* eslint-disable camelcase */
const rd = require('rd');
const path = require('path');
const fs = require('fs');
const dictionary = require('./dictionary.json')
console.log('dictionary:', dictionary)

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
    !f.includes('json')
  ) {
    const contentBuffer = fs.readFileSync(f);
    const str = contentBuffer.toString();
    // 如果这个文件修改过，就不要继续
    if (/import ErrorTooltip from '@\/components\/ErrorTooltip'/g.test(str)) return;

    // 找到formName
    const reg_formName = /(?<={(?:form.)?getFieldDecorator\s*\(\s*(?:'|"))\b([\w\.]+?)\b(?=(?:'|"))/g;
    const listFormName = str.match(reg_formName)

    // 找到原始label，插入到title
    const reg_origin_label = /(?<=(?:<Form.Item|<FormItem)(?:.|\n)*?label={\s*)formatMessage\(\s*{\s*id:\s*['"][\w\.-]+['"],?\s*}\s*\)/g
    const listOriginLabel = str.match(reg_origin_label)

    // 测试是否有解构form变量
    const reg_form_declearation = /(?<=render\(\)\s?{[\s\S]*?(?<!\/\/\s*)const {[\s\S]*?)form(?!:)(?=[\s\S]*?} = this.props)/g
    const hasFormDeclearation = reg_form_declearation.test(str)


    let final_result = str;
    if (Array.isArray(listFormName) && Array.isArray(listOriginLabel)) {
      let count = 0
      // 第一次替换
      final_result = final_result.replace(reg_origin_label, () => {
        const insert = `<ErrorTooltip form={form} formName="${listFormName[count]}" title={${listOriginLabel[count]}} /> `
        count += 1

        return insert
      })

      if (!hasFormDeclearation) {
        // 第二次替换（解构声明form变量）
        final_result = final_result.replace(/(?<=render\(\)\s?{)/, '\n    const { form } = this.props;')
      }

      // 第三次替换
      final_result = final_result.replace(
        /^/g,
        "import ErrorTooltip from '@/components/ErrorTooltip';\n"
      );

      // 写入文件
      fs.writeFileSync(f, final_result);
    }

  }
});
