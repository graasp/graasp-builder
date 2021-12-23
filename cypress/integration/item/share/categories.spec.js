import {
  buildShareButtonId,
  SHARE_ITEM_CATEGORY_DISCIPLINE,
  SHARE_ITEM_CATEGORY_LEVEL,
} from '../../../../src/config/selectors';
import { buildItemPath } from '../../../../src/config/paths';
import {
  CUSTOMIZED_TAGS,
  ITEM_WITH_CATEGORIES,
  SAMPLE_CATEGORIES,
} from '../../../fixtures/categories';
import { DEFAULT_TAGS } from '../../../fixtures/itemTags';
import { ITEM_LOGIN_ITEMS } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';

const openShareItemTab = (id) => {
  cy.get(`#${buildShareButtonId(id)}`).click();
};

// eslint-disable-next-line import/prefer-default-export
export const deleteOption = () => {
  cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`).click();
  cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
};

export const addOption = () => {
  cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`).click();
  cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
};

describe('Categories', () => {
  const item = ITEM_WITH_CATEGORIES;
  beforeEach(() => {
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
  });
  it('Disply Item Categories', () => {
    // check for displaying value
    const levelValue = cy.get(
      'div.MuiChip-root.MuiAutocomplete-tag.MuiChip-deletable > span',
    );
    levelValue.first().contains(SAMPLE_CATEGORIES[0].name);
  });

  it('Display item without category', () => {
    // check for not displaying if no categories
    const disciplineValue = cy.get(`#${SHARE_ITEM_CATEGORY_DISCIPLINE}`);
    disciplineValue.should('be.empty');
  });

  it('Delete a category option', () => {
    // delete selection
    deleteOption();
    cy.wait(['@deleteItemCategory']).then((data) => {
      const entryId = item.categories[0].id;
      const {
        request: { url },
      } = data;
      expect(url.split('/')[4]).equal('item-category');
      expect(url.split('/')[5]).equal(entryId);
    });
  });

  it('Add a category option', () => {
    addOption();
    cy.wait(['@postItemCategory']).then((data) => {
      const {
        request: { url },
      } = data;
      expect(url.split('/')[3]).equal('items');
      expect(url.split('/')[4]).equal(item.id);
    });
  });
});

describe('Customized Tags', () => {
  it('Display tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    cy.setUpApi({ items: [item], tags: DEFAULT_TAGS });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    const displayTags = cy.get('span.MuiChip-label');
    displayTags.contains(CUSTOMIZED_TAGS[0]);
  });
});

describe('Permissions', () => {
  it('User signed out', () => {
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.setUpApi({ ...ITEM_LOGIN_ITEMS, currentMember: SIGNED_OUT_MEMBER });
    cy.visit(buildItemPath(item.id));
    const signInNotification = cy.get(
      `span.MuiTypography-root.MuiFormControlLabel-label.makeStyles-signInWithWrapperLabel-10`,
    );
    signInNotification.contains('Sign In with');
  });

  it('Read-only', () => {
    const item = ITEM_LOGIN_ITEMS.items[0];
    cy.setUpApi({
      ...ITEM_LOGIN_ITEMS,
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));
    openShareItemTab(item.id);
    const levelValue = cy.get(`#${SHARE_ITEM_CATEGORY_LEVEL}`);
    levelValue.should('be.disabled');
  });
});
