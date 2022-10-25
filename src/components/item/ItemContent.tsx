import { RecordOf } from 'immutable';

import { Container, styled } from '@mui/material';

import { FC, useContext } from 'react';

import { Api, MUTATION_KEYS } from '@graasp/query-client';
import { Item, PermissionLevel } from '@graasp/sdk';
import {
  AppItem,
  DocumentItem,
  FileItem,
  H5PItem,
  LinkItem,
  Loader,
} from '@graasp/ui';

import {
  API_HOST,
  CONTEXT_BUILDER,
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
import { ITEM_TYPES } from '../../enums';
import { buildDocumentExtra, getDocumentExtra } from '../../utils/itemExtra';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { LayoutContext } from '../context/LayoutContext';
import ItemActions from '../main/ItemActions';
import Items from '../main/Items';
import NewItemButton from '../main/NewItemButton';

const { useChildren, useFileContent } = hooks;

const FileWrapper = styled(Container)(() => ({
  textAlign: 'center',
  height: '80vh',
  flexGrow: 1,
}));

type Props = {
  item: RecordOf<Item>;
  enableEditing?: boolean;
  permission: PermissionLevel;
};

const ItemContent: FC<Props> = ({ item, enableEditing, permission }) => {
  const { id: itemId, type: itemType } = item;
  const { mutate: editItem, mutateAsync: editItemAsync } = useMutation<
    any,
    any,
    any
  >(MUTATION_KEYS.EDIT_ITEM);
  const { editingItemId, setEditingItemId } = useContext(LayoutContext);

  // provide user to app
  const { data: member, isLoading: isLoadingUser } =
    useContext(CurrentUserContext);

  // display children
  const { data: children, isLoading: isLoadingChildren } = useChildren(itemId, {
    ordered: true,
    enabled: item?.type === ITEM_TYPES.FOLDER,
  });

  const { data: content, isLoading: isLoadingFileContent } = useFileContent(
    itemId,
    {
      enabled:
        item &&
        (itemType === ITEM_TYPES.FILE || itemType === ITEM_TYPES.S3_FILE),
    },
  );
  const isEditing = enableEditing && editingItemId === itemId;

  if (isLoadingFileContent || isLoadingUser || isLoadingChildren) {
    return <Loader />;
  }

  if (!item || !itemId) {
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
    case ITEM_TYPES.FILE:
    case ITEM_TYPES.S3_FILE:
      return (
        <FileWrapper>
          <FileItem
            id={buildFileItemId(itemId)}
            editCaption={isEditing}
            item={item}
            content={content}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
          />
        </FileWrapper>
      );
    case ITEM_TYPES.LINK:
      return (
        <FileWrapper>
          <LinkItem
            isResizable
            item={item}
            editCaption={isEditing}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
            height={ITEM_DEFAULT_HEIGHT}
            showButton={item.settings?.showLinkButton}
            showIframe={item.settings?.showLinkIframe}
          />
        </FileWrapper>
      );
    case ITEM_TYPES.DOCUMENT:
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
    case ITEM_TYPES.APP:
      return (
        <AppItem
          isResizable
          item={item}
          apiHost={API_HOST}
          editCaption={isEditing}
          onSaveCaption={onSaveCaption}
          saveButtonId={saveButtonId}
          onSettingsUpdate={editItemAsync}
          member={member}
          height={ITEM_DEFAULT_HEIGHT}
          permission={permission}
          requestApiAccessToken={Api.requestApiAccessToken}
          context={CONTEXT_BUILDER}
        />
      );
    case ITEM_TYPES.FOLDER:
      return (
        <>
          <Items
            parentId={itemId}
            id={buildItemsTableId(itemId)}
            title={item.name}
            items={children}
            isEditing={isEditing}
            onSaveCaption={onSaveCaption}
            headerElements={
              enableEditing
                ? [<NewItemButton key="newButton" fontSize="small" />]
                : undefined
            }
            ToolbarActions={ItemActions}
          />
        </>
      );
    case ITEM_TYPES.H5P: {
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

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

export default ItemContent;
