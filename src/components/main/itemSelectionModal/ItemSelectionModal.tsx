import { useState } from 'react';

import { Home as HomeIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { Breadcrumbs, type NavigationElement } from '@graasp/ui';

import { computeTitle } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import {
  HOME_MODAL_ITEM_ID,
  MY_GRAASP_ITEM_PATH,
  TREE_MODAL_CONFIRM_BUTTON_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import CancelButton from '../../common/CancelButton';
import AccessibleNavigationTree from './AccessibleNavigationTree';
import ChildrenNavigationTree from './ChildrenNavigationTree';
import RootNavigationTree from './RootNavigationTree';

const dialogId = 'items-tree-modal';

export type ItemSelectionModalProps = {
  buttonText: (itemName?: string) => string;
  /** disabled rows
   *  */
  isDisabled?: (
    items: DiscriminatedItem[],
    item: NavigationElement,
    homeId: string,
  ) => boolean;
  // items can be undefined because "many" operations start empty
  itemIds?: string[];
  onClose: (args: { id: string | null; open: boolean }) => void;
  onConfirm: (destination: string | undefined) => void;
  open?: boolean;
  titleKey: string;
};

const ItemSelectionModal = ({
  buttonText = () => 'Submit',
  isDisabled = () => false,
  itemIds = [],
  onClose,
  onConfirm,
  open = false,
  titleKey,
}: ItemSelectionModalProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: items, isLoading } = hooks.useItems(itemIds);
  const title = items ? (
    computeTitle({
      items,
      count: itemIds.length - 1,
      translateBuilder,
      translateKey: titleKey,
    })
  ) : (
    <Skeleton height={50} />
  );

  // special elements for breadcrumbs
  // root displays specific paths
  const ROOT_BREADCRUMB: NavigationElement = {
    icon: <HomeIcon />,
    name: '',
    path: 'selectionModalRoot',
    id: 'selectionModalRoot',
  };
  // my graasp displays accessible items
  const MY_GRAASP_BREADCRUMB: NavigationElement = {
    name: translateBuilder(BUILDER.MY_ITEMS_TITLE),
    id: MY_GRAASP_ITEM_PATH,
    path: MY_GRAASP_ITEM_PATH,
  };

  const SPECIAL_BREADCRUMB_IDS = [ROOT_BREADCRUMB.id, MY_GRAASP_BREADCRUMB.id];

  const [selectedItem, setSelectedItem] = useState<NavigationElement>();

  // keep track of the navigation item that can be different from the selected item
  const [selectedNavigationItem, setSelectedNavigationItem] =
    useState<NavigationElement>(ROOT_BREADCRUMB);

  const { data: navigationParents } = hooks.useParents({
    id: selectedNavigationItem.id,
    enabled: !SPECIAL_BREADCRUMB_IDS.includes(selectedNavigationItem.id),
  });

  const handleClose = () => {
    onClose({ id: null, open: false });
  };

  const onClickConfirm = () => {
    onConfirm(
      selectedItem?.id === MY_GRAASP_BREADCRUMB.id
        ? undefined
        : selectedItem?.id,
    );
    handleClose();
  };

  // row menu navigation
  const onNavigate = (item: NavigationElement) => {
    setSelectedNavigationItem(item);
    setSelectedItem(item);
  };

  const isDisabledLocal = (item: NavigationElement) =>
    !items?.data ||
    isDisabled(Object.values(items.data), item, MY_GRAASP_BREADCRUMB.id);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={dialogId}
      open={open}
      scroll="paper"
    >
      <DialogTitle id={dialogId}>{title}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          sx={{
            // needs a min height to avoid too small modal (reduce flickering)
            minHeight: 250,
            position: 'relative',
          }}
          id={HOME_MODAL_ITEM_ID}
        >
          {selectedNavigationItem.id !== ROOT_BREADCRUMB.id && (
            <Breadcrumbs
              elements={[...(navigationParents ?? []), selectedNavigationItem]}
              rootElements={[ROOT_BREADCRUMB, MY_GRAASP_BREADCRUMB]}
              selectedId={selectedNavigationItem.id}
              onSelect={onNavigate}
            />
          )}

          {items?.data && selectedNavigationItem.id === ROOT_BREADCRUMB.id && (
            <RootNavigationTree
              isDisabled={(item) =>
                isDisabled(
                  Object.values(items.data),
                  item,
                  MY_GRAASP_BREADCRUMB.id,
                )
              }
              onClick={setSelectedItem}
              selectedId={selectedItem?.id}
              onNavigate={onNavigate}
              items={Object.values(items.data)}
              rootMenuItems={[MY_GRAASP_BREADCRUMB]}
            />
          )}
          {isLoading && (
            <>
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </>
          )}
          {selectedNavigationItem.id === MY_GRAASP_BREADCRUMB.id && (
            <AccessibleNavigationTree
              isDisabled={isDisabledLocal}
              onClick={setSelectedItem}
              onNavigate={onNavigate}
              selectedId={selectedItem?.id}
            />
          )}
          {!SPECIAL_BREADCRUMB_IDS.includes(selectedNavigationItem.id) && (
            <ChildrenNavigationTree
              isDisabled={isDisabledLocal}
              onClick={setSelectedItem}
              onNavigate={onNavigate}
              selectedId={selectedItem?.id}
              selectedNavigationItem={selectedNavigationItem}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          onClick={onClickConfirm}
          disabled={
            !selectedItem ||
            // root is not a valid value
            selectedItem.id === ROOT_BREADCRUMB.id ||
            isDisabledLocal(selectedItem)
          }
          id={TREE_MODAL_CONFIRM_BUTTON_ID}
          variant="contained"
          sx={{
            textOverflow: 'ellipsis',
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'block',
          }}
        >
          {buttonText(selectedItem?.name)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemSelectionModal;
