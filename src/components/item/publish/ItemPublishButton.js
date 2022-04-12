import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import { Button, makeStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
} from '../../../utils/itemTag';

const { POST_ITEM_TAG } = MUTATION_KEYS;
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
  // current user
  const { data: user } = useContext(CurrentUserContext);
  // current item
  const { itemId } = useParams();

  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);

  const { data: tags, isLoading: isTagsLoading } = useTags();
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError,
  } = useItemTags(itemId);

  const [tagValue, setTagValue] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const { tag, itemTag } = getVisibilityTagAndItemTag({ tags, itemTags });
      setTagValue(tag);

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
    const publishedTag = getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name);
    // post published tag
    postItemTag({
      id: itemId,
      tagId: publishedTag.id,
      itemPath: item?.get('path'),
      creator: user?.get('id'),
    });
  };

  return (
    <>
      <Button
        disabled={isDisabled || !isValidated}
        variant="outlined"
        onClick={publishItem}
        color="primary"
        className={classes.button}
        endIcon={
          tagValue?.name === SETTINGS.ITEM_PUBLISHED.name && (
            <CheckCircleIcon color="primary" />
          )
        }
      >
        {t('Publish')}
      </Button>
    </>
  );
};

ItemPublishButton.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  isValidated: PropTypes.bool.isRequired,
};

export default ItemPublishButton;
