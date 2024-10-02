import { Category } from '@graasp/sdk';

import { hooks, mutations } from '@/config/queryClient';
import { Filter } from '@/types/array';

const { useItemCategories: useCategories } = hooks;
const { usePostItemCategory, useDeleteItemCategory } = mutations;

type Props = {
  itemId: string;
  filterCategories?: Filter<Category>;
};

type UseItemCategories = {
  isLoading: boolean;
  isMutationLoading: boolean;
  isMutationError: boolean;
  isMutationSuccess: boolean;
  categories?: string[];
  addCategory: (categoryId: string) => void;
  deleteCategory: (categoryId: string) => void;
  deleteCategoryByName: (name: string) => void;
};

export const useItemCategories = ({
  itemId,
  filterCategories = () => true,
}: Props): UseItemCategories => {
  const { data: itemCategories, isLoading } = useCategories(itemId);

  const filteredCategories = itemCategories?.filter(({ category }) =>
    filterCategories(category),
  );

  const categories = filteredCategories?.map(({ category }) => category.name);

  const {
    mutate: createItemCategory,
    isPending: isPostLoading,
    isSuccess: isPostSuccess,
    isError: isPostError,
  } = usePostItemCategory();
  const {
    mutate: deleteItemCategory,
    isPending: isDeleteLoading,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteItemCategory();

  const isMutationLoading = isPostLoading || isDeleteLoading;
  const isMutationSuccess = isPostSuccess || isDeleteSuccess;
  const isMutationError = isPostError || isDeleteError;

  const deleteCategory = (itemCategoryId: string) =>
    deleteItemCategory({
      itemId,
      itemCategoryId,
    });

  const deleteCategoryByName = (categoryName: string) => {
    const removedItemCategory = filteredCategories?.find(
      ({ category }) =>
        category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (!removedItemCategory) {
      console.error('The given category was not found !', categoryName);
      return;
    }

    deleteCategory(removedItemCategory.id);
  };

  const addCategory = (categoryId: string) =>
    createItemCategory({ itemId, categoryId });

  return {
    isLoading,
    isMutationError,
    isMutationLoading,
    isMutationSuccess,
    categories,
    addCategory,
    deleteCategory,
    deleteCategoryByName,
  };
};

export default useItemCategories;
