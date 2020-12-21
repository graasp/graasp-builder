// use simple id format for tests
export const ID_FORMAT = '[a-z0-9-]*';

export const ERROR_CODE = 400;

export const generateUuidId = () => `a-${Math.ceil(Math.random() * 100000)}`;
