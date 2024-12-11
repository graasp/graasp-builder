import {
  ItemVisibilityType,
  PackedFolderItemFactory,
  PermissionLevel,
  TagCategory,
} from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_HEADER_ID,
  ITEM_TAGS_OPEN_MODAL_BUTTON_CY,
  MUI_CHIP_REMOVE_BTN,
  buildCustomizedTagsSelector,
  buildDataCyWrapper,
  buildDataTestIdWrapper,
  buildMultiSelectChipInputId,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { PUBLISHED_ITEM_NO_TAGS } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { SAMPLE_TAGS } from '../../../fixtures/tags';
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';
import { ItemForTest } from '../../../support/types';

const ITEM_WITH_TAGS = {
  ...PackedFolderItemFactory(
    {
      settings: {
        displayCoEditors: true,
      },
    },
    { permission: PermissionLevel.Admin },
  ),
  tags: SAMPLE_TAGS.slice(0, 2),
};

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item: ItemForTest) => {
  cy.setUpApi({ items: [item] });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Customized Tags', () => {
  it('Display item without tags', () => {
    const item = PUBLISHED_ITEM_NO_TAGS;
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
    // check display edit button
    cy.get(buildDataCyWrapper(ITEM_TAGS_OPEN_MODAL_BUTTON_CY))
      // scroll because description can be long
      .scrollIntoView()
      .should('be.visible');
  });

  it('Display tags', () => {
    const item = ITEM_WITH_TAGS;
    visitItemPage(item);
    expect(item.tags).to.have.lengthOf.above(0);
    item.tags.forEach((tag) => {
      const displayTags = cy.get(
        buildDataCyWrapper(buildCustomizedTagsSelector(tag.id)),
      );
      displayTags.contains(tag.name);
    });
  });

  it('Remove tag', () => {
    const item = ITEM_WITH_TAGS;
    const tagToRemove = ITEM_WITH_TAGS.tags[1];

    visitItemPage(item);
    cy.get(buildDataCyWrapper(buildCustomizedTagsSelector(tagToRemove.id)))
      .find(buildDataTestIdWrapper(MUI_CHIP_REMOVE_BTN))
      .click();

    cy.wait('@removeTag', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then(
      (data) => {
        const {
          request: { url },
        } = data;
        expect(url.split('/')).contains(item.id).contains(tagToRemove.id);
      },
    );
  });

  it('Add tag', () => {
    cy.intercept(
      {
        method: 'Get',
        url: /\/tags\?search=/,
      },
      ({ reply }) =>
        reply([
          { name: 'secondary school', category: TagCategory.Level },
          ...SAMPLE_TAGS,
        ]),
    ).as('getTags');

    const item = ITEM_WITH_TAGS;
    const newTag = { name: 'My new tag', category: TagCategory.Level };

    visitItemPage(item);
    cy.get(buildDataCyWrapper(ITEM_TAGS_OPEN_MODAL_BUTTON_CY)).click();
    cy.get(buildDataCyWrapper(buildMultiSelectChipInputId(TagCategory.Level)))
      // debounce of 500
      .type(`${newTag.name}`);

    // should call get tags when typing
    cy.wait('@getTags').then(({ request: { query } }) => {
      expect(query.search).to.contain(newTag.name);
      expect(query.category).to.contain(newTag.category);
    });

    // display options for opened category
    cy.get(`li:contains("secondary school")`).should('be.visible');

    cy.get(
      buildDataCyWrapper(buildMultiSelectChipInputId(TagCategory.Level)),
    ).type('{Enter}');

    cy.wait('@addTag', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.name).contains(newTag.name);
      expect(body.category).contains(newTag.category);
    });
  });
});

describe('Tags permissions', () => {
  it('User signed out cannot edit tags', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: null, publicVisibility: {} },
    );
    const publishedItem = {
      ...item,
      visibilities: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemVisibilityType.Public,
          item,
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
      published: {
        id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
        item,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
        totalViews: 0,
      },
    };
    cy.setUpApi({
      items: [publishedItem],
      currentMember: SIGNED_OUT_MEMBER,
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    // signed out user can not see the publish menu
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });

  it('Read-only user cannot edit tags', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: PermissionLevel.Read, publicVisibility: {} },
    );
    const publishedItem = {
      ...item,
      visibilities: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemVisibilityType.Public,
          item,
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
      published: {
        id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
        item,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
        totalViews: 0,
      },
    };
    cy.setUpApi({
      items: [publishedItem],
      currentMember: MEMBERS.BOB,
    });
    cy.visit(buildItemPath(item.id));

    cy.get(`#${ITEM_HEADER_ID}`).should('be.visible');
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });
});
