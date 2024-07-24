import { Stack } from '@mui/material';

import { Upload } from 'lucide-react';

const SmallUploadFile = ({ text }: { text: string }): JSX.Element => (
  <Stack
    direction="row"
    gap={1}
    boxSizing="border-box"
    border="2px dashed grey"
    borderRadius={2}
    p={1}
  >
    <Upload /> {text}
  </Stack>
);

export default SmallUploadFile;
