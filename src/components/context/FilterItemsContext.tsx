import { createContext, useContext, useMemo, useState } from 'react';

import { ItemType, UnionOfConst } from '@graasp/sdk';

type ItemTypes = UnionOfConst<typeof ItemType>[];

type FilterItemsContextType = {
  itemTypes: ItemTypes;
  setItemTypes: (
    newTypes: ItemTypes | ((types: ItemTypes) => ItemTypes),
  ) => void;
};

const FilterItemsContext = createContext<FilterItemsContextType>({
  itemTypes: [],
  setItemTypes: () => {
    console.error(
      'No Provider found for "FilterItemsContext". Check that this Provider is accessible.',
    );
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
