import { createContext, useContext, useMemo, useState } from 'react';

import { ChatStatus } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';
import { ITEM_LAYOUT_MODES } from '../../enums';

interface LayoutContextInterface {
  mode: string;
  setMode: (mode: string) => void;
  editingItemId: string | null;
  setEditingItemId: (itemId: string) => void;
  isMainMenuOpen: boolean;
  setIsMainMenuOpen: (isOpen: boolean) => void;
  openedActionTabId: string | null;
  setOpenedActionTabId: (action: string | null) => void;
  isItemMetadataMenuOpen: boolean;
  setIsItemMetadataMenuOpen: (isOpen: boolean) => void;
  isChatboxMenuOpen: boolean;
  setIsChatboxMenuOpen: (isOpen: boolean) => void;
  isItemSharingOpen: boolean;
  setIsItemSharingOpen: (isOpen: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextInterface>({
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
  isItemSharingOpen: false,
  setIsItemSharingOpen: () => {
    // do nothing
  },
});

export const LayoutContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  // layout mode: grid or list
  const [mode, setMode] = useState<string>(DEFAULT_ITEM_LAYOUT_MODE);

  // item screen editing id
  // todo: separate in item specific context
  const [editingItemId, setEditingItemId] = useState<string>('');

  // item settings page open
  // todo: separate in item specific context
  const [openedActionTabId, setOpenedActionTabId] = useState<string | null>(
    null,
  );

  const [isMainMenuOpen, setIsMainMenuOpen] = useState(true);
  const [isItemSharingOpen, setIsItemSharingOpen] = useState(true);

  const [isItemMetadataMenuOpen, setIsItemMetadataMenuOpen] = useState(false);
  // check query params to see if chat should be open
  const chatIsOpen =
    new URLSearchParams(window.location.search).get('chat') === ChatStatus.Open;
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
      isItemSharingOpen,
      setIsItemSharingOpen,
    }),
    [
      editingItemId,
      isChatboxMenuOpen,
      isItemMetadataMenuOpen,
      isMainMenuOpen,
      mode,
      openedActionTabId,
      isItemSharingOpen,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextInterface =>
  useContext<LayoutContextInterface>(LayoutContext);
