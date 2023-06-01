import { buildItemPath } from "../../../../src/config/paths";
import {
  buildPublishButtonId,
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SHARE_ALIKE_CONTROL_ID,
} from "../../../../src/config/selectors";
import { PUBLISHED_ITEMS_WITH_CC_LICENSE } from "../../../fixtures/items";

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item) => {
  cy.setUpApi({ items: [item] });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

const ensureRadioCheckedState = (parentId, shouldBeChecked) =>
  cy.get(`#${parentId}`)
    // MUI doesn't update the `checked` attribute of checkboxes.
    .find('svg[data-testid=RadioButtonCheckedIcon]')
    .should('have.css', 'transform', `matrix(${shouldBeChecked ? '1, 0, 0, 1, 0, 0' : '0, 0, 0, 0, 0, 0'})`);

describe('Creative Commons License', () => {
  it('Current license is selected', () => {
    for (const publishedItem of PUBLISHED_ITEMS_WITH_CC_LICENSE) {
      visitItemPage(publishedItem);

      const requireAttribution = publishedItem.settings.ccLicenseAdaption.includes('BY');
      const noncommercial = publishedItem.settings.ccLicenseAdaption.includes('NC');
      const shareAlike = publishedItem.settings.ccLicenseAdaption.includes('SA');
      const noDerivative = publishedItem.settings.ccLicenseAdaption.includes('ND');

      ensureRadioCheckedState(CC_REQUIRE_ATTRIBUTION_CONTROL_ID, requireAttribution);
      ensureRadioCheckedState(CC_CC0_CONTROL_ID, !requireAttribution);

      if (requireAttribution) {
        ensureRadioCheckedState(CC_ALLOW_COMMERCIAL_CONTROL_ID, !noncommercial);
        ensureRadioCheckedState(CC_DISALLOW_COMMERCIAL_CONTROL_ID, noncommercial);

        ensureRadioCheckedState(CC_NO_DERIVATIVE_CONTROL_ID, noDerivative);
        ensureRadioCheckedState(CC_SHARE_ALIKE_CONTROL_ID, shareAlike);
        ensureRadioCheckedState(CC_DERIVATIVE_CONTROL_ID, !shareAlike && !noDerivative);
      }
      else {
        cy.get(`#${CC_ALLOW_COMMERCIAL_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_DISALLOW_COMMERCIAL_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_NO_DERIVATIVE_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_SHARE_ALIKE_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_DERIVATIVE_CONTROL_ID}`).should('not.exist');
      }
    }
  });
});
