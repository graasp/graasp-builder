/* eslint-disable react/jsx-wrap-multilines */
import { useState } from 'react';

import { Tab, Tabs, styled } from '@mui/material';

import { ItemType, MimeTypes } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_ETHERPAD_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_ZIP_ID,
} from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';
import { BUILDER } from '../../langs/constants';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  maxWidth: 150,

  '& .MuiTabs-scrollButtons svg': {
    background: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
  },
}));

type Props = {
  onTypeChange: (type: NewItemTabType) => void;
  initialValue: NewItemTabType;
};

const ItemTypeTabs = ({ onTypeChange, initialValue }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [value, setValue] = useState<NewItemTabType>(
    initialValue ?? ItemType.FOLDER,
  );

  const handleChange = (_event: unknown, newValue: NewItemTabType) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  const zipIcon = (
    <ItemIcon
      alt={translateBuilder(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
      type={ItemType.LOCAL_FILE}
      mimetype={MimeTypes.ZIP}
    />
  );

  return (
    <StyledTabs
      variant="scrollable"
      scrollButtons="auto"
      orientation="vertical"
      value={value}
      onChange={handleChange}
    >
      <Tab
        id={CREATE_ITEM_FOLDER_ID}
        value={ItemType.FOLDER}
        label={translateBuilder(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_FOLDER_TAB_TEXT)}
            type={ItemType.FOLDER}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_FILE_ID}
        value={ItemType.LOCAL_FILE}
        label={translateBuilder(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_FILE_TAB_TEXT)}
            type="upload"
          />
        }
      />
      <Tab
        id={CREATE_ITEM_LINK_ID}
        value={ItemType.LINK}
        label={translateBuilder(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_LINK_TAB_TEXT)}
            type={ItemType.LINK}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={ItemType.DOCUMENT}
        label={translateBuilder(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_DOCUMENT_TAB_TEXT)}
            type={ItemType.DOCUMENT}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_APP_ID}
        value={ItemType.APP}
        label={translateBuilder(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_APP_TAB_TEXT)}
            type={ItemType.APP}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_ZIP_ID}
        value={InternalItemType.ZIP}
        label={translateBuilder(BUILDER.NEW_ITEM_ZIP_TAB_TEXT)}
        icon={zipIcon}
      />
      <Tab
        id={CREATE_ITEM_H5P_ID}
        value={ItemType.H5P}
        label={translateBuilder(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_H5P_TAB_TEXT)}
            type={ItemType.H5P}
          />
        }
      />
      <Tab
        id={CREATE_ITEM_ETHERPAD_ID}
        value={ItemType.ETHERPAD}
        label={translateBuilder(BUILDER.NEW_ITEM_ETHERPAD_TAB_TEXT)}
        icon={
          <ItemIcon
            alt={translateBuilder(BUILDER.NEW_ITEM_ETHERPAD_TAB_TEXT)}
            type={ItemType.ETHERPAD}
          />
        }
      />
    </StyledTabs>
  );
};

export default ItemTypeTabs;
