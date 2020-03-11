export function memoize<TFunction extends (arg: any) => any>(originalFunction: TFunction): TFunction {
  // TODO: WeakMap.
  const results = new Map<any, any>();

  return function memoizedFunction(arg: any) {
    if (!results.has(arg)) {
      results.set(arg, originalFunction(arg));
    }
    return results.get(arg)!;
  } as TFunction;
}
