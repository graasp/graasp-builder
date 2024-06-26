import { useOutletContext } from 'react-router-dom';

import { Container, Skeleton, Stack, styled } from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  AppItemType,
  CompleteMember,
  Context,
  DocumentItemType,
  EtherpadItemType,
  FolderItemType,
  H5PItemType,
  ItemType,
  LinkItemType,
  LocalFileItemType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  S3FileItemType,
  buildPdfViewerLink,
  getH5PExtra,
} from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';
import {
  AppItem,
  EtherpadItem,
  FileItem,
  H5PItem,
  LinkItem,
  Loader,
} from '@graasp/ui';
import { DocumentItem } from '@graasp/ui/text-editor';

import { API_HOST, GRAASP_ASSETS_URL, H5P_INTEGRATION_URL } from '@/config/env';

import { ITEM_DEFAULT_HEIGHT } from '../../config/constants';
import { axios, hooks } from '../../config/queryClient';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildFileItemId,
  buildItemsTableId,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import NewItemButton from '../main/NewItemButton';
import { OutletType } from '../pages/item/type';
import { useItemSearch } from './ItemSearch';
import FileAlignmentSetting from './settings/file/FileAlignmentSetting';
import FileMaxWidthSetting from './settings/file/FileMaxWidthSetting';
import { SettingVariant } from './settings/settingTypes';

const { useChildren, useFileContentUrl, useEtherpad } = hooks;

const StyledContainer = styled(Container)(() => ({
  flexGrow: 1,
}));

/**
 * Helper component to render typed file items
 */
const FileContent = ({
  item,
}: {
  item: LocalFileItemType | S3FileItemType;
}): JSX.Element | null => {
  const { data: fileUrl, isLoading, isError } = useFileContentUrl(item.id);

  if (fileUrl) {
    return (
      <StyledContainer>
        <Stack direction="column" alignItems="center" gap={2} width="100%">
          <Stack direction="row" gap={1}>
            <FileMaxWidthSetting item={item} variant={SettingVariant.Button} />
            <FileAlignmentSetting item={item} variant={SettingVariant.Button} />
          </Stack>
          <FileItem
            fileUrl={fileUrl}
            id={buildFileItemId(item.id)}
            item={item}
            pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
          />
        </Stack>
      </StyledContainer>
    );
  }

  if (isLoading) {
    return <Skeleton height="50vh" />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return null;
};

/**
 * Helper component to render typed link items
 */
const LinkContent = ({
  item,
  member,
}: {
  item: LinkItemType;
  member?: Member | null;
}): JSX.Element => (
  <LinkItem
    id={item.id}
    memberId={member?.id}
    isResizable
    item={item}
    height={ITEM_DEFAULT_HEIGHT}
    showButton={Boolean(item.settings?.showLinkButton)}
    showIframe={Boolean(item.settings?.showLinkIframe)}
  />
);

/**
 * Helper component to render typed document items
 */
const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => (
  <StyledContainer>
    <DocumentItem id={DOCUMENT_ITEM_TEXT_EDITOR_ID} item={item} />
  </StyledContainer>
);

/**
 * Helper component to render typed app items
 */
const AppContent = ({
  item,
  member,
  permission = PermissionLevel.Read,
}: {
  item: AppItemType;
  member?: CompleteMember | null;
  permission?: PermissionLevel;
}): JSX.Element => (
  <AppItem
    isResizable={false}
    item={item}
    height={ITEM_DEFAULT_HEIGHT}
    requestApiAccessToken={(payload: {
      id: string;
      key: string;
      origin: string;
    }) => Api.requestApiAccessToken(payload, { API_HOST, axios })}
    contextPayload={{
      apiHost: API_HOST,
      itemId: item.id,
      memberId: member?.id,
      permission,
      settings: item.settings,
      lang: item.settings?.lang || member?.extra?.lang || DEFAULT_LANG,
      context: Context.Builder,
    }}
  />
);

/**
 * Helper component to render typed folder items
 */
const FolderContent = ({
  item,
  enableEditing,
}: {
  item: FolderItemType;
  enableEditing: boolean;
}): JSX.Element => {
  const { shouldDisplayItem } = useFilterItemsContext();

  const {
    data: children,
    isLoading,
    isError,
  } = useChildren(item.id, {
    ordered: true,
  });
  const itemSearch = useItemSearch();
  const { canWrite, canAdmin } = useOutletContext<OutletType>();

  // TODO: use hook's filter when available
  const folderChildren = children?.filter(
    (f) =>
      shouldDisplayItem(f.type) &&
      f.name.toLowerCase().includes(itemSearch.text.toLowerCase()),
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <Items
      canEdit={canWrite}
      canMove={canAdmin}
      parentId={item.id}
      id={buildItemsTableId(item.id)}
      title={item.name}
      items={folderChildren ?? []}
      headerElements={
        enableEditing
          ? [itemSearch.input, <NewItemButton key="newButton" />]
          : [itemSearch.input]
      }
      // todo: not exactly correct, since you could have write rights on some child,
      // but it's more tedious to check permissions over all selected items
      ToolbarActions={enableEditing ? ItemActions : undefined}
      totalCount={folderChildren?.length}
      showDropzoneHelper
    />
  );
};

/**
 * Helper component to render typed H5P items
 */
const H5PContent = ({ item }: { item: H5PItemType }): JSX.Element => {
  const extra = getH5PExtra(item?.extra);

  if (!extra?.contentId) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <H5PItem
      itemId={item.id}
      itemName={item.name}
      contentId={extra.contentId}
      integrationUrl={H5P_INTEGRATION_URL}
    />
  );
};

/**
 * Helper component to render typed Etherpad items
 */
const EtherpadContent = ({ item }: { item: EtherpadItemType }): JSX.Element => {
  const {
    data: etherpad,
    isLoading,
    isError,
  } = useEtherpad(
    item,
    'write', // server will return read view if no write access allowed
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!etherpad?.padUrl || isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <EtherpadItem
      itemId={item.id}
      padUrl={etherpad.padUrl}
      options={{ showChat: false }}
    />
  );
};

/**
 * Main item renderer component
 */
const ItemContent = (): JSX.Element => {
  const { data: member, isLoading, isError } = useCurrentUserContext();
  const { item, permission } = useOutletContext<OutletType>();

  if (isLoading) {
    return <Loader />;
  }

  if (!item || !item.id || isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  switch (item.type) {
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return <FileContent item={item} />;
    }
    case ItemType.LINK:
      return <LinkContent item={item} member={member} />;
    case ItemType.DOCUMENT:
      return <DocumentContent item={item} />;
    case ItemType.APP:
      return <AppContent item={item} member={member} permission={permission} />;
    case ItemType.FOLDER:
      return (
        <FolderContent
          item={item}
          enableEditing={
            permission
              ? PermissionLevelCompare.lte(PermissionLevel.Write, permission)
              : false
          }
        />
      );

    case ItemType.H5P: {
      return <H5PContent item={item} />;
    }

    case ItemType.ETHERPAD: {
      return <EtherpadContent item={item} />;
    }

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

export default ItemContent;
