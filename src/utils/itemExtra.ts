import {
  DiscriminatedItem,
  DocumentItemExtra,
  DocumentItemExtraProperties,
  EmbeddedLinkItemExtra,
  EmbeddedLinkItemExtraProperties,
  FileItemProperties,
  ItemLogin,
  ItemSettings,
  ItemType,
  LocalFileItemExtra,
  S3FileItemExtra,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';

export const buildFileExtra = (
  file: FileItemProperties,
): LocalFileItemExtra => ({
  [ItemType.LOCAL_FILE]: file,
});

export const buildS3FileExtra = (
  s3File: FileItemProperties,
): S3FileItemExtra => ({
  [ItemType.S3_FILE]: s3File,
});

export const buildEmbeddedLinkExtra = (
  embeddedLink: EmbeddedLinkItemExtraProperties,
): EmbeddedLinkItemExtra => ({
  [ItemType.LINK]: embeddedLink,
});

// todo: put types in sdk
export const buildShortcutExtra = (
  target: string,
): { shortcut: { target: string } } => ({
  [ItemType.SHORTCUT]: { target },
});

export const getItemLoginExtra = (extra: {
  itemLogin?: ItemLogin;
}): ItemLogin | undefined => extra?.itemLogin;

export const buildDocumentExtra = (
  document: DocumentItemExtraProperties,
): DocumentItemExtra => ({
  [ItemType.DOCUMENT]: document,
});

export const buildAppExtra = ({
  url,
  settings = {},
}: {
  url: string;
  settings?: ItemSettings;
}): { app: { url: string; settings: ItemSettings } } => ({
  [ItemType.APP]: { url, settings },
});

export const getExtraFromPartial = (
  testItem: Partial<DiscriminatedItem>,
): Partial<FileItemProperties> => {
  if (!testItem.extra) {
    return {};
  }

  const localFileExtra =
    testItem.type === ItemType.LOCAL_FILE ? getFileExtra(testItem.extra) : {};
  const s3FileExtra =
    testItem.type === ItemType.S3_FILE ? getS3FileExtra(testItem.extra) : {};
  const extra = {
    ...s3FileExtra,
    ...localFileExtra,
  };
  return extra;
};
