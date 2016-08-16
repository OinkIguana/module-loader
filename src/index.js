'use strict';
import generate from 'generate';
import path from 'path';

import xhr from './xhr';
import resolveModules from './resolve-modules';
import Modules from './modules';
import functionalize from './functionalize';
import run from './run';

window.moduleLoader = Promise.all(Array.prototype.map.call(
  document.querySelectorAll('script[type="module"]'),
  (element) => generate(function*() {
    const src = element.getAttribute('src');
    let code;
    if(src) {
      try {
        const url = path.resolve(location.hostname, path.dirname(location.pathname + ".html"), src);
        code = yield xhr(url);
      } catch(e) {
        console.error(e);
        return;
      }
    } else if(element.hasAttribute('entry')) {
      code = element.innerHTML;
    }
    const modules = new Modules(element.id);
    const root = yield resolveModules(code, './', modules);
    modules.root = root;
    return modules;
  }).then(functionalize).then(run)));
