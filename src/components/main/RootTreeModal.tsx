import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { HOME_MODAL_ITEM_ID, ROOT_MODAL_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import MoveMenuRow from './RowMenu';

interface RootTreeModalProps {
  setPaths: Dispatch<
    SetStateAction<(DiscriminatedItem | { name: string; id: string })[]>
  >;
  setSelectedId: Dispatch<SetStateAction<string>>;
  selectedId: string;
  selectedParent: DiscriminatedItem | null | { name: string; id: string };
  itemIds: string[];
  parentItem?: DiscriminatedItem;
}

const RootTreeModal = ({
  setPaths,
  setSelectedId,
  selectedId,
  selectedParent,
  itemIds,
  parentItem,
}: RootTreeModalProps): JSX.Element => {
  const { data: ownItems } = hooks.useOwnItems();
  const { data: sharedItems } = hooks.useSharedItems();
  const { t: translateBuilder } = useBuilderTranslation();

  const [isHome, setIsHome] = useState(true);
  const { data } = hooks.useChildren(selectedParent?.id || '');

  const selectSubItems = (ele: DiscriminatedItem) => {
    setPaths((paths) => [...paths, ele]);
    setSelectedId(ele.id);
  };

  useEffect(() => {
    if (selectedParent?.id === ROOT_MODAL_ID) {
      setIsHome(true);
    }
  }, [selectedParent]);
  const rootMenuItem = {
    name: translateBuilder(BUILDER.HOME_TITLE),
    id: HOME_MODAL_ITEM_ID,
    type: ItemType.FOLDER,
  } as DiscriminatedItem;

  const items = useMemo(() => {
    const results =
      selectedParent?.id === HOME_MODAL_ITEM_ID
        ? [...(ownItems || []), ...(sharedItems || [])]
        : data;

    return results?.filter(
      (ele: DiscriminatedItem) => ele.type === ItemType.FOLDER,
    );
  }, [selectedParent, ownItems, sharedItems, data]);

  return (
    <div id={`${HOME_MODAL_ITEM_ID}`}>
      {/* Home or Root  Which will be the start of the menu */}
      {isHome && (
        <MoveMenuRow
          key={rootMenuItem.name}
          ele={rootMenuItem}
          onNavigate={() => {
            setIsHome(false);
            setPaths((paths) => [...paths, rootMenuItem]);
            setSelectedId(rootMenuItem.id);
          }}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          itemIds={[]}
        />
      )}
      {/* end of home */}

      {/* Items for selected Item, So if I choose folder1 this should be it children */}
      {!isHome &&
        items?.map((ele) => (
          <MoveMenuRow
            key={ele.id}
            ele={ele}
            onNavigate={() => selectSubItems(ele)}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            itemIds={itemIds}
          />
        ))}

      {/* Default Parent So If I want to move an item who's in nested folder we will have it's parent as default */}

      {parentItem && selectedParent?.id === ROOT_MODAL_ID && (
        <MoveMenuRow
          key={parentItem.id}
          ele={parentItem}
          onNavigate={() => {
            selectSubItems(parentItem);
            setIsHome(false);
            setSelectedId(parentItem.id);
          }}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          itemIds={itemIds}
        />
      )}

      {!isHome && !items?.length && (
        <div>
          {translateBuilder(BUILDER.EMPTY_FOLDER_CHILDREN_FOR_THIS_ITEM)}
        </div>
      )}
    </div>
  );
};

export default RootTreeModal;
