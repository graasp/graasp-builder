import { ItemTagType, PackedFolderItemFactory } from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SHARE_ALIKE_CONTROL_ID,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { MEMBERS } from '../../../fixtures/members';
import { ItemForTest } from '../../../support/types';

const itemCCLicenseCCBY = PackedFolderItemFactory({
  name: 'public item with cc by',
  settings: { ccLicenseAdaption: 'CC BY' },
});
const itemCCLicenseCCBYNC = PackedFolderItemFactory({
  name: 'public item with cc by nc',
  settings: { ccLicenseAdaption: 'CC BY-NC' },
});
const itemCCLicenseCCBYSA = PackedFolderItemFactory({
  name: 'public item with cc by sa',
  settings: { ccLicenseAdaption: 'CC BY-SA' },
});
const itemCCLicenseCCBYNCND = PackedFolderItemFactory({
  name: 'public item with cc by nc nd',
  settings: { ccLicenseAdaption: 'CC BY-NC-ND' },
});

const PUBLISHED_ITEMS_WITH_CC_LICENSE: ItemForTest[] = [
  {
    ...itemCCLicenseCCBY,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBY,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBY,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
  },
  {
    ...itemCCLicenseCCBYNC,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYNC,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYNC,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
  },
  {
    ...itemCCLicenseCCBYSA,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYSA,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYSA,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
  },
  {
    ...itemCCLicenseCCBYNCND,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYNCND,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYNCND,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
  },
];

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const visitItemPage = (item: ItemForTest) => {
  cy.setUpApi({ items: [item] });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

const ensureRadioCheckedState = (parentId: string, shouldBeChecked: boolean) =>
  cy
    .get(`#${parentId}`)
    // MUI doesn't update the `checked` attribute of checkboxes.
    .find('svg[data-testid=RadioButtonCheckedIcon]')
    .should(
      'have.css',
      'transform',
      `matrix(${shouldBeChecked ? '1, 0, 0, 1, 0, 0' : '0, 0, 0, 0, 0, 0'})`,
    );

describe('Creative Commons License', () => {
  it('Current license is selected', () => {
    for (const publishedItem of PUBLISHED_ITEMS_WITH_CC_LICENSE) {
      visitItemPage(publishedItem);

      const requireAttribution =
        publishedItem.settings.ccLicenseAdaption.includes('BY');
      const noncommercial =
        publishedItem.settings.ccLicenseAdaption.includes('NC');
      const shareAlike =
        publishedItem.settings.ccLicenseAdaption.includes('SA');
      const noDerivative =
        publishedItem.settings.ccLicenseAdaption.includes('ND');

      ensureRadioCheckedState(
        CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
        requireAttribution,
      );
      ensureRadioCheckedState(CC_CC0_CONTROL_ID, !requireAttribution);

      if (requireAttribution) {
        ensureRadioCheckedState(CC_ALLOW_COMMERCIAL_CONTROL_ID, !noncommercial);
        ensureRadioCheckedState(
          CC_DISALLOW_COMMERCIAL_CONTROL_ID,
          noncommercial,
        );

        ensureRadioCheckedState(CC_NO_DERIVATIVE_CONTROL_ID, noDerivative);
        ensureRadioCheckedState(CC_SHARE_ALIKE_CONTROL_ID, shareAlike);
        ensureRadioCheckedState(
          CC_DERIVATIVE_CONTROL_ID,
          !shareAlike && !noDerivative,
        );
      } else {
        cy.get(`#${CC_ALLOW_COMMERCIAL_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_DISALLOW_COMMERCIAL_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_NO_DERIVATIVE_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_SHARE_ALIKE_CONTROL_ID}`).should('not.exist');
        cy.get(`#${CC_DERIVATIVE_CONTROL_ID}`).should('not.exist');
      }
    }
  });
});
