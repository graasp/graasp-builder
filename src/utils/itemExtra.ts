import {
  AppItemExtra,
  AppItemExtraProperties,
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
import { ImmutableCast } from '@graasp/sdk/frontend';
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

export const getItemLoginSchema = (extra: { itemLogin?: ItemLogin }): string =>
  getItemLoginExtra(extra)?.loginSchema;

export const buildDocumentExtra = (
  text: DocumentItemExtraProperties,
): DocumentItemExtra => ({
  [ItemType.DOCUMENT]: text,
});
/**
 * @deprecated
 */
export const getDocumentExtra = (
  extra: DocumentItemExtra | ImmutableCast<DocumentItemExtra>,
): DocumentItemExtraProperties => extra?.[ItemType.DOCUMENT];

export const buildAppExtra = ({
  url,
  settings = {},
}: {
  url: string;
  settings?: ItemSettings;
}): { app: { url: string; settings: ItemSettings } } => ({
  [ItemType.APP]: { url, settings },
});

export const getAppExtra = (
  extra: AppItemExtra,
): AppItemExtraProperties | undefined => extra?.[ItemType.APP];
