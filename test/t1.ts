import { makeClassDecorator, makeMethodDecorator, makePropertyDecorator } from '../src';

const prop = makePropertyDecorator();
const method = makeMethodDecorator();
const clazz = makeClassDecorator();

class A {
  @method.decorate aaa() {}
}

class B {
  @prop.decorate a!: A;
  @prop.decorate b!: A;

  constructor(b1: number, b2: string) {
  }

  @method.decorate bbb(a: A) {}
}

@clazz.decorate
class C extends B {
  constructor(p1: string, p2: number) {
    super(p2, p1);
  }

  @method.decorate ccc(b: B) {}
}

console.log('A methods:', method.getMethods(A.prototype));
console.log('B types:', prop.getTypes(B.prototype));
console.log('B methods:', method.getMethods(B.prototype));
console.log('C methods:', method.getMethods(C.prototype));
console.log('C types:', prop.getTypes(C.prototype));
console.log('C value:', clazz.getValue(C));
console.log('C params:', clazz.getParams(C));
