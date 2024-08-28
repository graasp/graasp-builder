import { TableRow, styled } from '@mui/material';

// add border at the bottom of the row, except the last one
export const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));
