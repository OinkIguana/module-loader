'use strict';

export default function run(modules) {
  const exports = {};

  function _import(url) {
    if(exports[url] === undefined) {
      exports[url] = {};
      const module = modules.get(url);
      if(typeof module === 'function') {
        module(_import, _export.bind(null, exports[url]), _export_import.bind(null, exports[url]), exports[url]);
      } else {
        exports[url] = module;
      }
    }
    return exports[url];
  }

  function _export(exports, definitions) {
    for(let key of Object.keys(definitions)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: () => definitions[key]
      });
    }
  }

  function _export_import(exports, url, map) {
    const imports = _import(url);
    if(map !== undefined) {
      for(let key of Object.keys(map)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: ((key) => () => imports[map[key]]) (key)
        })
      }
    } else {
      for(let key of Object.keys(imports)) {
        if(key !== 'default') {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: ((key) => () => imports[key]) (key)
          });
        }
      }
    }
  }

  window.moduleLoader[modules.name] = {};
  modules.root(
    _import,
    _export.bind(null, window.moduleLoader[modules.name]),
    _export_import.bind(null, window.moduleLoader[modules.name]),
    window.moduleLoader[modules.name]
  );
}
