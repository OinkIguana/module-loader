'use strict';
import symbolic from 'symbolic';

const [ALL, ROOT] = symbolic;

export default class Modules {
  constructor(name) {
    this.name = name;
    this[ALL] = {};
    this[ROOT] = "";
  }
  add(id, content) {
    this.all[id] = content;
  }
  get(id) {
    return this.all[id] || null;
  }

  set root(content) { this[ROOT] = content;}
  get all() { return this[ALL]; }
  get root() { return this[ROOT]; }
}
