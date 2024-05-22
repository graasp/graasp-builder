import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  styled,
} from '@mui/material';

import {
  DiscriminatedItem,
  ItemSettings,
  ItemType,
  LinkItemSettings,
  LinkItemType,
  buildLinkExtra,
  getLinkExtra,
} from '@graasp/sdk';
import { LinkCard, LinkItem } from '@graasp/ui';

import { Undo2Icon } from 'lucide-react';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../../../config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import { isUrlValid } from '../../../../utils/item';
import NameForm from '../NameForm';

const LinkType = {
  Embedded: 'embedded',
  Fancy: 'fancy',
  Default: 'default',
} as const;

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  item?: LinkItemType;
  updatedProperties: Partial<LinkItemType>;
};

const getLinkType = (settings?: LinkItemSettings & ItemSettings) => {
  if (settings?.showLinkButton) {
    return LinkType.Fancy;
  }
  if (settings?.showLinkIframe) {
    return LinkType.Embedded;
  }
  return LinkType.Default;
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

const LinkForm = ({
  onChange,
  item,
  updatedProperties,
}: Props): JSX.Element => {
  const [linkContent, setLinkContent] = useState<string>('');
  const [isDescriptionDirty, setIsDescriptionDirty] = useState<boolean>(false);
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: linkData } = hooks.useMetadata(linkContent);

  // get value from the updatedProperties
  const linkType = getLinkType(updatedProperties.settings);

  const handleLinkInput: TextFieldProps['onChange'] = (event) => {
    const newValue = event.target.value;
    setLinkContent(newValue);
    const hasProtocol = /^https?:\/\//;
    onChange({
      extra: buildLinkExtra({
        // when used inside the NewItem Modal this component does not receive the item prop
        // so the https will not show, but it will be added when we submit the url.
        url: hasProtocol.test(newValue) ? newValue : `https://${newValue}`,
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
  const isLinkInvalid = !(isUrlValid(url) || url.length === 0);

  const onChangeLinkType = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    switch (value) {
      case LinkType.Fancy: {
        onChange({
          settings: { showLinkIframe: false, showLinkButton: true },
        });
        break;
      }
      case LinkType.Embedded: {
        onChange({
          settings: { showLinkIframe: true, showLinkButton: false },
        });
        break;
      }
      // eslint-disable-next-line no-fallthrough
      case LinkType.Default:
      default: {
        onChange({
          settings: { showLinkIframe: false, showLinkButton: false },
        });
        break;
      }
    }
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

  const onChangeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
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
      <Stack direction="row" spacing={2}>
        <TextField
          variant="standard"
          id={ITEM_FORM_LINK_INPUT_ID}
          error={isLinkInvalid}
          autoFocus
          margin="dense"
          label={translateBuilder(BUILDER.CREATE_ITEM_LINK_LABEL)}
          value={linkContent}
          onChange={handleLinkInput}
          helperText={
            isLinkInvalid
              ? translateBuilder(BUILDER.CREATE_ITEM_LINK_INVALID_LINK_ERROR)
              : ''
          }
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={onClickClearURL}
                sx={{
                  visibility: linkContent ? 'visible' : 'hidden',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          fullWidth
          required
        />
      </Stack>
      <NameForm
        item={item}
        autoFocus={false}
        required={false}
        setChanges={onChange}
        updatedProperties={updatedProperties}
      />
      <TextField
        label="Description"
        variant="standard"
        InputLabelProps={{ shrink: true }}
        value={updatedProperties.description}
        onChange={onChangeDescription}
        // helperText={
        //   isDescriptionDirty ? (
        //     <Stack direction="row" alignItems="center" gap={0.5}>
        //       <TriangleAlertIcon
        //         strokeWidth="2.5"
        //         size={theme.typography.caption.fontSize}
        //         color={theme.palette.warning.main}
        //       />
        //       <Typography variant="caption">
        //         {translateBuilder(
        //           'You have edited this description, to use the automatic description clear the field',
        //         )}
        //       </Typography>
        //     </Stack>
        //   ) : (
        //     ' '
        //   )
        // }
        InputProps={{
          endAdornment: (
            <>
              {isDescriptionDirty ? (
                <IconButton
                  onClick={onClickRestoreDefaultDescription}
                  sx={{
                    visibility:
                      description !== linkData?.description
                        ? 'visible'
                        : 'hidden',
                  }}
                >
                  <Undo2Icon size="20" />
                </IconButton>
              ) : undefined}
              <IconButton
                onClick={onClickClearDescription}
                sx={{
                  visibility: description ? 'visible' : 'hidden',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </>
          ),
        }}
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
              {linkData?.isEmbeddingAllowed && (
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
              )}
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
