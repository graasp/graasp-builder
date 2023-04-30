import { FolderItemExtra, Item, ItemSettings, ItemType, Member, MemberType, PermissionLevel } from '@graasp/sdk';
import { test, expect } from '@playwright/test';
import { buildDatabase } from '../src/server';

const MEMBERS: Record<string, any> = {
  ANNA: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130002',
    name: 'anna',
    type: MemberType.Individual,
    email: 'anna@email.com',
    createdAt: new Date('2021-04-13 14:56:34.749946'),
    updatedAt: new Date('2021-04-13 14:56:34.749946'),
    extra: {
      lang: 'fr',
      emailFreq: 'never',
      enableSaveActions: false,
    },
  }
}

const DEFAULT_FOLDER_ITEM: {
  extra: FolderItemExtra,
  type: ItemType.FOLDER,
  creator: Member,
  createdAt: Date,
  updatedAt: Date,
  description: string
  settings: ItemSettings
} = {
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
  creator: MEMBERS.ANNA,
  type: ItemType.FOLDER,
  createdAt: new Date('2020-01-01T01:01:01Z'),
  updatedAt: new Date('2020-01-02T01:01:01Z'),
  description: 'mydescription',
  settings: {}
};

const sampleItems: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'item login with username',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'no item login',
  path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
}, {

  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
  name: 'child of item login with username',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',

}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
  name: 'item login with username and password',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
}, {

  ...DEFAULT_FOLDER_ITEM,
  id: 'ega2bd2a-5688-11eb-ae93-0242ac130002',
  name: 'item login with username and password',
  path: 'egafbd2a_5688_11eb_ae93_0242ac130002',
},
{
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
  name: 'child of item login with username and password',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004.bdf09f5a_5688_11eb_ae93_0242ac130004',

}

]

const memberships = [
  {
    id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
    item: sampleItems[0],
    permission: PermissionLevel.Admin,
    member: MEMBERS.ANNA,
    creator: MEMBERS.ANNA,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
    item: sampleItems[0],
    permission: PermissionLevel.Write,
    member: MEMBERS.BOB,
    creator: MEMBERS.ANNA,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
    item: sampleItems[0],
    permission: PermissionLevel.Write,
    member: MEMBERS.CEDRIC,
    updatedAt: new Date(),
    createdAt: new Date(),
    creator: MEMBERS.ANNA,
  },
  {
    id: 'ecbfbd2a-5688-11eb-be93-0242ac130002',
    item: sampleItems[0],
    permission: PermissionLevel.Read,
    member: MEMBERS.DAVID,
    creator: MEMBERS.ANNA,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
]

test('has title', async ({ browser }) => {

  const context = await browser.newContext();
  await context.addCookies([{ name: 'session', value: 'value', url: 'http://localhost:3111' }]);

  await context.exposeFunction('getDatabase', () => buildDatabase());

  const page = await context.newPage();


  // await context.route('http://localhost:3000/members/current', async route => {
  //   const json = MEMBERS.ANNA
  //   await route.fulfill({ json });
  // });


  // await context.route('http://localhost:3000/items/own', async route => {
  //   const json = sampleItems
  //   await route.fulfill({ json });
  // });



  // await context.route('http://localhost:3000/item-memberships', async route => {
  //   const json = memberships
  //   await route.fulfill({ json });
  // });





  await page.goto('http://localhost:3111');

  await page.waitForTimeout(30000)

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
