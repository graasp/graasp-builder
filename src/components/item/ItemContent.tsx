import { List } from 'immutable';

import { Button, Container, styled } from '@mui/material';

import { useState } from 'react';

import { Api } from '@graasp/query-client';
import {
  Context,
  DEFAULT_LANG,
  DocumentItemExtraProperties,
  ItemType,
  PermissionLevel,
  buildPdfViewerLink,
  getDocumentExtra,
  getH5PExtra,
} from '@graasp/sdk';
import {
  AppItemTypeRecord,
  DocumentItemTypeRecord,
  EmbeddedLinkItemTypeRecord,
  EtherpadItemTypeRecord,
  FolderItemTypeRecord,
  H5PItemTypeRecord,
  ItemRecord,
  LocalFileItemTypeRecord,
  MemberRecord,
  S3FileItemTypeRecord,
} from '@graasp/sdk/frontend';
import { COMMON } from '@graasp/translations';
import {
  AppItem,
  DocumentItem,
  EtherpadItem,
  FileItem,
  H5PItem,
  LinkItem,
  Loader,
  SaveButton,
} from '@graasp/ui';

import {
  API_HOST,
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
  GRAASP_ASSETS_URL,
  H5P_INTEGRATION_URL,
  ITEM_DEFAULT_HEIGHT,
} from '../../config/constants';
import { useCommonTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildCancelButtonId,
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
import { DocumentExtraForm } from './form/DocumentForm';

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
  isEditing,
  onSaveCaption,
  onCancelCaption,
  saveButtonId,
  cancelButtonId,
}: {
  item: LocalFileItemTypeRecord | S3FileItemTypeRecord;
  isEditing: boolean;
  onSaveCaption: (text: string) => void;
  onCancelCaption: (text: string) => void;
  saveButtonId: string;
  cancelButtonId: string;
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
        editCaption={isEditing}
        fileUrl={fileUrl}
        id={buildFileItemId(item.id)}
        item={item}
        onSaveCaption={onSaveCaption}
        onCancelCaption={onCancelCaption}
        pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
        saveButtonId={saveButtonId}
        cancelButtonId={cancelButtonId}
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
  isEditing,
  onSaveCaption,
  onCancelCaption,
  saveButtonId,
  cancelButtonId,
}: {
  item: EmbeddedLinkItemTypeRecord;
  member?: MemberRecord;
  isEditing: boolean;
  onSaveCaption: (caption: string) => void;
  onCancelCaption: (caption: string) => void;
  saveButtonId: string;
  cancelButtonId: string;
}): JSX.Element => (
  <StyledContainer>
    <LinkItem
      memberId={member?.id}
      isResizable
      item={item}
      editCaption={isEditing}
      onSaveCaption={onSaveCaption}
      onCancelCaption={onCancelCaption}
      saveButtonId={saveButtonId}
      cancelButtonId={cancelButtonId}
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
const DocumentContent = ({
  item,
  isEditing,
  onSaveDocument,
  onCancel,
  saveButtonId,
  cancelButtonId,
}: {
  item: DocumentItemTypeRecord;
  isEditing: boolean;
  onSaveDocument: (update: DocumentItemExtraProperties) => void;
  onCancel: () => void;
  saveButtonId: string;
  cancelButtonId: string;
}): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();

  const extra = getDocumentExtra(item?.extra);

  const [content, setContent] = useState<
    DocumentItemExtraProperties['content']
  >(extra?.content ?? '');
  const [flavor, setFlavor] = useState<DocumentItemExtraProperties['flavor']>(
    extra?.flavor,
  );

  const newExtra = { content, flavor };

  const onSave = () => onSaveDocument(newExtra);

  return (
    <StyledContainer>
      {isEditing ? (
        <>
          <DocumentExtraForm
            documentItemId={DOCUMENT_ITEM_TEXT_EDITOR_ID}
            extra={newExtra}
            maxHeight="70vh"
            onCancel={onCancel}
            onContentChange={setContent}
            onContentSave={onSave}
            onFlavorChange={(f) => setFlavor(f || undefined)}
            saveButtonId={saveButtonId}
            cancelButtonId={cancelButtonId}
          />
          <Button
            id={cancelButtonId}
            onClick={onCancel}
            variant="text"
            sx={{ m: 1 }}
          >
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <SaveButton
            sx={{ m: 1 }}
            id={saveButtonId}
            onClick={onSave}
            text={translateCommon(COMMON.SAVE_BUTTON)}
            hasChanges={content !== extra?.content || flavor !== extra?.flavor}
          />
        </>
      ) : (
        <DocumentItem
          id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
          item={item}
          maxHeight="70vh"
        />
      )}
    </StyledContainer>
  );
};

/**
 * Helper component to render typed app items
 */
const AppContent = ({
  item,
  member,
  permission = PermissionLevel.Read,
  isEditing,
  onSaveCaption,
  onCancelCaption,
  saveButtonId,
  cancelButtonId,
}: {
  item: AppItemTypeRecord;
  member?: MemberRecord;
  permission?: PermissionLevel;
  isEditing: boolean;
  onSaveCaption: (caption: string) => void;
  onCancelCaption: (caption: string) => void;
  saveButtonId: string;
  cancelButtonId: string;
}): JSX.Element => (
  <AppItem
    isResizable
    item={item}
    editCaption={isEditing}
    onSaveCaption={onSaveCaption}
    onCancelCaption={onCancelCaption}
    saveButtonId={saveButtonId}
    cancelButtonId={cancelButtonId}
    height={ITEM_DEFAULT_HEIGHT}
    requestApiAccessToken={(payload: {
      id: string;
      key: string;
      origin: string;
    }) => Api.requestApiAccessToken(payload, { API_HOST })}
    contextPayload={{
      apiHost: API_HOST,
      itemId: item.id,
      memberId: member?.id,
      permission,
      settings: item.settings,
      lang:
        // todo: remove once it is added in ItemSettings type in sdk
        item.settings?.lang || member?.extra?.lang || DEFAULT_LANG,
      context: Context.Builder,
    }}
  />
);

/**
 * Helper component to render typed folder items
 */
const FolderContent = ({
  item,
  isEditing,
  enableEditing,
}: {
  item: FolderItemTypeRecord;
  isEditing: boolean;
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
      items={children ?? List()}
      isEditing={isEditing}
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
const H5PContent = ({ item }: { item: H5PItemTypeRecord }): JSX.Element => {
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
const EtherpadContent = ({
  item,
}: {
  item: EtherpadItemTypeRecord;
}): JSX.Element => {
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
 * Props for {@see ItemContent}
 */
type Props = {
  item?: ItemRecord;
  enableEditing?: boolean;
  permission?: PermissionLevel;
};

/**
 * Main item renderer component
 */
const ItemContent = ({
  item,
  enableEditing,
  permission,
}: Props): JSX.Element => {
  const { mutate: editItem } = mutations.useEditItem();
  const { editingItemId, setEditingItemId } = useLayoutContext();

  const { data: member, isLoading, isError } = useCurrentUserContext();

  const isEditing = Boolean(enableEditing && editingItemId === item?.id);

  if (isLoading) {
    return <Loader />;
  }

  if (!item || !item.id || isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  const onSaveCaption = (caption: string) => {
    // edit item only when description has changed
    if (caption !== item.description) {
      editItem({ id: item.id, description: caption });
    }
    setEditingItemId(null);
  };

  const onCancelCaption = (_caption: string) => {
    setEditingItemId(null);
  };

  const onSaveDocument = ({ content, flavor }: DocumentItemExtraProperties) => {
    editItem({
      id: item.id,
      extra: buildDocumentExtra({ content, flavor }),
    });
    setEditingItemId(null);
  };

  const onCancel = () => {
    setEditingItemId(null);
  };

  const saveButtonId = buildSaveButtonId(item.id);
  const cancelButtonId = buildCancelButtonId(item.id);

  switch (item.type) {
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return (
        <FileContent
          item={item}
          isEditing={isEditing}
          onSaveCaption={onSaveCaption}
          onCancelCaption={onCancelCaption}
          saveButtonId={saveButtonId}
          cancelButtonId={cancelButtonId}
        />
      );
    }
    case ItemType.LINK:
      return (
        <LinkContent
          item={item}
          member={member}
          isEditing={isEditing}
          onSaveCaption={onSaveCaption}
          onCancelCaption={onCancelCaption}
          saveButtonId={saveButtonId}
          cancelButtonId={cancelButtonId}
        />
      );
    case ItemType.DOCUMENT:
      return (
        <DocumentContent
          item={item}
          isEditing={isEditing}
          onSaveDocument={onSaveDocument}
          onCancel={onCancel}
          saveButtonId={saveButtonId}
          cancelButtonId={cancelButtonId}
        />
      );
    case ItemType.APP:
      return (
        <AppContent
          item={item}
          member={member}
          isEditing={isEditing}
          onSaveCaption={onSaveCaption}
          onCancelCaption={onCancelCaption}
          saveButtonId={saveButtonId}
          cancelButtonId={cancelButtonId}
          permission={permission}
        />
      );
    case ItemType.FOLDER:
      return (
        <FolderContent
          item={item}
          isEditing={isEditing}
          enableEditing={enableEditing ?? false}
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
