// todo: this makes tests slow because it compiles ui everytime
// import { Platform } from '@graasp/ui';
import {
  DescriptionPlacementType,
  PublicationStatus,
  ShortLink,
} from '@graasp/sdk';

export const RECYCLED_ITEMS_ROOT_CONTAINER = 'recycledItemsPageRootContainer';
export const HEADER_APP_BAR_ID = 'headerAppBar';
export const ITEM_DELETE_BUTTON_CLASS = 'itemDeleteButton';
export const ITEM_COPY_BUTTON_CLASS = 'itemCopyButton';
export const ITEM_MOVE_BUTTON_CLASS = 'itemMoveButton';
export const CONFIRM_DELETE_BUTTON_ID = 'confirmDeleteButton';
export const buildItemCard = (id: string): string => `itemCard-${id}`;
export const CREATE_ITEM_BUTTON_ID = 'createItemButton';
export const ITEM_FORM_NAME_INPUT_ID = 'newItemNameInput';
export const ITEM_FORM_DISPLAY_NAME_INPUT_ID = 'newItemDisplayNameInput';
export const ITEM_FORM_CONFIRM_BUTTON_ID = 'newItemConfirmButton';
export const ITEM_SCREEN_ERROR_ALERT_ID = 'itemScreenErrorAlert';
export const NAVIGATION_HOME_LINK_ID = 'navigationHomeLink';
export const buildNavigationLink = (id: string): string =>
  `navigationLink-${id}`;
export const ITEM_MENU_MOVE_BUTTON_CLASS = 'itemMenuMoveButton';
export const ITEM_MENU_BUTTON_CLASS = 'itemMenuButton';
export const ITEM_MENU_COPY_BUTTON_CLASS = 'itemMenuCopyButton';
export const ITEM_MENU_RECYCLE_BUTTON_CLASS = 'itemMenuRecycleButton';
export const buildItemMenu = (id: string): string => `itemMenu-${id}`;
export const HOME_MODAL_ITEM_ID = 'treeModalHomeItem';
export const buildNavigationModalItemId = (id: string): string =>
  `${HOME_MODAL_ITEM_ID}-${id}`;
export const ROOT_MODAL_ID = 'rootModal';

export const buildTreeItemId = (id: string, treeRootId: string): string =>
  `${treeRootId}-${id}`;
export const buildItemRowArrowId = (id: string): string =>
  `treeModalMyItems-${id}-arrow`;
export const TREE_MODAL_CONFIRM_BUTTON_ID = 'treeModalConfirmButton';
export const ITEMS_GRID_NO_ITEM_ID = 'itemsGridNoItem';
export const EDIT_ITEM_BUTTON_CLASS = 'editButton';
export const PIN_ITEM_BUTTON_CLASS = 'pinButton';
export const COLLAPSE_ITEM_BUTTON_CLASS = 'collapseButton';
export const HIDDEN_ITEM_BUTTON_CLASS = 'hideButton';
export const buildHideButtonId = (hidden: boolean): string =>
  `hideButton-${hidden ? 'hidden' : 'visible'}`;
export const SHARE_ITEM_BUTTON_CLASS = 'itemMenuShareButton';
export const PUBLISH_ITEM_BUTTON_CLASS = 'publishItemButton';
export const RESTORE_ITEMS_BUTTON_CLASS = 'itemMenuRestoreButton';
export const SHARE_ITEM_EMAIL_INPUT_ID = 'shareItemModalEmailInput';
export const buildPermissionOptionId = (id: string): string =>
  `permission-${id}`;
export const SHARE_ITEM_SHARE_BUTTON_ID = 'shareItemModalShareButton';
export const SHARE_BUTTON_SELECTOR = 'shareItem';
export const SHARE_BUTTON_MORE_ID = 'shareItemMore';

export const PUBLISHED_ITEMS_ID = 'publishedItems';
export const BOOKMARKED_ITEMS_ID = 'bookmarkedItems';
export const buildFileItemId = (id: string): string => `file-${id}`;
export const ITEM_PANEL_ID = 'itemPanelMetadata';
export const ITEM_PANEL_NAME_ID = 'itemPanelName';
export const ITEM_PANEL_TABLE_ID = 'itemPanelTable';
export const CREATE_ITEM_FOLDER_ID = 'createItemFolder';
export const CREATE_ITEM_LINK_ID = 'createItemLink';
export const CREATE_ITEM_FILE_ID = 'createItemFile';
export const ITEM_FORM_LINK_INPUT_ID = 'itemFormLinkInput';
export const DASHBOARD_UPLOADER_ID = 'dashboardUploader';
export const CREATE_ITEM_CLOSE_BUTTON_ID = 'createItemCloseButton';
export const ITEM_LOGIN_SIGN_IN_USERNAME_ID = 'itemLoginSignInUsername';
export const ITEM_LOGIN_SIGN_IN_PASSWORD_ID = 'itemLoginSignInPassword';
export const ITEM_LOGIN_SIGN_IN_BUTTON_ID = 'itemLoginSignInButton';
export const ITEM_LOGIN_SCREEN_FORBIDDEN_ID = 'itemLoginScreenForbidden';
export const ITEM_LOGIN_SIGN_IN_MODE_ID = 'itemLoginSignInMode';
export const ITEM_MAIN_CLASS = 'itemMain';
export const HOME_ERROR_ALERT_ID = 'homeErrorAlert';
export const BOOKMARKED_ITEMS_ERROR_ALERT_ID = 'bookmarkedItemsErrorAlert';
export const PUBLISHED_ITEMS_ERROR_ALERT_ID = 'publishedItemsErrorAlert';
export const RECYCLED_ITEMS_ERROR_ALERT_ID = 'recycledItemsErrorAlert';
export const ITEM_MENU_SHORTCUT_BUTTON_CLASS = 'itemMenuShortcutButton';
export const ITEM_MENU_DUPLICATE_BUTTON_CLASS = 'itemMenuDuplicateButton';
export const ITEM_MENU_BOOKMARK_BUTTON_CLASS = 'itemMenuBookmarkButton';
export const ITEM_MENU_FAVORITE_BUTTON_CLASS = 'itemMenuFavoriteButton';
export const ITEM_MENU_FLAG_BUTTON_CLASS = 'itemMenuFlagButton';
export const buildFlagListItemId = (type: string): string =>
  `flagListItem-${type}`;
export const CREATE_ITEM_DOCUMENT_ID = 'createItemDocument';
export const ITEM_FORM_DOCUMENT_TEXT_ID = 'itemFormDocumentText';
export const ITEM_FORM_DOCUMENT_TEXT_SELECTOR = `#${ITEM_FORM_DOCUMENT_TEXT_ID} .ql-editor`;
export const DOCUMENT_ITEM_TEXT_EDITOR_ID = 'documentItemTextEditor';
export const DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR = `#${DOCUMENT_ITEM_TEXT_EDITOR_ID} .ql-editor`;
export const CREATE_ITEM_APP_ID = 'createItemApp';
export const CREATE_ITEM_ZIP_ID = 'createItemZip';
export const CREATE_ITEM_H5P_ID = 'createItemH5P';
export const CREATE_ITEM_ETHERPAD_ID = 'createItemEtherpad';
export const ITEM_FORM_ETHERPAD_NAME_INPUT_ID = 'itemFormEtherpadNameInputId';
export const ITEM_FORM_APP_URL_ID = 'itemFormAppUrl';
export const buildItemFormAppOptionId = (id?: string): string =>
  `app-option-${id}`;
export const TEXT_EDITOR_CLASS = 'ql-editor';
export const buildSaveButtonId = (id: string): string => `saveButton-${id}`;
export const buildCancelButtonId = (id: string): string => `cancelButton-${id}`;
export const CUSTOM_APP_CYPRESS_ID = 'custom-app';
export const FLAVOR_SELECT_ID = 'flavorSelect';

export const REDIRECTION_CONTENT_ID = 'redirectionContent';
export const ITEM_MEMBERSHIPS_CONTENT_ID = 'itemMembershipsContent';
export const buildMemberAvatarId = (id?: string): string =>
  `memberAvatar-${id}`;
export const buildItemMembershipRowId = (id: string): string =>
  `itemMembershipRow-${id}`;
export const buildItemMembershipRowSelector = (id: string): string =>
  `[data-cy="${buildItemMembershipRowId(id)}"]`;
export const ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS =
  'itemMembershipPermissionSelect';
export const buildItemMembershipRowDeleteButtonId = (id: string): string =>
  `itemMembershipRowDeleteButtonId-${id}`;
export const buildItemMembershipRowEditButtonId = (id: string): string =>
  `itemMembershipRowEditButtonId-${id}`;
export const ITEM_INFORMATION_ICON_IS_OPEN_CLASS = 'itemInformationIconIsOpen';
export const ITEM_SEARCH_INPUT_ID = 'itemSearchInput';
export const ITEMS_GRID_NO_SEARCH_RESULT_ID = 'itemsGridNoSearchResult';
export const ITEMS_GRID_ITEMS_PER_PAGE_SELECT_ID =
  'itemsGridItemsPerPageSelect';
export const ITEMS_GRID_ITEMS_PER_PAGE_SELECT_LABEL_ID =
  'itemsGridItemsPerPageSelectLabel';
export const ITEMS_GRID_PAGINATION_ID = 'itemsGridPagination';
export const buildItemsGridPaginationButton = (page: number): string =>
  `button[aria-label="page ${page}"].MuiPaginationItem-page`;
export const buildItemsGridPaginationButtonSelected = (page: number): string =>
  `${buildItemsGridPaginationButton(page)}.Mui-selected`;
export const ITEM_HEADER_ID = 'itemHeader';
export const buildShareButtonId = (id: string): string => `shareButton-${id}`;
export const buildPublishButtonId = (id: string): string =>
  `publishButton-${id}`;
export const buildDeleteButtonId = (id: string): string => `deleteButton-${id}`;
export const buildPlayerButtonId = (id: string): string => `playerButton-${id}`;
export const buildEditButtonId = (id: string): string => `editButton-${id}`;
export const buildSettingsButtonId = (id: string): string =>
  `settingsButton-${id}`;
export const SHARE_ITEM_QR_BTN_ID = 'shareItemQRBtn';
export const SHARE_ITEM_QR_DIALOG_ID = 'shareItemQRDialog';
export const ACCESS_INDICATION_ID = 'accessIndication';
export const ITEM_CHATBOX_BUTTON_ID = 'itemChatboxButton';
export const CHATBOX_ID = 'chatbox';
export const CHATBOX_INPUT_BOX_ID = 'chatboxInputBox';
export const CONFIRM_RECYCLE_BUTTON_ID = 'confirmRecycleButton';
export const SHARE_ITEM_VISIBILITY_SELECT_ID = 'shareItemVisiblitySelect';
export const buildCategorySelectionTitleId = (title: string): string =>
  `itemCategoryTitle-${title}`;
export const buildCategorySelectionId = (title: string): string =>
  `itemCategoryDropdown-${title}`;
export const buildCategoryDropdownParentSelector = (title: string): string =>
  `itemCategoryDropdownParent-${title}`;
export const SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID =
  'shareItemPseudonymizedSchema';
export const ITEM_RECYCLE_BUTTON_CLASS = 'itemRecycleButton';
export const buildItemsTableId = (id: string): string => `itemsTable-${id}`;

export const ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID =
  'imageEditAltTextTextField';

export const SETTINGS_PINNED_TOGGLE_ID = 'settingsPinnedToggle';
export const SETTINGS_CHATBOX_TOGGLE_ID = 'settingsChatboxToggle';
export const SETTINGS_COLLAPSE_TOGGLE_ID = 'settingsCollapseToggle';
export const SETTINGS_RESIZE_TOGGLE_ID = 'settingsResizeToggle';
export const SETTINGS_SAVE_ACTIONS_TOGGLE_ID = 'settingsSaveActionsToggle';
export const SETTINGS_HIDE_ITEM_ID = 'settingsHideItem';

export const ITEMS_TABLE_RESTORE_SELECTED_ITEMS_ID =
  'itemsTableRestoreSelectedItems';
export const FOLDER_FORM_DESCRIPTION_ID = 'folderFormDescription';
export const buildNameCellRendererId = (id: string): string =>
  `nameCellRenderer-${id}`;
export const THUMBNAIL_SETTING_UPLOAD_BUTTON_ID =
  'thumbnailSettingUploadButton';
export const CLEAR_CHAT_SETTING_ID = 'clearChatSettingButton';
export const CLEAR_CHAT_DIALOG_ID = 'clearChatDialog';
export const CLEAR_CHAT_CANCEL_BUTTON_ID = 'clearChatCancelButton';
export const CLEAR_CHAT_CONFIRM_BUTTON_ID = 'clearChatConfirmButton';
export const DOWNLOAD_CHAT_BUTTON_ID = 'downloadChatButton';
export const CROP_MODAL_CONFIRM_BUTTON_ID = 'cropModalConfirmButton';
export const ZIP_DASHBOARD_UPLOADER_ID = 'zipDashboardUploader';
export const H5P_DASHBOARD_UPLOADER_ID = 'h5pDashboardUploader';

export const ITEM_TAGS_OPEN_MODAL_BUTTON_CY = 'itemTagsOpenModalButton';
export const buildMultiSelectChipInputId = (id: string): string =>
  `multiSelectChipInput-${id}`;
export const MULTI_SELECT_CHIP_ADD_BUTTON_ID = 'multiSelectChipAddButton';
export const MULTI_SELECT_CHIP_CONTAINER_ID = 'multiSelectChipContainer';
export const buildMultiSelectChipsSelector = (index: number): string =>
  `multiSelectChips-${index}`;
export const buildCustomizedTagsSelector = (id: string): string =>
  `customizedTagsPreview-${id}`;

export const buildCategoriesSelectionValueSelector = (title: string): string =>
  `#${buildCategorySelectionTitleId(title)}+div span`;

export const buildCategoryMenuOptionSelector = (
  menuName: string,
  _optionIndex: number,
): string => `#${menuName} .MuiAutocomplete-option`;
export const buildDashboardButtonId = (id: string): string =>
  `dashboard-button-${id}`;
export const buildPlayerTabName = (id: string): string => `builder-tab-${id}`;

export const ITEM_PUBLISH_SECTION_TITLE_ID = 'itemPublishSectionTitle';
export const APP_NAVIGATION_PLATFORM_SWITCH_ID = 'appNavigationPlatformSwitch';
// cannot use graasp ui because it slows down a lot cypress
export const APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS = {
  builder: 'appNavigationPlatformSwitchButtonBuilder',
  player: 'appNavigationPlatformSwitchButtonPlayer',
  library: 'appNavigationPlatformSwitchButtonLibrary',
  analytics: 'appNavigationPlatformSwitchButtonAnalytics',
};

export const buildItemPublicationButton = (status: PublicationStatus): string =>
  `item${status}Button`;
export const buildItemInvitationRowDeleteButtonId = (id: string): string =>
  `itemInvitationRowDeleteButton-${id}`;
export const buildInvitationEmailTableRowId = (id: string): string =>
  `invitationEmailTableRow-${id}`;
export const buildInvitationTableRowId = (id: string): string =>
  `invitationTableRow-${id}`;
export const ITEM_RESEND_INVITATION_BUTTON_CLASS = 'itemResendInvitationButton';
export const CREATE_MEMBERSHIP_FORM_ID = 'createMembershipFormId';
export const NAVIGATION_ROOT_ID = 'navigationRoot';
export const NAVIGATION_HOME_ID = 'navigationHome';
export const HEADER_MEMBER_MENU_BUTTON_ID = 'headerMemberMenuButton';
export const HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID =
  'headerMemberMenuSeeProfileButton';
export const HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID =
  'headerMemberMenuSignInButton';

export const HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID =
  'headerMemberMenuSignOutButton';
export const buildMemberMenuItemId = (id: string): string =>
  `memberMenuItem-${id}`;
export const CO_EDITOR_SETTINGS_RADIO_GROUP_ID = 'coEditorSettingsRadioGroup';
export const CO_EDITOR_SETTINGS_CHECKBOX_ID = `coEditorSettingsCheckBox`;
export const EMAIL_NOTIFICATION_CHECKBOX = 'emailNotificationCheckbox';

export const MEMBER_CURRENT_PASSWORD_ID = 'memberCurrentPassword';
export const MEMBER_NEW_PASSWORD_ID = 'memberNewPassword';
export const MEMBER_NEW_PASSWORD_CONFIRMATION_ID =
  'memberNewPasswordConfirmation';
export const CONFIRM_CHANGE_PASSWORD_BUTTON_ID = 'confirmChangePasswordButton';
export const CONFIRM_RESET_PASSWORD_BUTTON_ID = 'confirmResetPasswordButton';
export const USER_CURRENT_PASSWORD_INPUT_ID = 'currentPasswordInput';
export const USER_NEW_PASSWORD_INPUT_ID = 'newPasswordInput';
export const USER_CONFIRM_PASSWORD_INPUT_ID = 'confirmPasswordInput';
export const SHARE_ITEM_CSV_PARSER_BUTTON_ID = 'shareItemCsvParserButton';
export const SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID =
  'shareItemCsvParserInputButton';
export const SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID = 'selectTemplateFolder';
export const SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_SELECTOR = `${SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID} input`;
export const SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID = 'shareItemFromCsvAlertError';
export const SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID =
  'shareItemFromCsvResultFailures';
export const SHARE_ITEM_FROM_CSV_CANCEL_BUTTON_ID =
  'shareItemFromCSVCancelButton';
export const SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID =
  'shareItemFromCSVConfirmButton';
export const SHARE_ITEM_FROM_CSV_WITH_GROUP_COLUMN_TEXT_ID =
  'shareItemFromCSVTemplateSelectionText';
export const CSV_FILE_SELECTION_DELETE_BUTTON_ID =
  'csvFileSelectionDeleteButton';
export const SHARE_CSV_TEMPLATE_SELECTION_DELETE_BUTTON_ID =
  'shareCSVTemplateSelectionDeleteButton';
export const SHARE_CSV_TEMPLATE_SUMMARY_CONTAINER_ID =
  'shareCSVTemplateSummaryContainer';
export const SETTINGS_LINK_SHOW_IFRAME_ID = 'settingsLinkShowIframe';
export const SETTINGS_LINK_SHOW_BUTTON_ID = 'settingsLinkShowButton';
export const buildCategorySelectionOptionId = (
  typeId: string,
  id: string,
): string => `category-${typeId}-option-${id}`;
export const LIBRARY_SETTINGS_CATEGORIES_ID = 'librarySettingsCategories';
export const LIBRARY_SETTINGS_LANGUAGES_ID = 'librarySettingsLanguages';
export const LIBRARY_SETTINGS_CC_SETTINGS_ID = 'librarySettingsCC';
export const buildLibraryAddButtonHeader = (containerId: string): string =>
  `librarySettingsAddButtonHeader${containerId}`;
export const CATEGORIES_ADD_BUTTON_HEADER = buildLibraryAddButtonHeader(
  LIBRARY_SETTINGS_CATEGORIES_ID,
);
export const LANGUAGES_ADD_BUTTON_HEADER = buildLibraryAddButtonHeader(
  LIBRARY_SETTINGS_LANGUAGES_ID,
);
export const CC_EDIT_BUTTON_HEADER = `libarySettingsCCEditButtonHeader`;
export const CC_DELETE_BUTTON_HEADER = `libarySettingsCCDeleteButtonHeader`;
export const CC_SAVE_BUTTON = 'librarySettingsCCSaveButton';
export const buildLanguageOptionId = (value: string): string =>
  `languageOption-${value}`;

export const CC_ALLOW_COMMERCIAL_CONTROL_ID = 'allowCommercialCCSelector';
export const CC_DISALLOW_COMMERCIAL_CONTROL_ID = 'disallowCommercialCCSelector';
export const CC_REQUIRE_ATTRIBUTION_CONTROL_ID = 'requireAttributionSelector';
export const CC_CC0_CONTROL_ID = 'cc0Selector';
export const CC_SHARE_ALIKE_CONTROL_ID = 'shareAlikeSelector';
export const CC_NO_DERIVATIVE_CONTROL_ID = 'noDerivativeSelector';
export const CC_DERIVATIVE_CONTROL_ID = 'derivativeSelector';
export const EDIT_MODAL_ID = 'editModal';
export const EDIT_ITEM_MODAL_CANCEL_BUTTON_ID = 'editModalCancelButton';
export const FILE_SETTING_MAX_WIDTH_ID = 'fileSettingMaxWidth';

export const CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID =
  'confirmDeleteMembershipButton';
export const buildDownloadButtonId = (itemId: string): string =>
  `download-button-id-${itemId}`;
export const CUSTOM_APP_URL_ID = 'customAppURLId';

export const DOWNGRADE_OWN_PERMISSION_DIALOG_TITLE_ID = 'downgradeTitleID';
export const DOWNGRADE_OWN_PERMISSION_DIALOG_DESC_ID = 'downgradeDescID';

export const SHORT_LINK_COMPONENT = 'shortLinkComponent';
export const SHORT_LINK_SAVE_BUTTON_ID = 'shortLinkSaveButtonID';
export const SHORT_LINK_RANDOMIZE_BUTTON_ID = 'shortLinkRandomizeButtonID';
export const SHORT_LINK_ALIAS_INPUT_ID = 'shortLinkAliasInputID';
export const SHORT_LINK_PLATFORM_SELECT_ID = 'shortLinkPlatformSelectID';
export const SHORT_LINK_MENU_START_ID = 'shortLinkMenuBtn';
export const SHORT_LINK_SHORTEN_START_ID = 'shortLinkShortenBtn';

export const buildShortLinkMenuBtnId = (alias: string): string =>
  `${SHORT_LINK_MENU_START_ID}-${alias}`;
export const buildShortLinkCancelBtnId = (alias: string): string =>
  `shortLinkCancelBtn-${alias}`;
export const buildShortLinkSaveBtnId = (alias: string): string =>
  `shortLinkSaveBtn-${alias}`;
export const buildShortLinkDeleteBtnId = (alias: string): string =>
  `shortLinkDeleteBtn-${alias}`;
export const buildShortLinkConfirmDeleteBtnId = (alias: string): string =>
  `shortLinkConfirmDeleteBtn-${alias}`;
export const buildShortLinkEditBtnId = (alias: string): string =>
  `shortLinkEditBtn-${alias}`;
export const buildShortLinkShortenBtnId = (
  itemId: string,
  platform: ShortLink['platform'],
): string => `${SHORT_LINK_SHORTEN_START_ID}-${platform}-${itemId}`;
export const buildShortLinkPlatformTextId = (
  platform: ShortLink['platform'],
): string => `shortLinkPlatformText-${platform}`;
export const buildShortLinkUrlTextId = (
  platform: ShortLink['platform'],
): string => `shortLinkUrlText-${platform}`;
export const ACCESSIBLE_ITEMS_ONLY_ME_ID = 'accessibleItemsOnlyMe';
export const ACCESSIBLE_ITEMS_TABLE_ID = 'accessibleItemsTable';
export const ACCESSIBLE_ITEMS_NEXT_PAGE_BUTTON_SELECTOR = `#${ACCESSIBLE_ITEMS_TABLE_ID} [data-testid="KeyboardArrowRightIcon"]`;
export const MY_GRAASP_ITEM_PATH = 'myGraaspItemPath';
export const LANGUAGE_SELECTOR_ID = 'languageSelector';

export const LAYOUT_MODE_BUTTON_ID = 'layoutModeButton';
export const ITEM_SETTING_DESCRIPTION_PLACEMENT_SELECT_ID =
  'itemSettingDescriptionPlacementSelect';
export const buildDescriptionPlacementId = (
  placement: DescriptionPlacementType,
): string => `itemSettingDescriptionPlacement-${placement}`;

export const DROPZONE_SELECTOR = '[role="dropzone"]';
export const buildMapViewId = (parentId?: string): string =>
  `map-view-${parentId}`;

export const buildDataCyWrapper = (dataCy: string): string =>
  `[data-cy="${dataCy}"]`;
export const buildDataTestIdWrapper = (dataCy: string): string =>
  `[data-testid="${dataCy}"]`;

// Publication page
export const buildPublishAttrContainer = (id: string): string =>
  `publicationAttributeContainer${id}`;

export const buildPublishWarningIcon = (warningId: string): string =>
  `publicationWarning${warningId}`;

export const buildPublishTitleAction = (id: string): string =>
  `publicationTitleAction${id}`;

export const buildPublishAttrEmptyContainer = (id: string): string =>
  `publicationEmptyContainer${id}`;

export const buildPublishChip = (id: string): string => `publicationChip${id}`;
export const buildPublishChipContainer = (id: string): string =>
  `publicationChipContainer${id}`;

export const buildPublicationStatus = (status: PublicationStatus): string =>
  `publicationStatus${status}`;

export const PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON =
  'publicVisbilityModalValidateButton';
export const UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON =
  'updateVisbilityModalValidateButton';
export const UPDATE_VISIBILITY_MODAL_CANCEL_BUTTON =
  'updateVisbilityModalCancelButton';

export const DEBOUNCED_TEXT_FIELD_ID = 'debouncedTextfield';

export const IMAGE_THUMBNAIL_FOLDER = 'imageThumbnailFolder';
export const IMAGE_PLACEHOLDER_FOLDER = 'imagePlaceholderFolder';
export const IMAGE_THUMBNAIL_UPLOADER = 'imageThumbnailUploader';
export const REMOVE_THUMBNAIL_BUTTON = 'removeThumbnailButton';

export const MUI_CHIP_REMOVE_BTN = 'CancelIcon';
export const HOME_LOAD_MORE_BUTTON_SELECTOR = '[role="feed"]';
export const buildItemsGridMoreButtonSelector = (id: string): string =>
  `#${buildItemCard(id)} [data-testid="MoreVertIcon"]`;
export const buildItemMenuId = (id: string): string => `item-menu-id-${id}`;
export const SORTING_SELECT_SELECTOR_TEST_ID = 'sortingSelect';
export const SORTING_SELECT_SELECTOR = `[data-testid="${SORTING_SELECT_SELECTOR_TEST_ID}"]`;
export const SORTING_ORDERING_SELECTOR_DESC = '.lucide-arrow-up-wide-narrow';
export const SORTING_ORDERING_SELECTOR_ASC = '.lucide-arrow-down-narrow-wide';
export const UNBOOKMARK_ICON_SELECTOR = '.lucide-bookmark';
export const BOOKMARK_ICON_SELECTOR = '.lucide-bookmark';

export const MEMBER_VALIDATION_BANNER_ID = 'memberValidationBanner';
export const MEMBER_VALIDATION_BANNER_CLOSE_BUTTON_ID =
  'memberValidationBannerCloseButton';
export const ITEM_CARD_CLASS = 'item-card';
export const buildFolderItemCardThumbnail = (id: string): string =>
  `#${buildItemCard(id)} .lucide-folder`;
export const RECYCLE_BIN_DELETE_MANY_ITEMS_BUTTON_ID =
  'recycleBinDeleteManyButton';

export const RECYCLE_BIN_RESTORE_MANY_ITEMS_BUTTON_ID =
  'recycleBinRestoreManyButton';
export const COPY_MANY_ITEMS_BUTTON_SELECTOR = `.lucide-copy`;
export const MOVE_MANY_ITEMS_BUTTON_SELECTOR = `.lucide-move`;
export const DELETE_SINGLE_ITEM_BUTTON_SELECTOR = `.lucide-trash`;
export const PREVENT_GUEST_MESSAGE_ID = 'preventGuestMessage';
export const REQUEST_MEMBERSHIP_BUTTON_ID = 'requestMembershipButton';
export const MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR =
  'membershipRequestPendingScreen';
export const MEMBERSHIPS_TAB_SELECTOR = `membershipsTab`;
export const MEMBERSHIP_REQUESTS_TAB_SELECTOR = `membershipRequestsTab`;

export const MEMBERSHIP_REQUESTS_EMPTY_SELECTOR = 'membershipRequestsEmpty';
export const buildMembershipRequestRowSelector = (memberId: string): string =>
  `membershipRequestRow-${memberId}`;
export const MEMBERSHIP_REQUEST_ACCEPT_BUTTON_SELECTOR =
  'membershipRequestAcceptButton';

export const MEMBERSHIP_REQUEST_REJECT_BUTTON_SELECTOR =
  'membershipRequestRejectButton';
export const ENROLL_BUTTON_SELECTOR = 'enrollButton';
export const VISIBILITY_HIDDEN_ALERT_ID = 'visibilityHiddenAlert';
export const SHARE_ITEM_CANCEL_BUTTON_CY = 'shareItemCancelButton';
export const ADD_FOLDER_BUTTON_CY = 'addFolder';
