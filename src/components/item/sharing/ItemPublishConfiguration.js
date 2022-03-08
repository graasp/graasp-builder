import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import { Button, Divider, makeStyles, Typography } from '@material-ui/core';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../../config/queryClient';
import CategorySelection from './CategorySelection';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import CCLicenseSelection from './CCLicenseSelection';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
} from '../../../utils/itemTag';
import { SETTINGS, SUBMIT_BUTTON_WIDTH } from '../../../config/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const { DELETE_ITEM_TAG, POST_ITEM_TAG } = MUTATION_KEYS;
const { useTags, useItemTags } = hooks;

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  subtitle: {
    marginTop: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  config: {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
    width: 'auto',
    minWidth: SUBMIT_BUTTON_WIDTH,
  },
}));

const ItemPublishConfiguration = ({ item, edit }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // current user
  const { data: user, isLoading: isMemberLoading } =
    useContext(CurrentUserContext);
  // current item
  const { itemId } = useParams();

  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);

  const { data: tags, isLoading: isTagsLoading } = useTags();
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError,
  } = useItemTags(itemId);

  const [itemTagValue, setItemTagValue] = useState(false);
  const [tagValue, setTagValue] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const { tag, itemTag } = getVisibilityTagAndItemTag({ tags, itemTags });
      setItemTagValue(itemTag);
      setTagValue(tag);

      // disable setting if any visiblity is set on any ancestor items
      setIsDisabled(
        tag && itemTag?.itemPath && itemTag?.itemPath !== item?.get('path'),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading || isMemberLoading) {
    return <Loader />;
  }

  if (isError) {
    return null;
  }

  const validateItem = () => {
    // TODO: call mutation to trigger validation processes
    setIsValidated(true);
  };

  const publishItem = () => {
    const publishedTag = getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name);
    const publicTag = getTagByName(tags, SETTINGS.ITEM_PUBLIC.name);

    // post published tag
    postItemTag({
      id: itemId,
      tagId: publishedTag.id,
      itemPath: item?.get('path'),
      creator: user?.get('id'),
    });

    // if previous is public, not necessary to delete/add the public tag
    if (itemTagValue?.name !== SETTINGS.ITEM_PUBLIC.name) {
      // post public tag
      postItemTag({
        id: itemId,
        tagId: publicTag.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
      // delete previous tag
      if (tagValue && tagValue !== SETTINGS.ITEM_PRIVATE.name) {
        deleteItemTag({ id: itemId, tagId: itemTagValue?.id });
      }
    }
  };

  return (
    <>
      <Divider className={classes.divider} />
      <Typography variant="h6" className={classes.heading}>
        {t('Publication On Explorer')}
      </Typography>
      <Typography variant="body1">
        {t(
          'You can publish your collection to Graasp Explorer, our open educational resource library.',
        )}
        <br />
        {t('Published collections are accessible by the public.')}
        <br />
        {t('To publish your collection, please follow the three steps below.')}
      </Typography>
      <Typography variant="h6" className={classes.subtitle}>
        <LooksOneIcon color="primary" className={classes.icon} />
        {t('Validation')}
      </Typography>
      <Typography variant="body1">
        {t('You need to validate your item before publish it.')}
      </Typography>
      <Button
        variant="outlined"
        onClick={validateItem}
        color="primary"
        disabled={isDisabled}
        className={classes.button}
        endIcon={isValidated && <CheckCircleIcon color="primary" />}
      >
        {t('Validate')}
      </Button>
      <Typography variant="h6" className={classes.subtitle}>
        <LooksTwoIcon color="primary" className={classes.icon} />
        {t('Publication')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Once your item is validated, you can set your item to published by clicking the button.',
        )}
      </Typography>
      <Button
        variant="outlined"
        onClick={publishItem}
        color="primary"
        disabled={isDisabled || !isValidated}
        className={classes.button}
        endIcon={
          tagValue?.name === SETTINGS.ITEM_PUBLISHED.name && (
            <CheckCircleIcon color="primary" />
          )
        }
      >
        {t('Publish')}
      </Button>
      <Typography variant="h6" className={classes.subtitle}>
        <Looks3Icon color="primary" className={classes.icon} />
        {t('Configuration')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Set the options for your resource to make it easily accessible by the public.',
        )}
      </Typography>
      <div className={classes.config}>
        <CategorySelection item={item} edit={edit} />
        <CustomizedTagsEdit item={item} edit={edit} />
        <CCLicenseSelection item={item} edit={edit} />
      </div>
    </>
  );
};

ItemPublishConfiguration.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default ItemPublishConfiguration;
