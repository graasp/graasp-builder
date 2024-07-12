import { Helmet } from 'react-helmet';

import { Container, Divider, Stack, Typography, styled } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import { DrawerHeader } from '@graasp/ui';

import { BUILDER } from '@/langs/constants';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_MAIN_CLASS } from '../../config/selectors';
import Chatbox from '../common/Chatbox';
import { useLayoutContext } from '../context/LayoutContext';
import ItemPanel from './ItemPanel';
import ItemHeader from './header/ItemHeader';

const StyledContainer = styled(Container)<{ open: boolean }>(({
  theme,
  open,
}) => {
  const openStyles = open
    ? {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        // marginRight: RIGHT_MENU_WIDTH,
      }
    : {};

  return {
    flexGrow: 1,
    // marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    ...openStyles,
  };
});

type Props = {
  children: JSX.Element | JSX.Element[];
  item: PackedItem;
  id?: string;
};

const ItemMain = ({ id, children, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { isChatboxMenuOpen, setIsChatboxMenuOpen } = useLayoutContext();

  return (
    <>
      <Helmet>
        <title>{item.name}</title>
      </Helmet>
      <Stack
        id={id}
        p={2}
        direction="row"
        className={ITEM_MAIN_CLASS}
        height="100%"
      >
        <StyledContainer open={isChatboxMenuOpen}>
          <ItemHeader showNavigation />
          {children}
        </StyledContainer>

        <ItemPanel open={isChatboxMenuOpen}>
          <DrawerHeader
            handleDrawerClose={() => {
              setIsChatboxMenuOpen(false);
            }}
            // todo
            direction="rtl"
          >
            <Typography variant="h6">
              {translateBuilder(BUILDER.ITEM_CHATBOX_TITLE, {
                name: item.name,
              })}
            </Typography>
          </DrawerHeader>
          <Divider />
          <Chatbox item={item} />
        </ItemPanel>
      </Stack>
    </>
  );
};

export default ItemMain;
