import {
  ItemType,
  LinkItemType,
  PackedLinkItemFactory,
  buildLinkExtra,
} from '@graasp/sdk';

import { CURRENT_USER } from './members';

export const GRAASP_LINK_ITEM: LinkItemType = PackedLinkItemFactory({
  creator: CURRENT_USER,
  extra: buildLinkExtra({
    url: 'https://graasp.eu',
    html: '',
    thumbnails: ['https://graasp.eu/img/epfl/logo-tile.png'],
    icons: [
      'https://graasp.eu/cdn/img/epfl/favicons/favicon-32x32.png?v=yyxJ380oWY',
    ],
  }),
});

export const GRAASP_LINK_ITEM_IFRAME_ONLY: LinkItemType = PackedLinkItemFactory(
  {
    ...GRAASP_LINK_ITEM,
    id: 'ecafbd2a-5688-11eb-ae91-0242ac130122',
    settings: {
      showLinkIframe: true,
      showLinkButton: false,
    },
  },
);

export const YOUTUBE_LINK_ITEM: LinkItemType = PackedLinkItemFactory({
  type: ItemType.LINK,
  name: 'graasp youtube link',
  description: 'a description for graasp youtube link',
  creator: CURRENT_USER,
  extra: buildLinkExtra({
    url: 'https://www.youtube.com/watch?v=FmiEgBMTPLo',
    html: '<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/FmiEgBMTPLo" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>',
    icons: ['https://www.youtube.com/s/desktop/f0ff6c1d/img/favicon_96.png'],
  }),
  settings: {
    // this is necessary for Youtube to show the embed
    showLinkIframe: true,
  },
});
