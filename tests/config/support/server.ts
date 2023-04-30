import { BrowserContext, Browser, Page } from "@playwright/test";
import { Database, buildDatabase } from "../../../src/server";
import { HOST } from "../../../src/config/constants";

// eslint-disable-next-line import/prefer-default-export
export const setUpApi = async (browser: Browser, database?: Database): Promise<{ context: BrowserContext, page: Page }> => {
  const context = await browser.newContext();
  if (database?.currentMember?.id) {
    await context.addCookies([{ name: 'session', value: 'value', url: HOST }]);
  }
  await context.exposeFunction('getDatabase', () => buildDatabase(database));
  return { context, page: await context.newPage() };
}
