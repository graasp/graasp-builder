import {
  Category,
  ChatMention,
  ChatMessage,
  CompleteMember,
  DiscriminatedItem,
  Invitation,
  ItemCategory,
  ItemLoginSchema,
  ItemMembership,
  ItemPublished,
  ItemTag,
  ItemValidationGroup,
  LocalFileItemType,
  Member,
  S3FileItemType,
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
  currentMember?: Member;
  mentions?: ChatMention[];
  categories?: Category[];
  // statuses = SAMPLE_STATUSES,
  // itemValidationAndReview = ITEM_VALIDATION_AND_REVIEW,
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
};
