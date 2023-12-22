import {
  AppItemExtra,
  DocumentItemExtra,
  ItemType,
  PermissionLevel,
} from '@graasp/sdk';

// cypress/support/index.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillShareForm(args: {
        member: { email: string };
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

      openMetadataPanel(): void;

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

      fillTreeModal(path: string, rootId?: string): void;

      switchMode(mode: string): void;
      goToItemInGrid(path: string): void;
      goToItemInList(path: string): void;
      goToItemWithNavigation(id: string): void;

      goToHome(): void;

      fillLinkModal(
        payload?: { extra?: { [ItemType.LINK]: { url?: string } } },
        options?: { confirm?: boolean },
      ): void;
      fillDocumentModal(
        payload: { name: string; extra?: DocumentItemExtra },
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
      // TODO
      setUpApi(args?: any): any;

      fillBaseItemModal(
        item: { name?: string },
        options?: { confirm?: boolean },
      ): void;
    }
  }
}
