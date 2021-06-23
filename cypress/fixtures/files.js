import { ITEM_TYPES, MIME_TYPES } from '../../src/enums';
import { buildFileExtra, buildS3FileExtra } from '../../src/utils/itemExtra';
import { CURRENT_USER } from './members';

export const ICON_FILEPATH = 'files/icon.png';
export const TEXT_FILEPATH = 'files/sometext.txt';

export const IMAGE_ITEM_DEFAULT = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ITEM_TYPES.FILE,
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
  // for testing
  filepath: 'files/icon.png',
};

export const VIDEO_ITEM_DEFAULT = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'video.mp4',
  description: 'a default video description',
  type: ITEM_TYPES.FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildFileExtra({
    name: 'video.mp4',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 52345,
    encoding: '7bit',
    mimetype: MIME_TYPES.VIDEO[0],
  }),
  // for testing
  filepath: 'files/video.mp4',
};

export const PDF_ITEM_DEFAULT = {
  id: 'cd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ITEM_TYPES.FILE,
  path: 'cd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildFileExtra({
    name: 'doc.pdf',
    path: '9a95/e2e1/2a7b-1615910428274',
    size: 54321,
    encoding: '7bit',
    mimetype: MIME_TYPES.PDF[0],
  }),
  // for testing
  filepath: 'files/doc.pdf',
};

export const IMAGE_ITEM_S3 = {
  id: 'ad5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'icon.png',
  description: 'a default image description',
  type: ITEM_TYPES.S3_FILE,
  path: 'ad5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    key: 'files/icon.png', // for testing
    size: 32439,
    contenttype: 'image/png',
  }),
};

export const VIDEO_ITEM_S3 = {
  id: 'qd5519a2-5ba9-4305-b221-185facbe6a93',
  name: 'video.mp4',
  description: 'a default video description',
  type: ITEM_TYPES.S3_FILE,
  path: 'qd5519a2_5ba9_4305_b221_185facbe6a93',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    key: 'files/video.mp4', // for testing
    size: 52345,
    contenttype: MIME_TYPES.VIDEO[0],
  }),
};

export const PDF_ITEM_S3 = {
  id: 'bd5519a2-5ba9-4305-b221-185facbe6a99',
  name: 'doc.pdf',
  description: 'a default pdf description',
  type: ITEM_TYPES.S3_FILE,
  path: 'bd5519a2_5ba9_4305_b221_185facbe6a99',
  creator: CURRENT_USER.id,
  createdAt: '2021-03-16T16:00:50.968Z',
  updatedAt: '2021-03-16T16:00:52.655Z',
  extra: buildS3FileExtra({
    key: 'files/doc.pdf', // for testing
    size: 54321,
    contenttype: MIME_TYPES.PDF[0],
  }),
};
