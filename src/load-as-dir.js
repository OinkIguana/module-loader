'use strict';
import path from 'path';
import generate from 'generate';

import xhr from './xhr';
import loadAsFile from './load-as-file';

export default function loadAsDir(dir, url, modules) {
  const paths = [
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'package.json'),
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'index.js'),
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url, 'index.json')
  ];
  let type = 0;
  return generate(function*() {
    for(let url of paths) {
      if(modules.get(url)) { return [url, modules.get(url)]; }
      try {
        let resolution = yield xhr(url);
        switch(type) {
          case 0:
            const packageJSON = JSON.parse(resolution);
            return yield loadAsFile(dir, path.resolve(path.dirname(url), packageJSON.main), modules);
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
