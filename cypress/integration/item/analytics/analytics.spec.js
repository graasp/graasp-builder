import { buildItemPath } from '../../../../src/config/paths';
import {
  buildDashboardButtonId,
  buildGraaspAnalyzerId,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const openAnalyticsDashboard = (itemId) => {
  cy.get(`#${buildDashboardButtonId(itemId)}`).click();
};

describe('Analytics Scenarios', () => {
  it('Send messages in chatbox', () => {
    const { id } = SAMPLE_ITEMS.items[0];
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(buildItemPath(id));

    // open dashboard
    openAnalyticsDashboard(id);
    cy.get(`#${buildGraaspAnalyzerId(id)}`)
      .should('be.visible')
      .then((el) => {
        expect(el.attr('src')).to.contain(id);
      });
  });
});
