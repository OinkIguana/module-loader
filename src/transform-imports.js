'use strict';
import spliceString from 'splice-string';
import {IMPORT_FN_NAME} from './const';

const IMPORTS = [
  /import\s+(?:'(.*)'|"(.*)")/g,
  /import\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\*\s+as\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\{(.*)\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s*,\s+\{(.*)\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s*,\s+\*\s+as\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s+from\s+(?:'(.*)'|"(.*)")/g,
];

export default function transformImports(code) {
  let matches;
  let type = 0;
  for(let regex of IMPORTS) {
    while(matches = regex.exec(code)) {
      let file, end, start, identifier, identifiers;
      switch(type) {
        case 0:
          file = matches[1] || matches[2];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `${IMPORT_FN_NAME}('${file}')`);
          break;
        case 1:
          identifier = matches[1];
          file = matches[2] || matches[3];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `const {default: ${identifier}} = ${IMPORT_FN_NAME}('${file}')`);
          break;
        case 2:
          identifier = matches[1];
          file = matches[2] || matches[3];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `const ${identifier} = ${IMPORT_FN_NAME}('${file}')`);
          break;
        case 3:
          identifiers = matches[1].split(',').map((id) => id.replace(/(.*)\s+as\s+(.*)/, '$1: $2')).join(',');
          file = matches[2] || matches[3];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `const {${identifiers}} = ${IMPORT_FN_NAME}('${file}')`);
          break;
        case 4:
          identifier = matches[1];
          identifiers = matches[2].split(',').map((id) => id.replace(/(.*)\s+as\s+(.*)/, '$1: $2')).join(',');
          file = matches[3] || matches[4];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `const {default: ${identifier}, ${identifiers}} = ${IMPORT_FN_NAME}('${file}')`);
          break;
        case 5:
          identifiers = [matches[1], matches[2]];
          file = matches[3] || matches[4];
          end = regex.lastIndex;
          start = end - matches[0].length;
          code = spliceString(code, start, matches[0].length, `const ${identifiers[1]} = ${IMPORT_FN_NAME}('${file}'); const {default: ${identifiers[0]}} = ${identifiers[1]}`);
          break;
      }
    }
    ++type;
  }
  return code;
}
