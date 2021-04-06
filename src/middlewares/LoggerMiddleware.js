const LoggerMiddleware = () => (next) => (action) => {
  const result = next(action);
  const { payload, type } = result;

  if (payload?.error) {
    console.error(`${type}: ${payload?.error}`);
  }

  return result;
};

export default LoggerMiddleware;
