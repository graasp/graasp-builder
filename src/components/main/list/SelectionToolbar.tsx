import { Close } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';

import { useSelectionContext } from './SelectionContext';

const SelectionToolbar = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { selectedIds, clearSelection } = useSelectionContext();

  return (
    <Stack
      spacing={1}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ backgroundColor: '#efefef' }}
      borderRadius={2}
    >
      <Stack direction="row" alignItems="center">
        <IconButton onClick={clearSelection}>
          <Close />
        </IconButton>
        <Stack>{selectedIds.length} selected</Stack>
      </Stack>
      <Stack direction="row">{children}</Stack>
    </Stack>
  );
};

export default SelectionToolbar;
