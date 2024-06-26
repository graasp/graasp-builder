import {
  DiscriminatedItem,
  FileItemProperties,
  ItemType,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';

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
