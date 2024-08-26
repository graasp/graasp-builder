import {
  Category,
  ChatMention,
  ChatMessage,
  CompleteMember,
  DiscriminatedItem,
  Invitation,
  ItemBookmark,
  ItemCategory,
  ItemLoginSchema,
  ItemMembership,
  ItemPublished,
  ItemTag,
  ItemValidationGroup,
  LocalFileItemType,
  PermissionLevel,
  PublicationStatus,
  RecycledItemData,
  S3FileItemType,
  ShortLink,
} from '@graasp/sdk';

// TODO: not the best way, to change with mirage?
export type ItemForTest = DiscriminatedItem & {
  categories?: ItemCategory[];
  thumbnails?: string;
  tags?: ItemTag[];
  itemLoginSchema?: ItemLoginSchema;
  readFilepath?: string;
  chat?: ChatMessage[];
  memberships?: ItemMembership[];
  invitations?: Invitation[];
  published?: ItemPublished;
  permission?: PermissionLevel;
  public?: ItemTag;
};

// TODO: not ideal, to change?
export type MemberForTest = CompleteMember & { thumbnails?: string };

export type LocalFileItemForTest = LocalFileItemType & {
  createFilepath: string;
  readFilepath: string;
};
export type S3FileItemForTest = S3FileItemType & {
  createFilepath: string;
  readFilepath: string;
};
export type FileItemForTest = LocalFileItemForTest | S3FileItemForTest;

export type ApiConfig = {
  items?: ItemForTest[];
  recycledItems?: DiscriminatedItem[];
  members?: MemberForTest[];
  currentMember?: MemberForTest;
  mentions?: ChatMention[];
  categories?: Category[];
  shortLinks?: ShortLink[];
  itemId?: DiscriminatedItem['id'];
  bookmarkedItems?: ItemBookmark[];
  recycledItemData?: RecycledItemData[];
  itemPublicationStatus?: PublicationStatus;
  publishedItemData?: ItemPublished[];
  // statuses = SAMPLE_STATUSES,
  itemValidationGroups?: ItemValidationGroup[];
  deleteItemsError?: boolean;
  postItemError?: boolean;
  moveItemsError?: boolean;
  copyItemsError?: boolean;
  getItemError?: boolean;
  editItemError?: boolean;
  shareItemError?: boolean;
  getMemberError?: boolean;
  defaultUploadError?: boolean;
  defaultDownloadFileError?: boolean;
  getCurrentMemberError?: boolean;
  postItemTagError?: boolean;
  postItemLoginError?: boolean;
  putItemLoginError?: boolean;
  editMemberError?: boolean;
  postItemFlagError?: boolean;
  getItemChatError?: boolean;
  recycleItemsError?: boolean;
  getRecycledItemsError?: boolean;
  deleteItemTagError?: boolean;
  restoreItemsError?: boolean;
  getItemThumbnailError?: boolean;
  getAvatarUrlError?: boolean;
  postItemThumbnailError?: boolean;
  postAvatarError?: boolean;
  importZipError?: boolean;
  getCategoriesError?: boolean;
  getItemCategoriesError?: boolean;
  postItemCategoryError?: boolean;
  deleteItemCategoryError?: boolean;
  postInvitationsError?: boolean;
  getItemInvitationsError?: boolean;
  patchInvitationError?: boolean;
  deleteInvitationError?: boolean;
  updatePasswordError?: boolean;
  postItemChatMessageError?: boolean;
  clearItemChatError?: boolean;
  getMemberMentionsError?: boolean;
  getAppLinkError?: boolean;
  appApiAccessTokenError?: boolean;
  getAppDataError?: boolean;
  postAppDataError?: boolean;
  patchAppDataError?: boolean;
  deleteAppDataError?: boolean;
  getPublishedItemsError?: boolean;
  importH5pError?: boolean;
  deleteShortLinkError?: boolean;
  patchShortLinkError?: boolean;
  postShortLinkError?: boolean;
  getShortLinkAvailable?: boolean;
  getShortLinksItemError?: boolean;
  deleteFavoriteError?: boolean;
  addFavoriteError?: boolean;
  getFavoriteError?: boolean;
};
