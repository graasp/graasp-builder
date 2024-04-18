import { ChangeEvent } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Stack, TextField, Tooltip } from '@mui/material';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DISPLAY_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import type { EditModalContentPropType } from './EditModalWrapper';

export type DisplayNameFormProps = EditModalContentPropType & {
  linkForm?: boolean;
};

const DisplayNameForm = ({
  updatedProperties,
  setChanges,
  linkForm,
}: DisplayNameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

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
            title={
              linkForm
                ? translateBuilder(
                    BUILDER.CREATE_NEW_ITEM_DISPLAY_NAME_HELPER_TEXT_LINKFORM,
                  )
                : translateBuilder(
                    BUILDER.CREATE_NEW_ITEM_DISPLAY_NAME_HELPER_TEXT,
                  )
            }
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
      fullWidth
      sx={{ my: 1 }}
    />
  );
};

export default DisplayNameForm;
