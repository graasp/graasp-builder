import { Button, Chip, Stack, Typography } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import { DEFAULT_LANG, langs } from '@graasp/translations';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { LIBRARY_SETTINGS_LANGUAGES_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import LanguageSelect from '../settings/LanguageSelect';
import PublicationAttributeContainer from './PublicationAttributeContainer';
import PublicationModal from './PublicationModal';

type Props = {
  item: PackedItem;
};

export function LanguageContainer({ item }: Props): JSX.Element {
  const { t } = useBuilderTranslation();
  const { isOpen, openModal, closeModal } = useModalStatus();

  const title = t(BUILDER.ITEM_LANGUAGE_CONTAINER_TITLE);

  const computeKey = (id: string) => `license-${id}`;

  const modalActions = [
    <Button key={computeKey(BUILDER.CANCEL_BUTTON)} onClick={closeModal}>
      {t(BUILDER.CLOSE_BUTTON)}
    </Button>,
  ];

  let currentLang = langs[DEFAULT_LANG];
  if (item.lang in langs) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentLang = langs[item.lang];
  }

  return (
    <>
      <PublicationModal
        modalContent={
          <Stack gap={1}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1">
              {t(BUILDER.ITEM_LANGUAGE_DESCRIPTION)}
            </Typography>
            <Typography variant="caption">
              {t(BUILDER.ITEM_LANGUAGE_DESCRIPTION_LIMITATION)}
            </Typography>
            <LanguageSelect item={item} />
          </Stack>
        }
        isOpen={isOpen}
        handleOnClose={closeModal}
        dialogActions={modalActions}
      />
      <PublicationAttributeContainer
        dataTestId={LIBRARY_SETTINGS_LANGUAGES_ID}
        title={title}
        content={<Chip label={currentLang} onClick={openModal} />}
      />
    </>
  );
}
