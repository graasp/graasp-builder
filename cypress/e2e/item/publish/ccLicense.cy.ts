import {
  CCLicenseAdaptions,
  ItemTagType,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import { buildItemPath } from '../../../../src/config/paths';
import {
  CC_ALLOW_COMMERCIAL_CONTROL_ID,
  CC_CC0_CONTROL_ID,
  CC_DELETE_BUTTON_HEADER,
  CC_DERIVATIVE_CONTROL_ID,
  CC_DISALLOW_COMMERCIAL_CONTROL_ID,
  CC_EDIT_BUTTON_HEADER,
  CC_NO_DERIVATIVE_CONTROL_ID,
  CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
  CC_SAVE_BUTTON,
  CC_SHARE_ALIKE_CONTROL_ID,
  LIBRARY_SETTINGS_CC_SETTINGS_ID,
  buildDataCyWrapper,
  buildPublishAttrContainer,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import { MEMBERS } from '../../../fixtures/members';
import { ItemForTest } from '../../../support/types';

// Set empty description to avoid having issue
const EMPTY_DESCRIPTION = '';

const itemCCLicenseCCBY = PackedFolderItemFactory({
  name: 'public item with cc by',
  settings: { ccLicenseAdaption: 'CC BY' },
  description: EMPTY_DESCRIPTION,
});
const itemCCLicenseCCBYNC = PackedFolderItemFactory({
  name: 'public item with cc by nc',
  settings: { ccLicenseAdaption: 'CC BY-NC' },
  description: EMPTY_DESCRIPTION,
});
const itemCCLicenseCCBYSA = PackedFolderItemFactory({
  name: 'public item with cc by sa',
  settings: { ccLicenseAdaption: 'CC BY-SA' },
  description: EMPTY_DESCRIPTION,
});
const itemCCLicenseCCBYNCND = PackedFolderItemFactory({
  name: 'public item with cc by nc nd',
  settings: { ccLicenseAdaption: 'CC BY-NC-ND' },
  description: EMPTY_DESCRIPTION,
});

const itemWithoutLicense = PackedFolderItemFactory({
  name: 'public item without license',
  settings: { ccLicenseAdaption: null },
  description: EMPTY_DESCRIPTION,
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

const setUpAndVisitItemPage = (item: ItemForTest) => {
  cy.setUpApi({ items: [item] });
  cy.visit(buildItemPath(item.id));
  openPublishItemTab(item.id);
};

const openLicenseModal = (
  { hasALicense }: { hasALicense: boolean } = { hasALicense: true },
) =>
  cy
    .get(
      buildDataCyWrapper(
        hasALicense
          ? CC_EDIT_BUTTON_HEADER
          : buildPublishAttrContainer(LIBRARY_SETTINGS_CC_SETTINGS_ID),
      ),
    )
    .click();

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
  describe('No license', () => {
    beforeEach(() => {
      setUpAndVisitItemPage(itemWithoutLicense);
    });

    it('License is not exist', () => {
      cy.get(buildDataCyWrapper(LIBRARY_SETTINGS_CC_SETTINGS_ID)).should(
        'not.exist',
      );
    });

    it('Set a license', () => {
      openLicenseModal({ hasALicense: false });
      cy.get(buildDataCyWrapper(CC_SAVE_BUTTON)).click();

      cy.wait('@editItem').then((data) => {
        const {
          request: { url, body },
        } = data;
        expect(url.split('/')).contains(itemWithoutLicense.id);
        expect(body.settings.ccLicenseAdaption).equals(CCLicenseAdaptions.CC0);
      });
    });
  });

  describe('Have a license', () => {
    it('Delete the license', () => {
      const item = PUBLISHED_ITEMS_WITH_CC_LICENSE[0];
      setUpAndVisitItemPage(item);
      cy.get(buildDataCyWrapper(CC_DELETE_BUTTON_HEADER)).click();

      cy.wait('@editItem').then((data) => {
        const {
          request: { url, body },
        } = data;
        expect(url.split('/')).contains(item.id);
        expect(body.settings.ccLicenseAdaption).equals(null);
      });
    });

    describe('Current license is selected', () => {
      const setUpAndOpenLicenseModal = (publishedItem: ItemForTest) => {
        setUpAndVisitItemPage(publishedItem);
        openLicenseModal();
      };

      const getLicenseAdaptations = (publishedItem: ItemForTest) => ({
        requireAttribution:
          publishedItem.settings.ccLicenseAdaption.includes('BY'),
        noncommercial: publishedItem.settings.ccLicenseAdaption.includes('NC'),
        shareAlike: publishedItem.settings.ccLicenseAdaption.includes('SA'),
        noDerivative: publishedItem.settings.ccLicenseAdaption.includes('ND'),
      });

      const ensureState = (publishedItem: ItemForTest) => {
        const { requireAttribution, noncommercial, shareAlike, noDerivative } =
          getLicenseAdaptations(publishedItem);

        ensureRadioCheckedState(
          CC_REQUIRE_ATTRIBUTION_CONTROL_ID,
          requireAttribution,
        );
        ensureRadioCheckedState(CC_CC0_CONTROL_ID, !requireAttribution);

        if (requireAttribution) {
          ensureRadioCheckedState(
            CC_ALLOW_COMMERCIAL_CONTROL_ID,
            !noncommercial,
          );
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
      };

      it('CCBY license is selected', () => {
        const publishedItem = PUBLISHED_ITEMS_WITH_CC_LICENSE[0];
        setUpAndOpenLicenseModal(publishedItem);
        ensureState(publishedItem);
      });
      it('CCBYNC license is selected', () => {
        const publishedItem = PUBLISHED_ITEMS_WITH_CC_LICENSE[1];
        setUpAndOpenLicenseModal(publishedItem);
        ensureState(publishedItem);
      });
      it('CCBYSA license is selected', () => {
        const publishedItem = PUBLISHED_ITEMS_WITH_CC_LICENSE[2];
        setUpAndOpenLicenseModal(publishedItem);
        ensureState(publishedItem);
      });
      it('CCBYNCND license is selected', () => {
        const publishedItem = PUBLISHED_ITEMS_WITH_CC_LICENSE[3];
        setUpAndOpenLicenseModal(publishedItem);
        ensureState(publishedItem);
      });
    });
  });
});
