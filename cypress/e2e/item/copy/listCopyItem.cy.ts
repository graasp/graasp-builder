import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_COPY_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemsTableRowIdAttribute,
} from '../../../../src/config/selectors';
import ITEM_LAYOUT_MODES from '../../../../src/enums/itemLayoutModes';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const copyItem = ({
  id,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  cy.get(`#${buildItemMenuButtonId(id)}`).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

describe('Copy Item in List', () => {
  it('copy item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[0];
    const { path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      expect(url).to.contain(copyItemId);
      expect(body.parentId).to.contain(toItem);
      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    copyItem({ id: copyItemId, toItemPath: MY_GRAASP_ITEM_PATH });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      expect(url).to.contain(copyItemId);

      cy.get(buildItemsTableRowIdAttribute(copyItemId)).should('exist');
    });
  });
});
