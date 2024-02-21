import { useState } from 'react';

import { CheckCircle, InfoRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import {
  EMAIL_NOTIFICATION_CHECKBOX,
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

const { useItemPublishedInformation } = hooks;
const { useUnpublishItem, usePublishItem } = mutations;

type Props = {
  item: DiscriminatedItem;
  isValidated: boolean;
  disabled: boolean;
};

const ItemPublishButton = ({
  item,
  isValidated,
  disabled,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  // item tags
  const { mutate: unpublish, isLoading: isUnPublishing } = useUnpublishItem();
  const { mutate: publishItem, isLoading: isPublishing } = usePublishItem();

  const { data: itemPublishedEntry, isFetching } = useItemPublishedInformation({
    itemId: item.id,
  });

  const [emailNotification, setEmailNotification] = useState<boolean>(false);

  const isPublished = Boolean(itemPublishedEntry);
  const isDisabled =
    itemPublishedEntry && itemPublishedEntry?.item?.path !== item?.path;

  if (!isValidated) {
    return null;
  }

  const handlePublish = () => {
    // Prevent resend request if item is already published
    if (!isPublished) {
      publishItem({
        id: item.id,
        notification: emailNotification,
      });
    }
  };

  const handleUnpublish = () => {
    if (itemPublishedEntry) {
      unpublish({ id: item.id });
    }
  };

  const toggleEmailNotification = () => {
    setEmailNotification(!emailNotification);
  };

  return (
    <>
      {isDisabled && (
        <Stack direction="row" alignItems="start" gap={1} color="gray">
          <InfoRounded fontSize="small" />
          <Typography>
            {translateBuilder(BUILDER.LIBRARY_SETTINGS_CHILD_PUBLISHED_STATUS)}
          </Typography>
        </Stack>
      )}
      <Stack direction="row" spacing={1}>
        <LoadingButton
          variant="contained"
          disabled={disabled || isDisabled || !isValidated || isPublished}
          onClick={handlePublish}
          endIcon={
            // only show the icon when the item is published and we are not un-publishing it
            isPublished &&
            !isUnPublishing &&
            !isFetching && <CheckCircle color="primary" />
          }
          id={ITEM_PUBLISH_BUTTON_ID}
          // show a loading state when we are fetching the entry and when we are publishing
          loading={isFetching || isPublishing}
        >
          {isPublished
            ? translateBuilder(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON_DISABLED)
            : translateBuilder(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON)}
        </LoadingButton>
        <LoadingButton
          variant="contained"
          disabled={disabled || isDisabled || !isPublished}
          onClick={handleUnpublish}
          id={ITEM_UNPUBLISH_BUTTON_ID}
          // show a loading state when we are un-publishing the entry
          loading={isUnPublishing}
        >
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON)}
        </LoadingButton>
      </Stack>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              id={EMAIL_NOTIFICATION_CHECKBOX}
              checked={emailNotification}
              onChange={toggleEmailNotification}
              color="primary"
              disabled={disabled}
            />
          }
          label={translateBuilder(
            BUILDER.LIBRARY_SETTINGS_PUBLISH_NOTIFICATIONS_LABEL,
          )}
        />
      </div>
      {isPublished && (
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_PUBLISHED_STATUS)}
        </Typography>
      )}
    </>
  );
};

export default ItemPublishButton;
