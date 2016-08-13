'use strict';

const MATCHERS_A = [
  /import\s+(?:'(.*)'|"(.*)")/g,
  /import\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\*\s+as\s+([\$A-Za-z_][\$A-Za-z_0-9]*)\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\{(.*)\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\{(.*)\}\s+from\s+(?:'(.*)'|"(.*)")/g
];

const MATCHERS = [
  /import\s+(?:'(.*)'|"(.*)")/g,
  /import\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\*\s+as\s+[\$A-Za-z_][\$A-Za-z_0-9]*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /import\s+\{.*\}\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\*\s+from\s+(?:'(.*)'|"(.*)")/g,
  /export\s+\{.*\}\s+from\s+(?:'(.*)'|"(.*)")/g
];

export default function findDependencies(code) {
  const deps = [];
  for(let regex of MATCHERS) {
    let matches;
    while(matches = regex.exec(code)) {
      if(matches[1]) {
        deps.push(matches[1]);
      } else if(matches[2]) {
        deps.push(matches[2]);
      }
    }
  }
  return deps;
};
