
import { test, expect } from '@playwright/test';
import { COOKIE_KEYS } from '@graasp/sdk';
import { SAMPLE_ITEMS } from './config/fixtures/items'
import {
  CREATE_ITEM_BUTTON_ID,
  HEADER_APP_BAR_ID,
  ITEM_MAIN_CLASS,
} from '../src/config/selectors';
import { CURRENT_USER, SIGNED_OUT_MEMBER } from './config/fixtures/members'
import {
  buildItemPath,
  HOME_PATH,
  ITEMS_PATH,
  REDIRECT_PATH,
  SHARED_ITEMS_PATH,
} from '../src/config/paths';
import { HOST, SIGN_IN_PATH } from '../src/config/constants';
import { REDIRECTION_TIME } from './config/support/constants';
import { setUpApi } from './config/support/server';


test.describe('Authentication', () => {

  test.describe('Signed Off > Redirect to sign in route', () => {
    test('Home', async ({ browser }) => {
      const { page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: SIGNED_OUT_MEMBER })

      // Storing the request urls in array before continue button is pressed
      const requestUrls: string[] = []
      page.on('request', request => {
        requestUrls.push(request.url())
      });

      await page.goto(HOME_PATH, { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000)
      const cookies = await page.context().cookies()

      expect(cookies.find(c => c.name === COOKIE_KEYS.REDIRECT_URL_KEY)?.value).toContain(
        HOME_PATH,
      );

      // Filtering the request URLs for the callback URL I'm looking for
      const callBackUrl = requestUrls.filter(element => {
        if (element.includes(SIGN_IN_PATH)) {
          return true;
        }
        return false
      });
      expect(callBackUrl).toBeTruthy()

    });
    test('Shared Items', async ({ browser }) => {
      const { page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: SIGNED_OUT_MEMBER })

      // Storing the request urls in array before continue button is pressed
      const requestUrls: string[] = []
      page.on('request', request => {
        requestUrls.push(request.url())
      });

      await page.goto(SHARED_ITEMS_PATH, { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000)
      const cookies = await page.context().cookies()
      expect(cookies.find(c => c.name === COOKIE_KEYS.REDIRECT_URL_KEY)?.value).toContain(
        SHARED_ITEMS_PATH,
      );

      // Filtering the request URLs for the callback URL I'm looking for
      const callBackUrl = requestUrls.filter(element => {
        if (element.includes(SIGN_IN_PATH)) {
          return true;
        }
        return false
      });
      expect(callBackUrl).toBeTruthy()
    });


    test.describe('Signed In', () => {

      test.describe('Load page correctly', () => {

        test('Home', async ({ browser }) => {
          const { page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          await page.goto(HOME_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(5000)
          await expect(await page.locator(`#${HEADER_APP_BAR_ID}`)).toBeVisible();
        });
        test('Shared Items', async ({ browser }) => {
          const { page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          await page.goto(SHARED_ITEMS_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(5000)
          await expect(await page.locator(`#${HEADER_APP_BAR_ID}`)).toBeVisible();
          await expect(await page.locator(`#${CREATE_ITEM_BUTTON_ID}`)).not.toBeVisible();
        });
        test('Item', async ({ browser }) => {
          const { page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          await page.goto(buildItemPath(SAMPLE_ITEMS?.items?.[0].id), { waitUntil: 'networkidle' });
          await page.waitForTimeout(5000)
          await expect(await page.locator(`#${HEADER_APP_BAR_ID}`)).toBeVisible();
          await expect(await page.locator(`.${ITEM_MAIN_CLASS}`)).toBeVisible();
        });
      });

      test.describe('Redirect to URL in local storage', () => {
        test('Home', async ({ browser }) => {
          const { context, page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          context.addCookies([{ name: COOKIE_KEYS.REDIRECT_URL_KEY, value: HOME_PATH, url: HOST }]);
          await page.goto(REDIRECT_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(REDIRECTION_TIME);
          expect(page.url()).toContain(HOME_PATH);
        });

        test('Items', async ({ browser }) => {
          const { context, page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          context.addCookies([{ name: COOKIE_KEYS.REDIRECT_URL_KEY, value: ITEMS_PATH, url: HOST }]);
          await page.goto(REDIRECT_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(10000);
          expect(page.url()).toContain(ITEMS_PATH);
        });

        test('SharedItems', async ({ browser }) => {
          const { context, page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          context.addCookies([{ name: COOKIE_KEYS.REDIRECT_URL_KEY, value: SHARED_ITEMS_PATH, url: HOST }]);
          await page.goto(REDIRECT_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(10000);
          expect(page.url()).toContain(SHARED_ITEMS_PATH);
        });

        test('Item', async ({ browser }) => {
          const { context, page } = await setUpApi(browser, { ...SAMPLE_ITEMS, currentMember: CURRENT_USER })
          context.addCookies([{ name: COOKIE_KEYS.REDIRECT_URL_KEY, value: buildItemPath(SAMPLE_ITEMS.items![0].id), url: HOST }]);
          await page.goto(REDIRECT_PATH, { waitUntil: 'networkidle' });
          await page.waitForTimeout(10000);
          expect(page.url()).toContain(buildItemPath(SAMPLE_ITEMS.items![0].id));
        });
      });
    });
  });
});
