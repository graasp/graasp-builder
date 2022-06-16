import { H5P_ASSETS_HOST, H5P_CONTENT_HOST } from './constants';

export const H5P_FRAME_JS_PATH = `${H5P_ASSETS_HOST}/frame.bundle.js`;
export const H5P_FRAME_CSS_PATH = `${H5P_ASSETS_HOST}/styles/h5p.css`;
export const buildServeH5PContentURL = (contentPath) =>
  `${H5P_CONTENT_HOST}/${contentPath}`;
