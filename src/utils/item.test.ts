import {
  DiscriminatedItem,
  ItemMembership,
  MemberFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { describe, expect, it } from 'vitest';

import {
  getHighestPermissionForMemberFromMemberships,
  getParentsIdsFromPath,
  isUrlValid,
} from './item';

describe('item utils', () => {
  it('isUrlValid', () => {
    expect(isUrlValid(null)).toBeFalsy();
    expect(isUrlValid()).toBeFalsy();
    expect(isUrlValid('somelink')).toBeFalsy();
    expect(isUrlValid('graasp.eu')).toBeTruthy();
    expect(isUrlValid('https://graasp')).toBeFalsy();

    expect(isUrlValid('https://graasp.eu')).toBeTruthy();
    expect(isUrlValid('http://graasp.eu')).toBeTruthy();
    expect(isUrlValid('https://www.youtube.com/')).toBeTruthy();
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(getParentsIdsFromPath(null)).toEqual([]);
      expect(getParentsIdsFromPath()).toEqual([]);
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(getParentsIdsFromPath(null, { ignoreSelf: true })).toEqual([]);
      expect(getParentsIdsFromPath(undefined, { ignoreSelf: true })).toEqual(
        [],
      );
    });
  });

  describe('getHighestPermission', () => {
    it('returns null when no memberId', () => {
      expect(
        getHighestPermissionForMemberFromMemberships({
          memberId: undefined,
          itemPath: '1234',
        }),
      ).toEqual(null);
    });

    it('returns null when no memberships', () => {
      expect(
        getHighestPermissionForMemberFromMemberships({
          memberId: '1234',
          itemPath: '1234',
          memberships: undefined,
        }),
      ).toEqual(null);
      expect(
        getHighestPermissionForMemberFromMemberships({
          memberId: '1234',
          itemPath: '1234',
          memberships: [],
        }),
      ).toEqual(null);
    });

    it('returns closest permission when only one permission', () => {
      const account = MemberFactory({
        id: '1234',
        name: 'bob',
        email: 'bob@graasp.org',
      });
      const item = { path: '1234' } as DiscriminatedItem;
      const membership = {
        id: 'membership-123',
        account,
        item,
        permission: PermissionLevel.Read,
        creator: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      expect(
        getHighestPermissionForMemberFromMemberships({
          memberId: account.id,
          itemPath: item.path,
          memberships: [membership],
        }),
      ).toEqual(membership);
    });

    it('returns closest permission when multiple permissions', () => {
      const account = MemberFactory({
        id: '1234',
        name: 'bob',
        email: 'bob@graasp.org',
      });
      const item1 = { path: '1234' } as DiscriminatedItem;
      const item2 = { path: '1234.5678' } as DiscriminatedItem;
      const membership1: ItemMembership = {
        id: 'membership-123',
        account,
        item: item1,
        permission: PermissionLevel.Read,
        creator: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const membership2: ItemMembership = {
        id: 'membership-123',
        account,
        item: item2,
        permission: PermissionLevel.Read,
        creator: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      expect(
        getHighestPermissionForMemberFromMemberships({
          memberId: account.id,
          itemPath: item2.path,
          memberships: [membership1, membership2],
        }),
      ).toEqual(membership2);
    });
  });
});
