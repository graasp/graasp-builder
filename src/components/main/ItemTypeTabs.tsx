/* eslint-disable react/jsx-wrap-multilines */
import { Tab, Tabs, styled } from '@mui/material';

import { FC, useState } from 'react';

import { ItemType } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { ItemIcon } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_ZIP_ID,
} from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  maxWidth: 150,
}));

type Props = {
  onTypeChange: (type: NewItemTabType) => void;
  initialValue: NewItemTabType;
};

const ItemTypeTabs: FC<Props> = ({ onTypeChange, initialValue }) => {
  const { t } = useBuilderTranslation();

  const [value, setValue] = useState<NewItemTabType>(
    initialValue ?? ItemType.FOLDER,
  );

  const handleChange = (_event: unknown, newValue: NewItemTabType) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  const zipIcon = (
    <ItemIcon
      alt={t(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
      type={ItemType.LOCAL_FILE}
      sx={{ mb: 0 }}
      extra={{ file: { mimetype: 'application/zip' } }}
    />
  );

  return (
    <StyledTabs
      centered
      orientation="vertical"
      value={value}
      onChange={handleChange}
    >
      <Tab
        id={CREATE_ITEM_FOLDER_ID}
        value={ItemType.FOLDER}
        label={t(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
            type={ItemType.FOLDER}
            sx={{ mb: 0 }}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_FILE_ID}
        value={ItemType.LOCAL_FILE}
        label={t(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
            type={ItemType.LOCAL_FILE}
            sx={{ mb: 0 }}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_LINK_ID}
        value={ItemType.LINK}
        label={t(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
            type={ItemType.LINK}
            sx={{ mb: 0 }}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={ItemType.DOCUMENT}
        label={t(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
            type={ItemType.DOCUMENT}
            sx={{ mb: 0 }}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_APP_ID}
        value={ItemType.APP}
        label={t(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
            type={ItemType.APP}
            sx={{ mb: 0 }}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_ZIP_ID}
        value={InternalItemType.ZIP}
        label={t(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
        icon={zipIcon}
      />
      <Tab
        id={CREATE_ITEM_H5P_ID}
        value={ItemType.H5P}
        label={t(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={t(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
            type={ItemType.H5P}
            sx={{ mb: 0 }}
          />
        }
      />
    </StyledTabs>
  );
};

export default ItemTypeTabs;
