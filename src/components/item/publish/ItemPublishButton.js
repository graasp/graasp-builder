import { Record } from 'immutable';
import PropTypes from 'prop-types';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import {
  EMAIL_NOTIFICATION_CHECKBOX,
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
} from '../../../config/selectors';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
  isItemPublished,
} from '../../../utils/itemTag';

const { DELETE_ITEM_TAG, PUBLISH_ITEM } = MUTATION_KEYS;
const { useTags, useItemTags } = hooks;

const ItemPublishButton = ({ item, isValidated, disabled }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  // current item
  const { itemId } = useParams();

  // item tags
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: publishItem } = useMutation(PUBLISH_ITEM);

  const { data: tags, isLoading: isTagsLoading } = useTags();
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError,
  } = useItemTags(itemId);

  const [isPublished, setIsPublished] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const { tag, itemTag } = getVisibilityTagAndItemTag({ tags, itemTags });
      setIsPublished(isItemPublished({ tags, itemTags }));

      // disable setting if any visiblity is set on any ancestor items
      setIsDisabled(
        tag && itemTag?.itemPath && itemTag?.itemPath !== item?.path,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  if (isError) {
    return null;
  }

  const handlePublish = () => {
    // Prevent resend request if item is already published
    if (!isPublished) {
      publishItem({
        id: itemId,
        notification: emailNotification,
      });
    }
  };

  const handleUnpublish = () => {
    const publishedTag = getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name);
    const publishedItemTag = itemTags.find(
      ({ tagId }) => tagId === publishedTag.id,
    );
    if (publishedItemTag) {
      deleteItemTag({ id: itemId, tagId: publishedItemTag.id });
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

ItemPublishButton.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  isValidated: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default ItemPublishButton;
