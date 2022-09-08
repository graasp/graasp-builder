import React, { useContext } from 'react';
import { Record } from 'immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import ItemHeader from './header/ItemHeader';
import ItemPanel from './ItemPanel';
import { ITEM_MAIN_CLASS } from '../../config/selectors';
import { LayoutContext } from '../context/LayoutContext';
import Chatbox from '../common/Chatbox';
import ItemMetadataContent from './ItemMetadataContent';
import ItemPanelHeader from './ItemPanelHeader';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    position: 'relative',
    padding: theme.spacing(1),
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    // takes the whole screen height minus the header height approximatively
    // this might have to change
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: RIGHT_MENU_WIDTH,
  },
}));

const ItemMain = ({ id, children, item }) => {
  const classes = useStyles();
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

  return (
    <div id={id} className={ITEM_MAIN_CLASS}>
      {isChatboxMenuOpen && (
        <ItemPanel open={isChatboxMenuOpen}>
          <ItemPanelHeader
            title={t('Comments')}
            onClick={() => {
              setIsChatboxMenuOpen(false);
            }}
          />
          <Chatbox item={item} />
        </ItemPanel>
      )}
      <ItemPanel open={isItemMetadataMenuOpen}>
        <ItemPanelHeader
          title={t('Information')}
          onClick={() => {
            setIsItemMetadataMenuOpen(false);
          }}
        />
        <ItemMetadataContent item={item} />
      </ItemPanel>

      <div
        className={clsx(classes.root, classes.content, {
          [classes.contentShift]: isItemMetadataMenuOpen || isChatboxMenuOpen,
        })}
      >
        <ItemHeader
          onClickMetadata={handleToggleMetadataMenu}
          onClickChatbox={handleToggleChatboxMenu}
        />

        {children}
      </div>
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
