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
  const [isItemSharingOpen, setIsItemSharingOpen] = useState(false);

  const [isMainMenuOpen, setIsMainMenuOpen] = useState(true);

  const [isItemMetadataMenuOpen, setIsItemMetadataMenuOpen] = useState(false);
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        mode,
        setMode,
        editingItemId,
        setEditingItemId,
        isMainMenuOpen,
        setIsMainMenuOpen,
        isItemSettingsOpen,
        setIsItemSettingsOpen,
        isItemMetadataMenuOpen,
        setIsItemMetadataMenuOpen,
        isChatboxMenuOpen,
        setIsChatboxMenuOpen,
        isItemSharingOpen,
        setIsItemSharingOpen,
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
