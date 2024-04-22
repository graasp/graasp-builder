import { ChangeEvent, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  TextFieldProps,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  DiscriminatedItem,
  LinkItemType,
  buildLinkExtra,
  getLinkExtra,
} from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { isUrlValid } from '../../../utils/item';
import AdvancedLinkComp from '../AdvancedLinkComp';
import DefaultLinkComp from '../DefaultLinkComp';
import DisplayNameForm from './DisplayNameForm';

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  item?: LinkItemType;
  required: boolean;
  updatedProperties: Partial<DiscriminatedItem>;
};

const LinkForm = ({
  onChange,
  item,
  required,
  updatedProperties,
}: Props): JSX.Element => {
  const [linkType, setLinkType] = useState<string>('default');
  const [linkContent, setLinkContent] = useState<string>('');
  const [linkDescription, setLinkDescription] = useState<string>('');
  const { t: translateBuilder } = useBuilderTranslation();
  const theme = useTheme();

  const largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const handleLinkInput: TextFieldProps['onChange'] = (event) => {
    const newValue = event.target.value;
    setLinkContent(newValue);
    const hasProtocol = /^https?:\/\//;
    onChange({
      ...item,
      name: translateBuilder(BUILDER.LINK_DEFAULT_NAME), // todo: this is replaced by iframely
      extra: buildLinkExtra({
        // when used inside the NewItem Modal this component does not receive the item prop
        // so the https will not show, but it will be added when we submit the url.
        url: hasProtocol.test(newValue) ? newValue : `https://${newValue}`,
        html: '',
        thumbnails: [],
        icons: [],
      }),
      displayName: newValue,
    });
  };

  let url = null;
  if (item?.extra) {
    ({ url } = getLinkExtra(item?.extra) || {});
  }
  const isLinkInvalid = Boolean(url?.length) && !isUrlValid(url);

  const handleTypeSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkType(e.target.value);
  };

  const handleClearClick = () => {
    setLinkContent('');
  };

  const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkDescription(e.target.value);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="standard"
          id={ITEM_FORM_LINK_INPUT_ID}
          error={isLinkInvalid}
          autoFocus
          margin="dense"
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {translateBuilder(BUILDER.CREATE_ITEM_LINK_LABEL)}
              {required && <span>*</span>}
              <Tooltip
                title={translateBuilder(
                  BUILDER.CREATE_NEW_ITEM_NAME_HELPER_TEXT,
                )}
              >
                <IconButton size="small">
                  <InfoIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          }
          value={linkContent}
          onChange={handleLinkInput}
          helperText={
            Boolean(isLinkInvalid) &&
            translateBuilder(BUILDER.CREATE_ITEM_LINK_INVALID_LINK_ERROR)
          }
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleClearClick}
                sx={{
                  visibility: linkContent ? 'visible' : 'hidden',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          // only take full width when on small screen size
          fullWidth={!largeScreen}
          sx={{ my: 1, width: largeScreen ? '50%' : undefined }}
        />
        <DisplayNameForm
          updatedProperties={updatedProperties}
          setChanges={onChange}
          linkForm
        />
      </Stack>
      <TextField
        label="Description"
        variant="standard"
        InputLabelProps={{ shrink: true }}
        value={linkDescription}
        onChange={handleDescription}
      />
      <FormControl>
        {/* give label a fontsize of 0.8rem to mimic the size of text field label */}
        <FormLabel sx={{ fontSize: '0.8rem' }}>
          {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_TITLE)}
          <RadioGroup
            name="use-radio-group"
            defaultValue="default"
            onChange={handleTypeSelection}
            sx={{ display: 'flex', gap: 2 }}
          >
            <Stack direction="row" justifyContent="space-between">
              <FormControlLabel
                value="default"
                label="Default"
                control={<Radio />}
              />
              <DefaultLinkComp linkType={linkType} linkContent={linkContent} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <FormControlLabel
                value="advanced"
                label="Advanced"
                control={<Radio />}
                // labelPlacement="bottom"
              />
              <AdvancedLinkComp
                linkType={linkType}
                linkContent={linkContent}
                linkDescription={linkDescription}
                displayName={updatedProperties?.displayName || ''}
              />
            </Stack>
          </RadioGroup>
        </FormLabel>
      </FormControl>
      <FormControl>
        <Stack direction="row" alignItems="center">
          <FormLabel sx={{ fontSize: '0.8rem' }}>
            {translateBuilder(BUILDER.CREATE_ITEM_LINK_EMBED_TITLE)}
          </FormLabel>
          <Tooltip
            title={translateBuilder(BUILDER.CREATE_ITEM_LINK_EMBED_HELPER_TEXT)}
          >
            <IconButton size="small">
              <WarningIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          {/* TODO: add onChange handler to store the value */}
          <Switch color="primary" />
        </Stack>
      </FormControl>
      {/* Type */}
    </Stack>
  );
};

export default LinkForm;
