import { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import { Button, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { TREE_MODAL_CONFIRM_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import CancelButton from '../../common/CancelButton';
import AccessibleNavigationTree from './AccessibleNavigationTree';
import Breadcrumbs, { NavigationElement } from './Breadcrumbs';
import ChildrenNavigationTree from './ChildrenNavigationTree';
import RootNavigationTree from './RootNavigationTree';

const dialogId = 'items-tree-modal';

export type ItemSelectionModalProps = {
  buttonText: (itemName?: string) => string;
  /** disabled rows
   *  */
  isDisabled: (item: NavigationElement, homeId: string) => boolean;
  // items can be undefined because "many" operations start empty
  items?: DiscriminatedItem[];
  onClose: (args: { id: string | null; open: boolean }) => void;
  onConfirm: (args: string | undefined) => void;
  open?: boolean;
  title: string;
};

const ItemSelectionModal = ({
  buttonText = () => 'Submit',
  isDisabled,
  items = [],
  onClose,
  onConfirm,
  open = false,
  title,
}: ItemSelectionModalProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  // special elements for breadcrumbs
  // root displays specific paths
  const ROOT_BREADCRUMB = {
    icon: <HomeIcon />,
    name: '',
    id: 'selectionModalRoot',
  };
  // my graasp displays accessible items
  const MY_GRAASP_BREADCRUMB = {
    name: translateBuilder(BUILDER.MY_ITEMS_TITLE),
    id: 'selectionModalMyGraasp',
  };

  const SPECIAL_BREADCRUMB_IDS = [ROOT_BREADCRUMB.id, MY_GRAASP_BREADCRUMB.id];

  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  }>();

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

  // does not show breadcrumbs on root
  const renderBreadcrumbs = () => {
    if (selectedNavigationItem.id === ROOT_BREADCRUMB.id) {
      return null;
    }

    // always show root
    const elements: NavigationElement[] = [ROOT_BREADCRUMB];

    // show graasp if not on root
    if (selectedNavigationItem.id !== MY_GRAASP_BREADCRUMB.id) {
      elements.push(MY_GRAASP_BREADCRUMB);
    }

    // parents: needs a check on current selected value as parents might keep the previous data
    if (
      !SPECIAL_BREADCRUMB_IDS.includes(selectedNavigationItem.id) &&
      navigationParents
    ) {
      elements.push(...navigationParents);
    }

    // element itself
    elements.push(selectedNavigationItem);

    return (
      <Breadcrumbs
        elements={elements}
        onSelect={(item: NavigationElement) => {
          setSelectedNavigationItem(item);
          setSelectedItem(item);
        }}
      />
    );
  };

  // row menu navigation
  const onNavigate = (item: NavigationElement) => {
    setSelectedNavigationItem(item);
    setSelectedItem(item);
  };

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
            minHeight: 270,
            position: 'relative',
          }}
        >
          {renderBreadcrumbs()}

          {selectedNavigationItem.id === ROOT_BREADCRUMB.id && (
            <RootNavigationTree
              isDisabled={(item) => isDisabled(item, MY_GRAASP_BREADCRUMB.id)}
              onClick={setSelectedItem}
              selectedId={selectedItem?.id}
              onNavigate={onNavigate}
              items={items}
              rootMenuItems={[MY_GRAASP_BREADCRUMB]}
            />
          )}
          {selectedNavigationItem.id === MY_GRAASP_BREADCRUMB.id && (
            <AccessibleNavigationTree
              isDisabled={(item) => isDisabled(item, MY_GRAASP_BREADCRUMB.id)}
              onClick={setSelectedItem}
              onNavigate={onNavigate}
              selectedId={selectedItem?.id}
            />
          )}
          {!SPECIAL_BREADCRUMB_IDS.includes(selectedNavigationItem.id) && (
            <ChildrenNavigationTree
              isDisabled={(item) => isDisabled(item, MY_GRAASP_BREADCRUMB.id)}
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
            isDisabled(selectedItem, MY_GRAASP_BREADCRUMB.id)
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
