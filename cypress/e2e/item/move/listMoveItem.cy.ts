import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
  buildItemRowArrowId,
  buildNavigationModalItemId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const openMoveModal = ({ id: movedItemId }: { id: string }) => {
  cy.get(`#${buildItemMenuButtonId(movedItemId)}`).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();
};

const moveItem = ({
  id: movedItemId,
  toItemPath,
  rootId,
}: {
  id: string;
  toItemPath: string;
  rootId?: string;
}) => {
  openMoveModal({ id: movedItemId });

  cy.handleTreeMenu(toItemPath, rootId);
};

describe('Move Item in List', () => {
  it('move item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[0];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { url, body } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('move item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(toItem);
      expect(url).to.contain(movedItem);
    });
  });

  it('cannot move inside self children', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    const { id: movedItemId } = SAMPLE_ITEMS.items[2];
    const parentId = SAMPLE_ITEMS.items[0].id;
    const childId = SAMPLE_ITEMS.items[6].id;
    openMoveModal({ id: movedItemId });
    // parent is disabled
    cy.get(`#${buildNavigationModalItemId(parentId)} button`).should(
      'be.disabled',
    );
    cy.get(`#${buildNavigationModalItemId(parentId)}`).trigger('mouseover');
    cy.get(`#${buildItemRowArrowId(parentId)}`).click();

    // self is disabled
    cy.get(`#${buildNavigationModalItemId(movedItemId)} button`).should(
      'be.disabled',
    );
    cy.get(`#${buildNavigationModalItemId(movedItemId)}`).trigger('mouseover');
    cy.get(`#${buildItemRowArrowId(movedItemId)}`).click();

    // inner child is disabled
    cy.get(`#${buildNavigationModalItemId(childId)} button`).should(
      'be.disabled',
    );
  });

  it('move item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));

    cy.switchMode(ITEM_LAYOUT_MODES.LIST);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    moveItem({ id: movedItem, toItemPath: 'selectionModalMyGraasp' });

    cy.wait('@moveItems').then(({ request: { body, url } }) => {
      expect(body.parentId).to.equal(undefined);
      expect(url).to.contain(movedItem);
    });
  });
});
