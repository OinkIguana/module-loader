'use strict';
import path from 'path';
import generate from 'generate';

import xhr from './xhr';

export default function loadAsFile(dir, url, modules) {
  const paths = [
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url),
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url + '.js'),
    path.resolve(location.hostname, path.dirname(location.pathname + ".html"), dir, url + '.json')
  ];
  let type = 0;
  return generate(function*() {
    for(let url of paths) {
      if(modules.get(url)) { return [url, modules.get(url)]; }
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
