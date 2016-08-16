'use strict';
import testA, {name_b, name_f} from './test-a';
import testB from './test-b';
import * as testC from './test-c';
import * as json from './test-e';
describe('external entry', function() {
  it('should retrieve all dependencies correctly', function() {
    testA().should.equal('test-a');
    testB.should.equal('test-b');
    name_b.should.equal('test-b');
    name_f.should.equal('test-f');
    testC.name.should.equal('test-c');
    json.name.should.equal('test-e');
  });
});
export const name = 'external-entry';
export default name;
