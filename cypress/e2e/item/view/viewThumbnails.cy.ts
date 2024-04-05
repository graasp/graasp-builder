import { HOME_PATH } from '../../../../src/config/paths';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  buildItemCard,
  buildNameCellRendererId,
} from '../../../../src/config/selectors';
import { ItemLayoutMode } from '../../../../src/enums';
import { MEMBERS } from '../../../fixtures/members';
import { SAMPLE_ITEMS_WITH_THUMBNAILS } from '../../../fixtures/thumbnails';

describe('View Thumbnails', () => {
  it(`display thumbnail icons`, () => {
    cy.setUpApi(SAMPLE_ITEMS_WITH_THUMBNAILS);

    cy.visit(HOME_PATH);

    const { items } = SAMPLE_ITEMS_WITH_THUMBNAILS;

    // check default material icon
    // first item doesn't have a thumbnail so it displays the material icon
    cy.get(`#${buildNameCellRendererId(items[0].id)} svg path`).should('exist');

    // the second item has a defined thumbnail
    cy.get(`#${buildNameCellRendererId(items[1].id)} img`).should('exist');

    // GRID
    cy.switchMode(ItemLayoutMode.Grid);
    // first element has default folder svg
    cy.get(`#${buildItemCard(items[0].id)} svg path`).should('exist');

    cy.get(`#${buildItemCard(items[1].id)} img`)
      .should('have.attr', 'src')
      .and('contain', items[1].thumbnails);
  });

  it(`display member avatar`, () => {
    cy.setUpApi({
      ...SAMPLE_ITEMS_WITH_THUMBNAILS,
      currentMember: MEMBERS.BOB,
    });

    cy.visit(HOME_PATH);

    // display member avatar in header
    cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID} img`)
      .should('have.attr', 'src')
      .and('contain', MEMBERS.BOB.thumbnails);
  });
});
