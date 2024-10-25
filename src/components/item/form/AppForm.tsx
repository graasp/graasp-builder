import { ChangeEventHandler, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ArrowBack } from '@mui/icons-material';
import {
  Alert,
  Box,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { DiscriminatedItem, buildAppExtra } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_CYPRESS_ID, CUSTOM_APP_URL_ID } from '@/config/selectors';
import { isUrlValid, sortByName } from '@/utils/item';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import addNewImage from '../../../resources/addNew.png';
import NameForm from './NameForm';

type AppGridProps = {
  currentUrl: string;
  handleSelection: (value: null | { name: string; url: string }) => void;
  searchQuery?: string;
};

const AppGrid = ({
  currentUrl,
  handleSelection,
  searchQuery,
}: AppGridProps): JSX.Element | JSX.Element[] => {
  const { useApps } = hooks;
  const { data, isLoading } = useApps();

  const { t: translateBuilder } = useBuilderTranslation();

  if (data) {
    // filter out with search query
    const dataToShow = searchQuery
      ? data.filter((d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : data;
    dataToShow.sort(sortByName);

    return (
      <>
        {dataToShow.map((ele) => (
          <AppCard
            id={ele.id}
            key={ele.name}
            name={ele.name}
            description={ele.description}
            image={ele.extra.image}
            selected={ele.url === currentUrl}
            onClick={() => {
              if (ele.url === currentUrl) {
                // reset fields
                handleSelection(null);
              } else {
                handleSelection({ url: ele.url, name: ele.name });
              }
            }}
          />
        ))}
      </>
    );
  }

  if (isLoading) {
    return Array(7)
      .fill(0)
      .map((i) => <AppCard id={i} />);
  }

  return (
    <Alert severity="error">
      {translateBuilder(BUILDER.APP_LIST_LOADING_FAILED)}
    </Alert>
  );
};

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
};

type Inputs = {
  name: string;
  url: string;
};

const AppForm = ({ onChange }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [isCustomApp, setIsCustomApp] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const { register, setValue, watch, reset } = useForm<Inputs>();
  const url = watch('url');
  const name = watch('name');

  const searchAnApp: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setSearchQuery(e.target.value);
  };

  // synchronize upper state after async local state change
  useEffect(() => {
    onChange({
      name,
      extra: buildAppExtra({
        url,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, name]);

  const handleAppSelection = (
    newValue: null | { url: string; name: string },
  ) => {
    // there is a new value to use
    if (newValue) {
      setValue('name', newValue.name);
      setValue('url', newValue.url);
    } else {
      // unset the name and the url in the extra
      reset({ name: '', url: '' });
    }
  };

  const addCustomApp = () => {
    setIsCustomApp(true);
    handleAppSelection(null);
  };

  if (isCustomApp) {
    return (
      <Stack direction="column" alignItems="start" mt={1} spacing={2}>
        <Button
          startIcon={<ArrowBack fontSize="small" />}
          variant="text"
          onClick={() => {
            setIsCustomApp(false);
            handleAppSelection(null);
          }}
        >
          {translateBuilder(BUILDER.CREATE_NEW_APP_BACK_TO_APP_LIST_BUTTON)}
        </Button>
        <Typography>
          {translateBuilder(BUILDER.CREATE_CUSTOM_APP_HELPER_TEXT)}
        </Typography>
        <TextField
          id={CUSTOM_APP_URL_ID}
          fullWidth
          variant="standard"
          autoFocus
          label={translateBuilder(BUILDER.APP_URL)}
          {...register('url', { validate: isUrlValid })}
        />
        <NameForm nameForm={register('name')} autoFocus={false} />
      </Stack>
    );
  }
  return (
    <Stack direction="column" height="100%" spacing={2} minHeight="0px">
      <TextField
        fullWidth
        placeholder={translateBuilder(BUILDER.CREATE_APP_SEARCH_FIELD_HELPER)}
        variant="outlined"
        autoFocus
        size="small"
        onChange={searchAnApp}
      />
      <Box display="flex" flexGrow={1} minHeight="0px" overflow="scroll" p={1}>
        <Grid
          container
          spacing={2}
          height="max-content"
          maxHeight={400}
          alignItems="stretch"
        >
          <AppGrid
            currentUrl={url}
            handleSelection={handleAppSelection}
            searchQuery={searchQuery}
          />
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
      <NameForm nameForm={register('name')} autoFocus={false} />
    </Stack>
  );
};

export default AppForm;
