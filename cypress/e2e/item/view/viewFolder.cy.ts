import {
  GuestFactory,
  ItemLoginSchemaFactory,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { SortingOptionsForFolder } from '../../../../src/components/table/types';
import i18n from '../../../../src/config/i18n';
import { buildItemPath } from '../../../../src/config/paths';
import {
  CREATE_ITEM_BUTTON_ID,
  ITEM_HEADER_ID,
  ITEM_MENU_BOOKMARK_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  ITEM_SEARCH_INPUT_ID,
  NAVIGATION_HOME_ID,
  SORTING_ORDERING_SELECTOR_ASC,
  SORTING_ORDERING_SELECTOR_DESC,
  SORTING_SELECT_SELECTOR,
  buildItemCard,
  buildItemsTableId,
  buildMapViewId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { CURRENT_USER } from '../../../fixtures/members';
import { expectFolderViewScreenLayout } from '../../../support/viewUtils';

const parentItem = PackedFolderItemFactory();
const item1 = PackedFolderItemFactory();

const child1 = PackedFolderItemFactory({ parentItem });
const child2 = PackedFolderItemFactory({ parentItem });
const child3 = PackedFolderItemFactory({ parentItem });
const child4 = PackedFolderItemFactory({ parentItem });
const children = [child1, child2, child3, child4];

const items = [parentItem, item1, ...children];

it('View folder as guest', () => {
  const item = PackedFolderItemFactory(
    {},
    { permission: PermissionLevel.Read },
  );
  const guest = GuestFactory({
    itemLoginSchema: ItemLoginSchemaFactory({
      item,
    }),
  });
  cy.setUpApi({
    items: [item],
    currentMember: guest,
  });
  cy.visit(buildItemPath(item.id));

  // no add button
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');

  // menu item only contains flag
  cy.get(`#${ITEM_HEADER_ID} [data-testid="MoreVertIcon"]`).click();
  cy.get(`.${ITEM_MENU_FLAG_BUTTON_CLASS}`).should('be.visible');
  cy.get(`.${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).should('not.exist');
});

it('View folder as reader', () => {
  const item = PackedFolderItemFactory(
    {},
    { permission: PermissionLevel.Read },
  );
  cy.setUpApi({
    items: [item],
  });
  cy.visit(buildItemPath(item.id));

  // no add button
  cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('not.exist');

  // menu item contains flag, duplicate, shortcut, bookmark
  cy.get(`#${ITEM_HEADER_ID} [data-testid="MoreVertIcon"]`).click();
  cy.get(`.${ITEM_MENU_FLAG_BUTTON_CLASS}`).should('be.visible');
  cy.get(`.${ITEM_MENU_SHORTCUT_BUTTON_CLASS}`).should('be.visible');
  cy.get(`.${ITEM_MENU_BOOKMARK_BUTTON_CLASS}`).should('be.visible');
});

describe('View Folder', () => {
  beforeEach(() => {
    cy.setUpApi({
      items,
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang as string);
  });

  it('View folder on map by default', () => {
    cy.setUpApi({
      items,
    });

    const { id } = parentItem;
    cy.visit(buildItemPath(id, { mode: ItemLayoutMode.Map }));

    cy.get(`#${buildMapViewId(id)}`, { timeout: 10000 }).should('be.visible');
  });
  it('View empty folder', () => {
    cy.setUpApi({
      items: [parentItem],
    });

    const { id } = parentItem;
    cy.visit(buildItemPath(id));

    cy.get(`[role="dropzone"]`).should('be.visible');
    cy.get(`#${CREATE_ITEM_BUTTON_ID}`).should('be.visible');
  });

  it('visit item by id', () => {
    const { id } = parentItem;
    cy.visit(buildItemPath(id, { mode: ItemLayoutMode.Grid }));

    // should get current item
    cy.wait('@getItem');

    // should get children
    cy.wait('@getChildren').then(() => {
      // check all children are created and displayed
      for (const item of children) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });
    expectFolderViewScreenLayout({ item: parentItem });

    // visit home
    cy.get(`#${NAVIGATION_HOME_ID}`).click();

    // should get accessible items
    cy.wait('@getAccessibleItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body.data) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });
  });

  it('search', () => {
    const { id } = parentItem;
    const searchText = child1.name;
    cy.visit(buildItemPath(id, { mode: ItemLayoutMode.Grid }));
    // initial call in the page
    cy.wait(['@getChildren', '@getChildren']);

    cy.get(`#${buildItemCard(child1.id)}`).should('be.visible');

    cy.get(`#${ITEM_SEARCH_INPUT_ID}`).type(searchText);

    cy.wait('@getChildren').then(({ request: { query } }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(
        (query.keywords as unknown as string[]).every((k) =>
          searchText.includes(k),
        ),
      ).to.be.true;
    });

    cy.get(`#${buildItemCard(child1.id)}`).should('be.visible');
  });

  it('Sorting & Ordering', () => {
    const { id } = parentItem;
    cy.visit(buildItemPath(id));

    cy.get(`${SORTING_SELECT_SELECTOR} input`).should(
      'have.value',
      SortingOptionsForFolder.Order,
    );
    cy.get(SORTING_ORDERING_SELECTOR_ASC).should('be.visible');

    cy.get(SORTING_SELECT_SELECTOR).click();
    cy.get('li[data-value="item.name"]').click();

    // check items are ordered by name
    cy.get(`#${buildItemsTableId(parentItem.id)} h5`).then(($e) => {
      children.sort((a, b) => (a.name > b.name ? 1 : -1));
      for (let idx = 0; idx < children.length; idx += 1) {
        expect($e[idx].innerText).to.eq(children[idx].name);
      }
    });

    // change ordering
    cy.get(SORTING_ORDERING_SELECTOR_ASC).click();
    cy.get(SORTING_ORDERING_SELECTOR_DESC).should('be.visible');
    cy.get(`#${buildItemsTableId(parentItem.id)} h5`).then(($e) => {
      children.reverse();
      for (let idx = 0; idx < children.length; idx += 1) {
        expect($e[idx].innerText).to.eq(children[idx].name);
      }
    });
  });
});

describe('Folder Layout mode', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [parentItem, child1],
    });
    cy.visit(buildItemPath(parentItem.id));
  });

  it('list', () => {
    // default mode is list
    cy.get(`#${buildItemCard(child1.id)}`);

    // go to map
    cy.switchMode(ItemLayoutMode.Map);

    // go to list
    cy.switchMode(ItemLayoutMode.List);
    cy.get(`#${buildItemCard(child1.id)}`);
  });

  it('grid', () => {
    cy.switchMode(ItemLayoutMode.Grid);
    cy.get(`#${buildItemCard(child1.id)}`);
  });

  it('map', () => {
    cy.switchMode(ItemLayoutMode.Map);
    cy.get(`#${buildMapViewId(parentItem.id)}`, { timeout: 10000 }).should(
      'be.visible',
    );
  });
});

it('visit Home on map by default', () => {
  cy.setUpApi({
    items: [parentItem, child1],
  });
  // access map directly
  cy.visit(buildItemPath(parentItem.id, { mode: ItemLayoutMode.Map }));

  cy.get(`#${buildMapViewId(parentItem.id)}`, { timeout: 10000 }).should(
    'be.visible',
  );
});
