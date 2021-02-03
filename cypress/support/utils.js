// use simple id format for tests
export const ID_FORMAT = '[a-z0-9-]*';

export const parseStringToRegExp = (string) => string.replaceAll('?', '\\?');

export const EMAIL_FORMAT = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+';
