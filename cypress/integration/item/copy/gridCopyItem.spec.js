import { ITEM_LAYOUT_MODES, ROOT_ID } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const copyItem = (id, toItemId) => {
  const menuSelector = `#${buildItemCard(id)} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemId);
};

describe('Copy Item in Grid', () => {
  it('copy item on Home', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS[0];
    const { id: toItem } = SAMPLE_ITEMS[1];
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInGrid(toItem);
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: copyItemId } = SAMPLE_ITEMS[2];
    const { id: toItem } = SAMPLE_ITEMS[3];
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInGrid(toItem);
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi({ items: SAMPLE_ITEMS });
    const { id } = SAMPLE_ITEMS[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: copyItemId } = SAMPLE_ITEMS[2];
    const toItem = ROOT_ID;
    copyItem(copyItemId, toItem);

    cy.wait('@copyItem').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToHome();
      cy.get(`#${buildItemCard(body.id)}`).should('exist');
    });
  });

  describe('Errors handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ items: SAMPLE_ITEMS, copyItemError: true });
      const { id } = SAMPLE_ITEMS[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // move
      const { id: copyItemId } = SAMPLE_ITEMS[2];
      const { id: toItem } = SAMPLE_ITEMS[0];
      copyItem(copyItemId, toItem);

      cy.wait('@copyItem').then(({ response: { body } }) => {
        // check item is still existing in parent
        cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
        cy.get(`#${buildItemCard(body.id)}`).should('not.exist');
      });
    });
  });
});
