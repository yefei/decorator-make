import 'reflect-metadata';

/**
 * 生成一个属性装饰器
 * 
 * ### 定义一个属性装饰器
 * ```js
 * const deco = makePropertyDecorator();
 * ```
 * 
 * #### 在 TypeScript 中使用方法：
 * ```ts
 * class Target {
 *   @deco prop: Type;
 * }
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {
 * }
 * deco(Target.prototype, 'prop', Type);
 * ```
 * 
 * #### 取得目标对象中被装饰的属性
 * ```js
 * deco.getProperties(Target);
 * ```
 */
export function makePropertyDecorator() {
  const PROPERTIES = Symbol('makePropertyDecorator#properties');

  /**
   * 属性装饰器
   * 
   * @param target 目标对象
   * @param propertyKey 目标对象中的属性名
   * @param type 属性类型，在不使用 experimentalDecorators 特性时需要指定
   */
  function decorator(target: any, propertyKey: string | symbol, type?: any) {
    if (!type) {
      type = Reflect.getOwnMetadata('design:type', target, propertyKey);
    }
    // 将父类的装饰属性描述复制到子类中，不能修改父类的装饰属性
    const properties = Object.assign({}, decorator.getProperties(target), { [propertyKey]: type });
    Reflect.defineMetadata(PROPERTIES, properties, target);
  }

  /**
   * 取得目标对象的所有已被装饰的属性
   * @param target 目标对象
   */
  decorator.getProperties = function (target: any): { [id: string | symbol]: any } {
    return Reflect.getMetadata(PROPERTIES, target);
  }

  return decorator;
}

export type MethodHandle = (...args: any[]) => any;

export interface MethodDescriptor {
  handle: MethodHandle;
  params: any[];
}

/**
 * 生成一个方法装饰器
 * 
 * ### 定义一个方法装饰器
 * ```js
 * const deco = makeMethodDecorator();
 * ```
 * 
 * #### 在 TypeScript 中使用方法：
 * ```ts
 * class Target {
 *   @deco someFunc(type?: Type, ...) {}
 * }
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {
 *   someFunc(type, ...) {}
 * }
 * deco(Target.prototype, 'someFunc', [Type, ...]);
 * ```
 * 
 * #### 取得目标对象中被装饰的方法列表
 * ```js
 * deco.getMethods(Target);
 * ```
 */
export function makeMethodDecorator() {
  const METHODS = Symbol('makeMethodDecorator#methods');

  /**
   * 方法装饰器
   * 
   * @param target 目标对象
   * @param propertyKey 目标对象中方法名
   * @param descriptor_or_paramtypes 目标对象中方法描述 | 或不使用 experimentalDecorators 特性时需要被注入方法参数列表
   */
  function decorator(target: any, propertyKey: string | symbol, descriptor_or_paramtypes?: PropertyDescriptor | any[]) {
    let handle: MethodHandle;
    let params: any[];
    // 兼容 js 调用
    if (!descriptor_or_paramtypes || Array.isArray(descriptor_or_paramtypes)) {
      handle = target[propertyKey];
      params = descriptor_or_paramtypes || [];
    // ts 调用
    } else {
      handle = descriptor_or_paramtypes.value;
      params = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey) || [];
    }

    const methods = [
      ...decorator.getMethods(target),
      { handle, params },
    ];
    Reflect.defineMetadata(METHODS, methods, target);
  }

  /**
   * 取得目标对象的所有已被装饰方法
   * @param target 目标对象
   */
  decorator.getMethods = function (target: any): MethodDescriptor[] {
    return Reflect.getMetadata(METHODS, target) || [];
  }

  return decorator;
}

/**
 * 生成一个类装饰器
 * 
 * ### 定义一个类装饰器
 * ```js
 * const deco = makeClassDecorator();
 * ```
 * 
 * #### 在 TypeScript 中使用方法：
 * ```ts
 * @deco class Target {}
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {}
 * deco(Target);
 * ```
 * 
 * #### 取得目标对象中被装饰的值
 * ```js
 * deco.getValue(Target);
 * ```
 * 
 * @param value 装饰完成后赋予的值，用于 `decorator.getValue(target)` 取出
 */
export function makeClassDecorator<T>(value: T) {
  const VALUE = Symbol('makeClassDecorator#value');

  /**
   * 类装饰器
   * @param target 目标类
   */
  function decorator(target: any) {
    Reflect.defineMetadata(VALUE, value, target);
  }

  /**
   * 取出目标类装饰完成的值
   * @param target 目标类
   */
  decorator.getValue = function (target: any) {
    return Reflect.getMetadata(VALUE, target) as T;
  }

  return decorator;
}
