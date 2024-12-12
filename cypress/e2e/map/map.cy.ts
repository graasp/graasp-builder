// /map is used by the mobile application to display the map and have access to its feature
import { MAP_ITEMS_PATH } from '@/config/paths';
import {
  CREATE_ITEM_FOLDER_ID,
  FOLDER_FORM_DESCRIPTION_ID,
  buildMapViewId,
} from '@/config/selectors';

describe('Map', () => {
  it('open create folder modal on Home', () => {
    cy.setUpApi();
    cy.visit(`${MAP_ITEMS_PATH}?enableGeolocation=false`);

    // home id
    cy.get(`#${buildMapViewId(undefined)}`).should('be.visible');

    // select a country
    cy.get(`#${buildMapViewId(undefined)} input`).click();
    cy.get(`#${buildMapViewId(undefined)} [role="presentation"]`).click();

    // open location button
    cy.get(`#${buildMapViewId(undefined)}`).click();
    cy.get(`#${buildMapViewId(undefined)} img[role="button"]`).click();
    cy.get(`[data-testid="AddLocationAltIcon"]`).click();

    // open folder form
    cy.get(`#${CREATE_ITEM_FOLDER_ID}`).click();
    cy.get(`#${FOLDER_FORM_DESCRIPTION_ID}`).should('be.visible');
  });
});
