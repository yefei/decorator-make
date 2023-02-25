# decorator-make

## Property Decorator

```js
const deco = makePropertyDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
class Target {
  @deco.decorate prop: Type;
}
```

### JavaScript
```js
class Target {
}
deco.decorate(Target.prototype, 'prop', Type);
```

### Get Types
```js
deco.getTypes(Target.prototype);
```

## Method Decorator

```js
const deco = makeMethodDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
class Target {
  @deco.decorate someFunc(type?: Type, ...) {}
}
```

### JavaScript
```js
class Target {
  someFunc(type, ...) {}
}
deco.decorate(Target.prototype, 'someFunc', [Type, ...]);
```

### Get Methods
```js
deco.getMethods(Target.prototype);
```

## Class Decorator

```js
const deco = makeClassDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
@deco.decorate class Target {}
```

### JavaScript
```js
class Target {}
deco.decorate(Target);
```

### Get Value
```js
deco.getValue(Target); // return true
```
