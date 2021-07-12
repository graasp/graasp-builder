import React from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import FolderIcon from '@material-ui/icons/Folder';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CreateIcon from '@material-ui/icons/Create';
import AppsIcon from '@material-ui/icons/Apps';
import { ITEM_TYPES } from '../../enums';
import {
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_APP_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 'fit-content',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    marginBottom: '0 !important',
    marginRight: 5,
  },
}));

const ItemTypeTabs = ({ onTypeChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [value, setValue] = React.useState(ITEM_TYPES.FOLDER);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  return (
    <Tabs
      centered
      orientation="vertical"
      value={value}
      onChange={handleChange}
      className={classes.tabs}
    >
      <Tab
        id={CREATE_ITEM_FOLDER_ID}
        value={ITEM_TYPES.FOLDER}
        label={t('Folder')}
        icon={<FolderIcon className={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_FILE_ID}
        value={ITEM_TYPES.FILE}
        label={t('File')}
        icon={<FileCopyIcon className={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_LINK_ID}
        value={ITEM_TYPES.LINK}
        label={t('Link')}
        icon={<LinkIcon className={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={ITEM_TYPES.DOCUMENT}
        label={t('Document')}
        icon={<CreateIcon className={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_APP_ID}
        value={ITEM_TYPES.APP}
        label={t('App')}
        icon={<AppsIcon className={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
    </Tabs>
  );
};

ItemTypeTabs.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
};

export default ItemTypeTabs;
