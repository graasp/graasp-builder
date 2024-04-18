import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link, Stack, Typography } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type AdvancedLinkCompProps = {
  linkType: string;
  linkContent: string;
  displayName: string;
  linkDescription: string;
};

const AdvancedLinkComp = ({
  linkType,
  linkContent,
  linkDescription,
  displayName,
}: AdvancedLinkCompProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Box
      bgcolor={linkType === 'advanced' ? '#E4DFFF' : '#D9D9D9'}
      padding={2}
      borderRadius={10}
      width="80%"
      height="15vh"
    >
      <Box
        bgcolor="white"
        padding={2}
        borderRadius={6}
        width="100%"
        height="100%"
        overflow="hidden"
        whiteSpace="nowrap"
        alignContent="center"
      >
        {linkContent ? (
          <Stack direction="row" spacing={1} alignContent="center">
            {/* TODO: what if image cannot be get */}
            <img alt="link" width="25%" />
            <Stack width="75%">
              <Link
                href={linkContent}
                underline="always"
                sx={{ display: 'flex' }}
              >
                <Typography
                  variant="body1"
                  fontWeight={800}
                  color="primary"
                  sx={{ textDecoration: 'underline' }}
                >
                  {displayName}
                </Typography>
                <OpenInNewIcon color="primary" fontSize="small" />
              </Link>
              <Typography variant="body2">{linkContent}</Typography>
              <Typography
                variant="body2"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {linkDescription || '(Description)'}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body2" textAlign="center" fontStyle="italic">
            {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_HELPER_TEXT)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdvancedLinkComp;
