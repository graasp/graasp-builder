import { ChangeEventHandler, useState } from 'react';

import { ArrowBack } from '@mui/icons-material';
import { Alert, Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_CYPRESS_ID, CUSTOM_APP_URL_ID } from '@/config/selectors';
import { sortByName } from '@/utils/item';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import addNewImage from '../../../resources/addNew.png';
import { buildAppExtra } from '../../../utils/itemExtra';
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
      .map(() => <AppCard />);
  }

  return (
    <Alert severity="error">
      {translateBuilder(BUILDER.APP_LIST_LOADING_FAILED)}
    </Alert>
  );
};

type Props = {
  onChange: (item: Partial<DiscriminatedItem>) => void;
  updatedProperties: Partial<DiscriminatedItem>;
};

const AppForm = ({ onChange, updatedProperties = {} }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const [isCustomApp, setIsCustomApp] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchAnApp: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAppSelection = (
    newValue: null | { url: string; name: string },
  ) => {
    // there is a new value to use
    if (newValue) {
      onChange({
        name: newValue.name,
        // todo: use better type here (partial of discriminated item is not a good type)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        extra: buildAppExtra({
          url: newValue.url,
        }),
      });
      return;
    }
    // there is no new value to use
    if (!newValue) {
      // unset the name and the url in the extra
      onChange({ name: undefined, extra: undefined });
    }
  };

  const currentUrl =
    (updatedProperties.type === ItemType.APP &&
      updatedProperties.extra?.app?.url) ||
    '';

  const addCustomApp = () => {
    setIsCustomApp(true);
    handleAppSelection(null);
  };

  return (
    <Stack direction="column" height="100%" spacing={2}>
      <Typography variant="h6">
        {translateBuilder(BUILDER.CREATE_NEW_ITEM_APP_TITLE)}
      </Typography>

      {isCustomApp ? (
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
            onChange={(e) =>
              // todo: use better type here (partial of discriminated item is not a good type)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange({ extra: buildAppExtra({ url: e.target.value }) })
            }
            value={currentUrl}
          />
        </Stack>
      ) : (
        <>
          <TextField
            fullWidth
            placeholder={translateBuilder('Search for an app')}
            variant="outlined"
            autoFocus
            size="small"
            onChange={searchAnApp}
          />
          <Box display="flex" flexGrow={1}>
            <Grid2
              container
              spacing={2}
              height="max-content"
              maxHeight={400}
              alignItems="stretch"
              overflow="auto"
            >
              <AppGrid
                currentUrl={currentUrl}
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
            </Grid2>
          </Box>
        </>
      )}
      <NameForm
        setChanges={onChange}
        updatedProperties={updatedProperties}
        autoFocus={false}
      />
    </Stack>
  );
};

export default AppForm;
