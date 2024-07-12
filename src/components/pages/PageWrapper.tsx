import { Helmet } from 'react-helmet';

import { Container, Stack, Typography } from '@mui/material';

type Props = {
  id?: string;
  children: JSX.Element;
  options?: JSX.Element;
  title: string;
};

const PageWrapper = ({
  id,
  children,
  options,
  title,
}: Props): JSX.Element | null => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Container id={id} sx={{ my: 2 }}>
      <Stack mb={2} direction="row" justifyContent="space-between" spacing={1}>
        <Typography variant="h2" component="h1" sx={{ wordWrap: 'break-word' }}>
          {title}
        </Typography>
        {options}
      </Stack>
      {children}
    </Container>
  </>
);

export default PageWrapper;
