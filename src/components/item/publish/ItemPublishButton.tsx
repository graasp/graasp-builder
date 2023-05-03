import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import {
  EMAIL_NOTIFICATION_CHECKBOX,
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
} from '../../../config/selectors';

const { useItemPublishedInformation } = hooks;
const { useUnpublishItem, usePublishItem } = mutations;

type Props = { item: ItemRecord; isValidated: boolean; disabled: boolean };

const ItemPublishButton = ({
  item,
  isValidated,
  disabled,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  // item tags
  const { mutate: unpublish } = useUnpublishItem();
  const { mutate: publishItem } = usePublishItem();

  const { data: itemPublishedEntry, isLoading: isItemTagsLoading } =
    useItemPublishedInformation({ itemId: item.id });

  const [isPublished, setIsPublished] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [emailNotification, setEmailNotification] = useState(null);

  // update state variables depending on fetch values
  useEffect(() => {
    if (itemPublishedEntry) {
      setIsPublished(Boolean(itemPublishedEntry));

      // disable setting if any visiblity is set on any ancestor items
      setIsDisabled(itemPublishedEntry?.item?.path !== item?.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemPublishedEntry, item]);

  if (isItemTagsLoading) {
    return <Loader />;
  }

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
      <Button
        disabled={disabled || isDisabled || !isValidated || isPublished}
        onClick={handlePublish}
        sx={{
          mr: 2,
        }}
        endIcon={isPublished && <CheckCircleIcon color="primary" />}
        id={ITEM_PUBLISH_BUTTON_ID}
      >
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON)}
      </Button>
      <Button
        disabled={disabled || !isPublished}
        onClick={handleUnpublish}
        id={ITEM_UNPUBLISH_BUTTON_ID}
      >
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON)}
      </Button>
      <div>
        <FormControlLabel
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
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
