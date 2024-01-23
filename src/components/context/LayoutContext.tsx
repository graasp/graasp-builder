import { createContext, useContext, useMemo, useState } from 'react';

import { ChatStatus } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';
import { ITEM_LAYOUT_MODES } from '../../enums';

interface LayoutContextInterface {
  mode: string;
  setMode: (mode: string) => void;
  editingItemId: string | null;
  setEditingItemId: (itemId: string | null) => void;
  openedActionTabId: string | null;
  setOpenedActionTabId: (action: string | null) => void;
  isChatboxMenuOpen: boolean;
  setIsChatboxMenuOpen: (isOpen: boolean) => void;
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
  openedActionTabId: null,
  setOpenedActionTabId: () => {
    // do nothing
  },
  isChatboxMenuOpen: false,
  setIsChatboxMenuOpen: () => {
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // item settings page open
  // todo: separate in item specific context
  const [openedActionTabId, setOpenedActionTabId] = useState<string | null>(
    null,
  );

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
      openedActionTabId,
      setOpenedActionTabId,
      isChatboxMenuOpen,
      setIsChatboxMenuOpen,
    }),
    [editingItemId, isChatboxMenuOpen, mode, openedActionTabId],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextInterface =>
  useContext<LayoutContextInterface>(LayoutContext);
