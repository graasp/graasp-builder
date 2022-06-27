import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import {
  Button,
  makeStyles,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/constants';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
  isItemPublished,
} from '../../../utils/itemTag';
import {
  EMAIL_NOTIFICATION_CHECKBOX,
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
} from '../../../config/selectors';

const { DELETE_ITEM_TAG, PUBLISH_ITEM } = MUTATION_KEYS;
const { useTags, useItemTags } = hooks;

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    width: 'auto',
    marginRight: theme.spacing(2),
  },
}));

const ItemPublishButton = ({ item, isValidated }) => {
  const { t } = useTranslation();
  const classes = useStyles();

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
        tag && itemTag?.itemPath && itemTag?.itemPath !== item?.get('path'),
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
        className={classes.button}
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
            'This element is published. Anyone can access it and is available on Graasp Explorer, our public repository of learning ressources.',
          )}
        </Typography>
      )}
    </>
  );
};

ItemPublishButton.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  isValidated: PropTypes.bool.isRequired,
};

export default ItemPublishButton;
