import { LoadingButton } from '@mui/lab';

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

  const description = t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_INFORMATIONS);
  const elements = (
    <LoadingButton
      variant="contained"
      onClick={openModal}
      data-cy={buildItemPublicationButton(PublicationStatus.NotPublic)}
    >
      {t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_CHANGE_BUTTON)}
    </LoadingButton>
  );

  return (
    <>
      <PublicVisibilityModal
        item={item}
        isOpen={isOpen}
        onClose={closeModal}
        onValidate={() => {}}
      />

      <PublicationButton
        isLoading={false}
        description={description}
        elements={elements}
      />
    </>
  );
};

export default NotPublicButton;
