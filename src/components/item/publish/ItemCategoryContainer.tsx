import { useEffect } from 'react';

import { Category } from '@graasp/sdk';

import { useDataSyncContext } from '@/components/context/DataSyncContext';
import { Filter } from '@/types/array';

import useItemCategories from '../../hooks/useItemCategories';
import useModalStatus from '../../hooks/useModalStatus';
import CategorySelection from './CategorySelection';
import PublicationChipContainer from './PublicationChipContainer';
import PublicationModal from './PublicationModal';

type Props = {
  itemId: string;
  title: string;
  description: string;
  emptyMessage: string;
  modalTitle?: JSX.Element;
  chipColor?: string;
  dataTestId: string;
  dataSyncKey: string;
  filterCategories?: Filter<Category>;
};

export const ItemCategoryContainer = ({
  itemId,
  title,
  description,
  emptyMessage,
  modalTitle,
  chipColor,
  dataTestId,
  dataSyncKey,
  filterCategories,
}: Props): JSX.Element | null => {
  const { computeStatusFor } = useDataSyncContext();
  const {
    isLoading,
    isMutationLoading,
    isMutationSuccess,
    isMutationError,
    categories,
    addCategory,
    deleteCategory,
    deleteCategoryByName,
  } = useItemCategories({ itemId, filterCategories });

  useEffect(
    () =>
      computeStatusFor(dataSyncKey, {
        isLoading: isMutationLoading,
        isSuccess: isMutationSuccess,
        isError: isMutationError,
      }),
    [
      isMutationLoading,
      isMutationSuccess,
      isMutationError,
      computeStatusFor,
      dataSyncKey,
    ],
  );

  const { isOpen, openModal, closeModal } = useModalStatus();

  return (
    <>
      <PublicationModal
        modalContent={
          <CategorySelection
            itemId={itemId}
            titleContent={modalTitle}
            onCreate={addCategory}
            onDelete={deleteCategory}
            filterCategories={filterCategories}
          />
        }
        isOpen={isOpen}
        handleOnClose={closeModal}
      />
      <PublicationChipContainer
        title={title}
        attributeDescription={description}
        emptyDataMessage={emptyMessage}
        data={categories}
        isLoading={isLoading}
        color={chipColor}
        onAddClicked={openModal}
        onChipDelete={deleteCategoryByName}
        dataTestId={dataTestId}
      />
    </>
  );
};
export default ItemCategoryContainer;
