import { ChangeEventHandler, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Alert,
  Box,
  DialogContent,
  Grid2 as Grid,
  TextField,
} from '@mui/material';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_CYPRESS_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../../../config/i18n';
import { BUILDER } from '../../../../langs/constants';
import addNewImage from '../../../../resources/addNew.png';
import { ItemNameField } from '../ItemNameField';
import { AppGrid } from './AppGrid';

function AppListForm({
  addCustomApp,
}: {
  addCustomApp: () => void;
}): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {
    formState: { errors },
  } = useFormContext<{ url: string }>();

  const searchAnApp: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DialogContent>
      <TextField
        fullWidth
        placeholder={translateBuilder(BUILDER.CREATE_APP_SEARCH_FIELD_HELPER)}
        variant="outlined"
        autoFocus
        size="small"
        onChange={searchAnApp}
      />
      <Box
        display="flex"
        flexGrow={1}
        minHeight="0px"
        sx={{ overflowY: 'auto' }}
        p={1}
      >
        <Grid
          container
          spacing={2}
          height="max-content"
          maxHeight={400}
          alignItems="stretch"
        >
          <AppGrid searchQuery={searchQuery} />
          <AppCard
            id={CUSTOM_APP_CYPRESS_ID}
            name={translateBuilder(BUILDER.CREATE_CUSTOM_APP)}
            description={translateBuilder(
              BUILDER.CREATE_CUSTOM_APP_DESCRIPTION,
            )}
            image={addNewImage}
            onClick={addCustomApp}
          />
        </Grid>
      </Box>
      <ItemNameField required autoFocus={false} />
      {errors.url?.type === 'required' && (
        <Alert severity="error">
          {translateBuilder('You have to choose an app to add.')}
        </Alert>
      )}
    </DialogContent>
  );
}

export default AppListForm;
