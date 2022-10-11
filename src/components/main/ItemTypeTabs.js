import PropTypes from 'prop-types';

import { Tab, Tabs, styled } from '@mui/material';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ItemIcon } from '@graasp/ui';

import {
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_H5P_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_ZIP_ID,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  minWidth: 'fit-content',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  // .MuiTab-wrapped
  '.MuiTab-iconWrapper': {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1),
  },
}));

const ItemTypeTabs = ({ onTypeChange, initialValue }) => {
  const { t } = useTranslation();

  const [value, setValue] = useState(initialValue ?? ITEM_TYPES.FOLDER);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  const zipIcon = (
    <ItemIcon
      type={ITEM_TYPES.FILE}
      sx={{ mb: 0, mr: 1 }}
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
      <StyledTab
        id={CREATE_ITEM_FOLDER_ID}
        value={ITEM_TYPES.FOLDER}
        label={t('Folder')}
        icon={<ItemIcon type={ITEM_TYPES.FOLDER} sx={{ mb: 0, mr: 1 }} />}
      />
      <StyledTab
        id={CREATE_ITEM_FILE_ID}
        value={ITEM_TYPES.FILE}
        label={t('File')}
        icon={<ItemIcon type={ITEM_TYPES.FILE} sx={{ mb: 0, mr: 1 }} />}
      />
      <StyledTab
        id={CREATE_ITEM_LINK_ID}
        value={ITEM_TYPES.LINK}
        label={t('Link')}
        icon={<ItemIcon type={ITEM_TYPES.LINK} sx={{ mb: 0, mr: 1 }} />}
      />
      <StyledTab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={ITEM_TYPES.DOCUMENT}
        label={t('Document')}
        icon={<ItemIcon type={ITEM_TYPES.DOCUMENT} sx={{ mb: 0, mr: 1 }} />}
      />
      <StyledTab
        id={CREATE_ITEM_APP_ID}
        value={ITEM_TYPES.APP}
        label={t('App')}
        icon={<ItemIcon type={ITEM_TYPES.APP} sx={{ mb: 0, mr: 1 }} />}
      />
      <StyledTab
        id={CREATE_ITEM_ZIP_ID}
        value={ITEM_TYPES.ZIP}
        label={t('Import ZIP')}
        icon={zipIcon}
      />
      <StyledTab
        id={CREATE_ITEM_H5P_ID}
        value={ITEM_TYPES.H5P}
        label={t('Import H5P')}
        icon={<ItemIcon type={ITEM_TYPES.H5P} sx={{ mb: 0, mr: 1 }} />}
      />
    </StyledTabs>
  );
};

ItemTypeTabs.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOf(Object.values(ITEM_TYPES)),
};

ItemTypeTabs.defaultProps = {
  initialValue: null,
};

export default ItemTypeTabs;
