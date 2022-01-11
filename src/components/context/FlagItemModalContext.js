import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useMutation, hooks } from '../../config/queryClient';
import {
  buildFlagListItemId,
  FLAG_ITEM_BUTTON_ID,
} from '../../config/selectors';
import { FLAG_LIST_MAX_HEIGHT } from '../../config/constants';

const { useFlags } = hooks;

const FlagItemModalContext = React.createContext();

const useStyles = makeStyles(() => ({
  list: {
    width: '100%',
    overflow: 'auto',
    maxHeight: FLAG_LIST_MAX_HEIGHT,
  },
  listTitle: {
    fontSize: 'small',
  },
  flagItemButton: {
    color: 'red',
  },
}));

const FlagItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: postFlagItem } = useMutation(MUTATION_KEYS.POST_ITEM_FLAG);
  const [open, setOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(false);
  const [itemId, setItemId] = useState(false);

  const { data: flags } = useFlags();

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const handleSelect = (flag) => () => setSelectedFlag(flag);

  const onFlag = () => {
    postFlagItem({
      flagId: selectedFlag.id,
      itemId,
    });
    onClose();
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <FlagItemModalContext.Provider value={value}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('Flag Item')}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" className={classes.listTitle}>
            {`${t('Select reason for flagging this item')}:`}
          </Typography>
          <List component="nav" className={classes.list}>
            {flags?.map((flag) => (
              <ListItem
                key={flag.id}
                id={buildFlagListItemId(flag.id)}
                button
                selected={selectedFlag.id === flag.id}
                onClick={handleSelect(flag)}
              >
                <ListItemText primary={flag.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={onFlag}
            className={classes.flagItemButton}
            id={FLAG_ITEM_BUTTON_ID}
            disabled={!selectedFlag}
          >
            {t('Flag')}
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </FlagItemModalContext.Provider>
  );
};

FlagItemModalProvider.propTypes = {
  children: PropTypes.node,
};

FlagItemModalProvider.defaultProps = {
  children: null,
};

export { FlagItemModalProvider, FlagItemModalContext };
