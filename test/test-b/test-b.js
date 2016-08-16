'use strict';
import {default as deep, name as deepName} from '../test-c/test-d/deep.js';
describe('test-b', function () {
  it('should load far away modules correctly', function() {
    deep.should.equal('default-export')
    deepName.should.equal('deep-module');
  });
});
export default 'test-b';
export const name = 'test-b';
