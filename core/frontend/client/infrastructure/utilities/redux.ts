type ActionCreator<T extends string, C extends (...args: never[]) => any> = {
  (...args: Parameters<C>): ReturnType<C> & {
    type: T;
  };
  type: T;
};

export const withPayload = <P>() => (payload: P) => ({ payload });

export const withoutPayload = () => ({});

export const action = <T extends string, C extends (...args: never[]) => any>(
  type: T,
  creator: C,
): ActionCreator<T, C> => {
  const typedCreator = (
    ...args: Parameters<C>
  ): ReturnType<C> & {
    type: T;
  } => ({
    ...creator(...args),
    type,
  });

  typedCreator.type = type;

  return typedCreator;
};
