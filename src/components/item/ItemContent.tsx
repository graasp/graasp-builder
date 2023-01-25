import { RecordOf } from 'immutable';

import { Container, styled } from '@mui/material';

import { FC, useContext } from 'react';

import { Api, MUTATION_KEYS } from '@graasp/query-client';
import {
  Item,
  ItemType,
  PermissionLevel,
  buildPdfViewerLink,
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

import {
  API_HOST,
  CONTEXT_BUILDER,
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
  GRAASP_ASSETS_URL,
  H5P_INTEGRATION_URL,
  ITEM_DEFAULT_HEIGHT,
} from '../../config/constants';
import { hooks, useMutation } from '../../config/queryClient';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildFileItemId,
  buildItemsTableId,
  buildSaveButtonId,
} from '../../config/selectors';
import { buildDocumentExtra, getDocumentExtra } from '../../utils/itemExtra';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { LayoutContext } from '../context/LayoutContext';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import NewItemButton from '../main/NewItemButton';

const { useChildren, useFileContent, useEtherpad } = hooks;

const FileWrapper = styled(Container)(() => ({
  textAlign: 'center',
  height: '80vh',
  flexGrow: 1,
}));

type Props = {
  // todo: not ideal but this item is really flexible
  item: RecordOf<Item<any>>;
  enableEditing?: boolean;
  permission: PermissionLevel;
};

const ItemContent: FC<Props> = ({ item, enableEditing, permission }) => {
  const { id: itemId, type: itemType } = item;
  const { mutate: editItem } = useMutation<any, any, any>(
    MUTATION_KEYS.EDIT_ITEM,
  );
  const { editingItemId, setEditingItemId } = useContext(LayoutContext);

  // provide user to app
  const { data: member, isLoading: isLoadingUser } =
    useContext(CurrentUserContext);

  // display children
  const { data: children, isLoading: isLoadingChildren } = useChildren(itemId, {
    ordered: true,
    enabled: item?.type === ItemType.FOLDER,
  });

  const { data: fileData, isLoading: isLoadingFileContent } = useFileContent(
    itemId,
    {
      enabled:
        item &&
        (itemType === ItemType.LOCAL_FILE || itemType === ItemType.S3_FILE),
      replyUrl: true,
    },
  );
  const isEditing = enableEditing && editingItemId === itemId;

  const etherpadQuery = useEtherpad(item, 'write'); // server will return read view if no write access allowed

  if (
    isLoadingFileContent ||
    isLoadingUser ||
    isLoadingChildren ||
    etherpadQuery?.isLoading
  ) {
    return <Loader />;
  }

  if (!item || !itemId || etherpadQuery?.isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  const onSaveCaption = (caption) => {
    // edit item only when description has changed
    if (caption !== item.description) {
      editItem({ id: itemId, description: caption });
    }
    setEditingItemId(null);
  };

  const onSaveDocument = (text) => {
    // edit item only when description has changed
    if (text !== getDocumentExtra(item?.extra).content) {
      editItem({ id: itemId, extra: buildDocumentExtra({ content: text }) });
    }
    setEditingItemId(null);
  };

  const onCancel = () => {
    setEditingItemId(null);
  };

  const saveButtonId = buildSaveButtonId(itemId);

  switch (itemType) {
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      // todo: remove when query client is correctly typed
      const file = fileData as Record<string, string>;
      return (
        <FileWrapper>
          <FileItem
            editCaption={isEditing}
            fileUrl={file?.url}
            id={buildFileItemId(itemId)}
            item={item}
            onSaveCaption={onSaveCaption}
            pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
            saveButtonId={saveButtonId}
          />
        </FileWrapper>
      );
    }
    case ItemType.LINK:
      return (
        <FileWrapper>
          <LinkItem
            isResizable
            item={item}
            editCaption={isEditing}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
            height={ITEM_DEFAULT_HEIGHT}
            showButton={Boolean(
              item.settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON,
            )}
            showIframe={Boolean(
              item.settings?.showLinkIframe ?? DEFAULT_LINK_SHOW_IFRAME,
            )}
          />
        </FileWrapper>
      );
    case ItemType.DOCUMENT:
      return (
        <FileWrapper>
          <DocumentItem
            id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
            item={item}
            edit={isEditing}
            onSave={onSaveDocument}
            onCancel={onCancel}
            saveButtonId={saveButtonId}
            maxHeight="70vh"
          />
        </FileWrapper>
      );
    case ItemType.APP:
      return (
        <AppItem
          isResizable
          item={item}
          apiHost={API_HOST}
          editCaption={isEditing}
          onSaveCaption={onSaveCaption}
          saveButtonId={saveButtonId}
          member={member}
          height={ITEM_DEFAULT_HEIGHT}
          permission={permission}
          requestApiAccessToken={Api.requestApiAccessToken}
          context={CONTEXT_BUILDER}
        />
      );
    case ItemType.FOLDER:
      return (
        <Items
          parentId={itemId}
          id={buildItemsTableId(itemId)}
          title={item.name}
          items={children}
          isEditing={isEditing}
          headerElements={
            enableEditing ? [<NewItemButton key="newButton" />] : undefined
          }
          ToolbarActions={ItemActions}
          showCreator
        />
      );

    case ItemType.H5P: {
      const contentId = item.extra?.h5p?.contentId;
      if (!contentId) {
        return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
      }

      return (
        <H5PItem
          itemId={itemId}
          contentId={contentId}
          integrationUrl={H5P_INTEGRATION_URL}
        />
      );
    }

    case ItemType.ETHERPAD: {
      if (!etherpadQuery?.data?.padUrl) {
        return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
      }
      return (
        <EtherpadItem itemId={itemId} padUrl={etherpadQuery.data.padUrl} />
      );
    }

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

export default ItemContent;
