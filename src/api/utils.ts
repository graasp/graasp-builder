// TODO: remove this file whenever possible

export const DEFAULT_GET = {
  credentials: 'include',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

export const DEFAULT_POST = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

export const DEFAULT_DELETE = {
  method: 'DELETE',
  credentials: 'include',
};

export const DEFAULT_PATCH = {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export const DEFAULT_PUT = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const failOnError = (res: any): any => {
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res;
};
