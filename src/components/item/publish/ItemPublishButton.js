import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import { Button, makeStyles, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
  isItemPublished,
} from '../../../utils/itemTag';
import {
  ITEM_PUBLISH_BUTTON_ID,
  ITEM_UNPUBLISH_BUTTON_ID,
} from '../../../config/selectors';

const { POST_ITEM_TAG, DELETE_ITEM_TAG } = MUTATION_KEYS;
const { useTags, useItemTags, useItemMemberships } = hooks;

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
  // current user
  const { data: user } = useContext(CurrentUserContext);
  // current item
  const { itemId } = useParams();

  // item tags
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);

  const { data: tags, isLoading: isTagsLoading } = useTags();
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError,
  } = useItemTags(itemId);

  // item memberships for co-editors
  const { data: memberships } = useItemMemberships([itemId]);

  // TODO: send emails to co-editors, this can be moved to backend
  const coEditors = memberships.filter((membership) => membership?.permission === "admin" || membership?.permission === "write");

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

  const publishItem = () => {
    // Prevent resend request if item is already published
    if (!isPublished) {
      const publishedTag = getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name);
      // post published tag
      postItemTag({
        id: itemId,
        tagId: publishedTag.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
    }
  };

  const unpublishItem = () => {
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
  }

  return (
    <>
      <Button
        disabled={isDisabled || !isValidated}
        variant="outlined"
        onClick={publishItem}
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
        onClick={unpublishItem}
        color="default"
        id={ITEM_UNPUBLISH_BUTTON_ID}
      >
        {t('Unpublish')}
      </Button>
      <div>
        <FormControlLabel
          control={(
            <Checkbox
              checked={emailNotification}
              onChange={toggleEmailNotification}
              name="emailNotification"
              color="primary"
            />
          )}
          label="Send email notifications to all co-editors"
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
