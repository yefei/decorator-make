import 'reflect-metadata';

function targetName(target: Object | Function) {
  if (typeof target === 'object') return target.constructor.name;
  if (typeof target === 'function') return target.name;
}

export type PropertyDecoratorCallback<T> = (type: Object, target: Object, propertyKey: string | symbol) => T;

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
 *   \@deco.decorate prop: Type;
 * }
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {
 * }
 * deco.decorate(Target.prototype, 'prop', Type);
 * ```
 * 
 * #### 取得目标对象中被装饰的属性
 * ```js
 * deco.getTypes(Target.prototype);
 * ```
 */
export function makePropertyDecorator<T = any>() {
  const TYPES = Symbol('makePropertyDecorator#types');

  /**
   * 包裹器，用于装饰器自定义处理
   * 
   * @param cb 回调处理函数
   * @returns 装饰器
   */
  function wrap(cb?: PropertyDecoratorCallback<T>) {
    /**
     * 属性装饰器
     *
     * @param target 目标对象
     * @param propertyKey 目标对象中的属性名
     * @param type 属性类型，在不使用 Decorators 特性时需要指定
     */
    function decorate(target: Object, propertyKey: string | symbol, type?: Object) {
      if (!type) {
        type = Reflect.getOwnMetadata('design:type', target, propertyKey);
      }
      if (!type) {
        throw new Error(`Missing propertie type: ${targetName(target)}::${String(propertyKey)}`);
      }
      // 将父类的装饰属性描述复制到子类中，不能修改父类的装饰属性
      const types = Object.assign(
        {},
        getTypes(target),
        { [propertyKey]: cb ? cb(type, target, propertyKey) : type },
      );
      Reflect.defineMetadata(TYPES, types, target);
    }
    return decorate;
  }

  /**
   * 取得目标对象的所有已被装饰的属性类型
   * @param target 目标对象
   */
  function getTypes(target: Object): { [propertyKey: string | symbol]: T } | undefined {
    return Reflect.getMetadata(TYPES, target);
  }

  return {
    wrap,
    decorate: wrap(),
    getTypes,
  };
}

export type MethodHandle = (...args: any[]) => any;

export interface MethodDescriptor {
  handle: MethodHandle;
  params: any[];
}

export type MethodDecoratorCallback<T> = (
  descriptor: MethodDescriptor, target: any, propertyKey: string | symbol) => T;

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
 *   @deco.decorate someFunc(type?: Type, ...) {}
 * }
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {
 *   someFunc(type, ...) {}
 * }
 * deco.decorate(Target.prototype, 'someFunc', [Type, ...]);
 * ```
 * 
 * #### 取得目标对象中被装饰的方法列表
 * ```js
 * deco.getMethods(Target);
 * ```
 * 
 * @param cb 装饰处理回调
 */
export function makeMethodDecorator<T = MethodDescriptor>() {
  const METHODS = Symbol('makeMethodDecorator#methods');

  /**
   * 包裹器，用于装饰器自定义处理
   * 
   * @param cb 回调处理函数
   * @returns 装饰器
   */
  function wrap(cb?: MethodDecoratorCallback<T>) {
    /**
     * 方法装饰器
     * 
     * @param target 目标对象
     * @param propertyKey 目标对象中方法名
     * @param descriptor_or_paramtypes 目标对象中方法描述 | 或不使用 experimentalDecorators 特性时需要被注入方法参数列表
     */
    function decorate(target: Object, propertyKey: string | symbol, descriptor_or_paramtypes?: PropertyDescriptor | any[]) {
      let handle: MethodHandle;
      let params: any[];
      // 兼容 js 调用
      if (!descriptor_or_paramtypes || Array.isArray(descriptor_or_paramtypes)) {
        handle = (<any>target)[propertyKey];
        params = descriptor_or_paramtypes || [];
      // ts 调用
      } else {
        handle = descriptor_or_paramtypes.value;
        params = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey) || [];
      }

      const methodDescriptor = { handle, params };
      const methods = [
        ...getMethods(target),
        cb ? cb(methodDescriptor, target, propertyKey) : methodDescriptor,
      ];
      Reflect.defineMetadata(METHODS, methods, target);
    }

    return decorate;
  }

  /**
   * 取得目标对象的所有已被装饰方法
   * @param target 目标对象
   */
  function getMethods(target: Object): T[] {
    return Reflect.getMetadata(METHODS, target) || [];
  }

  return {
    wrap,
    decorate: wrap(),
    getMethods,
  };
}

export type ClassDecoratorCallback<T> = (target: any) => T;

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
 * @deco.decorate class Target {}
 * ```
 * 
 * #### 在 JavaScript 中使用方法：
 * ```js
 * class Target {}
 * deco.decorate(Target);
 * ```
 * 
 * #### 取得目标对象中被装饰的值
 * ```js
 * deco.getValue(Target);
 * ```
 * 
 * @param value 装饰完成后赋予的值，用于 `decorator.getValue(target)` 取出
 */
export function makeClassDecorator<T = true>() {
  const VALUE = Symbol('makeClassDecorator#value');

  /**
   * 包裹器，用于装饰器自定义处理
   * 
   * @param cb 回调处理函数
   * @returns 装饰器
   */
  function wrap(cb?: ClassDecoratorCallback<T>) {
    /**
     * 类装饰器
     * @param target 目标类
     */
    function decorate(target: Object) {
      Reflect.defineMetadata(VALUE, cb ? cb(target) : true, target);
    }

    return decorate;
  }

  /**
   * 取出目标类装饰完成的值
   * @param target 目标类
   */
  function getValue(target: Object) {
    return Reflect.getMetadata(VALUE, target) as T | undefined;
  }

  /**
   * 取得目标类构造函数的参数列表
   * @param target 目标类
   * @returns 参数列表
   */
  function getParams(target: Object) {
    return Reflect.getOwnMetadata('design:paramtypes', target) || [];
  }

  return {
    wrap,
    decorate: wrap(),
    getValue,
    getParams,
  };
}
