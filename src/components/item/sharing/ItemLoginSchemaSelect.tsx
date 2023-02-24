import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ItemLoginSchemaType, UUID } from '@graasp/sdk';
import { ItemLoginSchemaRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import { SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID } from '../../../config/selectors';

const { usePutItemLoginSchema } = mutations;

type Props = {
  itemLoginSchema: ItemLoginSchemaRecord;
  isDisabled: boolean;
  itemId: UUID;
  edit?: boolean;
};

const ItemLoginSchemaSelect = ({
  itemId,
  itemLoginSchema,
  isDisabled,
  edit = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: putItemLoginSchema } = usePutItemLoginSchema();

  const handleLoginSchemaChange = (event: SelectChangeEvent) => {
    const newLoginSchema = event.target.value as ItemLoginSchemaType;
    putItemLoginSchema({
      itemId,
      loginSchema: newLoginSchema,
    });
  };

  if (!itemLoginSchema) {
    return null;
  }

  // do not show select if the user cannot edit the item
  if (!edit) {
    return (
      <span style={{ fontWeight: 'bold' }}>
        {itemLoginSchema?.type === ItemLoginSchemaType.USERNAME
          ? translateBuilder(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_LABEL,
            )
          : translateBuilder(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_AND_PASSWORD_LABEL,
            )}
      </span>
    );
  }

  return (
    <Select
      value={itemLoginSchema?.type || SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME}
      onChange={handleLoginSchemaChange}
      disabled={isDisabled}
      id={SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}
    >
      <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME}>
        {translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_LABEL,
        )}
      </MenuItem>
      <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD}>
        {translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_AND_PASSWORD_LABEL,
        )}
      </MenuItem>
    </Select>
  );
};

export default ItemLoginSchemaSelect;
