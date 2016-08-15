'use strict';
import generate from 'generate';
import {IMPORT_FN_NAME, EXPORT_FN_NAME, EXPORT_OBJ_NAME, INOUT_FN_NAME} from './const';

function toFunction(code) {
  return new Function(IMPORT_FN_NAME, EXPORT_FN_NAME, INOUT_FN_NAME, EXPORT_OBJ_NAME, code)
}

export default function functionalize(modules) {
  return generate(function*() {
    modules.root = toFunction(modules.root);
    for(let url of Object.keys(modules.all)) {
      if(typeof modules.get(url) === 'string') {
        modules.add(url, toFunction(modules.get(url)));
      }
    }
    return modules;
  });
}
