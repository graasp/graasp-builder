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
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import { MUTATION_KEYS, DATA_KEYS } from '@graasp/query-client';
import { useMutation, hooks, queryClient } from '../../../config/queryClient';
import CategorySelection from './CategorySelection';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import CCLicenseSelection from './CCLicenseSelection';
import {
  ADMIN_CONTACT,
  ITEM_VALIDATION_STATUSES,
  SETTINGS,
} from '../../../config/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../config/selectors';
import { getValidationStatusFromItemValidations } from '../../../utils/itemValidation';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
} from '../../../utils/itemTag';

const { DELETE_ITEM_TAG, POST_ITEM_TAG, POST_ITEM_VALIDATION } = MUTATION_KEYS;
const { buildItemValidationAndReviewKey } = DATA_KEYS;
const {
  useTags,
  useItemTags,
  useItemValidationAndReview,
  useItemValidationGroups,
  useItemValidationStatuses,
  useItemValidationReviewStatuses,
} = hooks;

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
    marginRight: theme.spacing(2),
  },
}));

const ItemPublishConfiguration = ({ item, edit }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // current user
  const { data: user } = useContext(CurrentUserContext);
  // current item
  const { itemId } = useParams();

  // item tags
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

  // item validation
  const { mutate: validateItem } = useMutation(POST_ITEM_VALIDATION);

  // get map of item validation and review statuses
  const { data: ivStatuses } = useItemValidationStatuses();
  const { data: ivrStatuses } = useItemValidationReviewStatuses();
  const validationStatusesMap = new Map(
    ivStatuses?.concat(ivrStatuses)?.map((entry) => [entry?.id, entry?.name]),
  );

  // get item validation data
  const { data: itemValidationData, isLoading } =
    useItemValidationAndReview(itemId);
  // check if validation is still valid
  const iVId =
    new Date(itemValidationData?.createdAt) >= new Date(item?.get('updatedAt'))
      ? itemValidationData?.itemValidationId
      : undefined;
  // get item validation groups
  const { data: itemValidationGroups } = useItemValidationGroups(iVId);

  // group iv records by item validation status
  const ivByStatus = itemValidationGroups?.groupBy(({ statusId }) =>
    validationStatusesMap?.get(statusId),
  );

  const [itemValidationStatus, setItemValidationStatus] = useState(false);

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

  useEffect(() => {
    // process when we fetch the item validation and review records
    if (ivByStatus) {
      setItemValidationStatus(
        getValidationStatusFromItemValidations(
          ivByStatus,
          validationStatusesMap,
          itemValidationData,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivByStatus]);

  if (isLoading || isTagsLoading || isItemTagsLoading) {
    return <Loader />;
  }

  if (isError) {
    return null;
  }

  const handleValidate = () => {
    // prevent re-send request if the item is already successfully validated, or a validation is already pending
    if (
      !itemValidationStatus ||
      itemValidationStatus === ITEM_VALIDATION_STATUSES.FAILURE
    )
      validateItem({ itemId });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(buildItemValidationAndReviewKey(itemId));
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
    if (tagValue?.name !== SETTINGS.ITEM_PUBLIC.name) {
      // post public tag
      postItemTag({
        id: itemId,
        tagId: publicTag.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
      // delete previous tag
      if (tagValue && tagValue.name !== SETTINGS.ITEM_PRIVATE.name) {
        deleteItemTag({ id: itemId, tagId: itemTagValue?.id });
      }
    }
  };

  // display icon indicating current status of given item
  const displayItemValidationIcon = () => {
    switch (itemValidationStatus) {
      case ITEM_VALIDATION_STATUSES.SUCCESS:
        return <CheckCircleIcon color="primary" />;
      case ITEM_VALIDATION_STATUSES.PENDING:
        return <UpdateIcon color="primary" />;
      case ITEM_VALIDATION_STATUSES.FAILURE:
        return <CancelIcon color="primary" />;
      default:
    }
    return null;
  };

  const displayItemValidationMessage = () => {
    switch (itemValidationStatus) {
      case ITEM_VALIDATION_STATUSES.PENDING:
        return (
          <Typography variant="body1">
            {t(
              'Your item is pending validation. Once the validation succeeds, you will be able to publish your item.',
            )}
          </Typography>
        );
      case ITEM_VALIDATION_STATUSES.FAILURE:
        return (
          <Typography variant="body1">
            {t('itemValidationFailureMessage', { contact: ADMIN_CONTACT })}
          </Typography>
        );
      default:
    }
    return null;
  };

  return (
    <>
      <Divider className={classes.divider} />
      <Typography
        variant="h6"
        className={classes.heading}
        id={ITEM_PUBLISH_SECTION_TITLE_ID}
      >
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
        {t(
          'You need to validate your item before publish it. Please allow some time for the validation to finish.',
        )}
      </Typography>
      <Button
        id={ITEM_VALIDATION_BUTTON_ID}
        variant="outlined"
        onClick={handleValidate}
        color="primary"
        disabled={!edit}
        className={classes.button}
        endIcon={displayItemValidationIcon()}
      >
        {t('Validate')}
      </Button>
      <Button
        variant="outlined"
        onClick={handleRefresh}
        color="primary"
        disabled={!edit}
        className={classes.button}
      >
        {t('Refresh')}
      </Button>
      {displayItemValidationMessage()}
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
        disabled={
          isDisabled ||
          itemValidationStatus !== ITEM_VALIDATION_STATUSES.SUCCESS
        }
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
