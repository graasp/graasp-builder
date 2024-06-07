import {
  ItemTagType,
  ItemValidationGroup,
  ItemValidationStatus,
  Member,
  PackedFolderItemFactory,
  PackedItem,
  PermissionLevel,
} from '@graasp/sdk';

import { PublicationStatus } from '@/types/publication';

import { buildItemPath } from '../../../../src/config/paths';
import {
  EMAIL_NOTIFICATION_CHECKBOX,
  PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON,
  buildDataCyWrapper,
  buildItemPublicationButton,
  buildPublicationStatus,
  buildPublishButtonId,
} from '../../../../src/config/selectors';
import {
  ItemValidationGroupFactory,
  PublishedItemFactory,
} from '../../../fixtures/items';
import { MEMBERS } from '../../../fixtures/members';
import { ItemForTest } from '../../../support/types';

const openPublishItemTab = (id: string) => {
  cy.get(`#${buildPublishButtonId(id)}`).click();
};

const setUpAndVisitItemPage = (
  item: PackedItem | ItemForTest,
  {
    itemValidationGroups,
    currentMember,
  }: {
    itemValidationGroups?: ItemValidationGroup[];
    currentMember?: Member | null;
  } = {},
) => {
  cy.setUpApi({ items: [item], itemValidationGroups, currentMember });
  cy.visit(buildItemPath(item.id));
};

const getPublicationButton = (status: PublicationStatus) =>
  cy.get(buildDataCyWrapper(buildItemPublicationButton(status)));

const getPublicationStatusComponent = (status: PublicationStatus) =>
  cy.get(buildDataCyWrapper(buildPublicationStatus(status)));

const confirmSetItemToPublic = () =>
  cy.get(buildDataCyWrapper(PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON)).click();

const waitOnRequest = (request: string, item: PackedItem) => {
  cy.wait(request).then((data) => {
    const {
      request: { url },
    } = data;
    expect(url.includes(item.id));
  });
};

const waitOnItemValidation = (item: PackedItem) => {
  waitOnRequest('@postItemValidation', item);
};

const waitOnPublishItem = (
  item: PackedItem,
  { shouldNotify }: { shouldNotify: boolean } = { shouldNotify: false },
) => {
  cy.wait('@publishItem').then((data) => {
    const {
      request: { url, query },
    } = data;
    expect(url.includes(item.id));
    if (shouldNotify) {
      expect(`${query.notification}`).equals(`${shouldNotify}`);
    } else {
      expect(query.notification).equals(undefined);
    }
  });
};

const waitOnSetItemPublic = (item: PackedItem) => {
  waitOnRequest(`@postItemTag-${ItemTagType.Public}`, item);
};

const waitOnUnpublishItem = (item: PackedItem) => {
  waitOnRequest('@unpublishItem', item);
};

describe('Unauthorized members should not have access to publish tab', () => {
  let item: PackedItem;

  afterEach(() => {
    cy.get(`#${buildPublishButtonId(item.id)}`).should('not.exist');
  });

  it('Unlogged members should not view publish tab', () => {
    item = PackedFolderItemFactory({}, { permission: null, publicTag: {} });
    setUpAndVisitItemPage(item, { currentMember: null });
  });

  it('Readers should not view publish tab', () => {
    item = PackedFolderItemFactory({}, { permission: PermissionLevel.Read });
    setUpAndVisitItemPage(item, { currentMember: MEMBERS.BOB });
  });

  it('Writers should not view publish tab', () => {
    item = PackedFolderItemFactory({}, { permission: PermissionLevel.Write });
    setUpAndVisitItemPage(item, { currentMember: MEMBERS.BOB });
  });
});

describe('Private Item', () => {
  const privateItem = PackedFolderItemFactory({}, { publicTag: null });

  describe('Unpublished Item', () => {
    const status = PublicationStatus.Unpublished;

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem);
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Unpublished', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated', () => {
      getPublicationButton(status).click(); // Click on validate
      waitOnItemValidation(privateItem);
    });
  });

  describe('Ready to Publish Item', () => {
    const status = PublicationStatus.ReadyToPublish;
    const itemValidationGroup = ItemValidationGroupFactory(privateItem);

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem, {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Ready to publish', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Publishing private item should warn user before changing visibility', () => {
      getPublicationButton(status).click(); // click on publish
      confirmSetItemToPublic();
      waitOnSetItemPublic(privateItem);
      waitOnPublishItem(privateItem);
    });
  });

  describe('Visibility of published item is private again', () => {
    const itemValidationGroup = ItemValidationGroupFactory(privateItem);

    beforeEach(() => {
      setUpAndVisitItemPage(PublishedItemFactory(privateItem), {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Not Public', () => {
      getPublicationStatusComponent(PublicationStatus.NotPublic)
        .should('exist')
        .should('be.visible');
    });

    it('Should ask before change item visility to public', () => {
      getPublicationButton(PublicationStatus.NotPublic).click(); // Click on change visibility
      confirmSetItemToPublic();
      waitOnSetItemPublic(privateItem);
    });
  });

  describe('Item is not valid', () => {
    const status = PublicationStatus.Invalid;
    const itemValidationGroup = ItemValidationGroupFactory(privateItem, {
      status: ItemValidationStatus.Failure,
    });

    beforeEach(() => {
      setUpAndVisitItemPage(privateItem, {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(privateItem.id);
    });

    it('Publication status should be Invalid', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated again', () => {
      getPublicationButton(status).click(); // click on retry
      waitOnItemValidation(privateItem);
    });
  });
});

describe('Public Item', () => {
  const publicItem = PackedFolderItemFactory({}, { publicTag: {} });

  describe('Unpublished Item', () => {
    const status = PublicationStatus.Unpublished;

    beforeEach(() => {
      setUpAndVisitItemPage(publicItem);
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Unpublished', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated', () => {
      getPublicationButton(status).click(); // Click on validate
      waitOnItemValidation(publicItem);
    });
  });

  describe('Validation is Pending', () => {
    const status = PublicationStatus.Pending;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem, {
      status: ItemValidationStatus.Pending,
    });

    beforeEach(() => {
      setUpAndVisitItemPage(PublishedItemFactory(publicItem), {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Pending', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('No actions are available during this state', () => {
      Object.values(PublicationStatus).forEach((state) => {
        getPublicationButton(state).should('not.exist');
      });
    });
  });

  describe('Ready to Publish Item', () => {
    const status = PublicationStatus.ReadyToPublish;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem);

    beforeEach(() => {
      setUpAndVisitItemPage(publicItem, {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Ready to publish', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Publish the item without notification', () => {
      getPublicationButton(status).click(); // click on publish
      waitOnPublishItem(publicItem);
    });

    it('Publish the item with notification', () => {
      cy.get(buildDataCyWrapper(EMAIL_NOTIFICATION_CHECKBOX)).click();
      getPublicationButton(status).click(); // click on publish
      waitOnPublishItem(publicItem, { shouldNotify: true });
    });
  });

  describe('Outdated Item', () => {
    const status = PublicationStatus.Outdated;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem, {
      isOutDated: true,
    });

    beforeEach(() => {
      setUpAndVisitItemPage(publicItem, {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Outdated', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Item can be validated again', () => {
      getPublicationButton(status).click(); // click on validate
      waitOnItemValidation(publicItem);
    });
  });

  describe('Published Item', () => {
    const status = PublicationStatus.Published;
    const itemValidationGroup = ItemValidationGroupFactory(publicItem);

    beforeEach(() => {
      setUpAndVisitItemPage(PublishedItemFactory(publicItem), {
        itemValidationGroups: [itemValidationGroup],
      });
      openPublishItemTab(publicItem.id);
    });

    it('Publication status should be Published', () => {
      getPublicationStatusComponent(status)
        .should('exist')
        .should('be.visible');
    });

    it('Unpublish the item', () => {
      getPublicationButton(status).click(); // click on unpublish
      waitOnUnpublishItem(publicItem);
    });
  });
});
