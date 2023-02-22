import {
  DocumentItemExtra,
  DocumentItemExtraProperties,
  EmbeddedLinkItemExtra,
  EmbeddedLinkItemExtraProperties,
  FileItemProperties,
  ItemSettings,
  ItemType,
  LocalFileItemExtra,
  S3FileItemExtra,
} from '@graasp/sdk';
import { ItemLogin, ItemLoginSchema } from '@graasp/ui/dist/types';

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

// todo: improve extra typing
export const buildItemLoginSchemaExtra = (
  schema?: ItemLoginSchema,
): { itemLogin?: ItemLogin } => {
  if (schema) {
    return {
      itemLogin: { loginSchema: schema },
    };
  }

  // remove setting
  return {};
};

export const getItemLoginExtra = (extra: {
  itemLogin?: ItemLogin;
}): ItemLogin => extra?.itemLogin;

export const getItemLoginSchema = (extra: {
  itemLogin?: ItemLogin;
}): string | undefined => extra?.itemLogin?.loginSchema;

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
