import {
  EmbeddedLinkItemFactory,
  EmbeddedLinkItemType,
  ItemType,
} from '@graasp/sdk';

import { buildEmbeddedLinkExtra } from '../../src/utils/itemExtra';
import { CURRENT_USER } from './members';

export const GRAASP_LINK_ITEM: EmbeddedLinkItemType = EmbeddedLinkItemFactory({
  id: 'ecafbd2a-5688-11eb-ae91-0242ac130002',
  type: ItemType.LINK,
  name: 'graasp link',
  description: 'a description for graasp link',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  creator: CURRENT_USER,
  settings: {},
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  extra: buildEmbeddedLinkExtra({
    url: 'https://graasp.eu',
    html: '',
    thumbnails: ['https://graasp.eu/img/epfl/logo-tile.png'],
    icons: [
      'https://graasp.eu/cdn/img/epfl/favicons/favicon-32x32.png?v=yyxJ380oWY',
    ],
  }),
});

export const GRAASP_LINK_ITEM_NO_PROTOCOL: EmbeddedLinkItemType =
  EmbeddedLinkItemFactory({
    id: 'ecafbd2a-5688-11eb-ae91-0242ac130002',
    type: ItemType.LINK,
    name: 'graasp link',
    description: 'a description for graasp link',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    creator: CURRENT_USER,
    settings: {},
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
    extra: buildEmbeddedLinkExtra({
      url: 'graasp.eu',
      html: '',
      thumbnails: ['https://graasp.eu/img/epfl/logo-tile.png'],
      icons: [
        'https://graasp.eu/cdn/img/epfl/favicons/favicon-32x32.png?v=yyxJ380oWY',
      ],
    }),
  });

export const GRAASP_LINK_ITEM_IFRAME_ONLY: EmbeddedLinkItemType =
  EmbeddedLinkItemFactory({
    ...GRAASP_LINK_ITEM,
    id: 'ecafbd2a-5688-11eb-ae91-0242ac130122',
    settings: {
      showLinkIframe: true,
      showLinkButton: false,
    },
  });

export const YOUTUBE_LINK_ITEM: EmbeddedLinkItemType = EmbeddedLinkItemFactory({
  id: 'gcafbd2a-5688-11eb-ae93-0242ac130002',
  type: ItemType.LINK,
  name: 'graasp youtube link',
  description: 'a description for graasp youtube link',
  settings: {},
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  creator: CURRENT_USER,
  path: 'gcafbd2a_5688_11eb_ae93_0242ac130002',
  extra: buildEmbeddedLinkExtra({
    url: 'https://www.youtube.com/watch?v=FmiEgBMTPLo',
    html: '<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/FmiEgBMTPLo" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>',
    thumbnails: ['https://i.ytimg.com/vi/FmiEgBMTPLo/maxresdefault.jpg'],
    icons: ['https://www.youtube.com/s/desktop/f0ff6c1d/img/favicon_96.png'],
  }),
});

export const INVALID_LINK_ITEM: EmbeddedLinkItemType = EmbeddedLinkItemFactory({
  id: 'gcafbd2a-5688-11eb-ae93-0242ac130001',
  path: 'gcafbd2a_5688_11eb_ae93_0242ac130001',
  type: ItemType.LINK,
  creator: CURRENT_USER,
  settings: {},
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  name: 'graasp youtube link',
  description: 'a description for graasp youtube link',
  extra: buildEmbeddedLinkExtra({
    url: 'wrong link',
    html: '',
    thumbnails: [],
    icons: [],
  }),
});
