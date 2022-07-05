import { H5P_ASSETS_BASE_URL, H5P_CONTENT_BASE_URL } from './constants';

export const H5P_FRAME_JS_PATH = `${H5P_ASSETS_BASE_URL}/frame.bundle.js`;
export const H5P_FRAME_CSS_PATH = `${H5P_ASSETS_BASE_URL}/styles/h5p.css`;
export const buildServeH5PContentURL = (contentPath) =>
  `${H5P_CONTENT_BASE_URL}/${contentPath}`;
