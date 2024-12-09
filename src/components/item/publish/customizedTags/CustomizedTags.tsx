import EditIcon from '@mui/icons-material/Edit';
import { Chip, Stack } from '@mui/material';

import { DiscriminatedItem, TagCategory } from '@graasp/sdk';

import { MultiSelectTagChipInput } from '@/components/input/MultiSelectTagChipInput';
import { useBuilderTranslation } from '@/config/i18n';
import {
  ITEM_TAGS_OPEN_MODAL_BUTTON_CY,
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
            <MultiSelectTagChipInput
              itemId={item.id}
              tagCategory={TagCategory.Discipline}
            />
            <MultiSelectTagChipInput
              itemId={item.id}
              tagCategory={TagCategory.Level}
            />
            <MultiSelectTagChipInput
              itemId={item.id}
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
          data-cy={ITEM_TAGS_OPEN_MODAL_BUTTON_CY}
        />
        {chipTags}
      </Stack>
    </>
  );
};

export default CustomizedTags;
