import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';
import { CHAT_STATUS } from '../../enums';

const LayoutContext = React.createContext();

const LayoutContextProvider = ({ children }) => {
  // layout mode: grid or list
  const [mode, setMode] = useState(DEFAULT_ITEM_LAYOUT_MODE);

  // item screen editing id
  // todo: separate in item specific context
  const [editingItemId, setEditingItemId] = useState(null);

  // item settings page open
  // todo: separate in item specific context
  const [openedActionTabId, setOpenedActionTabId] = useState(null);

  const [isMainMenuOpen, setIsMainMenuOpen] = useState(true);

  const [isItemMetadataMenuOpen, setIsItemMetadataMenuOpen] = useState(false);
  // check query params to see if chat should be open
  const chatIsOpen =
    new URLSearchParams(window.location.search).get('chat') ===
    CHAT_STATUS.OPEN;
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState(chatIsOpen);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      editingItemId,
      setEditingItemId,
      isMainMenuOpen,
      setIsMainMenuOpen,
      openedActionTabId,
      setOpenedActionTabId,
      isItemMetadataMenuOpen,
      setIsItemMetadataMenuOpen,
      isChatboxMenuOpen,
      setIsChatboxMenuOpen,
    }),
    [
      editingItemId,
      isChatboxMenuOpen,
      isItemMetadataMenuOpen,
      isMainMenuOpen,
      mode,
      openedActionTabId,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node,
};

LayoutContextProvider.defaultProps = {
  children: null,
};

export { LayoutContext, LayoutContextProvider };
