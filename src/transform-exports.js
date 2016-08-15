'use strict';
import spliceString from 'splice-string';
import {IMPORT_FN_NAME, EXPORT_FN_NAME, EXPORT_OBJ_NAME, INOUT_FN_NAME} from './const';

const EXPORTS = [
  /export\s+\{(.*)\}/g,
  /export (var|let|const|function|class)\s+([\$A-Za-z_][\$A-Za-z_0-9]*)/g,
  /export default/g,
  /export\s+\*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\{(.*)\}\s+from\s+(?:'(.*)'|"(.*)")/g
];

const RENAME = /(.*)\s+as\s+(.*)/;

export default function transformExports(code) {
  let matches;
  let type = 0;
  for(let regex of EXPORTS) {
    while(matches = regex.exec(code)) {
      let keyword, file, end, start, identifier, identifiers;
      switch(type) {
        case 0:
          identifiers = matches[1].split(',').map((id) => {
            if(RENAME.test(id)) {
              return id.replace(RENAME, 'get $2() { return $1; }');
            } else {
              return `get ${id}() { return ${id}; }`;
            }
          }).join(',');
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${EXPORT_FN_NAME}({${identifiers}})`);
          break;
        case 1:
          keyword = matches[1];
          identifier = matches[2];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${keyword} ${identifier}`);
          code += `${EXPORT_FN_NAME}({get ${identifier}() { return ${identifier}; }});`;
          break;
        case 2:
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${EXPORT_OBJ_NAME}.default = `);
          break;
        case 3:
          file = matches[1] || matches[2];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${INOUT_FN_NAME}('${file}')`);
          break;
        case 4:
          identifiers = matches[1].split(',').map((id) => {
            if(RENAME.test(id)) {
              return id.replace(RENAME, `$2: '$1'`);
            } else {
              return `${id}: '${id}'`;
            }
          }).join(',');
          file = matches[2] || matches[3];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${INOUT_FN_NAME}('${file}', ${identifiers})`);
          break;
      }
    }
    ++type;
  }
  return code;
}
