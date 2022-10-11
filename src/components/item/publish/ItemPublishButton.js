import { Record } from 'immutable';
import PropTypes from 'prop-types';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Loader } from '@graasp/ui';

import { SETTINGS } from '../../../config/constants';
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

const ItemPublishButton = ({ item, isValidated }) => {
  const { t } = useTranslation();

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
        disabled={isDisabled || !isValidated}
        variant="outlined"
        onClick={handlePublish}
        color="primary"
        sx={{
          marginTop: 1,
          width: 'auto',
          marginRight: 2,
        }}
        endIcon={isPublished && <CheckCircleIcon color="primary" />}
        id={ITEM_PUBLISH_BUTTON_ID}
      >
        {t('Publish')}
      </Button>
      <Button
        variant="outlined"
        disabled={!isPublished}
        onClick={handleUnpublish}
        color="default"
        id={ITEM_UNPUBLISH_BUTTON_ID}
      >
        {t('Unpublish')}
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
            />
          }
          label={t('Send email notifications to all co-editors')}
        />
      </div>
      {isPublished && (
        <Typography variant="body1">
          {t(
            'This element is published. Anyone can access it and is available on Graasp Library, our public repository of learning ressources.',
          )}
        </Typography>
      )}
    </>
  );
};

ItemPublishButton.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  isValidated: PropTypes.bool.isRequired,
};

export default ItemPublishButton;
