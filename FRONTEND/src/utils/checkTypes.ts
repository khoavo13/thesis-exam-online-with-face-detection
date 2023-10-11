export const isObject = <T>(arg: T): boolean => {
  return typeof arg === "object" && !Array.isArray(arg) && arg !== null;
};

interface BoolCheck<T> {
  value: T;
  is: boolean;
}

export const isTrue = <T>(arg: T): BoolCheck<T> => {
  if (Array.isArray(arg) && !arg.length) {
    return { value: arg, is: false };
  }
  if (isObject(arg) && !Object.keys(arg as keyof T).length) {
    return { value: arg, is: false };
  }
  return { value: arg, is: !!arg };
};

export const getObjsProperty = <T, K extends keyof T>(
  objs: T[],
  key: K
): T[K][] => {
  return objs.map((obj) => obj[key]);
};
