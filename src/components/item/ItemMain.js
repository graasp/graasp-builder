import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Container, Divider, Typography, styled } from '@mui/material';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { DrawerHeader } from '@graasp/ui';

import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_MAIN_CLASS } from '../../config/selectors';
import Chatbox from '../common/Chatbox';
import { LayoutContext } from '../context/LayoutContext';
import ItemMetadataContent from './ItemMetadataContent';
import ItemPanel from './ItemPanel';
import ItemHeader from './header/ItemHeader';

const ItemMain = ({ id, children, item }) => {
  const { t } = useTranslation();
  const {
    isItemMetadataMenuOpen,
    setIsItemMetadataMenuOpen,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
  } = useContext(LayoutContext);

  const handleToggleMetadataMenu = () => {
    setIsItemMetadataMenuOpen(!isItemMetadataMenuOpen);
    setIsChatboxMenuOpen(false);
  };
  const handleToggleChatboxMenu = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
    setIsItemMetadataMenuOpen(false);
  };

  const StyledContainer = styled(Container)(({ theme }) => {
    const openStyles = isChatboxMenuOpen
      ? {
          marginRight: RIGHT_MENU_WIDTH,
        }
      : {};

    return {
      position: 'relative',
      padding: theme.spacing(1),
      flexGrow: 1,
      marginRight: 0,
      margin: 'auto',
      // takes the whole screen height minus the header height approximatively
      // this might have to change
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',

      ...openStyles,
    };
  });

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
            <Typography variant="h6">{t('Comments')}</Typography>
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
          <Typography variant="h6">{t('Information')}</Typography>
        </DrawerHeader>
        <Divider />
        <ItemMetadataContent item={item} />
      </ItemPanel>

      <StyledContainer>
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
