import { createContext, useContext, useMemo, useState } from 'react';

import { ItemType, UnionOfConst } from '@graasp/sdk';

type ItemTypeConst = UnionOfConst<typeof ItemType>;
type ItemTypes = ItemTypeConst[];

type FilterItemsContextType = {
  itemTypes: ItemTypes;
  setItemTypes: (
    newTypes: ItemTypes | ((types: ItemTypes) => ItemTypes),
  ) => void;
  displayItem: (itemType: ItemTypeConst) => boolean;
};

const FilterItemsContext = createContext<FilterItemsContextType>({
  itemTypes: [],
  setItemTypes: () => {
    console.error(
      'No Provider found for "FilterItemsContext". Check that this Provider is accessible.',
    );
  },
  displayItem: (_itemType): boolean => {
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
  const [itemTypes, setItemTypes] = useState<ItemTypes>([]);

  const value = useMemo(
    () => ({
      itemTypes,
      setItemTypes,
      displayItem: (itemType: ItemTypeConst) =>
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
