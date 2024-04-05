import { ChangeEvent } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DISPLAY_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import type { EditModalContentPropType } from './EditModalWrapper';

export type DisplayNameFormProps = EditModalContentPropType;

const DisplayNameForm = ({
  updatedProperties,
  setChanges,
}: DisplayNameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const theme = useTheme();
  // when the screen is large, use only half of the width for the input.
  const largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDisplayNameInput = (event: ChangeEvent<{ value: string }>) => {
    setChanges({ displayName: event.target.value });
  };

  const handleClearClick = () => {
    setChanges({ displayName: '' });
  };

  return (
    <TextField
      variant="standard"
      id={ITEM_FORM_DISPLAY_NAME_INPUT_ID}
      label={
        <Stack direction="row" alignItems="center">
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_DISPLAY_NAME_LABEL)}
          <Tooltip
            title={translateBuilder(
              BUILDER.CREATE_NEW_ITEM_DISPLAY_NAME_HELPER_TEXT,
            )}
          >
            <IconButton size="small">
              <InfoIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      value={updatedProperties?.displayName}
      onChange={handleDisplayNameInput}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      // add a clear icon button
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClearClick}
            sx={{
              visibility: updatedProperties?.displayName ? 'visible' : 'hidden',
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
  );
};

export default DisplayNameForm;
