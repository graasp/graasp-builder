const LoggerMiddleware = () => (next) => (action) => {
  const result = next(action);
  const { error, type } = result;

  if (error) {
    console.error(`${type}: ${error}`);
  }

  return result;
};

export default LoggerMiddleware;
