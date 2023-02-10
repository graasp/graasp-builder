import { List as ImmutableList } from 'immutable';

import { ListItemButton, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { createContext, useMemo, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { FlagRecord } from '@graasp/query-client/dist/types';
import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { FLAG_LIST_MAX_HEIGHT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { hooks, useMutation } from '../../config/queryClient';
import {
  FLAG_ITEM_BUTTON_ID,
  buildFlagListItemId,
} from '../../config/selectors';
import CancelButton from '../common/CancelButton';

const { useFlags } = hooks;

const FlagItemModalContext = createContext<{
  openModal?: (id: string) => void;
}>({});

const FlagItemModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: postFlagItem } = useMutation<
    unknown,
    unknown,
    { flagId: string; itemId: string }
  >(MUTATION_KEYS.POST_ITEM_FLAG);
  const [open, setOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FlagRecord | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);

  const { data } = useFlags();
  const flags = data as ImmutableList<FlagRecord>;

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
        <DialogTitle>
          {translateBuilder(BUILDER.FLAG_ITEM_MODAL_TITLE)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {translateBuilder(BUILDER.FLAG_ITEM_REASON_TITLE)}
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
              <ListItemButton
                key={flag.id}
                id={buildFlagListItemId(flag.id)}
                selected={selectedFlag?.id === flag.id}
                onClick={handleSelect(flag)}
              >
                <ListItemText primary={flag.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <Button
            onClick={onFlag}
            id={FLAG_ITEM_BUTTON_ID}
            disabled={!selectedFlag}
          >
            {translateBuilder(BUILDER.FLAG_ITEM_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </FlagItemModalContext.Provider>
  );
};

export { FlagItemModalProvider, FlagItemModalContext };
