import {
  GuestFactory,
  ItemLoginSchemaFactory,
  ItemLoginSchemaStatus,
  ItemLoginSchemaType,
  Member,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';
import { namespaces } from '@graasp/translations';

import i18n from '@/config/i18n';

import { buildItemPath, buildItemSharePath } from '../../../src/config/paths';
import {
  buildDataCyWrapper,
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowEditButtonId,
  buildItemMembershipRowId,
  buildItemMembershipRowSelector,
  buildShareButtonId,
} from '../../../src/config/selectors';
import { CURRENT_USER, MEMBERS } from '../../fixtures/members';
import { buildItemMembership } from '../../fixtures/memberships';

const itemWithAdmin = { ...PackedFolderItemFactory() };
const adminMembership = buildItemMembership({
  item: itemWithAdmin,
  permission: PermissionLevel.Admin,
  account: MEMBERS.ANNA,
  creator: MEMBERS.ANNA,
});
const membershipsWithoutAdmin = [
  buildItemMembership({
    item: itemWithAdmin,
    permission: PermissionLevel.Write,
    account: MEMBERS.BOB,
    creator: MEMBERS.ANNA,
  }),
  buildItemMembership({
    item: itemWithAdmin,
    permission: PermissionLevel.Write,
    account: MEMBERS.CEDRIC,
    creator: MEMBERS.ANNA,
  }),
  buildItemMembership({
    item: itemWithAdmin,
    permission: PermissionLevel.Read,
    account: MEMBERS.DAVID,
    creator: MEMBERS.ANNA,
  }),
];

const checkItemMembershipRow = ({
  id,
  name,
  permission,
}: {
  id: string;
  name: string;
  permission: 'disabled' | PermissionLevel;
}): void => {
  cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
    .should('contain', name)
    .should('contain', i18n.t(permission, { ns: namespaces.enums }));
};

describe('View Memberships - Individual', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          memberships: [adminMembership, ...membershipsWithoutAdmin],
        },
      ],
    });
  });

  it('view membership in settings', () => {
    const item = itemWithAdmin;
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    i18n.changeLanguage(CURRENT_USER.extra.lang);

    // only admin - cannot edit, delete
    cy.get(buildDataCyWrapper(buildItemMembershipRowId(adminMembership.id)))
      .should('contain', adminMembership.account.name)
      .should('contain', (adminMembership.account as Member).email);

    // editable rows
    for (const { permission, account, id } of membershipsWithoutAdmin) {
      const { name, email } = Object.values(MEMBERS).find(
        ({ id: mId }) => mId === account.id,
      );

      // check name and mail
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('contain', email)
        .should('contain', i18n.t(permission, { ns: namespaces.enums }));

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });
});

describe('View Memberships - Hidden item', () => {
  it('view disabled memberships for hidden item', () => {
    const hiddenItem = PackedFolderItemFactory({}, { hiddenVisibility: {} });
    const adminHiddenMembership = buildItemMembership({
      item: hiddenItem,
      permission: PermissionLevel.Admin,
      account: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
    });
    const writeHiddenMembership = buildItemMembership({
      item: hiddenItem,
      permission: PermissionLevel.Write,
      account: MEMBERS.EVAN,
      creator: MEMBERS.ANNA,
    });
    const readHiddenMembership = buildItemMembership({
      item: hiddenItem,
      permission: PermissionLevel.Read,
      account: MEMBERS.GARRY,
      creator: MEMBERS.ANNA,
    });
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: hiddenItem,
    });
    const guestMemberships = [
      buildItemMembership({
        item: hiddenItem,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: hiddenItem,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = hiddenItem;
    cy.setUpApi({
      items: [
        {
          ...hiddenItem,
          itemLoginSchema,
          memberships: [
            adminHiddenMembership,
            writeHiddenMembership,
            readHiddenMembership,
            ...guestMemberships,
          ],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));

    // admin and write are enabled
    checkItemMembershipRow({
      id: adminHiddenMembership.id,
      name: adminHiddenMembership.account.name,
      permission: adminHiddenMembership.permission,
    });
    checkItemMembershipRow({
      id: writeHiddenMembership.id,
      name: writeHiddenMembership.account.name,
      permission: writeHiddenMembership.permission,
    });

    // read are disabled
    checkItemMembershipRow({
      id: readHiddenMembership.id,
      name: readHiddenMembership.account.name,
      permission: ItemLoginSchemaStatus.Disabled,
    });

    // guests are disabled
    for (const { account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      checkItemMembershipRow({
        id,
        name,
        permission: ItemLoginSchemaStatus.Disabled,
      });
      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });
  it('view frozen guest membership', () => {
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: itemWithAdmin,
      status: ItemLoginSchemaStatus.Freeze,
    });
    const guestMemberships = [
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = itemWithAdmin;
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          itemLoginSchema,
          memberships: [adminMembership, ...guestMemberships],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));
    // editable rows
    for (const { permission, account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('contain', i18n.t(permission, { ns: namespaces.enums }));

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });

  it('view disabled guest membership', () => {
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: itemWithAdmin,
      status: ItemLoginSchemaStatus.Disabled,
    });
    const guestMemberships = [
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = itemWithAdmin;
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          itemLoginSchema,
          memberships: [adminMembership, ...guestMemberships],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));
    // editable rows
    for (const { permission, account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('not.contain', permission)
        .should(
          'contain',
          i18n.t(ItemLoginSchemaStatus.Disabled, { ns: namespaces.enums }),
        );

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });
});

describe('View Memberships - Guest', () => {
  it('view guest membership', () => {
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: itemWithAdmin,
    });
    const guestMemberships = [
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = itemWithAdmin;
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          itemLoginSchema,
          memberships: [adminMembership, ...guestMemberships],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));
    // editable rows
    for (const { permission, account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('contain', i18n.t(permission, { ns: namespaces.enums }));

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });
  it('view frozen guest membership', () => {
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: itemWithAdmin,
      status: ItemLoginSchemaStatus.Freeze,
    });
    const guestMemberships = [
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = itemWithAdmin;
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          itemLoginSchema,
          memberships: [adminMembership, ...guestMemberships],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));
    // editable rows
    for (const { permission, account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('contain', i18n.t(permission, { ns: namespaces.enums }));

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });

  it('view disabled guest membership', () => {
    const itemLoginSchema = ItemLoginSchemaFactory({
      type: ItemLoginSchemaType.Username,
      item: itemWithAdmin,
      status: ItemLoginSchemaStatus.Disabled,
    });
    const guestMemberships = [
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item: itemWithAdmin,
        permission: PermissionLevel.Read,
        account: GuestFactory({
          itemLoginSchema,
        }),
        creator: MEMBERS.ANNA,
      }),
    ];
    const item = itemWithAdmin;
    cy.setUpApi({
      items: [
        {
          ...itemWithAdmin,
          itemLoginSchema,
          memberships: [adminMembership, ...guestMemberships],
        },
      ],
    });
    i18n.changeLanguage(CURRENT_USER.extra.lang);
    cy.visit(buildItemSharePath(item.id));
    // editable rows
    for (const { permission, account, id } of guestMemberships) {
      const { name } = Object.values(
        guestMemberships.map((m) => m.account),
      ).find(({ id: mId }) => mId === account.id);

      // check name and disabled permission
      cy.get(buildDataCyWrapper(buildItemMembershipRowId(id)))
        .should('contain', name)
        .should('not.contain', permission)
        .should(
          'contain',
          i18n.t(ItemLoginSchemaStatus.Disabled, { ns: namespaces.enums }),
        );

      // check delete button exists
      cy.get(`#${buildItemMembershipRowDeleteButtonId(id)}`).should('exist');
    }
  });
});

describe('View Memberships Read-Only Mode', () => {
  it('view membership in settings read-only mode', () => {
    const item = PackedFolderItemFactory(
      {},
      { permission: PermissionLevel.Write },
    );
    const ownMembership = buildItemMembership({
      item,
      permission: PermissionLevel.Write,
      account: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
    });
    const memberships = [
      buildItemMembership({
        item,
        permission: PermissionLevel.Admin,
        account: MEMBERS.BOB,
        creator: MEMBERS.ANNA,
      }),
      buildItemMembership({
        item,
        permission: PermissionLevel.Read,
        account: MEMBERS.CEDRIC,
        creator: MEMBERS.ANNA,
      }),
    ];

    cy.setUpApi({
      items: [{ ...item, memberships: [...memberships, ownMembership] }],
    });
    cy.visit(buildItemPath(item.id));
    cy.get(`#${buildShareButtonId(item.id)}`).click();

    i18n.changeLanguage(CURRENT_USER.extra.lang);

    // can only see own permission - can edit, delete
    cy.get(buildItemMembershipRowSelector(ownMembership.id))
      .should('contain', CURRENT_USER.email)
      .should(
        'contain',
        i18n.t(ownMembership.permission, { ns: namespaces.enums }),
      );

    cy.get(`#${buildItemMembershipRowEditButtonId(ownMembership.id)}`).should(
      'be.visible',
    );

    cy.get(`#${buildItemMembershipRowDeleteButtonId(ownMembership.id)}`).should(
      'be.visible',
    );

    // cannot see others
    for (const { id } of memberships) {
      cy.get(buildItemMembershipRowSelector(id)).should('not.exist');
    }
  });
});
