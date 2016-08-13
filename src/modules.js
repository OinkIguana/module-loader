const modules = {};
function add(id, content) {
  modules[id] = content;
}

function get(id, content) {
  return modules[id] || null;
}

function all() {
  return modules;
}

export default { add: add, get: get, all: all }
