import { ROOT_ID } from './constants';

export const ITEMS_KEY = 'items';
export const OWN_ITEMS_KEY = [ITEMS_KEY, 'own'];
export const buildItemKey = (id) => [ITEMS_KEY, id];
export const buildItemChildrenKey = (id) => [ITEMS_KEY, id, 'children'];
export const SHARED_ITEMS_KEY = 'shared';
export const CURRENT_MEMBER_KEY = 'currentMember';
export const buildItemParentsKey = (id) => [ITEMS_KEY, id, 'parents'];

export const getKeyForParentId = (parentId) =>
  parentId && parentId !== ROOT_ID
    ? buildItemChildrenKey(parentId)
    : OWN_ITEMS_KEY;

export const POST_ITEM_MUTATION_KEY = 'postItem';
export const EDIT_ITEM_MUTATION_KEY = 'editItem';
export const DELETE_ITEM_MUTATION_KEY = 'deleteItem';
export const DELETE_ITEMS_MUTATION_KEY = 'deleteItems';
export const COPY_ITEM_MUTATION_KEY = 'copyItem';
export const MOVE_ITEM_MUTATION_KEY = 'moveItem';
export const SHARE_ITEM_MUTATION_KEY = 'shareItem';
export const FILE_UPLOAD_MUTATION_KEY = 'fileUpload';
export const SIGN_OUT_MUTATION_KEY = 'signOut';
export const ITEM_LOGIN_MUTATION_KEY = 'itemLoginSignIn';
export const buildItemMembershipsKey = (id) => [ITEMS_KEY, id, 'memberships'];
export const buildItemLoginKey = (id) => [ITEMS_KEY, id, 'login'];
export const PUT_ITEM_LOGIN_MUTATION_KEY = 'putItemLogin';
export const ITEM_TAGS = 'itemTags';
export const POST_ITEM_TAG_MUTATION_KEY = 'postItemTags';
export const buildItemTagsKey = (id) => [ITEMS_KEY, id, 'tags'];
export const DELETE_ITEM_TAG_MUTATION_KEY = 'deleteItemTag';
