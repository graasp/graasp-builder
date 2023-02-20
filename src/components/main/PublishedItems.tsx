import { Box } from '@mui/material';

import ItemHeader from '../item/header/ItemHeader';
import Main from './Main';

// todo: remove
/* eslint-disable */

interface Props {}

const PublishedItems = ({}: Props): JSX.Element => {
  return (
    <Main>
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        {}
      </Box>
    </Main>
  );
};

export default PublishedItems;
