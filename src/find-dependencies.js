'use strict';

const MATCHERS = [
  /import\s+(?:'(.*)'|"(.*)")/g,
  /import\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\*\s+as\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\{.*\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s*,\s+\{.*\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s*,\s+\*\s+as\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\{.*\}\s+from\s+(?:'(.*)'|"(.*)")/g
];

export default function findDependencies(code) {
  const deps = [];
  for(let regex of MATCHERS) {
    let matches;
    while(matches = regex.exec(code)) {
      const dep = [0, matches[1] || matches[2]]
      dep[0] = regex.lastIndex - 1 - dep[1].length;
      deps.push(dep);
    }
  }
  return deps;
}
