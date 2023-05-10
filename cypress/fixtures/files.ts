import { ItemType, MimeTypes } from '@graasp/sdk';

import { InternalItemType } from '../../src/config/types';
import { buildFileExtra, buildS3FileExtra } from '../../src/utils/itemExtra';
import { LocalFileItemForTest, S3FileItemForTest } from '../support/types';
import { MOCK_IMAGE_URL, MOCK_PDF_URL, MOCK_VIDEO_URL } from './fileLinks';
import { CURRENT_USER } from './members';

export const ICON_FILEPATH = 'files/icon.png';
export const VIDEO_FILEPATH = 'files/video.mp4';
export const TEXT_FILEPATH = 'files/sometext.txt';

export const IMAGE_ITEM_DEFAULT: LocalFileItemForTest = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ItemType.LOCAL_FILE,
  path: 'bd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildFileExtra({
    name: 'icon.png',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 32439,
    mimetype: 'image/png',
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_IMAGE_URL,
};

export const VIDEO_ITEM_DEFAULT: LocalFileItemForTest = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'video.mp4',
  description: 'a default video description',
  type: ItemType.LOCAL_FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildFileExtra({
    name: 'video.mp4',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 52345,
    mimetype: MimeTypes.Video.MP4,
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: VIDEO_FILEPATH,
  readFilepath: MOCK_VIDEO_URL,
};

export const PDF_ITEM_DEFAULT: LocalFileItemForTest = {
  id: 'cd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ItemType.LOCAL_FILE,
  path: 'cd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildFileExtra({
    name: 'doc.pdf',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 54321,
    mimetype: MimeTypes.PDF,
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_PDF_URL,
};

export const ZIP_DEFAULT = {
  type: InternalItemType.ZIP,
  filepath: 'files/graasp.zip',
};

export const IMAGE_ITEM_S3: S3FileItemForTest = {
  id: 'ad5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ItemType.S3_FILE,
  path: 'ad5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildS3FileExtra({
    path: MOCK_IMAGE_URL, // for testing
    size: 32439,
    mimetype: MimeTypes.Image.PNG,
    name: 'myfile',
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_IMAGE_URL,
};

export const VIDEO_ITEM_S3: S3FileItemForTest = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a93',
  name: 'video.mp4',
  description: 'a default video description',
  type: ItemType.S3_FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a93',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildS3FileExtra({
    path: MOCK_VIDEO_URL, // for testing
    size: 52345,
    mimetype: MimeTypes.Video.MP4,
    name: 'myfile',
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: VIDEO_FILEPATH,
  readFilepath: MOCK_VIDEO_URL,
};

export const PDF_ITEM_S3: S3FileItemForTest = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ItemType.S3_FILE,
  path: 'bd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER,
  createdAt: new Date('2021-03-16T16:00:50.968Z'),
  updatedAt: new Date('2021-03-16T16:00:52.655Z'),
  settings: {},
  extra: buildS3FileExtra({
    path: MOCK_PDF_URL, // for testing
    size: 54321,
    mimetype: MimeTypes.PDF,
    name: 'myfile',
    altText: 'myAltText',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_PDF_URL,
};
