import { Box } from '@mui/material';

import { Member } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  PUBLISHED_ITEMS_ERROR_ALERT_ID,
  PUBLISHED_ITEMS_ID,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

const PublishedItemsDisplay = ({ member }: { member: Member }): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data: sharedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member.id);

  if (isError) {
    return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mx={2}>
      <ItemHeader showNavigation={false} />
      <Items
        id={PUBLISHED_ITEMS_ID}
        title={translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
        items={sharedItems ?? List()}
      />
    </Box>
  );
};

const PublishedItems = (): JSX.Element => {
  const { data: member, isError } = useCurrentUserContext();

  if (!member || isError) {
    return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
  }

  return (
    <Main>
      <PublishedItemsDisplay member={member} />
    </Main>
  );
};

export default PublishedItems;
