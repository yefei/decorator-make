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

console.log('A methods:', method.getMethods(A.prototype));
console.log('B types:', prop.getTypes(B.prototype));
console.log('B methods:', method.getMethods(B.prototype));
console.log('C methods:', method.getMethods(C.prototype));
console.log('C types:', prop.getTypes(C.prototype));
console.log('C value:', clazz.getValue(C));
