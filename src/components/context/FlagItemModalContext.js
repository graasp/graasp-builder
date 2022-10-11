import PropTypes from 'prop-types';

import { ListItem, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { createContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Button } from '@graasp/ui';

import { FLAG_LIST_MAX_HEIGHT } from '../../config/constants';
import { hooks, useMutation } from '../../config/queryClient';
import {
  FLAG_ITEM_BUTTON_ID,
  buildFlagListItemId,
} from '../../config/selectors';

const { useFlags } = hooks;

const FlagItemModalContext = createContext();

const FlagItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
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
          <Typography variant="body1">
            {`${t('Select reason for flagging this item')}:`}
          </Typography>
          <List
            component="nav"
            sx={{
              width: '100%',
              overflow: 'auto',
              maxHeight: FLAG_LIST_MAX_HEIGHT,
            }}
          >
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
          <Button onClick={onClose} variant="text">
            {t('Cancel')}
          </Button>
          <Button
            onClick={onFlag}
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
