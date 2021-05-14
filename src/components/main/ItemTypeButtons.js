import React from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import FolderIcon from '@material-ui/icons/Folder';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CreateIcon from '@material-ui/icons/Create';
import ItemTypeButton from './ItemTypeButton';
import { ITEM_TYPES } from '../../config/constants';
import {
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_APP_ID,
} from '../../config/selectors';

const ItemTypeButtons = ({ setSelectedItemType, selectedItemType }) => {
  const { t } = useTranslation();

  const handleClick = (type) => () => setSelectedItemType(type);

  return (
    <Grid container spacing={1} alignItems="stretch">
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_FOLDER_ID}
          handleClick={handleClick(ITEM_TYPES.FOLDER)}
          selected={selectedItemType === ITEM_TYPES.FOLDER}
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
          title={t('Upload File')}
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
          description={t('Wikipedia, YouTube')}
        />
      </Grid>
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_DOCUMENT_ID}
          handleClick={handleClick(ITEM_TYPES.DOCUMENT)}
          selected={selectedItemType === ITEM_TYPES.DOCUMENT}
          Icon={CreateIcon}
          title={t('Create a Document')}
          description={t('Create a document')}
        />
      </Grid>
      <Grid item xs={4}>
        <ItemTypeButton
          id={CREATE_ITEM_APP_ID}
          handleClick={handleClick(ITEM_TYPES.APP)}
          selected={selectedItemType === ITEM_TYPES.APP}
          Icon={LinkIcon}
          title={t('App')}
        />
      </Grid>
    </Grid>
  );
};

ItemTypeButtons.propTypes = {
  setSelectedItemType: PropTypes.func.isRequired,
  selectedItemType: PropTypes.oneOf(Object.values(ITEM_TYPES)).isRequired,
};

export default ItemTypeButtons;
