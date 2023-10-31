import { Container, styled } from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  AppItemType,
  CompleteMember,
  Context,
  DEFAULT_LANG,
  DiscriminatedItem,
  DocumentItemType,
  EmbeddedLinkItemType,
  EtherpadItemType,
  FolderItemType,
  H5PItemType,
  ItemType,
  LocalFileItemType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  S3FileItemType,
  buildPdfViewerLink,
  getH5PExtra,
} from '@graasp/sdk';
import {
  AppItem,
  DocumentItem,
  EtherpadItem,
  FileItem,
  H5PItem,
  LinkItem,
  Loader,
} from '@graasp/ui';

import { API_HOST, GRAASP_ASSETS_URL, H5P_INTEGRATION_URL } from '@/config/env';

import {
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
  ITEM_DEFAULT_HEIGHT,
} from '../../config/constants';
import { axios, hooks } from '../../config/queryClient';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildFileItemId,
  buildItemsTableId,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import NewItemButton from '../main/NewItemButton';

const { useChildren, useFileContentUrl, useEtherpad } = hooks;

const StyledContainer = styled(Container)(() => ({
  textAlign: 'center',
  height: '80vh',
  flexGrow: 1,
}));

/**
 * Helper component to render typed file items
 */
const FileContent = ({
  item,
}: {
  item: LocalFileItemType | S3FileItemType;
}): JSX.Element => {
  const { data: fileUrl, isLoading, isError } = useFileContentUrl(item.id);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <StyledContainer>
      <FileItem
        fileUrl={fileUrl}
        id={buildFileItemId(item.id)}
        item={item}
        pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
      />
    </StyledContainer>
  );
};

/**
 * Helper component to render typed link items
 */
const LinkContent = ({
  item,
  member,
}: {
  item: EmbeddedLinkItemType;
  member?: Member;
}): JSX.Element => (
  <StyledContainer>
    <LinkItem
      memberId={member?.id}
      isResizable
      item={item}
      height={ITEM_DEFAULT_HEIGHT}
      showButton={Boolean(
        item.settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON,
      )}
      showIframe={Boolean(
        item.settings?.showLinkIframe ?? DEFAULT_LINK_SHOW_IFRAME,
      )}
    />
  </StyledContainer>
);

/**
 * Helper component to render typed document items
 */
const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => (
  <StyledContainer>
    <DocumentItem
      id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
      item={item}
      maxHeight="70vh"
    />
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
  member?: Member;
  permission?: PermissionLevel;
}): JSX.Element => (
  <AppItem
    isResizable
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
      lang:
        // todo: remove once it is added in ItemSettings type in sdk
        // todo: wrong casting
        item.settings?.lang ||
        (member as CompleteMember)?.extra?.lang ||
        DEFAULT_LANG,
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
  const {
    data: children,
    isLoading,
    isError,
  } = useChildren(item.id, {
    ordered: true,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <Items
      parentId={item.id}
      id={buildItemsTableId(item.id)}
      title={item.name}
      items={children ?? []}
      headerElements={
        enableEditing ? [<NewItemButton key="newButton" />] : undefined
      }
      ToolbarActions={ItemActions}
      showCreator
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
  console.log(etherpad);
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
 * Props for {@see ItemContent}
 */
type Props = {
  item?: DiscriminatedItem;
  permission?: PermissionLevel;
};

/**
 * Main item renderer component
 */
const ItemContent = ({ item, permission }: Props): JSX.Element => {
  const { data: member, isLoading, isError } = useCurrentUserContext();

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
