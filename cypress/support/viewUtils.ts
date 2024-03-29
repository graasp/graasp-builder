import {
  CompleteMember,
  DocumentItemType,
  LinkItemType,
  PermissionLevel,
  PermissionLevelCompare,
  getDocumentExtra,
  getLinkExtra,
} from '@graasp/sdk';

import { getHighestPermissionForMemberFromMemberships } from '@/utils/item';

import {
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
  ITEM_TYPES_WITH_CAPTIONS,
} from '../../src/config/constants';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR,
  ITEM_HEADER_ID,
  TEXT_EDITOR_CLASS,
  buildEditButtonId,
  buildFileItemId,
  buildSettingsButtonId,
  buildShareButtonId,
} from '../../src/config/selectors';
import { CURRENT_USER } from '../fixtures/members';
import { ItemForTest, MemberForTest } from './types';

export const expectItemHeaderLayout = ({
  item: { id, type, memberships, path },
  currentMember,
}: {
  item: ItemForTest;
  currentMember?: CompleteMember;
}): void => {
  const header = cy.get(`#${ITEM_HEADER_ID}`);

  header.get(`#${buildShareButtonId(id)}`).should('exist');

  const permission = getHighestPermissionForMemberFromMemberships({
    memberships,
    memberId: currentMember?.id,
    itemPath: path,
  })?.permission;
  const canEditSettings = permission
    ? PermissionLevelCompare.gte(permission, PermissionLevel.Write)
    : false;

  if (canEditSettings) {
    if (ITEM_TYPES_WITH_CAPTIONS.includes(type)) {
      header.get(`#${buildEditButtonId(id)}`).should('exist');
    }
    header.get(`#${buildSettingsButtonId(id)}`).should('exist');
  }
};

export const expectDocumentViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}: {
  item: DocumentItemType;
  currentMember?: MemberForTest;
}): void => {
  cy.get(DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR).then((editor) => {
    expect(editor.html()).to.contain(getDocumentExtra(item.extra)?.content);
  });

  expectItemHeaderLayout({ item, currentMember });
};

export const expectFileViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}: {
  item: ItemForTest;
  currentMember?: MemberForTest;
}): void => {
  // embedded element
  cy.get(`#${buildFileItemId(item.id)}`).should('exist');

  cy.get(`.${TEXT_EDITOR_CLASS}`).should('contain', item.description);

  expectItemHeaderLayout({ item, currentMember });
};

export const expectLinkViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}: {
  item: LinkItemType;
  currentMember?: MemberForTest;
}): void => {
  const { id, description, settings } = item;
  const { url, html } = getLinkExtra(item.extra) || {};

  // embedded element
  if (html) {
    cy.get(`#${id}`).then((element) => {
      // transform innerhtml content to match provided html
      const parsedHtml = element.html().replaceAll('=""', '');
      expect(parsedHtml).to.contain(html);
    });
  } else if (settings?.showLinkIframe ?? DEFAULT_LINK_SHOW_IFRAME) {
    cy.get(`iframe#${id}`).should('have.attr', 'src', url);
  }

  if (!html && (settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON)) {
    cy.get('[data-testid="OpenInNewIcon"]').should('be.visible');
  }

  if (description) {
    cy.get(`.${TEXT_EDITOR_CLASS}`).should('contain', description);
  }

  expectItemHeaderLayout({ item, currentMember });
};

export const expectFolderViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}: {
  item: ItemForTest;
  currentMember?: MemberForTest | null;
}): void => {
  // table
  expectItemHeaderLayout({ item, currentMember });
};
