import { SelectProps } from '@mui/material';

import { FC, useEffect, useState } from 'react';

import { BUILDER } from '@graasp/translations';
import { Select } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildPermissionOptionId,
} from '../../../config/selectors';
import { PERMISSION_LEVELS } from '../../../enums';

type Props = {
  value: string;
  onChange?: SelectProps['onChange'];
  color?: SelectProps['color'];
  showLabel?: boolean;
  displayEmpty?: boolean;
};

const ItemMembershipSelect: FC<Props> = ({
  value,
  onChange,
  color,
  showLabel = true,
  displayEmpty = false,
}) => {
  const { t } = useBuilderTranslation();
  const [permission, setPermission] = useState(value);
  const labelId = showLabel ? 'permission-label' : undefined;
  const label = showLabel
    ? t(BUILDER.ITEM_MEMBERSHIP_PERMISSION_LABEL)
    : undefined;

  useEffect(() => {
    if (permission !== value) {
      setPermission(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Select
      labelId={labelId}
      label={label}
      values={Object.values(PERMISSION_LEVELS)}
      buildOptionId={buildPermissionOptionId}
      // eslint-disable-next-line react/jsx-props-no-spreading
      // {...labelProps}
      defaultValue={permission}
      onChange={onChange}
      // renderValue={(v) => v ?? label}
      displayEmpty={displayEmpty}
      className={ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}
      color={color}
    />
  );
};

export default ItemMembershipSelect;
