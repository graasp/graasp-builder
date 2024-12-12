import { Alert, MenuItem, Select, Stack } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import useVisibility from '@/components/hooks/useVisibility';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { SHARE_ITEM_VISIBILITY_SELECT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import ItemLoginSchemaSelect from './ItemLoginSchemaSelect';
import UpdateVisibilityModal from './UpdateVisibilityModal';
import useVisibilitySelect from './VisibilitySelect.hook';

type Props = {
  item: PackedItem;
  edit?: boolean;
};

const VisibilitySelect = ({ item, edit }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    visibility,
    isDisabled,
    itemLoginSchema,
    isLoading,
    updateVisibility,
  } = useVisibility(item);

  const {
    isModalOpen,
    pendingVisibility,
    onCloseModal,
    onValidateModal,
    onVisibilityChange,
  } = useVisibilitySelect({
    itemId: item.id,
    visibility,
    updateVisibility,
  });

  if (isLoading) {
    return <Loader />;
  }

  const renderVisiblityIndication = () => {
    switch (visibility) {
      case SETTINGS.ITEM_LOGIN.name:
        return (
          <>
            {translateBuilder(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_SELECT_MESSAGE,
            )}
            <ItemLoginSchemaSelect
              itemLoginSchema={itemLoginSchema}
              isDisabled={isDisabled}
              itemId={item.id}
              edit={edit}
            />
          </>
        );
      case SETTINGS.ITEM_PUBLIC.name:
        return translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_INFORMATIONS,
        );
      case SETTINGS.ITEM_PRIVATE.name:
      default:
        return translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_INFORMATION,
        );
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center">
        {isModalOpen && (
          <UpdateVisibilityModal
            isOpen={isModalOpen}
            newVisibility={pendingVisibility}
            onClose={onCloseModal}
            onValidate={onValidateModal}
          />
        )}
        {edit && (
          <Select
            value={visibility}
            onChange={(e) => onVisibilityChange(e.target.value)}
            disabled={isDisabled}
            id={SHARE_ITEM_VISIBILITY_SELECT_ID}
            sx={{ mr: 1 }}
          >
            <MenuItem value={SETTINGS.ITEM_PRIVATE.name}>
              {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_LABEL)}
            </MenuItem>
            <MenuItem value={SETTINGS.ITEM_LOGIN.name}>
              {translateBuilder(
                BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_LABEL,
              )}
            </MenuItem>
            <MenuItem value={SETTINGS.ITEM_PUBLIC.name}>
              {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_LABEL)}
            </MenuItem>
          </Select>
        )}
        {renderVisiblityIndication()}
      </Stack>
      {isDisabled && (
        <Alert severity="info">
          {translateBuilder(
            BUILDER.ITEM_SETTINGS_VISIBILITY_CANNOT_EDIT_PARENT_MESSAGE,
          )}
        </Alert>
      )}
    </>
  );
};
export default VisibilitySelect;
