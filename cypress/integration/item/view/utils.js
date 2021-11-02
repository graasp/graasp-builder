import { ITEM_TYPES_WITH_CAPTIONS } from '../../../../src/config/constants';
import {
  buildEditButtonId,
  buildFileItemId,
  buildPerformButtonId,
  buildS3FileItemId,
  buildSettingsButtonId,
  buildShareButtonId,
  DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR,
  ITEM_HEADER_ID,
  ITEM_PANEL_ID,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
  TEXT_EDITOR_CLASS,
} from '../../../../src/config/selectors';
import { ITEM_TYPES } from '../../../../src/enums';
import {
  getDocumentExtra,
  getEmbeddedLinkExtra,
  getFileExtra,
  getS3FileExtra,
} from '../../../../src/utils/itemExtra';
import { getMemberById } from '../../../../src/utils/member';
import { isSettingsEditionAllowedForUser } from '../../../../src/utils/membership';
import { CURRENT_USER, MEMBERS } from '../../../fixtures/members';

const expectPanelLayout = ({ name, extra, creator, mimetype }) => {
  cy.openMetadataPanel();

  const panel = cy.get(`#${ITEM_PANEL_ID}`);
  panel.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);

  const creatorName = getMemberById(Object.values(MEMBERS), creator).name;

  panel.get(`#${ITEM_PANEL_TABLE_ID}`).should('exist').contains(creatorName);

  if (mimetype) {
    panel.get(`#${ITEM_PANEL_TABLE_ID}`).contains(mimetype);

    panel
      .get(`#${ITEM_PANEL_TABLE_ID}`)
      .contains(getFileExtra(extra)?.size || getS3FileExtra(extra)?.size);
  }
};

export const expectItemHeaderLayout = ({
  item: { id, type, memberships },
  currentMember,
}) => {
  const header = cy.get(`#${ITEM_HEADER_ID}`);

  header.get(`#${buildShareButtonId(id)}`).should('exist');
  header.get(`#${buildPerformButtonId(id)}`).should('exist');

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
}) => {
  const { name, extra, creator } = item;
  cy.get(DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR).then((editor) => {
    expect(editor.html()).to.contain(getDocumentExtra(extra)?.content);
  });

  expectPanelLayout({
    name,
    extra,
    creator,
  });

  expectItemHeaderLayout({ item, currentMember });
};

export const expectFileViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}) => {
  const { id, name, extra, creator, type, description } = item;
  const mimetype =
    getFileExtra(extra)?.mimetype || getS3FileExtra(extra)?.contenttype;

  // embedded element
  let selector = null;
  if (type === ITEM_TYPES.FILE) {
    selector = `#${buildFileItemId(id)}`;
  } else if (type === ITEM_TYPES.S3_FILE) {
    selector = `#${buildS3FileItemId(id)}`;
  }
  cy.get(selector).should('exist');

  cy.get(`.${TEXT_EDITOR_CLASS}`).should('contain', description);

  // table
  expectPanelLayout({ name, extra, creator, mimetype });

  expectItemHeaderLayout({ item, currentMember });
};

export const expectLinkViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}) => {
  const { id, name, extra, creator, description } = item;
  const { url, html } = getEmbeddedLinkExtra(extra);

  // embedded element
  if (html) {
    cy.get(`#${id}`).then((element) => {
      // transform innerhtml content to match provided html
      const parsedHtml = element.html().replaceAll('=""', '');
      expect(parsedHtml).to.contain(html);
    });
  } else {
    cy.get(`iframe#${id}`).should('have.attr', 'src', url);
  }

  if (description) {
    cy.get(`.${TEXT_EDITOR_CLASS}`).should('contain', description);
  }

  // table
  expectPanelLayout({ name, extra, creator });

  expectItemHeaderLayout({ item, currentMember });
};

export const expectFolderViewScreenLayout = ({
  item,
  currentMember = CURRENT_USER,
}) => {
  const { name, creator } = item;
  // table
  expectPanelLayout({ name, creator });

  expectItemHeaderLayout({ item, currentMember });
};
