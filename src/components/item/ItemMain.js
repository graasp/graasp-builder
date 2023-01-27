import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Box, Divider, Typography, styled } from '@mui/material';

import { BUILDER } from '@graasp/translations';
import { DrawerHeader } from '@graasp/ui';

import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_MAIN_CLASS } from '../../config/selectors';
import Chatbox from '../common/Chatbox';
import { useLayoutContext } from '../context/LayoutContext';
import ItemMetadataContent from './ItemMetadataContent';
import ItemPanel from './ItemPanel';
import ItemHeader from './header/ItemHeader';

const StyledContainer = styled(Box)(({ theme, open }) => {
  const openStyles = open
    ? {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: RIGHT_MENU_WIDTH,
      }
    : {};

  return {
    position: 'relative',
    padding: theme.spacing(1, 2),
    flexGrow: 1,
    marginRight: 0,
    width: 'unset',
    // takes the whole screen height minus the header height approximatively
    // this might have to change
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',

    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    ...openStyles,
  };
});

const ItemMain = ({ id, children, item }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    isItemMetadataMenuOpen,
    setIsItemMetadataMenuOpen,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
  } = useLayoutContext();

  const handleToggleMetadataMenu = () => {
    setIsItemMetadataMenuOpen(!isItemMetadataMenuOpen);
    setIsChatboxMenuOpen(false);
  };
  const handleToggleChatboxMenu = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
    setIsItemMetadataMenuOpen(false);
  };
  return (
    <div id={id} className={ITEM_MAIN_CLASS}>
      {isChatboxMenuOpen && (
        <ItemPanel open={isChatboxMenuOpen}>
          <DrawerHeader
            handleDrawerClose={() => {
              setIsChatboxMenuOpen(false);
            }}
            // todo
            direction="rtl"
          >
            <Typography variant="h6">
              {translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            </Typography>
          </DrawerHeader>
          <Divider />
          <Chatbox item={item} />
        </ItemPanel>
      )}
      <ItemPanel open={isItemMetadataMenuOpen}>
        <DrawerHeader
          handleDrawerClose={() => {
            setIsItemMetadataMenuOpen(false);
          }}
          // todo
          direction="rtl"
        >
          <Typography variant="h6">
            {translateBuilder(BUILDER.ITEM_METADATA_TITLE)}
          </Typography>
        </DrawerHeader>
        <Divider />
        <ItemMetadataContent item={item} />
      </ItemPanel>

      <StyledContainer open={isChatboxMenuOpen || isItemMetadataMenuOpen}>
        <ItemHeader
          showNavigation
          onClickMetadata={handleToggleMetadataMenu}
          onClickChatbox={handleToggleChatboxMenu}
        />

        {children}
      </StyledContainer>
    </div>
  );
};

ItemMain.propTypes = {
  children: PropTypes.node.isRequired,
  item: PropTypes.instanceOf(Record).isRequired,
  id: PropTypes.string,
};

ItemMain.defaultProps = {
  id: null,
};

export default ItemMain;
