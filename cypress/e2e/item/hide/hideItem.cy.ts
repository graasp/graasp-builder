import {
  ItemTagType,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  HIDDEN_ITEM_BUTTON_CLASS,
  buildHideButtonId,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { MEMBERS } from '../../../fixtures/members';
import { ItemForTest } from '../../../support/types';

const hiddenItem = PackedFolderItemFactory(
  {},
  { hiddenTag: { type: ItemTagType.Hidden } },
);
const HIDDEN_ITEM: ItemForTest = {
  ...hiddenItem,
  memberships: [
    {
      item: hiddenItem,
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
    {
      item: hiddenItem,
      permission: PermissionLevel.Read,
      member: MEMBERS.BOB,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
  ],
};

const CHILD_HIDDEN_ITEM = PackedFolderItemFactory({ parentItem: HIDDEN_ITEM });

const ITEM = PackedFolderItemFactory(
  {},
  {
    permission: PermissionLevel.Admin,
  },
);

const toggleHideButton = (itemId: string, isHidden = false) => {
  // todo: remove on table refactor
  cy.wait(500);
  const menuSelector = `#${buildItemMenuButtonId(itemId)}`;
  cy.get(menuSelector).click();

  cy.get(`#${buildItemMenu(itemId)} .${HIDDEN_ITEM_BUTTON_CLASS}`)
    .should('have.attr', 'data-cy', buildHideButtonId(isHidden))
    .click();
};

describe('Hiding Item', () => {
  describe('Successfully hide item in List', () => {
    beforeEach(() => {
      cy.setUpApi({ items: [ITEM, HIDDEN_ITEM, CHILD_HIDDEN_ITEM] });
    });

    it('Hide an item', () => {
      cy.visit(HOME_PATH);

      toggleHideButton(ITEM.id, false);

      cy.wait(`@postItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(ITEM.id);
        },
      );
    });

    it('Show an item', () => {
      cy.visit(HOME_PATH);
      const item = HIDDEN_ITEM;

      // make sure to wait for the tags to be fetched
      toggleHideButton(item.id, true);

      cy.wait(`@deleteItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(item.id);
        },
      );
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        expect(classList.some((c) => c.includes('disabled'))).to.be.true;
      });
    });
  });

  describe('Successfully hide item in Grid', () => {
    beforeEach(() => {
      cy.setUpApi({ items: [ITEM, HIDDEN_ITEM, CHILD_HIDDEN_ITEM] });
    });

    it('Hide an item', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);
      const item = ITEM;

      toggleHideButton(item.id, false);

      cy.wait(`@postItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(ItemTagType.Hidden);
          expect(url).to.contain(item.id);
        },
      );
    });

    it('Show an Item', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ItemLayoutMode.Grid);
      const item = HIDDEN_ITEM;

      toggleHideButton(item.id, true);

      cy.wait(`@deleteItemTag-${ItemTagType.Hidden}`).then(
        ({ request: { url } }) => {
          expect(url).to.contain(item.id);
          expect(url).to.contain(ItemTagType.Hidden);
        },
      );
    });

    it('Cannot hide child of hidden item', () => {
      cy.visit(buildItemPath(HIDDEN_ITEM.id));
      cy.switchMode(ItemLayoutMode.Grid);

      cy.get(`#${buildItemMenuButtonId(CHILD_HIDDEN_ITEM.id)}`).click();
      cy.get(
        `#${buildItemMenu(CHILD_HIDDEN_ITEM.id)} .${HIDDEN_ITEM_BUTTON_CLASS}`,
      ).should(($menuItem) => {
        const classList = Array.from($menuItem[0].classList);
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        expect(classList.some((c) => c.includes('disabled'))).to.be.true;
      });
    });
  });
});
