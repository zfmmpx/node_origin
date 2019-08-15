/* eslint-disable camelcase */
const rd = require('rd');
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const dictionary = require('./content.json')

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


    // 找到 formatMessage ---- 第一次替换：把formatMessage替换成formatMessageApi
    const reg_formatMessage = /formatMessage(?=\(\s*{\s*id:\s*['"][\w\.-]+['"],?\s*}\s*\))/g
    const listFormatMessage = str.match(reg_formatMessage)
    // console.log('listFormatMessage:', listFormatMessage)

    // 找到 dict_code ---- 为了根据dict_code 从dictionary找到 typeCode
    const reg_dict_code = /(?<=formatMessage\(\s*{\s*id:\s*['"])[\w\.-]+(?=['"],?\s*}\s*\))/g
    const listDictCode = str.match(reg_dict_code)
    // console.log('listDictCode:', listDictCode)

    if (Array.isArray(listFormatMessage) && Array.isArray(listDictCode)) {
      let final_result = str;

      const listTypeCode = lodash
        .chain(listDictCode)
        .reduce((result, v) => {
          const typeCode = lodash.reduce(dictionary, (result2, value2, key) => {
            if (lodash.has(value2, v)) {
              result2 = key
              return result2
            }
            return result2
          }, '')
          if (typeCode) {
            return result.concat(typeCode)
          }
          return result
        }, [])
        .value();


      if (!lodash.isEmpty(listTypeCode)) {
        // 第一次替换：把formatMessage替换成formatMessageApi
        final_result = final_result.replace(reg_formatMessage, () => {
          const replacement = 'formatMessageApi'

          return replacement
        })

        // 第二次替换 ---- 把 id 替换成 typeCode[count]
        let count = 0
        const reg_id = /(?<=formatMessage\(\s*{\s*)id(?=:\s*['"][\w\.-]+['"],?\s*}\s*\))/g
        final_result = final_result.replace(reg_id, () => {
          const replacement = listTypeCode[count]
          count = count + 1

          return replacement
        })

        // 如果没有import { formatMessageApi }，就手动import一下
        if (!/import { formatMessageApi } from '@\/utils\/dictFormatMessage'/g.test(str)) {
          // 第三次替换
          final_result = final_result.replace(
            /^/g,
            "import ErrorTooltip from '@/components/ErrorTooltip';\n"
          );
        };

        // 写入文件
        fs.writeFileSync(f, final_result);
      }


    }

  }
});
