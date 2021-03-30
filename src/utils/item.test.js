import { isUrlValid } from './item';

describe('item utils', () => {
  it('isUrlValid', () => {
    expect(isUrlValid(null)).toBeFalsy();
    expect(isUrlValid(undefined)).toBeFalsy();
    expect(isUrlValid('somelink')).toBeFalsy();
    expect(isUrlValid('graasp.eu')).toBeFalsy();
    expect(isUrlValid('https://graasp')).toBeFalsy();

    expect(isUrlValid('https://graasp.eu')).toBeTruthy();
    expect(isUrlValid('http://graasp.eu')).toBeTruthy();
    expect(isUrlValid('https://www.youtube.com/')).toBeTruthy();
  });
});
