import { Stack, Switch, Typography } from '@mui/material';

type Props = {
  onClick: (checked: boolean) => void;
  title: string;
  checked: boolean;
  valueText: string;
  id?: string;
  disabled?: boolean;
  icon?: JSX.Element;
};

const ItemSettingProperty = ({
  onClick,
  title,
  checked = false,
  id,
  disabled,
  icon,
  valueText,
}: Props): JSX.Element => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    pb={1}
  >
    <Stack direction="row" alignItems="center" gap={1}>
      <Stack>{icon}</Stack>
      <Stack>
        <Stack>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body2">{valueText}</Typography>
        </Stack>
      </Stack>
    </Stack>
    <Stack>
      <Switch
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={(e) => {
          onClick(e.target.checked);
        }}
      />
    </Stack>
  </Stack>
);

export default ItemSettingProperty;
