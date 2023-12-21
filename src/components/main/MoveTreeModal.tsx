import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Breadcrumbs, Button, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  ROOT_MODAL_ID,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_MY_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CancelButton from '../common/CancelButton';
import MoveMenuRow from './RowMenu';

const dialogId = 'simple-dialog-title';

export type TreeModalProps = {
  onConfirm: (args: { ids: string[]; to?: string }) => void;
  onClose: (args: { id: string | null; open: boolean }) => void;
  title: string;
  itemIds?: string[];
  open?: boolean;
};

interface OwnedItemsProps {
  setPaths: Dispatch<
    SetStateAction<(DiscriminatedItem | { name: string; id: string })[]>
  >;
  setSelectedId: Dispatch<SetStateAction<string>>;
  selectedId: string;
  selectedParent: DiscriminatedItem | null | { name: string; id: string };
  itemIds: string[];
  defaultParent?: DiscriminatedItem;
}

const OwnedItemsTree = ({
  setPaths,
  setSelectedId,
  selectedId,
  selectedParent,
  itemIds,
  defaultParent,
}: OwnedItemsProps) => {
  const { data: ownItems } = hooks.useOwnItems();
  const { data: sharedItems } = hooks.useSharedItems();
  const { t: translateBuilder } = useBuilderTranslation();

  const [isHome, setIsHome] = useState(true);
  const { data } = hooks.useChildren(selectedParent?.id || '');

  const selectSubItems = (ele: DiscriminatedItem) => {
    setPaths((paths) => [...paths, ele]);
    setSelectedId(ele.id);
  };

  useEffect(() => {
    if (selectedParent?.id === ROOT_MODAL_ID) {
      setIsHome(true);
    }
  }, [selectedParent]);
  const rootMenuItem = {
    name: translateBuilder(BUILDER.HOME_TITLE),
    id: TREE_MODAL_MY_ITEMS_ID,
    type: ItemType.FOLDER,
  } as DiscriminatedItem;

  const items = useMemo(() => {
    const results =
      selectedParent?.id === TREE_MODAL_MY_ITEMS_ID
        ? [...(ownItems || []), ...(sharedItems || [])]
        : data;

    return results?.filter(
      (ele: DiscriminatedItem) => ele.type === ItemType.FOLDER,
    );
  }, [selectedParent, ownItems, sharedItems, data]);

  return (
    <div id={`${TREE_MODAL_MY_ITEMS_ID}`}>
      {/* Home or Root  Which will be the start of the menu */}
      {isHome && (
        <MoveMenuRow
          key={rootMenuItem.name}
          ele={rootMenuItem}
          fetchSubItems={() => {
            setIsHome(false);
            setPaths((paths) => [...paths, rootMenuItem]);
            setSelectedId(rootMenuItem.id);
          }}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          itemIds={[]}
        />
      )}
      {/* end of home */}

      {/* Items for selected Item, So if I choose folder1 this should be it children */}
      {!isHome &&
        items?.map((ele) => (
          <MoveMenuRow
            key={ele.id}
            ele={ele}
            fetchSubItems={() => selectSubItems(ele)}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            itemIds={itemIds}
          />
        ))}

      {/* Default Parent So If I want to move an item who's in nested folder we will have it's parent as default */}

      {defaultParent && selectedParent?.id === ROOT_MODAL_ID && (
        <MoveMenuRow
          key={defaultParent.id}
          ele={defaultParent}
          fetchSubItems={() => {
            selectSubItems(defaultParent);
            setIsHome(false);
            setSelectedId(defaultParent.id);
          }}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          itemIds={itemIds}
        />
      )}

      {!isHome && !items?.length && (
        <div>
          {translateBuilder(BUILDER.EMPTY_FOLDER_CHILDREN_FOR_THIS_ITEM)}
        </div>
      )}
    </div>
  );
};

const TreeModal = ({
  title,
  onClose,
  onConfirm,
  open = false,
  itemIds = [],
}: TreeModalProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [selectedId, setSelectedId] = useState<string>('');
  // serious of breadcrumbs
  const [paths, setPaths] = useState<
    (DiscriminatedItem | { name: string; id: string })[]
  >([{ name: translateBuilder(BUILDER.ROOT), id: ROOT_MODAL_ID }]);

  const { data: parentItem } = hooks.useItem(
    selectedId === TREE_MODAL_MY_ITEMS_ID ? '' : selectedId,
  );
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

  // no selected Item, or selectedId is same original location
  const isDisabled =
    !selectedId ||
    selectedId === ROOT_MODAL_ID ||
    (!parents?.length && selectedId === TREE_MODAL_MY_ITEMS_ID) ||
    selectedId === (parents && parents?.[(parents?.length || 0) - 1]?.id);

  const text =
    !isDisabled &&
    ((selectedId === TREE_MODAL_MY_ITEMS_ID &&
      ` ${translateBuilder(BUILDER.TO)} ${translateBuilder(
        BUILDER.HOME_TITLE,
      )}`) ||
      (parentItem?.name &&
        ` ${translateBuilder(BUILDER.TO)} ${parentItem?.name}`));

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={dialogId}
      open={open}
      scroll="paper"
    >
      <DialogTitle id={dialogId}>{title}</DialogTitle>
      <DialogContent sx={{ height: '250px' }}>
        <Stack spacing={2} mb={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {paths.map((ele, index) => (
              <Button
                variant="text"
                color="inherit"
                sx={{
                  padding: 0,
                  '&:hover': {
                    textDecoration: 'underline',
                    background: 'none',
                  },
                }}
                key={ele.id}
                onClick={() => {
                  setPaths((prevPaths) => {
                    const trimmedIndex = prevPaths.indexOf(ele);
                    if (trimmedIndex === 0) {
                      return prevPaths.slice(0, -prevPaths.length + 1);
                    }
                    return prevPaths.slice(0, trimmedIndex + 1);
                  });

                  if (ele.id === ROOT_MODAL_ID) {
                    setSelectedId('');
                  } else {
                    setSelectedId(ele.id);
                  }
                }}
                disabled={index === paths.length - 1}
              >
                {ele.name}
              </Button>
            ))}
          </Breadcrumbs>
        </Stack>

        <OwnedItemsTree
          setPaths={setPaths}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          selectedParent={paths[paths.length - 1]}
          itemIds={itemIds}
          defaultParent={parents?.[parents.length - 1]}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          onClick={onClickConfirm}
          disabled={isDisabled}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
          variant="contained"
        >
          {translateBuilder(BUILDER.MOVE_BUTTON)}
          {text}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreeModal;
