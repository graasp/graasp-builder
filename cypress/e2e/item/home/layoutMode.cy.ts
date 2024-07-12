import { HOME_PATH } from '@/config/paths';
import { buildItemCard, buildMapViewId } from '@/config/selectors';
import { ItemLayoutMode } from '@/enums';

import { generateOwnItems } from '../../../fixtures/items';

const ITEMS = generateOwnItems(30);

describe('Home screen', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: ITEMS,
    });
  });

  it('Home screen list layout mode', () => {
    cy.visit(HOME_PATH);

    // default mode is list
    cy.get(`#${buildItemCard(ITEMS[0].id)}`);

    // go to map
    cy.switchMode(ItemLayoutMode.Map);
    cy.get(`#${buildMapViewId()}`, { timeout: 10000 }).should('be.visible');

    // go to list
    cy.switchMode(ItemLayoutMode.List);
    cy.get(`#${buildItemCard(ITEMS[0].id)}`);
  });

  it('Home screen grid layout mode', () => {
    cy.visit(HOME_PATH);

    // go to grid
    cy.switchMode(ItemLayoutMode.Grid);
    cy.get(`#${buildItemCard(ITEMS[0].id)}`);
  });

  it('Home screen map layout mode', () => {
    cy.visit(HOME_PATH);

    // go to map
    cy.switchMode(ItemLayoutMode.Map);
    cy.get(`#${buildMapViewId()}`, { timeout: 10000 }).should('be.visible');
  });

  it('visit Home on map by default', () => {
    // access map directly
    cy.visit(`${HOME_PATH}?mode=map`);

    cy.get(`#${buildMapViewId()}`, { timeout: 10000 }).should('be.visible');
  });
});
