import {
  CompleteMember,
  DocumentItemType,
  EmbeddedLinkItemType,
  getDocumentExtra,
  getEmbeddedLinkExtra,
} from '@graasp/sdk';

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
import { isSettingsEditionAllowedForUser } from '../../src/utils/membership';
import { CURRENT_USER } from '../fixtures/members';
import { ItemForTest, MemberForTest } from './types';

export const expectItemHeaderLayout = ({
  item: { id, type, memberships },
  currentMember,
}: {
  item: ItemForTest;
  currentMember?: CompleteMember;
}): void => {
  const header = cy.get(`#${ITEM_HEADER_ID}`);

  header.get(`#${buildShareButtonId(id)}`).should('exist');

  if (
    isSettingsEditionAllowedForUser({
      memberships,
      memberId: currentMember?.id,
    })
  ) {
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
  item: EmbeddedLinkItemType;
  currentMember?: MemberForTest;
}): void => {
  const { id, description, settings } = item;
  const { url, html } = getEmbeddedLinkExtra(item.extra) || {};

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
