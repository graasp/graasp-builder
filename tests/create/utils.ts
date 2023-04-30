
import { AppItemType, DocumentItemType, EmbeddedLinkItemType, ItemType } from '@graasp/sdk';
import { Page } from '@playwright/test';
import { CREATE_ITEM_APP_ID, CREATE_ITEM_BUTTON_ID, CREATE_ITEM_CLOSE_BUTTON_ID, CREATE_ITEM_DOCUMENT_ID, CREATE_ITEM_FILE_ID, CREATE_ITEM_LINK_ID, CREATE_ITEM_ZIP_ID, FOLDER_FORM_DESCRIPTION_ID, ITEM_FORM_CONFIRM_BUTTON_ID, ITEM_FORM_NAME_INPUT_ID } from '../../src/config/selectors';
import { FileItemForTest } from '../support/types';
import { InternalItemType } from '../../src/config/types';

const fillBaseItemModal = async (page: Page, { name = '' }, { confirm = true } = {}) => {
  // first select all the text and then remove it to have a clear field, then type new text
  await page.locator(`#${ITEM_FORM_NAME_INPUT_ID}`).type(`{selectall}{backspace}${name}`);

  if (confirm) {
    await page.locator(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
  }
}

export const fillFolderModal = async (page: Page, { name = '', description = '' }: { name?: string, description?: string }, { confirm = true } = {}): Promise<void> => {
  await fillBaseItemModal(page, { name }, { confirm: false });
  // first select all the text and then remove it to have a clear field, then type new description
  await page.locator(`#${FOLDER_FORM_DESCRIPTION_ID}`).type(
    `{selectall}{backspace}${description}`,
  );

  if (confirm) {
    await page.locator(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
  }
}

export const createApp = async (page: Page, payload: AppItemType, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();
  await page.locator(`#${CREATE_ITEM_APP_ID}`).click();
  // cy.fillAppModal(payload, options);
};

export const createDocument = async (page: Page, payload: DocumentItemType, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();
  await await page.locator(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
  // cy.fillDocumentModal(payload, options);
};

export const createFolder = async (page: Page, payload: { name?: string; description?: string }, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();
  // cy.fillFolderModal(payload, options);
};

export const createLink = async (page: Page, payload: EmbeddedLinkItemType, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();
  await page.locator(`#${CREATE_ITEM_LINK_ID}`).click();
  // fillLinkModal(payload, options);
};

export const createFile = async (page: Page, payload: FileItemForTest, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();
  const confirm = options ?? { confirm: true };
  await page.locator(`#${CREATE_ITEM_FILE_ID}`).click();

  // drag-drop a file in the uploader
  // attachFile(
  //   page.locator(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
  //   payload?.createFilepath,
  //   {
  //     action: 'drag-drop',
  //     force: true,
  //   },
  // );
  if (confirm) {
    await page.locator(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
  }
};


export const createItem = async (page: Page, payload: { name?: string; extra?: { [ItemType.LINK]: { url?: string; } }; filepath?: string; type?: ItemType | InternalItemType, createFilepath?: string }, options?: { confirm?: boolean }): void => {
  await page.locator(`#${CREATE_ITEM_BUTTON_ID}`).click();

  switch (payload.type) {
    case ItemType.LINK:
      await page.locator(`#${CREATE_ITEM_LINK_ID}`).click();
      // cy.fillLinkModal(payload, options);
      break;
    case ItemType.S3_FILE:
    case ItemType.LOCAL_FILE: {
      const confirm = options ?? { confirm: true };
      page.locator(`#${CREATE_ITEM_FILE_ID}`).click();

      // drag-drop a file in the uploader
      // cy.attachFile(
      //   page.locator(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
      //   payload?.createFilepath,
      //   {
      //     action: 'drag-drop',
      //     force: true,
      //   },
      // );
      if (confirm) {
        page.locator(`#${CREATE_ITEM_CLOSE_BUTTON_ID}`).click();
      }
      break;
    }
    case InternalItemType.ZIP: {
      await page.locator(`#${CREATE_ITEM_ZIP_ID}`).click();

      // drag-drop a file in the uploader
      // cy.attachFile(
      //   page.locator(`#${ZIP_DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).first(),
      //   payload?.filepath,
      //   {
      //     action: 'drag-drop',
      //     force: true,
      //   },
      // );
      break;
    }
    case ItemType.DOCUMENT:
      page.locator(`#${CREATE_ITEM_DOCUMENT_ID}`).click();
      // cy.fillDocumentModal(payload, options);
      break;
    case ItemType.APP:
      page.locator(`#${CREATE_ITEM_APP_ID}`).click();
      // cy.fillAppModal(payload, options);
      break;
    case ItemType.FOLDER:
    default:
      fillFolderModal(page, payload, options);
      break;
  }
};

