import { GRAASP_PERFORM_HOST } from './constants';

export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/shared';
export const FAVORITE_ITEMS_PATH = '/favorite';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const GROUP_PATH = '/group';
export const buildItemPath = (id = ':itemId') => `${ITEMS_PATH}/${id}`;
export const REDIRECT_PATH = '/redirect';
export const MEMBER_PROFILE_PATH = '/profile';
export const buildItemSettingsPath = (id = ':itemId') =>
  `${ITEMS_PATH}/${id}/settings`;
export const buildGraaspPerformView = (id) => `${GRAASP_PERFORM_HOST}/${id}`;
export const buildGraaspComposeView = (id) =>
  `${window.location.origin}${buildItemPath(id)}`;
export const buildGraaspGroupViewSelector = (id = ':groupId') =>
  `${GROUP_PATH}/${id}`;

export const combinedSelectors = (link1, link2) => `${link1}${link2}`;

//
// export const buildGraaspGroupViewSelector = (link,id=':groupId',) => `${GROUP_PATH}/${id}${link}`
//
// export const buildGraaspGroupView = (link,groupId = ':groupId') => {
//   if(groupId===':groupId'){
//     return link
//   }
//   return `${GROUP_PATH}/${groupId}${link}`
// }

export const linkBuilder = ({ itemId = 'itemId', groupId }) => ({
  ITEM_PATH:
    groupId !== ''
      ? combinedSelectors(buildGraaspGroupViewSelector(groupId), ITEMS_PATH)
      : ITEMS_PATH,
  HOME_PATH:
    groupId !== ''
      ? combinedSelectors(buildGraaspGroupViewSelector(groupId), HOME_PATH)
      : HOME_PATH,
  SHARED_ITEMS_PATH:
    groupId !== ''
      ? combinedSelectors(
          buildGraaspGroupViewSelector(groupId),
          SHARED_ITEMS_PATH,
        )
      : SHARED_ITEMS_PATH,
  FAVORITE_ITEMS_PATH:
    groupId !== ''
      ? combinedSelectors(
          buildGraaspGroupViewSelector(groupId),
          FAVORITE_ITEMS_PATH,
        )
      : FAVORITE_ITEMS_PATH,
  buildItemPath:
    groupId !== ''
      ? combinedSelectors(
          buildGraaspGroupViewSelector(groupId),
          buildItemPath(itemId),
        )
      : buildItemPath(itemId),
});
