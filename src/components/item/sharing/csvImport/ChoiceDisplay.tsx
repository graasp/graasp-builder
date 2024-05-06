import { IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Trash2 } from 'lucide-react';

type ChoiceDisplayProps = {
  deleteButtonId?: string;
  name: string;
  onDelete: () => void;
};

const ChoiceDisplay = ({
  deleteButtonId,
  name,
  onDelete,
}: ChoiceDisplayProps): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography>{name}</Typography>
      <IconButton onClick={onDelete} id={deleteButtonId}>
        <Trash2 color={theme.palette.error.main} />
      </IconButton>
    </Stack>
  );
};
export default ChoiceDisplay;
