import { LoadingButton } from '@mui/lab';

import { PackedItem, PublicationStatus } from '@graasp/sdk';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

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

  const { mutate: validateItem, isPending: isValidating } =
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

  return (
    <>
      {!isPublic && (
        <PublicVisibilityModal
          item={item}
          isOpen={isOpen}
          shouldUpdateVisibility={false}
          onClose={closeModal}
          onValidate={handleModalValidate}
        />
      )}
      <PublicationButton isLoading={isLoading} description={description}>
        <LoadingButton
          variant="contained"
          onClick={handleValidateItem}
          loading={isValidating}
          data-cy={buildItemPublicationButton(PublicationStatus.Unpublished)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON)}
        </LoadingButton>
      </PublicationButton>
    </>
  );
};

export default UnpublishedButton;
