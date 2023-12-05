import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Dialog, Stack } from '@mui/material';

import {
  ClientHostManager,
  Context,
  ShortLinkPlatform as ShortLinkPlatformConst,
  appendPathToUrl,
} from '@graasp/sdk';

import { SHORT_LINK_ID_MAX_LENGTH } from '@/config/constants';
import { GRAASP_REDIRECTION_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
import {
  ShortLinkPlatform,
  ShortLinkPlatformType,
  randomAlias,
  randomString,
} from '@/utils/shortLink';

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
  linkId: string;
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
  const [shortLinks, setShortLinks] = useState<ShortLinkType[]>([]);
  const [modalOpen, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [initialAlias, setInitAlias] = useState<string>('');
  const [initialPlatform, setInitPlatform] = useState<ShortLinkPlatform>(
    Context.Player,
  );
  // Lists the available short links platforms for the current item.
  const defaultPlatforms = useMemo(
    () => [ShortLinkPlatformConst.builder, ShortLinkPlatformConst.player],
    [],
  );
  const [itemPlatforms, setItemPlatforms] =
    useState<ShortLinkPlatformType[]>(defaultPlatforms);

  const addNewAlias = useCallback(
    (
      platform: ShortLinkPlatform,
      alias: string,
      url: URL,
      isShorten: boolean,
    ) => {
      setShortLinks((prevShortLinks) =>
        [
          ...prevShortLinks,
          {
            linkId: randomString(SHORT_LINK_ID_MAX_LENGTH),
            alias,
            platform,
            url,
            isShorten,
          },
        ].sort((a, b) => a.platform.localeCompare(b.platform)),
      );
    },
    [setShortLinks],
  );

  // Add the library to the short link's platform if item is published
  useEffect(() => {
    if (publishedEntry) {
      setItemPlatforms((currState) => [
        ...currState,
        ShortLinkPlatformConst.library,
      ]);
    }

    // Reset the item platforms if rerendered to avoid multiple short links library
    return () => {
      setItemPlatforms(defaultPlatforms);
    };
  }, [defaultPlatforms, publishedEntry]);

  useEffect(() => {
    setShortLinks([]);
    apiLinks?.forEach((link) => {
      const url = appendPathToUrl({
        baseURL: GRAASP_REDIRECTION_HOST,
        pathname: link.alias,
      });
      addNewAlias(link.platform, link.alias, url, true);
    });

    itemPlatforms.forEach((platform) => {
      const shortLinksPlatform = apiLinks?.filter(
        (shortLink) => shortLink.platform === platform,
      );
      if (!shortLinksPlatform?.length) {
        const clientHostManager = ClientHostManager.getInstance();
        const url = clientHostManager.getItemAsURL(platform, itemId);
        addNewAlias(platform, itemId, url, false);
      }
    });
  }, [apiLinks, addNewAlias, itemId, itemPlatforms]);

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
                key={shortLink.linkId}
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

      {isLoading && itemPlatforms.map((_) => <ShortLinkSkeleton />)}
    </>
  );
};

export default ShortLinksRenderer;
