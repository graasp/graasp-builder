import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { HOME_MODAL_ITEM_ID, ROOT_MODAL_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import TreeMenuRow from './MenuRow';

interface RootTreeModalProps {
  setBreadcrumbs: Dispatch<
    SetStateAction<(DiscriminatedItem | { name: string; id: string })[]>
  >;
  setSelectedId: Dispatch<SetStateAction<string>>;
  selectedId: string;
  selectedParent: DiscriminatedItem | null | { name: string; id: string };
  itemIds: string[];
  parentItem?: DiscriminatedItem;
  selfAndChildrenDisable?: boolean;
}

const RootTreeModal = ({
  setBreadcrumbs,
  setSelectedId,
  selectedId,
  selectedParent,
  itemIds,
  parentItem,
  selfAndChildrenDisable = false,
}: RootTreeModalProps): JSX.Element => {
  const { data: ownItems } = hooks.useOwnItems();
  const { data: sharedItems } = hooks.useSharedItems();
  const { t: translateBuilder } = useBuilderTranslation();

  const [isHome, setIsHome] = useState(true);
  const { data } = hooks.useChildren(selectedParent?.id || '');

  const selectSubItems = (ele: DiscriminatedItem) => {
    setBreadcrumbs((breadcrumb) => [...breadcrumb, ele]);
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
    <div id={HOME_MODAL_ITEM_ID}>
      {/* Home or Root  Which will be the start of the menu */}
      {isHome && (
        <TreeMenuRow
          key={rootMenuItem.name}
          ele={rootMenuItem}
          onNavigate={() => {
            setIsHome(false);
            setBreadcrumbs((breadcrumb) => [...breadcrumb, rootMenuItem]);
            setSelectedId(rootMenuItem.id);
          }}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          itemIds={[]}
          selfAndChildrenDisable={selfAndChildrenDisable}
        />
      )}
      {/* end of home */}

      {/* Items for selected Item, So if I choose folder1 this should be it children */}
      {!isHome &&
        items?.map((ele) => (
          <TreeMenuRow
            key={ele.id}
            ele={ele}
            onNavigate={() => selectSubItems(ele)}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            itemIds={itemIds}
            selfAndChildrenDisable={selfAndChildrenDisable}
          />
        ))}

      {/* Default Parent So If I want to move an item who's in nested folder we will have it's parent as default */}

      {parentItem && selectedParent?.id === ROOT_MODAL_ID && (
        <TreeMenuRow
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
          selfAndChildrenDisable={selfAndChildrenDisable}
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
