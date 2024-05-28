import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { DiscriminatedItem } from '@graasp/sdk';

type ItemTypeConst = DiscriminatedItem['type'];
type ItemTypes = ItemTypeConst[];

type FilterItemsContextType = {
  itemTypes: ItemTypes;
  setItemTypes: (
    newTypes: ItemTypes | ((types: ItemTypes) => ItemTypes),
  ) => void;
  shouldDisplayItem: (itemType: ItemTypeConst) => boolean;
};

const FilterItemsContext = createContext<FilterItemsContextType>({
  itemTypes: [],
  setItemTypes: () => {
    console.error(
      'No Provider found for "FilterItemsContext". Check that this Provider is accessible.',
    );
  },
  shouldDisplayItem: (_itemType): boolean => {
    console.error(
      'No Provider found for "FilterItemsContext". Check that this Provider is accessible.',
    );
    return true;
  },
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const FilterItemsContextProvider = ({
  children,
}: Props): JSX.Element => {
  const location = useLocation();
  const [itemTypes, setItemTypes] = useState<ItemTypes>([]);

  useEffect(() => setItemTypes([]), [location]);

  const value = useMemo(
    () => ({
      itemTypes,
      setItemTypes,
      shouldDisplayItem: (itemType: ItemTypeConst) =>
        itemTypes.length === 0 || itemTypes.includes(itemType),
    }),
    [itemTypes],
  );

  return (
    <FilterItemsContext.Provider value={value}>
      {children}
    </FilterItemsContext.Provider>
  );
};

export const useFilterItemsContext = (): FilterItemsContextType =>
  useContext(FilterItemsContext);
