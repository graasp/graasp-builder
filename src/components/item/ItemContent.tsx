import { Button, Container, styled } from '@mui/material';

import { useState } from 'react';
import { UseQueryResult } from 'react-query';

import { Api, MUTATION_KEYS } from '@graasp/query-client';
import {
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
  EtherpadRecord,
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
  CONTEXT_BUILDER,
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
  GRAASP_ASSETS_URL,
  H5P_INTEGRATION_URL,
  ITEM_DEFAULT_HEIGHT,
} from '../../config/constants';
import { useCommonTranslation } from '../../config/i18n';
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
import { DocumentExtraForm } from './form/DocumentForm';

const { useChildren, useFileContent, useEtherpad } = hooks;

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
  saveButtonId,
}: {
  item: LocalFileItemTypeRecord | S3FileItemTypeRecord;
  isEditing: boolean;
  onSaveCaption: (text: string) => void;
  saveButtonId: string;
}): JSX.Element => {
  const {
    data: fileContent,
    isLoading,
    isError,
  } = useFileContent(item.id, {
    replyUrl: true,
  });

  // todo: remove when query client is correctly typed
  const file = fileContent as Record<string, string>;

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
        fileUrl={file?.url}
        id={buildFileItemId(item.id)}
        item={item}
        onSaveCaption={onSaveCaption}
        pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
        saveButtonId={saveButtonId}
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
  saveButtonId,
}: {
  item: EmbeddedLinkItemTypeRecord;
  member: MemberRecord;
  isEditing: boolean;
  onSaveCaption: (caption: string) => void;
  saveButtonId: string;
}): JSX.Element => (
  <StyledContainer>
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
}: {
  item: DocumentItemTypeRecord;
  isEditing: boolean;
  onSaveDocument: (update: DocumentItemExtraProperties) => void;
  onCancel: () => void;
  saveButtonId: string;
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
          />
          <Button onClick={onCancel} variant="text" sx={{ m: 1 }}>
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
  permission,
  isEditing,
  onSaveCaption,
  saveButtonId,
}: {
  item: AppItemTypeRecord;
  member: MemberRecord;
  permission: PermissionLevel;
  isEditing: boolean;
  onSaveCaption: (caption: string) => void;
  saveButtonId: string;
}): JSX.Element => (
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
      items={children}
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
  const { contentId } = getH5PExtra(item?.extra);

  if (!contentId) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return (
    <H5PItem
      itemId={item.id}
      contentId={contentId}
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
  }: UseQueryResult<EtherpadRecord> = useEtherpad(
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
  item: ItemRecord;
  enableEditing?: boolean;
  permission: PermissionLevel;
};

/**
 * Main item renderer component
 */
const ItemContent = ({
  item,
  enableEditing,
  permission,
}: Props): JSX.Element => {
  const { mutate: editItem } = useMutation<any, any, any>(
    MUTATION_KEYS.EDIT_ITEM,
  );
  const { editingItemId, setEditingItemId } = useLayoutContext();

  const { data: member, isLoading, isError } = useCurrentUserContext();

  const isEditing = enableEditing && editingItemId === item.id;

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

  switch (item.type) {
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return (
        <FileContent
          item={item}
          isEditing={isEditing}
          onSaveCaption={onSaveCaption}
          saveButtonId={saveButtonId}
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
          saveButtonId={saveButtonId}
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
        />
      );
    case ItemType.APP:
      return (
        <AppContent
          item={item}
          member={member}
          isEditing={isEditing}
          onSaveCaption={onSaveCaption}
          saveButtonId={saveButtonId}
          permission={permission}
        />
      );
    case ItemType.FOLDER:
      return (
        <FolderContent
          item={item}
          isEditing={isEditing}
          enableEditing={enableEditing}
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
