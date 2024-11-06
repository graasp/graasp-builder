import { useState } from 'react';

import { Box, Dialog, Stack } from '@mui/material';

import {
  ClientHostManager,
  Context,
  ShortLink,
  appendPathToUrl,
} from '@graasp/sdk';

import { useLayoutContext } from '@/components/context/LayoutContext';
import { GRAASP_REDIRECTION_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
import { randomAlias } from '@/utils/shortLink';

import ShortLinkDialogContent from './ShortLinkDialogContent';
import ShortLinkDisplay from './ShortLinkDisplay';
import ShortLinkSkeleton from './ShortLinkSkeleton';

const { useShortLinksItem, useItemPublishedInformation } = hooks;

type ShortLinkPlatform = ShortLink['platform'];

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
  const { mode } = useLayoutContext();
  const { data: apiLinks, isLoading } = useShortLinksItem(itemId);
  const { data: publishedEntry } = useItemPublishedInformation({ itemId });
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [initialAlias, setInitialAlias] = useState<string>('');
  const [shortLinkPlatform, setShortLinkPlatform] = useState<ShortLinkPlatform>(
    Context.Player,
  );

  // List of available platforms, the order matters
  const platforms = [
    Context.Builder as const,
    Context.Player as const,
    Context.Library as const,
  ];

  const shortLinks: ShortLinkType[] = platforms
    .map<ShortLinkType | undefined>((platform) => {
      if (!publishedEntry && platform === Context.Library) {
        return undefined;
      }
      const clientHostManager = ClientHostManager.getInstance();
      const url = clientHostManager.getItemAsURL(platform, itemId);

      // not ideal, provide a select to choose the mode?
      if (platform === Context.Builder) {
        url.searchParams.set('mode', mode);
      }

      const shortLink = {
        alias: randomAlias(),
        platform,
        url,
        isShorten: false,
      };

      const apiShortLinkAlias = apiLinks?.[platform];
      if (apiShortLinkAlias) {
        shortLink.alias = apiShortLinkAlias;
        shortLink.isShorten = true;
        shortLink.url = appendPathToUrl({
          baseURL: GRAASP_REDIRECTION_HOST,
          pathname: apiShortLinkAlias,
        });
      }

      return shortLink;
    })
    .filter((short): short is ShortLinkType => Boolean(short));

  const handleNewAlias = (platform: ShortLinkPlatform) => {
    setInitialAlias(randomAlias());
    setShortLinkPlatform(platform);
    setIsNew(true);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);
  const onClose = (_event: Event, reason: string) => {
    // handle on backdrop click to close only with buttons
    if (reason === 'backdropClick') {
      return;
    }

    handleClose();
  };

  const handleUpdate = (shortLink: ShortLinkType) => {
    setInitialAlias(shortLink.alias);
    setShortLinkPlatform(shortLink.platform);
    setIsNew(false);
    setModalOpen(true);
  };

  return (
    <>
      {canAdminShortLink && (
        <Dialog open={modalOpen} onClose={onClose}>
          <ShortLinkDialogContent
            itemId={itemId}
            handleClose={handleClose}
            initialAlias={initialAlias}
            platform={shortLinkPlatform}
            isNew={isNew}
          />
        </Dialog>
      )}

      {!isLoading && (
        <Stack alignItems="center" justifyContent="center">
          <Box width={{ xs: '100%', sm: '80%' }}>
            {shortLinks.map((shortLink) => (
              <ShortLinkDisplay
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

      {isLoading && shortLinks.map((s) => <ShortLinkSkeleton key={s.alias} />)}
    </>
  );
};

export default ShortLinksRenderer;
