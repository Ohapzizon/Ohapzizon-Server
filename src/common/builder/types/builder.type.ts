type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends () => void ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type IBuilder<T> = {
  [k in keyof NonFunctionProperties<T> as `set${Capitalize<string & k>}`]: (
    arg: T[k],
  ) => IBuilder<T>;
};
