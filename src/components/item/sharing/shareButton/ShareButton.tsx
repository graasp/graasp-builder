import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

import { DiscriminatedItem } from '@graasp/sdk';

import { ChevronDown } from 'lucide-react';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import {
  SHARE_BUTTON_MORE_ID,
  SHARE_BUTTON_SELECTOR,
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ImportUsersWithCSVDialog from '../csvImport/ImportUsersWithCSVDialog';
import CreateItemMembershipForm from './CreateItemMembershipForm';

type Props = {
  item: DiscriminatedItem;
};

const ShareButton = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: isOpenImportCsvModal,
    closeModal: closeImportCsvModal,
    openModal: openImportCsvModal,
  } = useModalStatus();
  const {
    isOpen: isOpenShareItemModal,
    closeModal: closeShareItemModal,
    openModal: openShareItemModal,
  } = useModalStatus();

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        disableElevation
        ref={anchorRef}
        aria-label="sharing options"
      >
        <Button onClick={openShareItemModal} data-cy={SHARE_BUTTON_SELECTOR}>
          {translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        </Button>
        <Button
          size="small"
          aria-controls={openMenu ? 'split-button-menu' : undefined}
          aria-expanded={openMenu ? 'true' : undefined}
          aria-label="select share option"
          aria-haspopup="menu"
          onClick={handleToggle}
          id={SHARE_BUTTON_MORE_ID}
        >
          <ChevronDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={openMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
      >
        {({ TransitionProps }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem onClick={openShareItemModal}>
                    {translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
                  </MenuItem>
                  <MenuItem
                    id={SHARE_ITEM_CSV_PARSER_BUTTON_ID}
                    onClick={() => openImportCsvModal()}
                  >
                    {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_BUTTON)}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <CreateItemMembershipForm
        open={isOpenShareItemModal}
        item={item}
        handleClose={closeShareItemModal}
      />
      <ImportUsersWithCSVDialog
        item={item}
        handleCloseModal={closeImportCsvModal}
        open={isOpenImportCsvModal}
      />
    </>
  );
};

export default ShareButton;
