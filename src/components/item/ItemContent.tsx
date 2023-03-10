import { Container, styled } from '@mui/material';

import { FC } from 'react';
import { UseQueryResult } from 'react-query';

import { Api, MUTATION_KEYS } from '@graasp/query-client';
import {
  Context,
  ItemType,
  PermissionLevel,
  buildPdfViewerLink,
  getDocumentExtra,
} from '@graasp/sdk';
import {
  DocumentItemTypeRecord,
  EtherpadRecord,
  ItemRecord,
} from '@graasp/sdk/frontend';
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
import { buildDocumentExtra } from '../../utils/itemExtra';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { useLayoutContext } from '../context/LayoutContext';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import NewItemButton from '../main/NewItemButton';

const { useChildren, useFileUrl, useEtherpad } = hooks;

const FileWrapper = styled(Container)(() => ({
  textAlign: 'center',
  height: '80vh',
  flexGrow: 1,
}));

type Props = {
  item?: ItemRecord;
  enableEditing?: boolean;
  permission: PermissionLevel;
};

const ItemContent: FC<Props> = ({ item, enableEditing, permission }) => {
  const { id: itemId, type: itemType } = item;
  const { mutate: editItem } = useMutation<any, any, any>(
    MUTATION_KEYS.EDIT_ITEM,
  );
  const { editingItemId, setEditingItemId } = useLayoutContext();

  // provide user to app
  const { data: member, isLoading: isLoadingUser } = useCurrentUserContext();

  // display children
  const { data: children, isLoading: isLoadingChildren } = useChildren(itemId, {
    ordered: true,
    enabled: item?.type === ItemType.FOLDER,
  });

  const { data: fileUrl, isLoading: isLoadingFileContent } = useFileUrl(
    itemId,
    {
      enabled:
        item &&
        (itemType === ItemType.LOCAL_FILE || itemType === ItemType.S3_FILE),
    },
  );
  const isEditing = enableEditing && editingItemId === itemId;

  const etherpadQuery: UseQueryResult<EtherpadRecord> = useEtherpad(
    item,
    'write',
  ); // server will return read view if no write access allowed

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
    if (
      text !== getDocumentExtra((item as DocumentItemTypeRecord)?.extra).content
    ) {
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
      return (
        <FileWrapper>
          <FileItem
            editCaption={isEditing}
            fileUrl={fileUrl}
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
            memberId={member.id}
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
          context={Context.BUILDER}
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
        <EtherpadItem
          itemId={itemId}
          padUrl={etherpadQuery.data.padUrl}
          options={{ showChat: false }}
        />
      );
    }

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

export default ItemContent;
