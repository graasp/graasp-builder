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
  setPaths: Dispatch<SetStateAction<DiscriminatedItem[]>>;
  setSelectedId: Dispatch<SetStateAction<string>>;
  selectedId: string;
  defaultSelectedSubItem: DiscriminatedItem | null;
  itemIds: string[];
  defaultParent?: DiscriminatedItem;
}

const OwnedItemsTree = ({
  setPaths,
  setSelectedId,
  selectedId,
  defaultSelectedSubItem,
  itemIds,
  defaultParent,
}: OwnedItemsProps) => {
  const { data: ownItems } = hooks.useOwnItems();
  const { data: sharedItems } = hooks.useSharedItems();
  const { t: translateBuilder } = useBuilderTranslation();

  const [selectedSubItem, setSubSelectedItem] = useState(
    defaultSelectedSubItem,
  );

  const [isHome, setIsHome] = useState(true);
  const { data } = hooks.useChildren(selectedSubItem?.id || '');

  const selectSubItems = (ele: DiscriminatedItem) => {
    setSubSelectedItem(ele);
    setPaths((paths: DiscriminatedItem[]) => [...paths, ele]);
    setSelectedId(ele.id);
  };

  useEffect(() => {
    if (defaultSelectedSubItem) {
      if (
        defaultSelectedSubItem.name === translateBuilder(BUILDER.HOME_TITLE)
      ) {
        setSubSelectedItem(null);
      } else {
        setSubSelectedItem(defaultSelectedSubItem);
      }

      setSelectedId(defaultSelectedSubItem?.id);

      setPaths((prevPaths) => {
        const trimmedIndex = prevPaths.indexOf(defaultSelectedSubItem);
        if (trimmedIndex === 0) {
          return prevPaths.slice(0, -prevPaths.length + 1);
        }
        return prevPaths.slice(0, trimmedIndex + 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedSubItem?.id]);

  const rootMenuItem = {
    name: translateBuilder(BUILDER.HOME_TITLE),
    id: TREE_MODAL_MY_ITEMS_ID,
    extra: { folder: { childrenOrder: [''] } },
    type: ItemType.FOLDER,
  } as DiscriminatedItem;

  const items = useMemo(() => {
    const results = selectedSubItem
      ? data
      : [...(ownItems || []), ...(sharedItems || [])];

    return results?.filter(
      (ele: DiscriminatedItem) => ele.type === ItemType.FOLDER,
    );
  }, [selectSubItems]);
  return (
    <div id={`${TREE_MODAL_MY_ITEMS_ID}`}>
      {/* Home or Root  Which will be the start of the menu */}
      {isHome && (
        <MoveMenuRow
          key={rootMenuItem.name}
          ele={rootMenuItem}
          fetchSubItems={() => {
            setIsHome(false);
            setPaths((paths: DiscriminatedItem[]) => [...paths, rootMenuItem]);
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

      {defaultParent && !selectedSubItem && (
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

      {!isHome && !defaultParent && !items?.length && (
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
  const [paths, setPaths] = useState<DiscriminatedItem[]>([]);

  const { data: parentItem } = hooks.useItem(
    selectedId === TREE_MODAL_MY_ITEMS_ID ? '' : selectedId,
  );
  const { data: parents } = hooks.useParents({
    id: itemIds?.[0],
  });
  const [defaultSelectedSubItem, setDefaultSelectedSubItem] =
    // eslint-disable-next-line no-unsafe-optional-chaining
    useState<DiscriminatedItem | null>(null);

  const handleClose = () => {
    onClose({ id: null, open: false });
  };

  const onClickConfirm = () => {
    onConfirm({ ids: itemIds, to: selectedId });
    handleClose();
  };

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
                onClick={() => setDefaultSelectedSubItem(ele)}
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
          defaultSelectedSubItem={defaultSelectedSubItem}
          itemIds={itemIds}
          defaultParent={parents?.[parents.length - 1]}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          onClick={onClickConfirm}
          disabled={!parentItem && selectedId !== TREE_MODAL_MY_ITEMS_ID}
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
          variant="contained"
        >
          {translateBuilder(BUILDER.MOVE_BUTTON)}
          {(selectedId === TREE_MODAL_MY_ITEMS_ID &&
            ` to ${translateBuilder(BUILDER.HOME_TITLE)}`) ||
            (parentItem?.name && ` to ${parentItem?.name}`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreeModal;
