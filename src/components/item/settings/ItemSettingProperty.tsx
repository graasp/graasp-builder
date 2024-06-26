import { Box, Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  valueText?: string | JSX.Element;
  inputSetting: JSX.Element;
  icon?: JSX.Element;
  additionalInfo?: JSX.Element | null;
};

const ItemSettingProperty = ({
  title,
  valueText,
  inputSetting,
  icon,
  additionalInfo,
}: Props): JSX.Element => (
  <Stack>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" gap={1}>
        <Box flexShrink={0}>{icon}</Box>
        <Stack direction="column" alignItems="flex-start">
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          {valueText && (
            <Typography variant="body2" maxWidth="50ch">
              {valueText}
            </Typography>
          )}
        </Stack>
      </Stack>
      {inputSetting}
    </Stack>
    {additionalInfo}
  </Stack>
);

export default ItemSettingProperty;
