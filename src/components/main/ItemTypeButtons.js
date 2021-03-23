import React from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import FolderIcon from '@material-ui/icons/Folder';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ItemTypeButton from './ItemTypeButton';
import { ITEM_TYPES } from '../../config/constants';
import {
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_SPACE_ID,
} from '../../config/selectors';

const ItemTypeButtons = ({ setSelectedItemType, selectedItemType }) => {
  const { t } = useTranslation();

  const handleClick = (type) => () => setSelectedItemType(type);

  return (
    <Grid container spacing={1} alignItems="stretch">
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_SPACE_ID}
          handleClick={handleClick(ITEM_TYPES.SPACE)}
          selected={selectedItemType === ITEM_TYPES.SPACE}
          Icon={FolderIcon}
          title={t('Space')}
        />
      </Grid>
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_FILE_ID}
          handleClick={handleClick(ITEM_TYPES.FILE)}
          selected={selectedItemType === ITEM_TYPES.FILE}
          Icon={FileCopyIcon}
          title={t('File')}
          description={t('Images, Videos, Audios, Documents')}
        />
      </Grid>
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_LINK_ID}
          handleClick={handleClick(ITEM_TYPES.LINK)}
          selected={selectedItemType === ITEM_TYPES.LINK}
          Icon={LinkIcon}
          title={t('Link')}
          description={t('Wikipedia, Youtube')}
        />
      </Grid>
    </Grid>
  );
};

ItemTypeButtons.propTypes = {
  setSelectedItemType: PropTypes.func.isRequired,
  selectedItemType: PropTypes.oneOf(Object.entries(ITEM_TYPES)).isRequired,
};

export default ItemTypeButtons;
