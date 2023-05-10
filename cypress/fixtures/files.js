import { ItemType, MimeTypes } from '@graasp/sdk';

import { buildFileExtra, buildS3FileExtra } from '../../src/utils/itemExtra';
import { ITEM_TYPES } from './enums';
import { MOCK_IMAGE_URL, MOCK_PDF_URL, MOCK_VIDEO_URL } from './fileLinks';
import { CURRENT_USER } from './members';

export const ICON_FILEPATH = 'files/icon.png';
export const VIDEO_FILEPATH = 'files/video.mp4';
export const TEXT_FILEPATH = 'files/sometext.txt';

export const IMAGE_ITEM_DEFAULT = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ItemType.LOCAL_FILE,
  path: 'bd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildFileExtra({
    name: 'icon.png',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 32439,
    encoding: '7bit',
    mimetype: 'image/png',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_IMAGE_URL,
};

export const VIDEO_ITEM_DEFAULT = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'video.mp4',
  description: 'a default video description',
  type: ItemType.LOCAL_FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildFileExtra({
    name: 'video.mp4',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 52345,
    encoding: '7bit',
    mimetype: MimeTypes.Video.MP4,
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: VIDEO_FILEPATH,
  readFilepath: MOCK_VIDEO_URL,
};

export const PDF_ITEM_DEFAULT = {
  id: 'cd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ItemType.LOCAL_FILE,
  path: 'cd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildFileExtra({
    name: 'doc.pdf',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 54321,
    encoding: '7bit',
    mimetype: MimeTypes.PDF,
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_PDF_URL,
};

export const ZIP_DEFAULT = {
  // todo: move this one to sdk
  type: ITEM_TYPES.ZIP,
  filepath: 'files/graasp.zip',
};

export const IMAGE_ITEM_S3 = {
  id: 'ad5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ItemType.S3_FILE,
  path: 'ad5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    path: MOCK_IMAGE_URL, // for testing
    size: 32439,
    mimetype: 'image/png',
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_IMAGE_URL,
};

export const VIDEO_ITEM_S3 = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a93',
  name: 'video.mp4',
  description: 'a default video description',
  type: ItemType.S3_FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a93',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    path: MOCK_VIDEO_URL, // for testing
    size: 52345,
    mimetype: MimeTypes.Video.MP4,
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: VIDEO_FILEPATH,
  readFilepath: MOCK_VIDEO_URL,
};

export const PDF_ITEM_S3 = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ItemType.S3_FILE,
  path: 'bd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    path: MOCK_PDF_URL, // for testing
    size: 54321,
    mimetype: MimeTypes.PDF,
  }),
  // for testing: creating needs a fixture, reading needs an url
  createFilepath: ICON_FILEPATH,
  readFilepath: MOCK_PDF_URL,
};
