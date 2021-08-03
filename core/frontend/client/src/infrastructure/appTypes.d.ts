type ValueOf<T> = T[keyof T];

type Constructor<T> = {
  prototype: T;
  new (...params: unknown[]): T;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>;
};

export type Reducer<State, Action, Key extends keyof State> = (
  state: State[Key] | undefined,
  action: Action,
) => State[Key];
