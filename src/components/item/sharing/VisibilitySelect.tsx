import { MenuItem, Select, Typography } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import useVisibility from '@/components/hooks/useVisibility';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { SHARE_ITEM_VISIBILITY_SELECT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import ItemLoginSchemaSelect from './ItemLoginSchemaSelect';

type Props = {
  item: PackedItem;
  edit?: boolean;
};

const VisibilitySelect = ({ item, edit }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    visibility,
    isError,
    isDisabled,
    itemLoginSchema,
    isLoading,
    updateVisibility,
  } = useVisibility(item);

  if (isLoading) {
    return <Loader />;
  }

  // hide visibility select if cannot access item tags
  // this happens when accessing a public item
  if (isError) {
    return null;
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
      {edit && (
        <Select
          value={visibility}
          onChange={(e) => updateVisibility(e.target.value)}
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
      {isDisabled && (
        <Typography variant="body2">
          {translateBuilder(
            BUILDER.ITEM_SETTINGS_VISIBILITY_CANNOT_EDIT_PARENT_MESSAGE,
          )}
        </Typography>
      )}
    </>
  );
};
export default VisibilitySelect;
