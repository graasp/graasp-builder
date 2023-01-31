/* eslint-disable @typescript-eslint/ban-types */
import { createContext, useMemo, useState } from 'react';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';
import { ChatStatus, ITEM_LAYOUT_MODES } from '../../enums';

interface LayoutContextInterface {
  mode: string;
  setMode: Function;
  editingItemId: string | null;
  setEditingItemId: Function;
  isMainMenuOpen: boolean;
  setIsMainMenuOpen: Function;
  openedActionTabId: string | null;
  setOpenedActionTabId: Function;
  isItemMetadataMenuOpen: boolean;
  setIsItemMetadataMenuOpen: Function;
  isChatboxMenuOpen: boolean;
  setIsChatboxMenuOpen: Function;
}

const LayoutContext = createContext<LayoutContextInterface>({
  mode: ITEM_LAYOUT_MODES.LIST,
  setMode: () => {
    // do nothing
  },
  editingItemId: null,
  setEditingItemId: () => {
    // do nothing
  },
  isMainMenuOpen: true,
  setIsMainMenuOpen: () => {
    // do nothing
  },
  openedActionTabId: null,
  setOpenedActionTabId: () => {
    // do nothing
  },
  isItemMetadataMenuOpen: false,
  setIsItemMetadataMenuOpen: () => {
    // do nothing
  },
  isChatboxMenuOpen: false,
  setIsChatboxMenuOpen: () => {
    // do nothing
  },
});

const LayoutContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
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
    new URLSearchParams(window.location.search).get('chat') === ChatStatus.OPEN;
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState(chatIsOpen);

  const value: LayoutContextInterface = useMemo(
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

export { LayoutContext, LayoutContextProvider };
