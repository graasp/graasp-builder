import { ROOT_ID } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  buildItemMenuButtonId,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const copyItem = ({ id, toItemPath }) => {
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.fillTreeModal(toItemPath);
};

describe('Copy Item in Grid', () => {
  it.only('copy item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[0];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInGrid(toItem);
      cy.get(`#${buildItemCard(body[0].id)}`).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToItemInGrid(toItem);
      cy.get(`#${buildItemCard(body[0].id)}`).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const toItemPath = ROOT_ID;
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ response: { body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');

      // check in new parent
      cy.goToHome();
      cy.get(`#${buildItemCard(body[0].id)}`).should('exist');
    });
  });

  describe('Error handling', () => {
    it('error while copying item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, copyItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // move
      const { id: copyItemId } = SAMPLE_ITEMS.items[2];
      const { path: toItemPath } = SAMPLE_ITEMS.items[0];
      copyItem({ id: copyItemId, toItemPath });

      cy.wait('@copyItems').then(({ response: { body } }) => {
        // check item is still existing in parent
        cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
        cy.get(`#${buildItemCard(body[0].id)}`).should('not.exist');
      });
    });
  });
});
