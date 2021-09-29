const parseStringForId = (string) => string.replaceAll('+', '');

export const ITEM_DELETE_BUTTON_CLASS = 'itemDeleteButton';
export const ITEM_COPY_BUTTON_CLASS = 'itemCopyButton';
export const ITEM_MOVE_BUTTON_CLASS = 'itemMoveButton';
export const CONFIRM_DELETE_BUTTON_ID = 'confirmDeleteButton';
export const buildItemCard = (id) => `itemCard-${id}`;
export const CREATE_ITEM_BUTTON_ID = 'createItemButton';
export const ITEM_FORM_NAME_INPUT_ID = 'newItemNameInput';
export const ITEM_FORM_DESCRIPTION_INPUT_ID = 'newItemDescriptionInput';
export const ITEM_FORM_IMAGE_INPUT_ID = 'newItemImageInput';
export const ITEM_FORM_CONFIRM_BUTTON_ID = 'newItemConfirmButton';
export const ITEM_SCREEN_ERROR_ALERT_ID = 'itemScreenErrorAlert';
export const buildItemLink = (id) => `itemLink-${id}`;
export const NAVIGATION_HOME_LINK_ID = 'navigationHomeLink';
export const buildNavigationLink = (id) => `navigationLink-${id}`;
export const ITEM_MENU_MOVE_BUTTON_CLASS = 'itemMenuMoveButton';
export const ITEM_MENU_BUTTON_CLASS = 'itemMenuButton';
export const ITEM_MENU_COPY_BUTTON_CLASS = 'itemMenuCopyButton';
export const buildItemMenu = (id) => `itemMenu-${id}`;
export const TREE_MODAL_TREE_ID = 'treeModalTree';
export const buildTreeItemClass = (id) => `treeItem-${id}`;
export const TREE_MODAL_CONFIRM_BUTTON_ID = 'treeModalConfirmButton';
export const ITEMS_GRID_NO_ITEM_ID = 'itemsGridNoItem';
export const EDIT_ITEM_BUTTON_CLASS = 'editButton';
export const FAVORITE_ITEM_BUTTON_CLASS = 'favoriteButton';
export const SHARE_ITEM_BUTTON_CLASS = 'itemMenuShareButton';
export const SHARE_ITEM_EMAIL_INPUT_ID = 'shareItemModalEmailInput';
export const buildPermissionOptionId = (id) => `permission-${id}`;
export const SHARE_ITEM_SHARE_BUTTON_ID = 'shareItemModalShareButton';
export const MODE_LIST_BUTTON_ID = 'modeListButton';

export const MODE_GRID_BUTTON_ID = 'modeCardButton';
export const SHARED_ITEMS_ID = 'sharedItems';
export const FAVORITE_ITEMS_ID = 'favoriteItems';
export const OWNED_ITEMS_ID = 'ownedItems';
export const ITEMS_TABLE_BODY = 'itemsTableBody';
export const buildItemsTableRowId = (id) => `itemsTableRow-${id}`;
export const ITEMS_TABLE_EMPTY_ROW_ID = 'itemsTableEmptyRow';
export const ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID =
  'itemsTableDeleteSelectedItems';
export const ITEMS_TABLE_COPY_SELECTED_ITEMS_ID = 'itemsTableCopySelectedItems';
export const ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID = 'itemsTableMoveSelectedItems';
export const ITEMS_TABLE_ROW_CHECKBOX_CLASS = 'itemsTableRowCheckbox';
export const UPLOADER_ID = 'uploader';
export const UPLOADER_DROP_ZONE_ITEMS_CLASS = 'uppy-Root';
export const buildFileItemId = (id) => `file-${id}`;
export const buildS3FileItemId = (id) => `s3File-${id}`;
export const ITEM_PANEL_ID = 'itemPanelMetadata';
export const ITEM_PANEL_NAME_ID = 'itemPanelName';
export const ITEM_PANEL_TABLE_ID = 'itemPanelTable';
export const CREATE_ITEM_FOLDER_ID = 'createItemSpace';
export const CREATE_ITEM_LINK_ID = 'createItemLink';
export const CREATE_ITEM_FILE_ID = 'createItemFile';
export const ITEM_FORM_LINK_INPUT_ID = 'itemFormLinkInput';
export const DASHBOARD_UPLOADER_ID = 'dashboardUploader';
export const CREATE_ITEM_CLOSE_BUTTON_ID = 'createItemCloseButton';
export const HEADER_APP_BAR_ID = 'headerAppBar';
export const HEADER_USER_ID = 'headerUser';
export const USER_MENU_SIGN_OUT_OPTION_ID = 'userMenuSignOutOption';
export const NAVIGATION_HIDDEN_PARENTS_ID = 'navigationHiddenParents';
export const ITEM_LOGIN_SCREEN_ID = 'itemLoginScreen';
export const ITEM_LOGIN_SIGN_IN_USERNAME_ID = 'itemLoginSignInUsername';
export const ITEM_LOGIN_SIGN_IN_PASSWORD_ID = 'itemLoginSignInPassword';
export const ITEM_LOGIN_SIGN_IN_BUTTON_ID = 'itemLoginSignInButton';
export const ITEM_SCREEN_MAIN_ID = 'itemScreenMain';
export const ITEM_LOGIN_SCREEN_FORBIDDEN_ID = 'itemLoginScreenForbidden';
export const ITEM_LOGIN_SETTING_SWITCH_ID = 'itemLoginSettingSwitch';
export const ITEM_LOGIN_SETTING_MODE_SELECT_ID = 'itemLoginSettingModeSelect';
export const buildItemLoginSettingModeSelectOption = (id) =>
  `itemLoginSettingModeSelectOptions-${parseStringForId(id)}`;
export const ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID = 'itemLoginSignInMemberId';
export const ITEM_LOGIN_SIGN_IN_MODE_ID = 'itemLoginSignInMode';
export const buildItemLoginSignInModeOption = (id) =>
  `itemLoginSignInModeOption-${id}`;
export const ITEM_MAIN_CLASS = 'itemMain';
export const HOME_ERROR_ALERT_ID = 'homeErrorAlert';
export const SHARED_ITEMS_ERROR_ALERT_ID = 'sharedItemsErrorAlert';
export const FAVORITE_ITEMS_ERROR_ALERT_ID = 'favoriteItemsErrorAlert';
export const ITEM_MENU_SHORTCUT_BUTTON_CLASS = 'itemMenuShortcutButton';
export const ITEM_MENU_FAVORITE_BUTTON_CLASS = 'itemMenuFavoriteButton';
export const ITEM_MENU_FLAG_BUTTON_CLASS = 'itemMenuFlagButton';
export const buildFlagListItemId = (id) => `flagListItem-${id}`;
export const FLAG_ITEM_BUTTON_ID = 'flagItemButton';
export const CREATE_ITEM_DOCUMENT_ID = 'createItemDocument';
export const ITEM_FORM_DOCUMENT_TEXT_ID = 'itemFormDocumentText';
export const ITEM_FORM_DOCUMENT_TEXT_SELECTOR = `#${ITEM_FORM_DOCUMENT_TEXT_ID} .ql-editor`;
export const DOCUMENT_ITEM_TEXT_EDITOR_ID = 'documentItemTextEditor';
export const DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR = `#${DOCUMENT_ITEM_TEXT_EDITOR_ID} .ql-editor`;
export const CREATE_ITEM_APP_ID = 'createItemApp';
export const ITEM_FORM_APP_URL_ID = 'itemFormAppUrl';
export const TEXT_EDITOR_CLASS = 'ql-editor';
export const buildSaveButtonId = (id) => `saveButton-${id}`;
export const MEMBER_PROFILE_MEMBER_ID_ID = 'memberProfileMemberId';
export const MEMBER_PROFILE_MEMBER_NAME_ID = 'memberProfileMemberName';
export const MEMBER_PROFILE_EMAIL_ID = 'memberProfileEmail';
export const MEMBER_PROFILE_INSCRIPTION_DATE_ID =
  'memberProfileInscriptionDate';
export const MEMBER_PROFILE_LANGUAGE_SWITCH_ID = 'memberProfileLanguageSwitch';
export const MEMBER_PROFILE_MEMBER_ID_COPY_BUTTON_ID =
  'memberProfileMemberIdCopyButton';
export const REDIRECTION_CONTENT_ID = 'redirectionContent';
export const ITEM_MEMBERSHIPS_CONTENT_ID = 'itemMembershipsContent';
export const buildMemberAvatarClass = (id) => `memberAvatar-${id}`;
export const ITEM_SETTINGS_BUTTON_CLASS = 'itemSettingsButton';
export const buildItemMembershipRowId = (id) => `itemMembershipRow-${id}`;
export const ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS =
  'itemMembershipPermissionSelect';
export const buildItemMembershipRowDeleteButtonId = (id) =>
  `itemMembershipRowDeleteButtonId-${id}`;
export const ITEM_INFORMATION_ICON_IS_OPEN_CLASS = 'itemInformationIconIsOpen';
export const ITEM_INFORMATION_BUTTON_ID = 'itemInformationButton';
export const ITEM_SEARCH_INPUT_ID = 'itemSearchInput';
export const ITEMS_GRID_NO_SEARCH_RESULT_ID = 'itemsGridNoSearchResult';
export const ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID =
  'itemsGridItemsPerPageSelect';
export const ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID =
  'itemsGridItemsPerPageSelectLabel';
export const ITEMS_GRID_PAGINATION_ID = 'itemsGridPagination';
export const buildItemsGridPaginationButton = (page) =>
  `button[aria-label="page ${page}"].MuiPaginationItem-page`;
export const buildItemsGridPaginationButtonSelected = (page) =>
  `${buildItemsGridPaginationButton(page)}.Mui-selected`;
export const ITEM_HEADER_ID = 'itemHeader';
export const buildShareButtonId = (id) => `shareButton-${id}`;
export const buildPerformButtonId = (id) => `performButton-${id}`;
export const buildEditButtonId = (id) => `editButton-${id}`;
export const buildSettingsButtonId = (id) => `settingsButton-${id}`;
export const PUBLIC_SETTING_SWITCH_ID = 'publicSettingSwitch';
export const SHARE_ITEM_DIALOG_ID = 'shareItemDialog';
export const SHARE_ITEM_DIALOG_LINK_ID = 'shareItemDialogLink';
export const SHARE_ITEM_DIALOG_LINK_SELECT_ID = 'shareItemDialogLinkSelect';
export const ACCESS_INDICATION_ID = 'accessIndication';
export const ITEM_CHATBOX_BUTTON_ID = 'itemChatboxButton';
export const CHATBOX_ID = 'chatbox';
export const CHATBOX_INPUT_BOX_ID = 'chatboxInputBox';
export const CONFIRM_RECYCLE_BUTTON_ID = 'confirmRecycleButton';
export const SHARE_ITEM_VISIBILITY_SELECT_ID = 'shareItemVisiblitySelect';
export const SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID =
  'shareItemPseudonymizedSchema';
