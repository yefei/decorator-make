# decorator-make

## Property Decorator

```js
const deco = makePropertyDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
class Target {
  @deco prop: Type;
}
```

### JavaScript
```js
class Target {
}
deco(Target.prototype, 'prop', Type);
```

### Get Properties
```js
deco.getProperties(Target);
```

## Method Decorator

```js
const deco = makeMethodDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
class Target {
  @deco someFunc(type?: Type, ...) {}
}
```

### JavaScript
```js
class Target {
  someFunc(type, ...) {}
}
deco(Target.prototype, 'someFunc', [Type, ...]);
```

### Get Methods
```js
deco.getMethods(Target);
```

## Class Decorator

```js
const deco = makeClassDecorator();
```

### TypeScript with experimentalDecorators & emitDecoratorMetadata
```ts
@deco class Target {}
```

### JavaScript
```js
class Target {}
deco(Target);
```

### Get Value
```js
deco.getValue(Target); // return true
```
