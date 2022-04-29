import {
  buildPublishButtonId,
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  PUBLISHED_ITEM,
  SAMPLE_ITEMS,
  SAMPLE_PUBLIC_ITEMS,
} from '../../../fixtures/items';
import { DEFAULT_TAGS, ITEM_PUBLISHED_TAG } from '../../../fixtures/itemTags';
import { VALIDATED_ITEM } from '../../../fixtures/validations';

const openPublishItemTab = (id) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const publishItem = () => {
  cy.get(`#${ITEM_PUBLISH_BUTTON_ID}`).click();
};

describe('Public Item', () => {
  it('Validate item', () => {
    cy.setUpApi({ ...SAMPLE_PUBLIC_ITEMS, tags: DEFAULT_TAGS });
    const item = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);

    // click validate item button
    cy.get(`#${ITEM_VALIDATION_BUTTON_ID}`).click();

    cy.wait('@postItemValidation').then((data) => {
      const {
        request: { url },
      } = data;
      expect(url.split('/')).contains(item.id);
    });
  });
});

describe('Published Item', () => {
  const item = PUBLISHED_ITEM;
  beforeEach(() => {
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
  });
  it('Show published state on button', () => {
    // click validate item button
    cy.get(`#${ITEM_PUBLISH_BUTTON_ID} > span`)
      .children()
      .children()
      .should('exist');
  });
  it('Unpublish item', () => {
    cy.get(`#${ITEM_UNPUBLISH_BUTTON_ID}`).click();
    cy.wait('@deleteItemTag').then(({ request: { url } }) => {
      // should contain published tag id
      expect(url).to.contain(item.tags[1].id);
    });
  });
});

describe('Validated Item', () => {
  it('Publish item', () => {
    cy.setUpApi({ items: [VALIDATED_ITEM], tags: DEFAULT_TAGS });
    const item = VALIDATED_ITEM;
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);

    // click validate item button
    cy.get(`#${ITEM_PUBLISH_BUTTON_ID}`).click();

    cy.wait('@postItemTag').then((data) => {
      const {
        request: { body },
      } = data;
      expect(body?.tagId).to.equal(ITEM_PUBLISHED_TAG.id);
    });
  });
});
