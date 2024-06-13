import { Alert, LoadingButton } from '@mui/lab';

import { PackedItem } from '@graasp/sdk';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { PublicationStatus } from '@/types/publication';

import PublicVisibilityModal from '../PublicVisibilityModal';
import PublicationButton from './PublicationButton';

type Props = {
  item: PackedItem;
};

export const NotPublicButton = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { isOpen, openModal, closeModal } = useModalStatus();

  const description = (
    <Alert severity="error">
      {t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_INFORMATIONS)}
    </Alert>
  );

  return (
    <>
      <PublicVisibilityModal item={item} isOpen={isOpen} onClose={closeModal} />

      <PublicationButton isLoading={false} description={description}>
        <LoadingButton
          variant="contained"
          onClick={openModal}
          data-cy={buildItemPublicationButton(PublicationStatus.NotPublic)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_CHANGE_BUTTON)}
        </LoadingButton>
      </PublicationButton>
    </>
  );
};

export default NotPublicButton;
