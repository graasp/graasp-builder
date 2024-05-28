import { ChangeEvent, useEffect, useMemo, useState } from 'react';

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
  LinkItemType,
  buildLinkExtra,
  getLinkExtra,
} from '@graasp/sdk';
import { LinkCard, LinkItem } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../../../config/i18n';
import { BUILDER } from '../../../../langs/constants';
import { isUrlValid } from '../../../../utils/item';
import NameForm from '../NameForm';
import LinkDescriptionField from './LinkDescriptionField';
import LinkUrlField from './LinkUrlField';
import {
  LinkType,
  getLinkType,
  getSettingsFromLinkType,
  normalizeURL,
} from './linkUtils';

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  item?: LinkItemType;
  updatedProperties: Partial<LinkItemType>;
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

const LinkForm = ({
  onChange,
  item,
  updatedProperties,
}: Props): JSX.Element => {
  const [linkContent, setLinkContent] = useState<string>('');
  const [isDescriptionDirty, setIsDescriptionDirty] = useState<boolean>(false);
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: linkData } = hooks.useLinkMetadata(normalizeURL(linkContent));

  // get value from the updatedProperties
  const linkType = getLinkType(updatedProperties.settings);

  const handleLinkInput = (value: string) => {
    setLinkContent(value);
    onChange({
      extra: buildLinkExtra({
        // when used inside the NewItem Modal this component does not receive the item prop
        // so the https will not show, but it will be added when we submit the url.
        url: normalizeURL(value),
        html: '',
        thumbnails: [],
        icons: [],
      }),
    });
  };

  let url = '';
  let description: string | undefined = '';
  const extraProps = updatedProperties.extra;
  if (extraProps && ItemType.LINK in extraProps) {
    ({ url, description } = getLinkExtra(extraProps) || {});
  }
  // link is considered valid if it is either empty, or it is a valid url
  const isLinkValid = linkContent.length === 0 || isUrlValid(url);

  const onChangeLinkType = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const settings = getSettingsFromLinkType(value);
    onChange({ settings });
  };

  const onClickClearURL = () => {
    setLinkContent('');
  };
  const onClickClearDescription = () => {
    onChange({ description: '' });
    setIsDescriptionDirty(false);
  };
  const onClickRestoreDefaultDescription = () => {
    onChange({ description: linkData?.description });
    setIsDescriptionDirty(false);
  };
  const onChangeDescription = (value: string) => {
    setIsDescriptionDirty(true);
    onChange({ description: value });
  };

  // apply the description from the api to the field
  // this is only run once.
  useEffect(
    () => {
      // this is the object on which we will define the props to be updated
      const updatedProps: Partial<LinkItemType> = {};

      if (!isDescriptionDirty && linkData?.description) {
        updatedProps.description = linkData?.description;
      }
      if (linkData?.title) {
        updatedProps.name = linkData.title;
      }
      if (linkData?.description) {
        updatedProps.extra = buildLinkExtra({
          ...updatedProperties.extra?.embeddedLink,
          url: updatedProperties.extra?.embeddedLink.url || '',
          description: linkData.description,
        });
      }
      // update props in one call to remove issue of race updates
      if (Object.keys(updatedProps).length) {
        // this should be called only once !
        onChange(updatedProps);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkData],
  );

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

  return (
    <Stack gap={1} overflow="scroll">
      <LinkUrlField
        isValid={isLinkValid}
        value={linkContent}
        onChange={handleLinkInput}
        onClear={onClickClearURL}
      />
      <NameForm
        item={item}
        autoFocus={false}
        required={false}
        setChanges={onChange}
        updatedProperties={updatedProperties}
      />
      <LinkDescriptionField
        value={updatedProperties.description}
        onChange={onChangeDescription}
        onRestore={onClickRestoreDefaultDescription}
        onClear={onClickClearDescription}
        showRestore={description !== linkData?.description}
      />
      <FormControl>
        <FormLabel>
          <Typography variant="caption">
            {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_TITLE)}
          </Typography>
          {linkContent ? (
            <RadioGroup
              name="use-radio-group"
              value={linkType}
              onChange={onChangeLinkType}
              sx={{ display: 'flex', gap: 2 }}
            >
              <StyledFormControlLabel
                value={LinkType.Default}
                label={<Link href={url}>{linkContent}</Link>}
                control={<Radio />}
              />
              <StyledFormControlLabel
                value={LinkType.Fancy}
                label={
                  <LinkCard
                    title={linkData?.title || ''}
                    url={linkContent}
                    thumbnail={linkData?.thumbnails[0]}
                    description={description || ''}
                  />
                }
                control={<Radio />}
                slotProps={{ typography: { width: '100%', minWidth: '0px' } }}
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
                linkData?.isEmbeddingAllowed && linkData?.html === '' && (
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
          ) : (
            <Typography fontStyle="italic">
              {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_HELPER_TEXT)}
            </Typography>
          )}
        </FormLabel>
      </FormControl>
    </Stack>
  );
};

export default LinkForm;
