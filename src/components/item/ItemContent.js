import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { makeStyles } from '@material-ui/core';
import { FileItem, DocumentItem, LinkItem, AppItem, H5PItem } from '@graasp/ui';
import { MUTATION_KEYS, Api } from '@graasp/query-client';
import { hooks, useMutation } from '../../config/queryClient';
import {
  buildFileItemId,
  buildItemsTableId,
  buildSaveButtonId,
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
} from '../../config/selectors';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import {
  API_HOST,
  ITEM_DEFAULT_HEIGHT,
  CONTEXT_BUILDER,
  H5P_ASSETS_BASE_URL,
} from '../../config/constants';
import { LayoutContext } from '../context/LayoutContext';
import Items from '../main/Items';
import { buildDocumentExtra, getDocumentExtra } from '../../utils/itemExtra';
import NewItemButton from '../main/NewItemButton';
import { CurrentUserContext } from '../context/CurrentUserContext';
import {
  buildServeH5PContentURL,
  H5P_FRAME_CSS_PATH,
  H5P_FRAME_JS_PATH,
} from '../../config/h5p';

const { useChildren, useFileContent } = hooks;

const useStyles = makeStyles(() => ({
  fileWrapper: {
    textAlign: 'center',
    height: '80vh',
    flexGrow: 1,
  },
}));

const ItemContent = ({ item, enableEditing, permission }) => {
  const classes = useStyles();
  const itemId = item.get(ITEM_KEYS.ID);
  const itemType = item?.get(ITEM_KEYS.TYPE);
  const { mutate: editItem, mutateAsync: editItemAsync } = useMutation(
    MUTATION_KEYS.EDIT_ITEM,
  );
  const { editingItemId, setEditingItemId } = useContext(LayoutContext);

  // provide user to app
  const { data: member, isLoading: isLoadingUser } =
    useContext(CurrentUserContext);

  // display children
  const { data: children, isLoading: isLoadingChildren } = useChildren(itemId, {
    ordered: true,
    enabled: item?.get('type') === ITEM_TYPES.FOLDER,
  });
  const id = item?.get(ITEM_KEYS.ID);

  const { data: content, isLoading: isLoadingFileContent } = useFileContent(
    id,
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
    if (caption !== item.get('description')) {
      editItem({ id: itemId, description: caption });
    }
    setEditingItemId(null);
  };

  const onSaveDocument = (text) => {
    // edit item only when description has changed
    if (text !== getDocumentExtra(item?.get('extra')).content) {
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
        <div className={classes.fileWrapper}>
          <FileItem
            id={buildFileItemId(itemId)}
            editCaption={isEditing}
            item={item}
            content={content}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
          />
        </div>
      );
    case ITEM_TYPES.LINK:
      return (
        <div className={classes.fileWrapper}>
          <LinkItem
            item={item}
            editCaption={isEditing}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
            height={ITEM_DEFAULT_HEIGHT}
          />
        </div>
      );
    case ITEM_TYPES.DOCUMENT:
      return (
        <div className={classes.fileWrapper}>
          <DocumentItem
            id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
            item={item}
            edit={isEditing}
            onSave={onSaveDocument}
            onCancel={onCancel}
            saveButtonId={saveButtonId}
            maxHeight="70vh"
          />
        </div>
      );
    case ITEM_TYPES.APP:
      return (
        <AppItem
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
            title={item.get('name')}
            items={children}
            isEditing={isEditing}
            onSaveCaption={onSaveCaption}
            headerElements={
              enableEditing
                ? [<NewItemButton key="newButton" fontSize="small" />]
                : undefined
            }
          />
        </>
      );
    case ITEM_TYPES.H5P: {
      const h5pContentPath = item.get('extra')?.h5p?.contentFilePath;
      if (!h5pContentPath) {
        return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
      }

      return (
        <H5PItem
          itemId={itemId}
          h5pAssetsHost={H5P_ASSETS_BASE_URL}
          playerOptions={{
            h5pJsonPath: buildServeH5PContentURL(h5pContentPath),
            frameJs: H5P_FRAME_JS_PATH,
            frameCss: H5P_FRAME_CSS_PATH,
          }}
        />
      );
    }

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

ItemContent.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  enableEditing: PropTypes.bool,
  permission: PropTypes.string.isRequired,
};

ItemContent.defaultProps = {
  enableEditing: false,
};

export default ItemContent;
