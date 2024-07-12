// corresponds to the value that should be sent in the request
export enum SortingOptions {
  ItemName = 'item.name',
  ItemType = 'item.type',
  ItemCreator = 'item.creator.name',
  ItemUpdatedAt = 'item.updated_at',
}

// special sorting value for inside folders
// corresponds to the value that should be sent in the request
export enum SortingOptionsForFolder {
  ItemName = 'item.name',
  ItemType = 'item.type',
  ItemCreator = 'item.creator.name',
  ItemUpdatedAt = 'item.updated_at',
  Order = 'Order',
}

export type AllSortingOptions = SortingOptions | SortingOptionsForFolder;
