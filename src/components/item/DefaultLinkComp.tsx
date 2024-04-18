import { Box, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type DefaultLinkCompProps = {
  linkType: string;
  linkContent: string;
};

const DefaultLinkComp = ({
  linkType,
  linkContent,
}: DefaultLinkCompProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Box
      bgcolor={linkType === 'default' ? '#E4DFFF' : '#D9D9D9'}
      padding={5}
      borderRadius={10}
      // flexGrow={1}
      width="80%"
      height="15vh"
      alignContent="center"
    >
      {linkContent ? (
        <Typography
          variant="body1"
          color="primary"
          sx={{ textDecoration: 'underline' }}
        >
          {linkContent}
        </Typography>
      ) : (
        <Typography variant="body2" fontStyle="italic" textAlign="center">
          {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_HELPER_TEXT)}
        </Typography>
      )}
    </Box>
  );
};

export default DefaultLinkComp;
