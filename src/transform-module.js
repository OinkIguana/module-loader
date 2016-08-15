'use strict';
import transformImports from './transform-imports';
import transformExports from './transform-exports';
import {IMPORT_FN_NAME, EXPORT_FN_NAME, EXPORT_OBJ_NAME, INOUT_FN_NAME} from './const';

export default function transformModule(code) {
  if(typeof code === 'string') {
    return transformImports(transformExports(code));
  } else {
    return code;
  }
}
