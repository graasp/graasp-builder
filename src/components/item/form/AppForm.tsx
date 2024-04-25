import { ChangeEventHandler, useState } from 'react';

import { Add, ArrowBack } from '@mui/icons-material';
import { Alert, Stack, TextField, Typography, alpha } from '@mui/material';

import { App, DiscriminatedItem, ItemType, buildAppExtra } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import AppCard from '@/components/main/AppCard';
import { CUSTOM_APP_BUTTON_ID, CUSTOM_APP_URL_ID } from '@/config/selectors';
import defaultImage from '@/resources/defaultApp.png';
import { sortByName } from '@/utils/item';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import NameForm from './NameForm';

type AppGridProps = {
  showFull: boolean;
  currentUrl: string;
  handleSelection: (value: null | { name: string; url: string }) => void;
  searchQuery?: string;
};

type MostUsedApp = {
  url: string;
  name: string;
  count: number;
};

type AppCardListProps = {
  apps: (App | MostUsedApp)[];
  currentUrl: string;
  handleSelection: (value: null | { name: string; url: string }) => void;
  searchQuery?: string;
};

const AppCardList = ({
  apps,
  currentUrl,
  handleSelection,
  searchQuery,
}: AppCardListProps) => {
  // filter out with search query
  const dataToShow = searchQuery
    ? apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : apps;
  dataToShow.sort(sortByName);
  return (
    <>
      {dataToShow.map((ele) => (
        <AppCard
          key={ele.name}
          id={'id' in ele ? ele.id : ''}
          name={ele.name}
          description={'description' in ele ? ele.description : ''}
          image={'extra' in ele ? ele.extra?.image : defaultImage}
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
};

const AppGrid = ({
  showFull,
  currentUrl,
  handleSelection,
  searchQuery,
}: AppGridProps): JSX.Element | JSX.Element[] => {
  const { useApps, useMostUsedApps } = hooks;
  const { data: allApps, isLoading } = useApps();
  const { data: mostUsedApps } = useMostUsedApps();
  const { t: translateBuilder } = useBuilderTranslation();

  // at first, try to present the user the 'most used' data
  if (mostUsedApps && mostUsedApps.length !== 0 && !showFull) {
    return (
      <AppCardList
        apps={mostUsedApps}
        currentUrl={currentUrl}
        handleSelection={handleSelection}
        searchQuery={searchQuery}
      />
    );
  }

  if (allApps) {
    return (
      <AppCardList
        apps={allApps}
        currentUrl={currentUrl}
        handleSelection={handleSelection}
        searchQuery={searchQuery}
      />
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
  updatedProperties: Partial<DiscriminatedItem>;
};

const AppForm = ({ onChange, updatedProperties = {} }: Props): JSX.Element => {
  const [showFull, setShowFull] = useState<boolean>(false);
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
        extra: buildAppExtra({
          url: newValue.url,
        }),
      });
      return;
    }
    // there is no new value to use
    if (!newValue) {
      // unset the name and the url in the extra
      onChange({
        name: undefined,
        extra: undefined,
      });
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
          onChange={(e) =>
            // todo: use better type here (partial of discriminated item is not a good type)

            onChange({ extra: buildAppExtra({ url: e.target.value }) })
          }
          value={currentUrl}
        />
        <NameForm
          setChanges={onChange}
          updatedProperties={updatedProperties}
          autoFocus={false}
        />
      </Stack>
    );
  }
  return (
    <Stack spacing={2} mt={1}>
      <Stack
        direction="column"
        maxHeight={400}
        spacing={1}
        bgcolor={alpha('#ADADAD', 0.06)}
        padding={2}
        borderRadius={2}
      >
        <TextField
          fullWidth
          placeholder={translateBuilder(BUILDER.ADD_BUILT_IN_APP_TEXT)}
          variant="outlined"
          autoFocus
          size="small"
          onChange={searchAnApp}
        />
        <Stack direction="row" alignItems="center">
          <Typography variant="label">
            {!showFull
              ? translateBuilder(BUILDER.APP_SECTION_MOST_USED)
              : translateBuilder(BUILDER.APP_SECTION_ALL_APP)}
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={() => setShowFull(!showFull)}
            id={CUSTOM_APP_BUTTON_ID}
          >
            {!showFull
              ? translateBuilder(BUILDER.APP_SECTION_ALL_APP_BUTTON_TEXT)
              : translateBuilder(BUILDER.APP_SECTION_MOST_USED_BUTTON_TEXT)}
          </Button>
        </Stack>
        <Stack
          flex={2}
          flexDirection="row"
          flexWrap="wrap"
          width="100%"
          gap={1}
          sx={{
            overflowY: 'scroll',
          }}
          padding={1}
          alignContent="flex-start"
          direction={{ xs: 'column', sm: 'row' }}
        >
          <AppGrid
            showFull={showFull}
            currentUrl={currentUrl}
            handleSelection={handleAppSelection}
            searchQuery={searchQuery}
          />
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1} flex={1}>
        <Typography variant="body2">
          {translateBuilder(BUILDER.CREATE_CUSTOM_APP_LABEL)}
        </Typography>
        <Button
          startIcon={<Add fontSize="small" />}
          variant="outlined"
          onClick={addCustomApp}
          id={CUSTOM_APP_BUTTON_ID}
          size="small"
        >
          {translateBuilder(BUILDER.CREATE_CUSTOM_APP_DESCRIPTION)}
        </Button>
      </Stack>
      <NameForm
        setChanges={onChange}
        updatedProperties={updatedProperties}
        autoFocus={false}
      />
    </Stack>
  );
};

export default AppForm;
