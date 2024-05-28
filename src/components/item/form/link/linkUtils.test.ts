import { describe, expect, it } from 'vitest';

import {
  LinkType,
  getLinkType,
  getSettingsFromLinkType,
  normalizeURL,
} from './linkUtils';

describe('Link Utils', () => {
  describe('Normalize URL', () => {
    it('Return correct HTTP url', () => {
      const url = 'http://graasp.org';
      const newUrl = normalizeURL(url);
      expect(newUrl).toEqual(url);
    });
    it('Return correct HTTPS url', () => {
      const url = 'https://graasp.org';
      const newUrl = normalizeURL(url);
      expect(newUrl).toEqual(url);
    });
    it('Adds protocol to url without', () => {
      const url = 'graasp.org';
      const newUrl = normalizeURL(url);
      expect(newUrl).toEqual(`https://${url}`);
    });
    it('Adds protocol to url with path', () => {
      const url = 'graasp.org/terms';
      const newUrl = normalizeURL(url);
      expect(newUrl).toEqual(`https://${url}`);
    });
  });

  describe('Get Link Type', () => {
    it('Default link type', () => {
      const settings = {};
      const linkType = getLinkType(settings);
      expect(linkType).toEqual(LinkType.Default);
    });
    it('Default link type', () => {
      const settings = { showLinkButton: false, showLinkIframe: false };
      const linkType = getLinkType(settings);
      expect(linkType).toEqual(LinkType.Default);
    });
    it('Fancy link type', () => {
      const settings = { showLinkButton: true, showLinkIframe: false };
      const linkType = getLinkType(settings);
      expect(linkType).toEqual(LinkType.Fancy);
    });
    it('Embedded link type', () => {
      const settings = { showLinkButton: false, showLinkIframe: true };
      const linkType = getLinkType(settings);
      expect(linkType).toEqual(LinkType.Embedded);
    });
    it('Prefer Embedded link type when both are true', () => {
      const settings = { showLinkButton: true, showLinkIframe: true };
      const linkType = getLinkType(settings);
      expect(linkType).toEqual(LinkType.Embedded);
    });
  });

  describe('Get settings from link type', () => {
    it('Default type', () => {
      const settings = getSettingsFromLinkType(LinkType.Default);
      expect(settings).toEqual({
        showLinkIframe: false,
        showLinkButton: false,
      });
    });
    it('Fancy type', () => {
      const settings = getSettingsFromLinkType(LinkType.Fancy);
      expect(settings).toEqual({
        showLinkIframe: false,
        showLinkButton: true,
      });
    });
    it('Embedded type', () => {
      const settings = getSettingsFromLinkType(LinkType.Embedded);
      expect(settings).toEqual({
        showLinkIframe: true,
        showLinkButton: false,
      });
    });
  });
});
