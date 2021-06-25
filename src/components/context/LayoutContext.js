import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';

const LayoutContext = React.createContext();

const LayoutContextProvider = ({ children }) => {
  // layout mode: grid or list
  const [mode, setMode] = useState(DEFAULT_ITEM_LAYOUT_MODE);

  // item screen editing id
  // todo: separate in item specific context
  const [editingItemId, setEditingItemId] = useState(null);

  // item settings page open
  // todo: separate in item specific context
  const [isItemSettingsOpen, setIsItemSettingsOpen] = useState(false);

  const [isMainmenuOpen, setIsMainmenuOpen] = useState(true);

  // open item panel by default if width allows it
  const isItemPanelOpen = window.innerWidth > 1000;
  const [isItemMetadataMenuOpen, setIsItemMetadataMenuOpen] = useState(
    isItemPanelOpen,
  );

  return (
    <LayoutContext.Provider
      value={{
        mode,
        setMode,
        editingItemId,
        setEditingItemId,
        isMainmenuOpen,
        setIsMainmenuOpen,
        isItemSettingsOpen,
        setIsItemSettingsOpen,
        isItemMetadataMenuOpen,
        setIsItemMetadataMenuOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node,
};

LayoutContextProvider.defaultProps = {
  children: null,
};

export { LayoutContext, LayoutContextProvider };
