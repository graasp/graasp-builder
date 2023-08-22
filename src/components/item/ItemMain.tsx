import { Box, Divider, Typography, styled } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';
import { DrawerHeader } from '@graasp/ui';

import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_MAIN_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import Chatbox from '../common/Chatbox';
import { useLayoutContext } from '../context/LayoutContext';
import ItemMetadataContent from './ItemMetadataContent';
import ItemPanel from './ItemPanel';
import ItemHeader from './header/ItemHeader';

const StyledContainer = styled(Box)<{ open: boolean }>(({ theme, open }) => {
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

type Props = {
  children: JSX.Element | JSX.Element[];
  item: ItemRecord;
  id?: string;
};

const ItemMain = ({ id, children, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    isItemMetadataMenuOpen,
    setIsItemMetadataMenuOpen,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
  } = useLayoutContext();

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
        <ItemHeader showNavigation />

        {children}
      </StyledContainer>
    </div>
  );
};

export default ItemMain;
