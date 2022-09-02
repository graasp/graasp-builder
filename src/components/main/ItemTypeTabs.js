import React from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ItemIcon } from '@graasp/ui';
import { ITEM_TYPES } from '../../enums';
import {
  CREATE_ITEM_FILE_ID,
  CREATE_ITEM_LINK_ID,
  CREATE_ITEM_FOLDER_ID,
  CREATE_ITEM_DOCUMENT_ID,
  CREATE_ITEM_APP_ID,
  CREATE_ITEM_ZIP_ID,
  CREATE_ITEM_H5P_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 'fit-content',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1),
  },
  icon: {
    marginBottom: '0 !important',
    marginRight: theme.spacing(0.5),
  },
}));

const ItemTypeTabs = ({ onTypeChange, initialValue }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [value, setValue] = React.useState(initialValue ?? ITEM_TYPES.FOLDER);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTypeChange(newValue);
  };

  const zipIcon = (
    <ItemIcon
      type={ITEM_TYPES.FILE}
      iconClass={classes.icon}
      extra={{ file: { mimetype: 'application/zip' } }}
    />
  );

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
        icon={<ItemIcon type={ITEM_TYPES.FOLDER} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_FILE_ID}
        value={ITEM_TYPES.FILE}
        label={t('File')}
        icon={<ItemIcon type={ITEM_TYPES.FILE} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_LINK_ID}
        value={ITEM_TYPES.LINK}
        label={t('Link')}
        icon={<ItemIcon type={ITEM_TYPES.LINK} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_DOCUMENT_ID}
        value={ITEM_TYPES.DOCUMENT}
        label={t('Document')}
        icon={<ItemIcon type={ITEM_TYPES.DOCUMENT} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_APP_ID}
        value={ITEM_TYPES.APP}
        label={t('App')}
        icon={<ItemIcon type={ITEM_TYPES.APP} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_ZIP_ID}
        value={ITEM_TYPES.ZIP}
        label={t('Import ZIP')}
        icon={zipIcon}
        classes={{ wrapper: classes.wrapper }}
      />
      <Tab
        id={CREATE_ITEM_H5P_ID}
        value={ITEM_TYPES.H5P}
        label={t('Import H5P')}
        icon={<ItemIcon type={ITEM_TYPES.H5P} iconClass={classes.icon} />}
        classes={{ wrapper: classes.wrapper }}
      />
    </Tabs>
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
