import React, { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs, Button, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { DiscriminatedItem } from '@graasp/sdk';

import i18n, { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  HOME_MODAL_ITEM_ID,
  ROOT_MODAL_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CancelButton from '../common/CancelButton';
import RootTreeModal from './RootTreeModal';

const dialogId = 'items-tree-modal';

export type TreeModalProps = {
  onConfirm: (args: { ids: string[]; to?: string }) => void;
  onClose: (args: { id: string | null; open: boolean }) => void;
  title: string;
  itemIds?: string[];
  open?: boolean;
};

const TreeModal = ({
  title,
  onClose,
  onConfirm,
  open = false,
  itemIds = [],
}: TreeModalProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  console.log(i18n.language);
  const [selectedId, setSelectedId] = useState<string>('');
  // serious of breadcrumbs
  const [breadcrumbs, setBreadcrumbs] = useState<
    (DiscriminatedItem | { name: string; id: string })[]
  >([{ name: translateBuilder(BUILDER.ROOT), id: ROOT_MODAL_ID }]);

  const { data: parentItem } = hooks.useItem(
    selectedId === HOME_MODAL_ITEM_ID ? '' : selectedId,
  );
  const { data: itemToMove } = hooks.useItem(itemIds[0]);

  const { data: parents } = hooks.useParents({
    id: itemIds?.[0],
  });

  const handleClose = () => {
    onClose({ id: null, open: false });
  };
  const onClickConfirm = () => {
    onConfirm({ ids: itemIds, to: selectedId });
    handleClose();
  };

  // no selected item, or selectedId is same original location
  const isDisabled =
    !selectedId ||
    selectedId === ROOT_MODAL_ID ||
    (!parents?.length && selectedId === HOME_MODAL_ITEM_ID) ||
    selectedId === (parents && parents[parents.length - 1]?.id);

  const text =
    !isDisabled &&
    translateBuilder(BUILDER.TO_FOLDER, {
      name:
        selectedId === HOME_MODAL_ITEM_ID
          ? translateBuilder(BUILDER.HOME_TITLE)
          : parentItem?.name || '',
    });

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={dialogId}
      open={open}
      scroll="paper"
      PaperProps={{
        sx: {
          width: { sm: '350px', md: '400px', lg: '500px' },
        },
      }}
    >
      <DialogTitle id={dialogId}>
        {translateBuilder(title, {
          name:
            i18n.language === 'en'
              ? `${itemToMove?.name.slice(0, 10)}${
                  (itemToMove?.name.length || 0) > 10 ? '...' : ''
                }`
              : itemToMove?.name,
          count: itemIds.length - 1,
        })}
      </DialogTitle>
      <DialogContent
        sx={{
          height: '270px',
        }}
      >
        {breadcrumbs.length > 1 && (
          <Stack spacing={2} mb={2}>
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              sx={{ '& li:first-of-type': { width: '42px', paddingLeft: 1 } }}
            >
              {breadcrumbs.map((ele) => (
                <Button
                  variant="text"
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 0,
                    '&:hover': {
                      textDecoration: 'underline',
                      background: 'none',
                    },
                  }}
                  key={ele.id}
                  onClick={() => {
                    setBreadcrumbs((prevBreadcrumb) => {
                      // remove until the clicked item included
                      const trimmedIndex = prevBreadcrumb.indexOf(ele);
                      if (trimmedIndex === 0 && prevBreadcrumb.length === 1) {
                        return prevBreadcrumb;
                      }
                      if (trimmedIndex === 0) {
                        return prevBreadcrumb.slice(
                          0,
                          -prevBreadcrumb.length + 1,
                        );
                      }
                      return prevBreadcrumb.slice(0, trimmedIndex + 1);
                    });

                    if (ele.id === ROOT_MODAL_ID) {
                      setSelectedId('');
                    } else {
                      setSelectedId(ele.id);
                    }
                  }}
                >
                  {ele.id === ROOT_MODAL_ID ? (
                    <HomeIcon />
                  ) : (
                    `${ele.name.slice(0, 12)}${
                      ele.name.length > 12 ? '...' : ''
                    }`
                  )}
                </Button>
              ))}
            </Breadcrumbs>
          </Stack>
        )}

        <RootTreeModal
          setBreadcrumbs={setBreadcrumbs}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          selectedParent={breadcrumbs[breadcrumbs.length - 1]}
          itemIds={itemIds}
          parentItem={parents?.[parents.length - 1]}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          onClick={onClickConfirm}
          disabled={isDisabled}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
          variant="contained"
          sx={{
            textOverflow: 'ellipsis',
            maxWidth: '180px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'block',
          }}
        >
          {translateBuilder(BUILDER.MOVE_BUTTON)}
          {text && ` ${text}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreeModal;
