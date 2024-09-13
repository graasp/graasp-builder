import { IconButton, Stack } from '@mui/material';

import { XIcon } from 'lucide-react';

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
          <XIcon />
        </IconButton>
        <Stack>{selectedIds.length} selected</Stack>
      </Stack>
      <Stack direction="row">{children}</Stack>
    </Stack>
  );
};

export default SelectionToolbar;
