import { ReactNode } from 'react';

import { Typography } from '@mui/material';

type Props = {
  description: ReactNode;
};

export const DescriptionElement = ({ description }: Props): ReactNode => {
  if (typeof description === 'string') {
    return <Typography>{description}</Typography>;
  }

  return description;
};

export default DescriptionElement;
