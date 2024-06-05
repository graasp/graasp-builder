import { LoadingButton } from '@mui/lab';

import { PackedItem } from '@graasp/sdk';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { PublicationStatus } from '@/types/publication';

import PublicVisibilityModal from '../PublicVisibilityModal';
import PublicationButton from './PublicationButton';

type Props = {
  item: PackedItem;
  isLoading: boolean;
};

const { usePostItemValidation } = mutations;

export const UnpublishedButton = ({ item, isLoading }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { id: itemId, public: isPublic } = item;
  const { isOpen, openModal, closeModal } = useModalStatus();

  const { mutate: validateItem, isLoading: isValidating } =
    usePostItemValidation();

  const handleValidateItem = () => {
    if (isPublic) {
      validateItem({ itemId });
    } else {
      openModal();
    }
  };

  const handleModalValidate = () => {
    validateItem({ itemId });
    closeModal();
  };

  const description = t(BUILDER.LIBRARY_SETTINGS_VALIDATION_INFORMATIONS);
  const elements = (
    <LoadingButton
      variant="contained"
      onClick={handleValidateItem}
      loading={isValidating}
      data-cy={buildItemPublicationButton(PublicationStatus.Unpublished)}
    >
      {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON)}
    </LoadingButton>
  );

  return (
    <>
      {!isPublic && (
        <PublicVisibilityModal
          item={item}
          isOpen={isOpen}
          enableUpdateVisibility={false}
          onClose={closeModal}
          onValidate={handleModalValidate}
        />
      )}
      <PublicationButton
        isLoading={isLoading}
        description={description}
        elements={elements}
      />
    </>
  );
};

export default UnpublishedButton;
