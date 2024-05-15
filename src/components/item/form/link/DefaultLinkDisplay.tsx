import { Box, Typography } from '@mui/material';

type DefaultLinkCompProps = {
  linkContent: string;
};

const DefaultLinkDisplay = ({
  linkContent,
}: DefaultLinkCompProps): JSX.Element => (
  <Box alignContent="center">
    <Typography
      variant="body1"
      color="primary"
      sx={{ textDecoration: 'underline' }}
    >
      {linkContent}
    </Typography>
  </Box>
);

export default DefaultLinkDisplay;
