import { Controller, useFormContext } from 'react-hook-form';

import { Alert } from '@mui/material';

import AppCard from '@/components/main/AppCard';
import { sortByName } from '@/utils/item';

import { useBuilderTranslation } from '../../../../config/i18n';
import { hooks } from '../../../../config/queryClient';
import { BUILDER } from '../../../../langs/constants';

type AppGridProps = {
  searchQuery?: string;
};

export function AppGrid({
  searchQuery,
}: AppGridProps): JSX.Element | JSX.Element[] {
  const { useApps } = hooks;
  const { data, isLoading } = useApps();
  const { control, reset } = useFormContext<{
    url: string;
    name: string;
  }>();

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
      <Controller
        name="url"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            {dataToShow.map((ele) => (
              <AppCard
                id={ele.id}
                key={ele.name}
                name={ele.name}
                description={ele.description}
                image={ele.extra.image}
                selected={ele.url === field.value}
                onClick={() => {
                  if (ele.url === field.value) {
                    // reset fields
                    reset({ name: '', url: '' });
                  } else {
                    // force render with reset
                    reset({ name: ele.name, url: ele.url });
                  }
                }}
              />
            ))}
          </>
        )}
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
}
