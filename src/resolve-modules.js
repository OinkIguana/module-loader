'use strict';
import path from 'path';
import generate from 'generate';

import xhr from './xhr';
import findDependencies from './find-dependencies';
import convertModules from './convert-modules';
import modules from './modules';

export default function resolveModules(code, dir) {
  function loadAsFile(url) {
    const paths = [
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url),
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url + '.js'),
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url + '.json')
    ];
    let type = 0;
    return generate(function*() {
      for(let url of paths) {
        if(modules.get(url)) { return modules.get(url); }
        try {
          let resolution = yield xhr(url);
          if(type === 2) {
            resolution = JSON.parse(resolution);
          }
          return [url, resolution];
        } catch(e) { ++type; }
      }
      throw `Could not find module at ${path.resolve(location.hostname, location.pathname, dir, url)}`;
    });
  }

  function loadAsDir(url) {
    const paths = [
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'package.json'),
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'index.js'),
      path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'index.json')
    ];
    let type = 0;
    return generate(function*() {
      for(let url of paths) {
        if(modules.get(url)) { return modules.get(url); }
        try {
          let resolution = yield xhr(url);
          switch(type) {
            case 0:
              const packageJSON = JSON.parse(resolution);
              return yield loadAsFile(path.resolve(path.dirname(url), packageJSON.main));
              break;
            case 2:
              resolution = JSON.parse(resolution);
              break;
          }
          return [url, resolution];
        } catch(e) { ++type; }
      }
      throw `Could not find module at ${path.resolve(location.hostname, location.pathname, dir, url)}`;
    });
  }

  return generate(function*() {
    const deps = findDependencies(code);
    yield Promise.all(deps.map((dep) => generate(function*() {
      if(/^\.{0,2}[\\\/]/.test(dep)) {
        let resolution = [path.resolve(location.hostname, location.pathname, dir, dep), `function() { throw 'Module ${dep} could not be found'; }`];
        try {
          resolution = yield loadAsFile(dep);
        } catch(e) {
          try {
            resolution = yield loadAsDir(dep);
          } catch(e) {
            console.error(e);
          }
        }
        modules.add(resolution[0], yield resolveModules(resolution[1], path.dirname(resolution[0])));
      } else {
        console.log('node_modules');
      }
    })));
    return convertModules(code);
  });
};
