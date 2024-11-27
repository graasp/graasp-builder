import EditIcon from '@mui/icons-material/Edit';
import { Chip, Stack } from '@mui/material';

import { DiscriminatedItem, TagCategory } from '@graasp/sdk';

import MultiSelectChipInput from '@/components/input/MultiSelectChipInput';
import { useBuilderTranslation } from '@/config/i18n';
import {
  ITEM_TAGS_OPEN_MODAL_BUTTON_ID,
  buildCustomizedTagsSelector,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { useModalStatus } from '../../../hooks/useModalStatus';
import PublicationModal from '../PublicationModal';
import { useTagsManager } from './useTagsManager';

type Props = {
  item: DiscriminatedItem;
};

export const CustomizedTags = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { deleteValue } = useTagsManager({ itemId: item.id });
  const { isOpen, openModal, closeModal } = useModalStatus();
  const { tags } = useTagsManager({
    itemId: item.id,
  });

  const chipTags = tags?.map(({ name, id }) => (
    <Chip
      key={id}
      label={name}
      onDelete={() => deleteValue(id)}
      data-cy={buildCustomizedTagsSelector(id)}
    />
  ));

  return (
    <>
      <PublicationModal
        title={t(BUILDER.ITEM_TAGS_TITLE)}
        handleOnClose={closeModal}
        isOpen={isOpen}
        modalContent={
          <Stack gap={2}>
            <MultiSelectChipInput
              itemId={item.id}
              label={t(BUILDER.ITEM_TAGS_LABEL)}
              tagCategory={TagCategory.Discipline}
            />
            <MultiSelectChipInput
              itemId={item.id}
              label={t(BUILDER.ITEM_TAGS_LABEL)}
              tagCategory={TagCategory.Level}
            />
            <MultiSelectChipInput
              itemId={item.id}
              label={t(BUILDER.ITEM_TAGS_LABEL)}
              tagCategory={TagCategory.ResourceType}
            />
          </Stack>
        }
      />
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
        <Chip
          icon={<EditIcon />}
          label={t(BUILDER.ITEM_TAGS_CHIP_BUTTON_EDIT)}
          variant="outlined"
          onClick={openModal}
          data-cy={ITEM_TAGS_OPEN_MODAL_BUTTON_ID}
        />
        {chipTags}
      </Stack>
    </>
  );
};

export default CustomizedTags;
