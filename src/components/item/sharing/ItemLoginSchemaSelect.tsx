import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { ItemLoginSchema, ItemLoginSchemaType, UUID } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import { SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

const { usePutItemLoginSchema } = mutations;

type Props = {
  itemLoginSchema?: ItemLoginSchema;
  isDisabled: boolean;
  itemId: UUID;
  edit?: boolean;
};

const ItemLoginSchemaSelect = ({
  itemId,
  itemLoginSchema,
  isDisabled,
  edit = false,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: putItemLoginSchema } = usePutItemLoginSchema();

  const handleLoginSchemaChange = (event: SelectChangeEvent) => {
    const newLoginSchema = event.target.value as ItemLoginSchemaType;
    putItemLoginSchema({
      itemId,
      type: newLoginSchema,
    });
  };

  if (!itemLoginSchema) {
    return null;
  }

  // do not show select if the user cannot edit the item
  if (!edit) {
    return (
      <span style={{ fontWeight: 'bold' }}>
        {itemLoginSchema?.type === ItemLoginSchemaType.Username
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
      value={itemLoginSchema?.type || ItemLoginSchemaType.Username}
      onChange={handleLoginSchemaChange}
      disabled={isDisabled}
      id={SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}
    >
      <MenuItem value={ItemLoginSchemaType.Username}>
        {translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_LABEL,
        )}
      </MenuItem>
      <MenuItem value={ItemLoginSchemaType.UsernameAndPassword}>
        {translateBuilder(
          BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_AND_PASSWORD_LABEL,
        )}
      </MenuItem>
    </Select>
  );
};

export default ItemLoginSchemaSelect;
