import { Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  valueText?: string;
  inputSetting: JSX.Element;
  icon?: JSX.Element;
};

const ItemSettingProperty = ({
  title,
  valueText,
  inputSetting,
  icon,
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
        {valueText && (
          <Stack>
            <Typography variant="body2">{valueText}</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
    <Stack>{inputSetting}</Stack>
  </Stack>
);

export default ItemSettingProperty;
