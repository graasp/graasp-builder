import { IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Trash2 } from 'lucide-react';

type ChoiceDisplayProps = {
  name: string;
  onDelete: () => void;
};

const ChoiceDisplay = ({ name, onDelete }: ChoiceDisplayProps): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography>{name}</Typography>
      <IconButton onClick={onDelete}>
        <Trash2 color={theme.palette.error.main} />
      </IconButton>
    </Stack>
  );
};
export default ChoiceDisplay;
