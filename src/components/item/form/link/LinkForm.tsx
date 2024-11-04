import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  UnionOfConst,
  buildLinkExtra,
  getLinkThumbnailUrl,
} from '@graasp/sdk';
import { LinkCard, LinkItem } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../../../config/i18n';
import { BUILDER } from '../../../../langs/constants';
import { isUrlValid } from '../../../../utils/item';
import { ItemNameField } from '../ItemNameField';
import LinkDescriptionField from './LinkDescriptionField';
import LinkUrlField from './LinkUrlField';
import { LinkType, getSettingsFromLinkType, normalizeURL } from './linkUtils';

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
};

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  // remove weird default margins on label
  margin: 0,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  // this allows to apply a style to the current element if if contains an input element that is checked
  '&:has(input:checked)': {
    // here we added a bit of opacity to the color used on the background of the icons cards
    backgroundColor: '#E4DFFFB3',
  },
}));

const StyledDiv = styled('div')(() => ({
  '& > div': {
    height: '200px !important',
    paddingBottom: '0 !important',
  },
}));

type Inputs = {
  name: string;
  linkType: UnionOfConst<typeof LinkType>;
  description: string;
  url: string;
};

const LinkForm = ({ onChange }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const methods = useForm<Inputs>();
  const { register, watch, control, setValue, reset } = methods;
  const url = watch('url');

  const name = watch('name');
  const linkType = watch('linkType');
  const description = watch('description');
  const { data: linkData } = hooks.useLinkMetadata(
    isUrlValid(normalizeURL(url)) ? normalizeURL(url) : '',
  );

  // apply the description from the api to the field
  // this is only run once.
  useEffect(
    () => {
      if (!description && linkData?.description) {
        setValue('description', linkData.description);
      }
      if (!name && linkData?.title) {
        setValue('name', linkData.title);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkData],
  );

  // synchronize upper state after async local state change
  useEffect(() => {
    onChange({
      name,
      description,
      extra: buildLinkExtra({
        url,
        description: linkData?.description,
        thumbnails: linkData?.thumbnails,
        icons: linkData?.icons,
      }),
      settings: getSettingsFromLinkType(linkType),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, linkData, linkType, name, url]);

  const embeddedLinkPreview = useMemo(
    () => (
      <LinkItem
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        item={{
          type: ItemType.LINK,
          settings: {},
          extra: { [ItemType.LINK]: { url } },
        }}
        showIframe
        showButton={false}
        height="200px"
      />
    ),
    [url],
  );

  const thumbnail = linkData
    ? getLinkThumbnailUrl(buildLinkExtra({ ...linkData, url }))
    : undefined;

  return (
    <Stack gap={1} overflow="scroll">
      <FormProvider {...methods}>
        <LinkUrlField
          form={register('url', { validate: isUrlValid })}
          onClear={() => reset({ url: '' })}
          showClearButton={Boolean(url)}
          isValid={isUrlValid(normalizeURL(url))}
        />
        <ItemNameField required />
        <LinkDescriptionField
          onRestore={() => setValue('description', linkData?.description ?? '')}
          form={register('description')}
          onClear={() => reset({ description: '' })}
          showRestoreButton={
            Boolean(description) && description !== linkData?.description
          }
          showClearButton={Boolean(description)}
        />
        <FormControl>
          <FormLabel>
            <Typography variant="caption">
              {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_TITLE)}
            </Typography>
            {url ? (
              <Controller
                control={control}
                defaultValue={LinkType.Default}
                name="linkType"
                render={({ field }) => (
                  <RadioGroup sx={{ display: 'flex', gap: 2 }} {...field}>
                    <StyledFormControlLabel
                      value={LinkType.Default}
                      label={<Link href={url}>{url}</Link>}
                      control={<Radio />}
                    />
                    <StyledFormControlLabel
                      value={LinkType.Fancy}
                      label={
                        <LinkCard
                          title={linkData?.title || ''}
                          url={url}
                          thumbnail={thumbnail}
                          description={description || ''}
                        />
                      }
                      control={<Radio />}
                      slotProps={{
                        typography: { width: '100%', minWidth: '0px' },
                      }}
                      sx={{ minWidth: '0px', width: '100%' }}
                    />
                    {linkData?.html && linkData.html !== '' && (
                      <StyledFormControlLabel
                        value={LinkType.Embedded}
                        label={
                          // eslint-disable-next-line react/no-danger
                          <StyledDiv
                            sx={{}}
                            dangerouslySetInnerHTML={{ __html: linkData.html }}
                          />
                        }
                        control={<Radio />}
                        slotProps={{
                          typography: {
                            width: '100%',
                            minWidth: '0px',
                          },
                        }}
                      />
                    )}
                    {
                      // only show this options when embedding is allowed and there is no html code
                      // as the html will take precedence over showing the site as an iframe
                      // and some sites like daily motion actually allow both, we want to allow show the html setting
                      linkData?.isEmbeddingAllowed && !linkData?.html && (
                        <StyledFormControlLabel
                          value={LinkType.Embedded}
                          label={embeddedLinkPreview}
                          control={<Radio />}
                          slotProps={{
                            typography: {
                              width: '100%',
                              minWidth: '0px',
                            },
                          }}
                          sx={{
                            // this ensure the iframe takes up all horizontal space
                            '& iframe': {
                              width: '100%',
                            },
                          }}
                        />
                      )
                    }
                  </RadioGroup>
                )}
              />
            ) : (
              <Typography fontStyle="italic">
                {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_HELPER_TEXT)}
              </Typography>
            )}
          </FormLabel>
        </FormControl>
      </FormProvider>
    </Stack>
  );
};

export default LinkForm;
