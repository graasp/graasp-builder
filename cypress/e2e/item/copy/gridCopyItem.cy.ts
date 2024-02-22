import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_COPY_BUTTON_CLASS,
  MY_GRAASP_ITEM_PATH,
  buildItemCard,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
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
  const menuSelector = `#${buildItemMenuButtonId(id)}`;
  cy.get(menuSelector).click();
  cy.get(`#${buildItemMenu(id)} .${ITEM_MENU_COPY_BUTTON_CLASS}`).click();
  cy.handleTreeMenu(toItemPath, rootId);
};

describe('Copy Item in Grid', () => {
  it('copy item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ItemLayoutMode.Grid);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[0];
    const { path: toItemPath } = SAMPLE_ITEMS.items[1];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
      expect(url).to.contain(copyItemId);
    });
  });

  it('copy item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.Grid);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const { id: toItemId, path: toItemPath } = SAMPLE_ITEMS.items[3];
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url, body } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
      expect(url).to.contain(copyItemId);
      expect(body.parentId).to.equal(toItemId);
    });
  });

  it('copy item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ItemLayoutMode.Grid);

    // copy
    const { id: copyItemId } = SAMPLE_ITEMS.items[2];
    const toItemPath = MY_GRAASP_ITEM_PATH;
    copyItem({ id: copyItemId, toItemPath });

    cy.wait('@copyItems').then(({ request: { url } }) => {
      cy.get(`#${buildItemCard(copyItemId)}`).should('exist');
      expect(url).to.contain(copyItemId);
    });
  });
});
