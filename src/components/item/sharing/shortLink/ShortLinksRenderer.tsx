import { useState } from 'react';

import { Box, Dialog, Stack } from '@mui/material';

import {
  ClientHostManager,
  Context,
  ShortLinkPlatform as ShortLinkPlatformConst,
  appendPathToUrl,
} from '@graasp/sdk';

import { GRAASP_REDIRECTION_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
import { ShortLinkPlatform, randomAlias } from '@/utils/shortLink';

import ShortLink from './ShortLink';
import ShortLinkDialogContent from './ShortLinkDialogContent';
import ShortLinkSkeleton from './ShortLinkSkeleton';

const { useShortLinksItem, useItemPublishedInformation } = hooks;

type Props = {
  itemId: string;
  canAdminShortLink: boolean;
};

type ShortLinkType = {
  alias: string;
  platform: ShortLinkPlatform;
  url: URL;
  isShorten: boolean;
};

const ShortLinksRenderer = ({
  itemId,
  canAdminShortLink,
}: Props): JSX.Element => {
  const { data: apiLinks, isLoading } = useShortLinksItem(itemId);
  const { data: publishedEntry } = useItemPublishedInformation({ itemId });
  const [modalOpen, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [initialAlias, setInitAlias] = useState<string>('');
  const [initialPlatform, setInitPlatform] = useState<ShortLinkPlatform>(
    Context.Player,
  );

  // List of available platforms, the order matters
  const platforms = [
    ShortLinkPlatformConst.builder,
    ShortLinkPlatformConst.player,
    ShortLinkPlatformConst.library,
  ];

  const shortLinks: ShortLinkType[] = platforms
    .map<ShortLinkType | undefined>((platform) => {
      if (!publishedEntry && platform === ShortLinkPlatformConst.library) {
        return undefined;
      }
      const clientHostManager = ClientHostManager.getInstance();
      const url = clientHostManager.getItemAsURL(platform, itemId);

      const shortLink = {
        alias: randomAlias(),
        platform,
        url,
        isShorten: false,
      };

      const apiShortLink = apiLinks?.find(
        (short) => short.platform === platform,
      );
      if (apiShortLink) {
        shortLink.alias = apiShortLink.alias;
        shortLink.isShorten = true;
        shortLink.url = appendPathToUrl({
          baseURL: GRAASP_REDIRECTION_HOST,
          pathname: apiShortLink.alias,
        });
      }

      return shortLink;
    })
    .filter((short): short is ShortLinkType => Boolean(short));

  const handleNewAlias = (platform: ShortLinkPlatform) => {
    setInitAlias(randomAlias());
    setInitPlatform(platform);
    setIsNew(true);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const onClose = (_event: Event, reason: string) => {
    // handle on backdrop click to close only with buttons
    if (reason === 'backdropClick') {
      return;
    }

    handleClose();
  };

  const handleUpdate = (shortLink: ShortLinkType) => {
    setInitAlias(shortLink.alias);
    setInitPlatform(shortLink.platform);
    setIsNew(false);
    setOpen(true);
  };

  return (
    <>
      {canAdminShortLink && (
        <Dialog open={modalOpen} onClose={onClose}>
          <ShortLinkDialogContent
            itemId={itemId}
            handleClose={handleClose}
            initialAlias={initialAlias}
            initialPlatform={initialPlatform}
            isNew={isNew}
          />
        </Dialog>
      )}

      {!isLoading && (
        <Stack alignItems="center" justifyContent="center">
          <Box width={{ xs: '100%', sm: '80%' }}>
            {shortLinks.map((shortLink) => (
              <ShortLink
                key={shortLink.platform}
                url={`${shortLink.url}`}
                shortLink={{
                  alias: shortLink.alias,
                  platform: shortLink.platform,
                  itemId,
                }}
                isShorten={shortLink.isShorten}
                canAdminShortLink={canAdminShortLink}
                onUpdate={() => handleUpdate(shortLink)}
                onCreate={handleNewAlias}
              />
            ))}
          </Box>
        </Stack>
      )}

      {isLoading && shortLinks.map((_) => <ShortLinkSkeleton />)}
    </>
  );
};

export default ShortLinksRenderer;
