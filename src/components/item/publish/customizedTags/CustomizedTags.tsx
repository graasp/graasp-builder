import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import { Chip, Stack, Tooltip } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import MultiSelectChipInput from '@/components/input/MultiSelectChipInput';
import { WARNING_COLOR } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import {
  ITEM_TAGS_OPEN_MODAL_BUTTON_ID,
  buildCustomizedTagsSelector,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { useModalStatus } from '../../../hooks/useModalStatus';
import PublicationModal from '../PublicationModal';
import useCustomizedTags from './CustomizedTags.hook';

type Props = {
  item: DiscriminatedItem;
  warningWhenNoTags?: boolean;
};

export const CustomizedTags = ({
  item,
  warningWhenNoTags = false,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { isOpen, openModal, closeModal } = useModalStatus();
  const { tags, hasTags, saveTags, deleteTag } = useCustomizedTags({
    item,
    enableNotifications: false,
  });
  const showWarning = warningWhenNoTags && !hasTags;

  const onSave = (newTags: string[]) => {
    saveTags(newTags);
  };

  const chipTags = tags.map((tag, idx) => (
    <Chip
      key={tag}
      label={tag}
      onDelete={() => deleteTag(tag)}
      data-cy={buildCustomizedTagsSelector(idx)}
    />
  ));

  return (
    <>
      <PublicationModal
        title={t(BUILDER.ITEM_TAGS_TITLE)}
        handleOnClose={closeModal}
        isOpen={isOpen}
        modalContent={
          <MultiSelectChipInput
            label={t(BUILDER.ITEM_TAGS_LABEL)}
            onSave={onSave}
            data={tags}
          />
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
        {showWarning && (
          <Tooltip title={t(BUILDER.ITEM_TAGS_MISSING_WARNING)}>
            <WarningIcon htmlColor={WARNING_COLOR} />
          </Tooltip>
        )}
      </Stack>
    </>
  );
};

export default CustomizedTags;
