import {
  AppItemExtra,
  DiscriminatedItem,
  DocumentItemExtra,
  PermissionLevel,
} from '@graasp/sdk';

import { ApiConfig } from './types';

// cypress/support/index.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillShareForm(args: {
        email: string;
        permission: PermissionLevel;
        submit?: boolean;
        selector?: string;
      }): void;

      clickElementInIframe(
        iframeSelector: string,
        elementSelector: string,
      ): void;

      checkContentInElementInIframe(
        iframeSelector: string,
        elementSelector: string,
        text: string,
      ): void;

      attachFile(selector: Chainable, file: string, options?: object): void;
      attachFiles(
        selector: Chainable,
        filenames: string[],
        options?: object,
      ): void;

      // TODO
      visitAndMockWs(
        visitRoute: string,
        sampleData: object,
        wsClientStub: any,
      ): void;

      clickTreeMenuItem(value: string): void;
      handleTreeMenu(path: string, rootId?: string): void;
      switchMode(mode: string): void;
      goToItemInCard(path: string): void;
      goToItemWithNavigation(id: string): void;

      goToHome(): void;

      fillDocumentModal(
        payload: {
          name: string;
          extra?: DocumentItemExtra;
        },
        options?: { confirm?: boolean },
      ): void;
      fillAppModal(
        payload: { name: string; extra?: AppItemExtra },
        options?: {
          type?: boolean;
          id?: string;
          confirm?: boolean;
          custom?: boolean;
        },
      ): void;
      fillFolderModal(
        arg1: { name?: string; description?: string },
        arg2?: { confirm?: boolean },
      ): void;

      dragAndDrop(subject: string, x: number, y: number): void;

      selectItem(id: DiscriminatedItem['id']): void;

      setUpApi(args?: ApiConfig): any;

      fillBaseItemModal(
        item: { name?: string },
        options?: { confirm?: boolean },
      ): void;
    }
  }
}
