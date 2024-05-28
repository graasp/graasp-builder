import { ItemSettings, LinkItemSettings, UnionOfConst } from '@graasp/sdk';

/**
 * Enum representing the different ways a link can be shown
 * `Embedded` will use an iframe to display the website content.
 * If the link is to a rich media (video, etc), the embedded code will be used.
 * `Fancy` will display a nice card similar to social media previews.
 * `Default` will show the link as hyperlink text.
 */
export const LinkType = {
  Embedded: 'embedded',
  Fancy: 'fancy',
  Default: 'default',
} as const;

/**
 * Add the protocol on the url if not set
 * This function allows to enter urls without the protocol (http / https)
 * and will add it to make url compliant to the spec. Defaults to adding HTTPS.
 * @param url input url to be normalized
 * @returns A string representing a url with the required protocol attached
 */
export const normalizeURL = (url: string): string => {
  const hasProtocol = /^https?:\/\//;

  if (hasProtocol.test(url)) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Find LinkType based on settings
 * @param settings item settings from which to take the showIframe and shoWButton settings
 * @returns the linkType to be used
 */
export const getLinkType = (
  settings?: LinkItemSettings & ItemSettings,
): UnionOfConst<typeof LinkType> => {
  if (settings?.showLinkIframe) {
    return LinkType.Embedded;
  }
  if (settings?.showLinkButton) {
    return LinkType.Fancy;
  }
  return LinkType.Default;
};

/**
 * Convert a link type to settings to be saved in the item
 * @param linkType The type of the link selected
 * @returns the settings needed to represent that link type
 */
export const getSettingsFromLinkType = (
  linkType: string,
): { showLinkButton: boolean; showLinkIframe: boolean } => {
  switch (linkType) {
    case LinkType.Fancy: {
      return {
        showLinkIframe: false,
        showLinkButton: true,
      };
    }
    case LinkType.Embedded: {
      return {
        showLinkIframe: true,
        showLinkButton: false,
      };
    }
    // eslint-disable-next-line no-fallthrough
    case LinkType.Default:
    default: {
      return {
        showLinkIframe: false,
        showLinkButton: false,
      };
    }
  }
};
