'use strict';
import generate from 'generate';
import path from 'path';

import xhr from './xhr';
import resolveModules from './resolve-modules';
import modules from './modules';

window.moduleLoader = Promise.all(Array.prototype.map.call(
  document.querySelectorAll('script[type="text/module"]'),
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
    } else {
      code = element.innerHTML;
    }
    return resolveModules(code, './');
  }))
);

window.moduleLoader.then(() => {
  console.log(modules.all());
})
