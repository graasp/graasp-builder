import { useState } from 'react';

import { DiscriminatedItem, Tag, TagCategory } from '@graasp/sdk';

import groupBy from 'lodash.groupby';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

const EMPTY_STRING = '';
type Props = {
  itemId: DiscriminatedItem['id'];
};

type UseMultiSelectChipInput = {
  tags?: Tag[];
  tagsPerCategory?: { [key: string]: Tag[] };
  currentValue: string;
  error: string | undefined;
  hasError: boolean;
  debouncedCurrentValue: string;

  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;

  handleCurrentValueChanged: (newValue: string, category: TagCategory) => void;
  addValue: (tag: Pick<Tag, 'name' | 'category'>) => void;
  resetCurrentValue: () => void;
  deleteValue: (tagId: Tag['id']) => void;
};

export const useTagsManager = ({ itemId }: Props): UseMultiSelectChipInput => {
  const { t } = useBuilderTranslation();
  const [currentValue, setCurrentValue] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string | undefined>();
  const debouncedCurrentValue = hooks.useDebounce(currentValue, 500);
  const { data: tags } = hooks.useTagsByItem({ itemId });
  const {
    mutate: addTag,
    isPending: addTagIsLoading,
    isSuccess: addTagIsSuccess,
    isError: addTagIsError,
  } = mutations.useAddTag();
  const {
    mutate: removeTag,
    isPending: removeTagIsLoading,
    isSuccess: removeTagIsSuccess,
    isError: removeTagIsError,
  } = mutations.useRemoveTag();

  const hasError = Boolean(error);

  const tagsPerCategory = groupBy(tags, ({ category }) => category);

  const valueIsValid = (
    dataToValidate: string | undefined,
  ): dataToValidate is string => Boolean(dataToValidate);

  const valueExist = (tag: Pick<Tag, 'category' | 'name'>) =>
    tags?.find(
      ({ name, category }) => name === tag.name && category === tag.category,
    );

  const validateData = (tag: Pick<Tag, 'category' | 'name'>) => {
    if (valueExist(tag)) {
      setError(t(BUILDER.CHIPS_ALREADY_EXIST, { element: tag.name }));
      return false;
    }
    setError(undefined);
    return true;
  };

  const resetCurrentValue = () => {
    setCurrentValue(EMPTY_STRING);
  };

  const addValue = (tag: Pick<Tag, 'category' | 'name'>) => {
    if (valueIsValid(tag.name) && !valueExist(tag)) {
      addTag({ itemId, tag });

      resetCurrentValue();
    }
  };

  const deleteValue = (tagId: Tag['id']) => {
    removeTag({ tagId, itemId });
  };

  const handleCurrentValueChanged = (
    newValue: string,
    category: TagCategory,
  ) => {
    validateData({ name: newValue, category });
    setCurrentValue(newValue);
  };

  return {
    currentValue,
    error,
    hasError,
    handleCurrentValueChanged,
    addValue,
    deleteValue,
    resetCurrentValue,
    // return debounced current value, or empty when removing everything
    debouncedCurrentValue: currentValue.length
      ? debouncedCurrentValue
      : currentValue,
    tags,
    tagsPerCategory,
    isLoading: addTagIsLoading || removeTagIsLoading,
    isSuccess: addTagIsSuccess || removeTagIsSuccess,
    isError: addTagIsError || removeTagIsError,
  };
};

export default useTagsManager;
