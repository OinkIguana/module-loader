'use strict';
import * as b from './test-b';
import {name} from './test-c';
describe('test-a', function () {
  it('should load nested dependencies correctly', function() {
    b.default.should.equal('test-b');
  });
  it('should load repeated dependencies correctly', function() {
    name.should.equal('test-c');
  });
});
export default () => 'test-a';
export {name as name_b} from './test-b';
export * from './test-f';
