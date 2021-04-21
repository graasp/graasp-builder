import { getParentsIdsFromPath, isUrlValid, transformIdForPath } from './item';

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

  it('transformIdForPath', () => {
    expect(transformIdForPath('someid')).toEqual('someid');
    expect(transformIdForPath('some-id')).toEqual('some_id');
    const id = 'ecafbd2a-5688-11eb-ae93-0242ac130002';
    const path = 'ecafbd2a_5688_11eb_ae93_0242ac130002';
    expect(transformIdForPath(id)).toEqual(path);

    expect(() => transformIdForPath(null)).toThrow();
    expect(() => transformIdForPath(undefined)).toThrow();
  });

  describe('getParentsIdsFromPath', () => {
    it('default', () => {
      expect(getParentsIdsFromPath('someid')).toEqual(['someid']);
      expect(getParentsIdsFromPath('parent.child')).toEqual([
        'parent',
        'child',
      ]);
      expect(
        getParentsIdsFromPath(
          'ecafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130001',
        ),
      ).toEqual([
        'ecafbd2a-5688-11eb-ae93-0242ac130002',
        'ecafbd2a-5688-11eb-ae93-0242ac130001',
      ]);
      expect(
        getParentsIdsFromPath(
          'ecafbd2a_5688_11eb_ae93_0242ac130003.ecafbd2a_5688_11eb_ae93_0242ac130004.ecafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130001',
        ),
      ).toEqual([
        'ecafbd2a-5688-11eb-ae93-0242ac130003',
        'ecafbd2a-5688-11eb-ae93-0242ac130004',
        'ecafbd2a-5688-11eb-ae93-0242ac130002',
        'ecafbd2a-5688-11eb-ae93-0242ac130001',
      ]);

      expect(getParentsIdsFromPath(null)).toEqual([]);
      expect(getParentsIdsFromPath(undefined)).toEqual([]);
    });
    it('ignoreSelf = true', () => {
      expect(getParentsIdsFromPath('someid', { ignoreSelf: true })).toEqual([]);
      expect(
        getParentsIdsFromPath('parent.child', { ignoreSelf: true }),
      ).toEqual(['parent']);
      expect(
        getParentsIdsFromPath(
          'ecafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130001',
          { ignoreSelf: true },
        ),
      ).toEqual(['ecafbd2a-5688-11eb-ae93-0242ac130002']);
      expect(
        getParentsIdsFromPath(
          'ecafbd2a_5688_11eb_ae93_0242ac130003.ecafbd2a_5688_11eb_ae93_0242ac130004.ecafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130001',
          { ignoreSelf: true },
        ),
      ).toEqual([
        'ecafbd2a-5688-11eb-ae93-0242ac130003',
        'ecafbd2a-5688-11eb-ae93-0242ac130004',
        'ecafbd2a-5688-11eb-ae93-0242ac130002',
      ]);

      expect(getParentsIdsFromPath(null, { ignoreSelf: true })).toEqual([]);
      expect(getParentsIdsFromPath(undefined, { ignoreSelf: true })).toEqual(
        [],
      );
    });
  });
});
