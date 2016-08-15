'use strict';
import path from 'path';
import generate from 'generate';
import spliceString from 'splice-string';

import xhr from './xhr';
import findDependencies from './find-dependencies';
import transformModule from './transform-module';
import modules from './modules';
import loadAsFile from './load-as-file';
import loadAsDir from './load-as-dir';

export default function resolveModules(code, dir, modules) {
  return generate(function*() {
    const deps = findDependencies(code).sort(([a], [b]) => b - a);
    for(let [strpos, dep] of deps) {
      if(/^\.{0,2}[\\\/]/.test(dep)) {
        let resolution = [path.resolve(location.hostname, location.pathname, dir, dep), `function() { throw 'Module ${dep} could not be found'; }`];
        try {
          resolution = yield loadAsFile(dir, dep, modules);
        } catch(e) {
          try {
            resolution = yield loadAsDir(dir, dep, modules);
          } catch(e) {
            console.error(e);
          }
        }
        code = spliceString(code, strpos, dep.length, resolution[0]);
        modules.add(resolution[0], yield resolveModules(resolution[1], path.dirname(resolution[0]), modules));
      } else {
        console.log('node_modules');
      }
    }
    return transformModule(code);
  });
}
