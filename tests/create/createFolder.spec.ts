
import { test, expect } from '@playwright/test';
import { HOME_PATH, buildItemPath } from '../../src/config/paths';
import { createFolder } from './utils';
import { setUpApi } from '../config/support/server';
import { CREATED_ITEM, SAMPLE_ITEMS } from '../config/fixtures/items';

test.describe('Create Folder', () => {
  test.describe('List', () => {
    test('create folder on Home', async ({ browser }) => {
      const { page } = await setUpApi(browser);
      await page.goto(HOME_PATH);

      // switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      await createFolder(page, CREATED_ITEM);

      await expect(await page.getByText(CREATED_ITEM.name!)).toBeTruthy()

    });

    test('create folder in item', async ({ browser }) => {
      const { page } = await setUpApi(browser, SAMPLE_ITEMS);
      await page.goto(buildItemPath(SAMPLE_ITEMS.items?.[0]?.id));

      // switchMode(ITEM_LAYOUT_MODES.LIST);

      // create
      await createFolder(page, CREATED_ITEM);

      await expect(await page.getByText(CREATED_ITEM.name!)).toBeTruthy()
    });
  });

  // test.describe('Grid', () => {
  //   test('create folder on Home', () => {
  //     cy.setUpApi();
  //     cy.visit(HOME_PATH);
  //     cy.switchMode(ITEM_LAYOUT_MODES.GRID);

  //     // create
  //     createFolder(CREATED_ITEM,);

  //     cy.wait('@postItem').then(() => {
  //       // check item is created and displayed
  //       cy.wait(CREATE_ITEM_PAUSE);
  //       // expect update
  //       cy.wait('@getOwnItems');
  //     });
  //   });

  //   test('create folder in item', () => {
  //     cy.setUpApi(SAMPLE_ITEMS);
  //     const { id } = SAMPLE_ITEMS.items[0];

  //     // go to children item
  //     cy.visit(buildItemPath(id));
  //     cy.switchMode(ITEM_LAYOUT_MODES.GRID);

  //     // create
  //     createFolder(CREATED_ITEM,);

  //     cy.wait('@postItem').then(() => {
  //       // expect update
  //       cy.wait('@getItem').its('response.url').should('contain', id);
  //     });
  //   });
  // });

  // test.describe('Error handling', () => {
  //   test('error while creating folder does not create in interface', () => {
  //     cy.setUpApi({ ...SAMPLE_ITEMS, postItemError: true });
  //     const { id } = SAMPLE_ITEMS.items[0];

  //     // go to children item
  //     cy.visit(buildItemPath(id));

  //     cy.switchMode(ITEM_LAYOUT_MODES.LIST);

  //     // create
  //     createFolder(CREATED_ITEM,);

  //     cy.wait('@postItem').then(({ response: { body } }) => {
  //       // check item is created and displayed
  //       page.locator(buildItemsTableRowIdAttribute(body.id)).should('not.exist');
  //     });
  //   });
  // });
});
