'use strict';
let runs = 0;
describe('test-c', function () {
  it('should only be run once', function() {
    (++runs).should.equal(1);
  });
});
export let name;
name = 'test-c';
export default () => name;
