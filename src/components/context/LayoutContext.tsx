import { Dispatch, createContext, useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ChatStatus } from '@graasp/sdk';

import { DEFAULT_ITEM_LAYOUT_MODE } from '@/enums/itemLayoutMode';

import { ItemLayoutMode } from '../../enums';

interface LayoutContextInterface {
  mode: ItemLayoutMode;
  setMode: Dispatch<ItemLayoutMode>;
  editingItemId: string | null;
  setEditingItemId: (itemId: string | null) => void;
  openedActionTabId: string | null;
  setOpenedActionTabId: (action: string | null) => void;
  isChatboxMenuOpen: boolean;
  setIsChatboxMenuOpen: (isOpen: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextInterface>({
  mode: ItemLayoutMode.List,
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
  const [searchParams, setSearchParams] = useSearchParams();

  // layout mode: grid or list
  const mode =
    (searchParams.get('mode') as ItemLayoutMode) ?? DEFAULT_ITEM_LAYOUT_MODE;

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
      setMode: (m) => {
        setSearchParams({ mode: m });
      },
      editingItemId,
      setEditingItemId,
      openedActionTabId,
      setOpenedActionTabId,
      isChatboxMenuOpen,
      setIsChatboxMenuOpen,
    }),
    [
      editingItemId,
      isChatboxMenuOpen,
      mode,
      openedActionTabId,
      setSearchParams,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextInterface =>
  useContext<LayoutContextInterface>(LayoutContext);
