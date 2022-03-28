import {
  buildShareButtonId,
  ITEM_PUBLISH_SECTION_TITLE_SELECTOR,
  ITEM_VALIDATION_BUTTON_SELECTOR,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_LOGIN_ITEMS,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';
import { SETTINGS } from '../../../../src/config/constants';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';

const ITEM_PUBLISH_SECTION_TITLE = 'Publication On Explorer';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const changeVisibility = (value) => {
  cy.get(`#${SHARE_ITEM_VISIBILITY_SELECT_ID}`).click();
  cy.get(`li[data-value="${value}"]`).click();
};

describe('Change visibililty to published', () => {
  it('Default Private Item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // publication section should not exist at this time
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should('not.exist');

    changeVisibility(SETTINGS.ITEM_PUBLISHED.name);
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should(
      'have.text',
      ITEM_PUBLISH_SECTION_TITLE,
    );
    // visibilitySelect value should not be changed
    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );
    visiblitySelect.should('have.value', SETTINGS.ITEM_PRIVATE.name);
  });

  it('Public Item', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_PUBLIC_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // publication section should not exist at this time
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should('not.exist');

    changeVisibility(SETTINGS.ITEM_PUBLISHED.name);
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should(
      'have.text',
      ITEM_PUBLISH_SECTION_TITLE,
    );
    // visibilitySelect value should not be changed
    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );
    visiblitySelect.should('have.value', SETTINGS.ITEM_PUBLIC.name);
  });

  it('Pseudonymized Item', () => {
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);

    // publication section should not exist at this time
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should('not.exist');

    changeVisibility(SETTINGS.ITEM_PUBLISHED.name);
    cy.get(`#${ITEM_PUBLISH_SECTION_TITLE_SELECTOR}`).should(
      'have.text',
      ITEM_PUBLISH_SECTION_TITLE,
    );
    // visibilitySelect value should not be changed
    const visiblitySelect = cy.get(
      `#${SHARE_ITEM_VISIBILITY_SELECT_ID} + input`,
    );
    visiblitySelect.should('have.value', SETTINGS.ITEM_LOGIN.name);
  });
});

describe('Validate item', () => {
  it('Default Private Item', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    changeVisibility(SETTINGS.ITEM_PUBLISHED.name);

    // click validate item button
    cy.get(`#${ITEM_VALIDATION_BUTTON_SELECTOR}`).click();

    cy.wait('@postItemValidation').then((data) => {
      const {
        request: { url },
      } = data;
      expect(url.split('/')).contains(item.id);
    });
  });
});
