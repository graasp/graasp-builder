import {
  ItemTagType,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_HEADER_ID,
  ITEM_TAGS_OPEN_MODAL_BUTTON_ID,
  MUI_CHIP_REMOVE_BTN,
  MULTI_SELECT_CHIP_ADD_BUTTON_ID,
  MULTI_SELECT_CHIP_INPUT_ID,
  buildCustomizedTagsSelector,
  buildDataCyWrapper,
  buildDataTestIdWrapper,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import {
  ITEM_WITH_CATEGORIES,
  ITEM_WITH_CATEGORIES_CONTEXT,
} from '../../../fixtures/categories';
import { PUBLISHED_ITEM_NO_TAGS } from '../../../fixtures/items';
import { MEMBERS, SIGNED_OUT_MEMBER } from '../../../fixtures/members';
import { EDIT_TAG_REQUEST_TIMEOUT } from '../../../support/constants';
import { ItemForTest } from '../../../support/types';

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item: ItemForTest) => {
  cy.setUpApi(ITEM_WITH_CATEGORIES_CONTEXT);
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

describe('Customized Tags', () => {
  it('Display item without tags', () => {
    // check for not displaying if no tags
    const item = PUBLISHED_ITEM_NO_TAGS;
    cy.setUpApi({ items: [item] });
    cy.visit(buildItemPath(item.id));
    openPublishItemTab(item.id);
    cy.get(buildDataCyWrapper(buildCustomizedTagsSelector(0))).should(
      'not.exist',
    );
  });

  it('Display tags', () => {
    const item = ITEM_WITH_CATEGORIES;
    visitItemPage(item);
    expect(item.settings.tags).to.have.lengthOf.above(0);
    item.settings.tags!.forEach((tag, index) => {
      const displayTags = cy.get(
        buildDataCyWrapper(buildCustomizedTagsSelector(index)),
      );
      displayTags.contains(tag);
    });
  });

  it('Remove tag', () => {
    const item = ITEM_WITH_CATEGORIES;
    const removeIdx = 0;
    const removedTag = item.settings.tags[removeIdx];

    visitItemPage(item);
    cy.get(buildDataCyWrapper(buildCustomizedTagsSelector(removeIdx)))
      .find(buildDataTestIdWrapper(MUI_CHIP_REMOVE_BTN))
      .click();

    cy.wait('@editItem', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.settings.tags).not.contains(removedTag);
    });
  });

  it('Add tag', () => {
    const item = ITEM_WITH_CATEGORIES;
    const newTag = 'My new tag';

    visitItemPage(item);
    cy.get(buildDataCyWrapper(ITEM_TAGS_OPEN_MODAL_BUTTON_ID)).click();
    cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_INPUT_ID)).type(newTag);
    cy.get(buildDataCyWrapper(MULTI_SELECT_CHIP_ADD_BUTTON_ID)).click();

    cy.wait('@editItem', { timeout: EDIT_TAG_REQUEST_TIMEOUT }).then((data) => {
      const {
        request: { url, body },
      } = data;
      expect(url.split('/')).contains(item.id);
      expect(body.settings.tags).contains(newTag);
    });
  });
});

describe('Tags permissions', () => {
  it('User signed out cannot edit tags', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: null, publicTag: {} },
    );
    const publishedItem = {
      ...item,
      tags: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemTagType.Public,
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
      { permission: PermissionLevel.Read, publicTag: {} },
    );
    const publishedItem = {
      ...item,
      tags: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemTagType.Public,
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
