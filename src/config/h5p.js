import { API_ROUTES } from '@graasp/query-client';
import { API_HOST, H5P_ASSETS_HOST } from './constants';

const { buildServeH5PContentRoute } = API_ROUTES;

export const H5P_FRAME_JS_PATH = `${H5P_ASSETS_HOST}/frame.bundle.js`;
export const H5P_FRAME_CSS_PATH = `${H5P_ASSETS_HOST}/styles/h5p.css`;
export const buildServeH5PContentURL = (id) =>
  `${API_HOST}/${buildServeH5PContentRoute(id)}`;
