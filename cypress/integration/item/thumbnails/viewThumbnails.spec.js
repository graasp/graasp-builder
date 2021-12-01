import { DEFAULT_IMAGE_SRC } from '../../../../src/config/constants';
import { HOME_PATH, SHARED_ITEMS_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildNameCellRendererId,
  ITEM_CARD_MEDIA_CLASSNAME,
  HEADER_USER_ID,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { MEMBERS } from '../../../fixtures/members';
import { SAMPLE_ITEMS_WITH_THUMBNAILS } from '../../../fixtures/thumbnails';

describe('View Thumbnails', () => {
  beforeEach(() => {});

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
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    cy.get(`#${buildItemCard(items[0].id)} img`)
      .should('have.attr', 'src')
      .and('contain', DEFAULT_IMAGE_SRC);

    cy.get(`#${buildItemCard(items[1].id)} img`)
      .should('have.attr', 'src')
      .and('contain', 'blob:');
  });

  it(`display member avatar`, () => {
    cy.setUpApi({
      ...SAMPLE_ITEMS_WITH_THUMBNAILS,
      currentMember: MEMBERS.BOB,
    });

    cy.visit(HOME_PATH);

    const { items } = SAMPLE_ITEMS_WITH_THUMBNAILS;

    // display member avatar in header
    cy.get(`#${HEADER_USER_ID} img`)
      .should('have.attr', 'src')
      .and('contain', 'blob:');

    cy.visit(SHARED_ITEMS_PATH);

    // check bob avatar in shared items, grid mode
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);
    cy.get(`#${buildItemCard(items[2].id)} img`)
      .should('have.attr', 'src')
      .and('contain', 'blob:');
  });
});
