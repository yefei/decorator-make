const { makeClassDecorator, makeMethodDecorator, makePropertyDecorator } = require('../dist');

const prop = makePropertyDecorator();
const method = makeMethodDecorator();
const clazz = makeClassDecorator();

class A {
  aaa() {}
}

method.decorate(A.prototype, 'aaa');

class B {
  bbb(a) {}
}

prop.decorate(B.prototype, 'a', A);
prop.decorate(B.prototype, 'b', A);
method.decorate(B.prototype, 'bbb', [A]);

class C extends B {
  ccc(b) {}
}

clazz.decorate(C);
method.decorate(C.prototype, 'ccc', [B]);

console.log('A methods:', method.getMethods(A.prototype));
console.log('B types:', prop.getTypes(B.prototype));
console.log('B methods:', method.getMethods(B.prototype));
console.log('C methods:', method.getMethods(C.prototype));
console.log('C types:', prop.getTypes(C.prototype));
console.log('C value:', clazz.getValue(C));
