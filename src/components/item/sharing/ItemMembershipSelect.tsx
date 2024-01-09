import { useEffect, useState } from 'react';

import { SelectProps } from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';
import { Select } from '@graasp/ui';

import {
  useBuilderTranslation,
  useEnumsTranslation,
} from '../../../config/i18n';
import {
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
  buildPermissionOptionId,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type DisabledMap = {
  [key in PermissionLevel]: boolean;
};

const defaultDisabledMap = {
  admin: false,
  read: false,
  write: false,
};
export type ItemMembershipSelectProps = {
  value: string;
  onChange?: SelectProps['onChange'];
  color?: SelectProps['color'];
  showLabel?: boolean;
  displayEmpty?: boolean;
  disabledMap?: DisabledMap;
};

const ItemMembershipSelect = ({
  value,
  onChange,
  color,
  showLabel = true,
  displayEmpty = false,
  disabledMap = defaultDisabledMap,
}: ItemMembershipSelectProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: enumT } = useEnumsTranslation();
  const [permission, setPermission] = useState(value);
  const label = showLabel
    ? translateBuilder(BUILDER.ITEM_MEMBERSHIP_PERMISSION_LABEL)
    : undefined;

  useEffect(() => {
    if (permission !== value) {
      setPermission(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Select
      label={label}
      values={Object.values(PermissionLevel).map((v) => ({
        value: v,
        text: enumT(v),
        disabled: disabledMap[v],
      }))}
      buildOptionId={buildPermissionOptionId}
      value={permission}
      defaultValue={permission}
      onChange={onChange}
      displayEmpty={displayEmpty}
      className={ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}
      color={color}
    />
  );
};

export default ItemMembershipSelect;
