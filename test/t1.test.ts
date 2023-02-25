import * as assert from 'assert';
import { makeClassDecorator, makeMethodDecorator, makePropertyDecorator } from '../src';

const prop = makePropertyDecorator();
const method = makeMethodDecorator();
const clazz = makeClassDecorator();

class A {
  @method.decorate aaa() {}
}

class B {
  @prop.decorate a: A;
  @prop.decorate b: A;
  @method.decorate bbb(a: A) {}
}

@clazz.decorate
class C extends B {
  @method.decorate ccc(b: B) {}
}

describe('Model', function() {
  const Aaaa = { handle: A.prototype.aaa, params: [] };
  // const Bbbb = { handle: B.prototype.bbb, params: [A] };

  it('methods A', function() {
    assert.deepEqual(method.getMethods(A.prototype), [Aaaa]);
  });

  // it('methods B', function() {
  //   assert.deepEqual(method.getMethods(B.prototype), [Aaaa, Bbbb]);
  // });
});

// console.log('A methods:', method.getMethods(A.prototype));
// console.log('B types:', prop.getTypes(B.prototype));
// console.log('B methods:', method.getMethods(B.prototype));
// console.log('C methods:', method.getMethods(C.prototype));
// console.log('C types:', prop.getTypes(C.prototype));
// console.log('C value:', clazz.getValue(C));
