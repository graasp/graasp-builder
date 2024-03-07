import { Switch } from '@mui/material';

import ItemSettingProperty from './ItemSettingProperty';

type Props = {
  onClick: (checked: boolean) => void;
  title: string;
  checked: boolean;
  valueText: string;
  id?: string;
  disabled?: boolean;
  icon?: JSX.Element;
};

const ItemSettingCheckBoxProperty = ({
  onClick,
  title,
  checked = false,
  id,
  disabled,
  icon,
  valueText,
}: Props): JSX.Element => (
  <ItemSettingProperty
    title={title}
    valueText={valueText}
    icon={icon}
    inputSetting={
      <Switch
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={(e) => {
          onClick(e.target.checked);
        }}
      />
    }
  />
);

export default ItemSettingCheckBoxProperty;
